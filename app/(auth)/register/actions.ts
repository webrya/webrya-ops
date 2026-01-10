'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const displayName = formData.get('displayName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        language: 'GR', // Προεπιλεγμένη γλώσσα για νέους χρήστες
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Μετά την επιτυχή εγγραφή, ανακατεύθυνση στο κεντρικό Dashboard
  redirect('/dashboard')
}