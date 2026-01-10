import ical from 'node-ical';
import { createClient } from '@/lib/supabase/server';

export async function syncPropertyCal(propertyId: string, icalUrl: string) {
  const supabase = await createClient();
  
  // 1. Κατεβάζουμε το ημερολόγιο
  const events = await ical.fromURL(icalUrl);
  
  for (const k in events) {
    const event = events[k];
    if (event.type !== 'VEVENT') continue;

    // 2. Αποθηκεύουμε κάθε κράτηση στη βάση
    await supabase.from('bookings').upsert({
      property_id: propertyId,
      guest_name: event.summary || 'Guest (iCal)',
      check_in: event.start,
      check_out: event.end,
      external_id: event.uid // Χρειάζεται για να μην διπλογράφονται
    }, { onConflict: 'external_id' });
  }
}