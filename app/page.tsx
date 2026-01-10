import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supabase = await createClient()
  
  // Έλεγχος αν ο client δημιουργήθηκε σωστά
  if (!supabase) {
    return <div>Σφάλμα σύνδεσης με τη βάση δεδομένων. Ελέγξτε τις ρυθμίσεις ENV.</div>
  }

  const { data } = await supabase.auth.getUser()
  const user = data?.user

  if (!user) {
    redirect('/login')
  }

  redirect('/dashboard')
}