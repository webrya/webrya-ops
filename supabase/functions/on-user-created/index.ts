import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const payload = await req.json();

  // Auth trigger payload
  const user = payload?.record;
  if (!user?.id || !user?.email) {
    return new Response('No user data', { status: 200 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Create org + membership (owner) for first-time user
  const orgName = String(user.email).split('@')[0] + "'s Workspace";

  const { data: org, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({ name: orgName })
    .select('id')
    .single();

  if (orgError) {
    console.error('Org create error:', orgError);
    return new Response('Org create failed', { status: 500 });
  }

  const { error: memberError } = await supabaseAdmin.from('organization_members').insert({
    org_id: org.id,
    user_id: user.id,
    role: 'owner',
  });

  if (memberError) {
    console.error('Member create error:', memberError);
    return new Response('Member create failed', { status: 500 });
  }

  return new Response('OK', { status: 200 });
});
