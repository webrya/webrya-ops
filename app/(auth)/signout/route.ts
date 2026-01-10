import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  // 1. Έλεγχος αν υπάρχει χρήστης
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // 2. ΤΟ ΠΙΟ ΣΗΜΑΝΤΙΚΟ: Καθαρίζουμε ΟΛΗ τη μνήμη cache του dashboard
  revalidatePath('/', 'layout') 
  
  // 3. Αναγκαστική ανακατεύθυνση στο login
  return redirect('/login')
}