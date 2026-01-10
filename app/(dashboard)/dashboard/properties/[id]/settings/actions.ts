'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import ical from 'node-ical'

export async function syncPropertyAction(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Παίρνουμε τον χρήστη μόνο για το Task
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error("User not authenticated")
    return
  }

  const propertyId = formData.get('propertyId') as string
  const ical_url = formData.get('ical_url') as string

  const platform = ical_url.includes('airbnb') ? 'Airbnb' : 
                   ical_url.includes('booking.com') ? 'Booking.com' : 'iCal'

  try {
    const webEvents = await ical.fromURL(ical_url)
    const eventsArray = Object.values(webEvents).filter((e: any) => e.type === 'VEVENT')
    
    for (const event of eventsArray) {
      if (event.type !== 'VEVENT') continue

      const startDate = new Date(event.start as Date).toISOString()
      const endDate = new Date(event.end as Date).toISOString()
      const guestName = event.summary || 'iCal Guest'

      // 2. Αποθήκευση Κράτησης (ΑΦΑΙΡΕΘΗΚΕ ΤΟ user_id ΕΔΩ)
      const { data: booking, error: bError } = await supabase
        .from('bookings')
        .upsert({
          property_id: propertyId,
          guest_name: guestName,
          check_in: startDate,
          check_out: endDate,
          external_id: event.uid,
          platform: platform
        }, { onConflict: 'external_id' })
        .select()
        .single()

      if (bError) {
        console.error(`Error upserting booking: ${bError.message}`)
        continue
      }

      // 3. Δημιουργία Task (ΕΔΩ ΤΟ ΚΡΑΤΑΜΕ ΓΙΑΤΙ ΕΙΝΑΙ REQUIRED)
      const isBlocked = guestName.toLowerCase().includes('closed') || 
                        guestName.toLowerCase().includes('not available') ||
                        guestName.toLowerCase().includes('blocked')

      if (booking && !isBlocked) {
        const { error: tError } = await supabase.from('tasks').upsert({
          property_id: propertyId,
          booking_id: booking.id,
          user_id: user.id, // Παραμένει γιατί ο πίνακας tasks το ζητάει
          title: `Cleaning: ${guestName} (${platform})`,
          due_date: endDate,
          status: 'pending'
        }, { onConflict: 'booking_id' })

        if (tError) {
          console.error(`Task Error: ${tError.message}`)
        }
      }
    }

    await supabase.from('properties').update({ ical_url }).eq('id', propertyId)

  } catch (error: any) {
    console.error('Sync Error:', error.message)
  }

  revalidatePath('/dashboard/bookings')
  revalidatePath('/dashboard')
  redirect('/dashboard/bookings')
}