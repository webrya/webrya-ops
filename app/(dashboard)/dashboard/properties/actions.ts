'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Δημιουργία νέου ακινήτου
 */
export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const address = formData.get('address') as string

  const { error } = await supabase.from('properties').insert({
    name,
    address,
    user_id: user.id,
  })

  if (error) {
    console.error('Supabase Error:', error)
    throw new Error('Αποτυχία δημιουργίας ακινήτου')
  }

  revalidatePath('/dashboard/properties')
  revalidatePath('/dashboard')
  redirect('/dashboard/properties')
}

/**
 * Διαγραφή υπάρχοντος ακινήτου (ΝΕΟ)
 */
export async function deletePropertyAction(propertyId: string) {
  const supabase = await createClient()

  // Έλεγχος αν ο χρήστης είναι συνδεδεμένος
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Διαγραφή από τη βάση δεδομένων
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)
    .eq('user_id', user.id) // Ασφάλεια: Διαγραφή μόνο αν ανήκει στον χρήστη

  if (error) {
    console.error('Delete Error:', error.message)
    throw new Error('Αποτυχία διαγραφής ακινήτου')
  }

  // Καθαρισμός cache για να ενημερωθούν τα Stats στο Dashboard και η λίστα
  revalidatePath('/dashboard/properties')
  revalidatePath('/dashboard')
  
  // Επιστροφή στη λίστα ακινήτων
  redirect('/dashboard/properties')
}