'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import ical from 'node-ical'

export async function syncPropertyAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const propertyId = formData.get('propertyId') as string
  const ical_url = formData.get('ical_url') as string

  try {
    const webEvents = await ical.fromURL(ical_url)
    const eventsArray = Object.values(webEvents).filter(e => e.type === 'VEVENT')
    
    for (const event of eventsArray) {
      const checkOutDate = new Date(event.end as Date)
      const guestName = (event.summary || 'Guest').replace('Reserved', 'Guest')

      // 1. Booking Upsert
      const { data: booking } = await supabase
        .from('bookings')
        .upsert({
          property_id: propertyId,
          guest_name: guestName,
          check_in: new Date(event.start as Date).toISOString(),
          check_out: checkOutDate.toISOString(),
          external_id: event.uid,
          platform: ical_url.includes('airbnb') ? 'Airbnb' : 'Booking.com'
        }, { onConflict: 'external_id' })
        .select().single()

      if (booking && !guestName.toLowerCase().includes('closed')) {
        // ΥΠΟΛΟΓΙΣΜΟΣ: Παίρνουμε την ημερομηνία και προσθέτουμε +1 μέρα καθαρά
        const nextDay = new Date(checkOutDate)
        nextDay.setUTCDate(nextDay.getUTCDate() + 1)
        nextDay.setUTCHours(10, 0, 0, 0) // Θέτουμε την ώρα στις 10 π.μ. για να μην υπάρχει αμφιβολία

        // 2. Task Upsert - Χρησιμοποιούμε το ID για να είμαστε σίγουροι για το update
        await supabase.from('tasks').upsert({
          property_id: propertyId,
          booking_id: booking.id, 
          user_id: user.id,
          title: `Cleaning: ${guestName}`,
          due_date: nextDay.toISOString(),
          status: 'pending'
        }, { 
          onConflict: 'booking_id',
          ignoreDuplicates: false 
        })
      }
    }
  } catch (error: any) {
    console.error('Sync Error:', error.message)
  }

  revalidatePath('/dashboard/tasks')
  redirect('/dashboard/tasks')
}
// Προσθήκη στο τέλος του actions.ts
export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Μη εξουσιοδοτημένη πρόσβαση')

  const title = formData.get('title') as string
  const propertyId = formData.get('propertyId') as string
  const dueDate = formData.get('dueDate') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('tasks')
    .insert([
      { 
        title, 
        property_id: propertyId, 
        user_id: user.id,
        due_date: new Date(dueDate).toISOString(),
        description,
        status: 'pending' 
      }
    ])

  if (error) {
    console.error('Task Error:', error.message)
    throw new Error('Αποτυχία δημιουργίας εργασίας')
  }

  revalidatePath('/dashboard/tasks')
  return { success: true }
}