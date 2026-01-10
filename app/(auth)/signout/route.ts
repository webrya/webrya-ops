import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  const supabase = await createClient()

  // 1. Kill Supabase session
  await supabase.auth.signOut()

  // 2. HARD cache invalidation (layouts + pages)
  revalidatePath('/', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/dashboard', 'page')
  revalidatePath('/dashboard/(.*)', 'page')

  // 3. Redirect with no-store headers
  return NextResponse.redirect(
    new URL('/login', process.env.NEXT_PUBLIC_SITE_URL),
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  )
}
