import { createClient } from '@/lib/supabase/server'
import { User, ArrowLeft, Calendar, Globe } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PropertyBookingsPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const lang = (user?.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 1. Ανάκτηση στοιχείων ακινήτου
  const { data: property } = await supabase
    .from('properties')
    .select('name')
    .eq('id', params.id)
    .single()

  // 2. Ανάκτηση κρατήσεων για το συγκεκριμένο ακίνητο
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', params.id)
    .not('guest_name', 'ilike', '%closed%')
    .order('check_in', { ascending: true })

  return (
    <div className="space-y-10 pb-32 text-white font-sans">
      {/* Back Button & Title */}
      <div className="flex items-center gap-6 px-4 md:px-0">
        <Link href="/dashboard/bookings" className="p-3 bg-zinc-900 rounded-full hover:bg-amber-500 hover:text-black transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            {property?.name}
          </h1>
          <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {lang === 'GR' ? 'ΛΙΣΤΑ ΚΡΑΤΗΣΕΩΝ' : 'BOOKING LIST'}
          </p>
        </div>
      </div>

      {/* Λίστα Κρατήσεων */}
      <div className="grid gap-6 px-4 md:px-0">
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-zinc-950 p-8 rounded-[3rem] border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-amber-500/30 transition-all shadow-2xl">
              <div className="flex items-center gap-6 w-full">
                <div className="bg-zinc-900 p-5 rounded-[1.5rem] text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                    {booking.guest_name.replace(/Reserved/gi, dict.bookings.guest)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={12} className="text-zinc-600" />
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                      {booking.platform || 'Direct Booking'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ημερομηνίες */}
              <div className="flex gap-4 w-full md:w-auto">
                <div className="bg-zinc-900/50 px-8 py-4 rounded-[1.5rem] border border-zinc-800 text-center flex-1 min-w-[120px]">
                  <div className="text-[8px] text-zinc-500 uppercase font-black mb-1 tracking-widest">{dict.bookings.check_in}</div>
                  <div className="text-sm font-black italic">{new Date(booking.check_in).toLocaleDateString('el-GR')}</div>
                </div>
                <div className="bg-zinc-900/50 px-8 py-4 rounded-[1.5rem] border border-zinc-800 text-center flex-1 min-w-[120px]">
                  <div className="text-[8px] text-zinc-500 uppercase font-black mb-1 tracking-widest">{dict.bookings.check_out}</div>
                  <div className="text-sm font-black italic">{new Date(booking.check_out).toLocaleDateString('el-GR')}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-zinc-950/50 rounded-[3rem] border border-dashed border-zinc-900">
            <Calendar size={48} className="mx-auto text-zinc-800 mb-4 opacity-20" />
            <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">
              {lang === 'GR' ? 'ΔΕΝ ΥΠΑΡΧΟΥΝ ΚΡΑΤΗΣΕΙΣ ΓΙΑ ΑΥΤΟ ΤΟ ΑΚΙΝΗΤΟ' : 'NO BOOKINGS FOR THIS PROPERTY'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}