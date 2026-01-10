import { createClient } from '@/lib/supabase/server'
import { CheckCircle2, Circle, ArrowLeft, Calendar } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PropertyTasksPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const lang = (user?.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 1. Ανάκτηση στοιχείων ακινήτου και εργασιών
  const { data: property } = await supabase
    .from('properties')
    .select('name')
    .eq('id', params.id)
    .single()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('property_id', params.id)
    .order('due_date', { ascending: true })

  return (
    <div className="space-y-10 pb-32 text-white font-sans">
      {/* Back Button & Title */}
      <div className="flex items-center gap-6 px-4 md:px-0">
        <Link href="/dashboard/tasks" className="p-3 bg-zinc-900 rounded-full hover:bg-amber-500 hover:text-black transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            {property?.name}
          </h1>
          <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            {lang === 'GR' ? 'ΛΙΣΤΑ ΕΡΓΑΣΙΩΝ' : 'TASK LIST'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 px-4 md:px-0">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => {
            // Λογική: Μόνο "ΚΑΘΑΡΙΣΜΟΣ" αν περιέχει τη λέξη cleaning
            let displayTitle = task.title;
            const isAirbnb = task.title.toLowerCase().includes('airbnb');
            const isBooking = task.title.toLowerCase().includes('booking');

            if (lang === 'GR' && displayTitle.toLowerCase().includes('cleaning')) {
              displayTitle = 'ΚΑΘΑΡΙΣΜΟΣ';
            } else {
              displayTitle = displayTitle.replace(/Reserved/gi, '').replace(/:/g, '').trim();
            }

            return (
              <div key={task.id} className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-900 flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="text-zinc-800">
                    {task.status === 'completed' ? (
                      <CheckCircle2 size={32} className="text-amber-500" />
                    ) : (
                      <Circle size={32} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{displayTitle}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Calendar size={12} className="text-zinc-600" />
                      <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                        {new Date(task.due_date).toLocaleDateString('el-GR')}
                      </span>
                      {(isAirbnb || isBooking) && (
                        <span className="text-[9px] text-zinc-700 font-black uppercase italic border-l border-zinc-800 pl-3">
                          {isAirbnb ? 'Airbnb' : 'Booking.com'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-20 text-center bg-zinc-950/50 rounded-[3rem] border border-dashed border-zinc-900">
            <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">Δεν υπάρχουν εργασίες</p>
          </div>
        )}
      </div>
    </div>
  )
}