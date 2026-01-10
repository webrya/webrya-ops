'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettingsAction(formData: FormData) {
  const supabase = await createClient()
  
  const displayName = formData.get('displayName') as string
  const language = formData.get('language') as string
  const newPassword = formData.get('newPassword') as string

  // 1. Ενημέρωση Metadata
  const { error: metaError } = await supabase.auth.updateUser({
    data: { 
      display_name: displayName,
      language: language 
    }
  })

  if (metaError) throw new Error('ΑΠΟΤΥΧΙΑ ΕΝΗΜΕΡΩΣΗΣ ΡΥΘΜΙΣΕΩΝ')

  // 2. Ενημέρωση Κωδικού
  if (newPassword) {
    if (newPassword.length < 6) throw new Error('Ο ΚΩΔΙΚΟΣ ΠΡΕΠΕΙ ΝΑ ΕΙΝΑΙ ΤΟΥΛΑΧΙΣΤΟΝ 6 ΧΑΡΑΚΤΗΡΕΣ')
    
    const { error: passError } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (passError) throw new Error(passError.message)
  }

  revalidatePath('/', 'layout')
  revalidatePath('/dashboard/settings')

  return { success: true } // Επιστρέφουμε επιτυχία
}