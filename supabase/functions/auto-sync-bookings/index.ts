import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import ical from "https://esm.sh/node-ical"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Admin Client to bypass RLS for Sync Jobs
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch properties with iCal URLs
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, organization_id, ical_url')
      .not('ical_url', 'is', null)
      .eq('status', 'active')

    if (propError) throw propError

    const results = []

    // 3. Process each property
    for (const prop of properties) {
      if (!prop.ical_url) continue

      try {
        const response = await fetch(prop.ical_url)
        if (!response.ok) throw new Error(`Failed to fetch ical for ${prop.id}`)
        
        const text = await response.text()
        const events = ical.parseICS(text)
        
        const bookingsToUpsert = []

        for (const k in events) {
          const event = events[k]
          if (event.type === 'VEVENT') {
            bookingsToUpsert.push({
              organization_id: prop.organization_id,
              property_id: prop.id,
              external_id: event.uid,
              start_date: event.start,
              end_date: event.end,
              guest_name: event.summary || 'Blocked',
              source: 'ical_import',
              status: 'confirmed'
            })
          }
        }

        // 4. Batch Upsert (Idempotent via unique constraint on property_id + external_id)
        if (bookingsToUpsert.length > 0) {
            const { error: upsertError } = await supabase
                .from('bookings')
                .upsert(bookingsToUpsert, { 
                    onConflict: 'property_id,external_id',
                    ignoreDuplicates: false 
                })
            
            if (upsertError) console.error(`Upsert error for ${prop.id}:`, upsertError)
        }

        results.push({ property: prop.id, eventsFound: bookingsToUpsert.length })

      } catch (err) {
        console.error(`Sync failed for property ${prop.id}:`, err)
        results.push({ property: prop.id, error: err.message })
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})