import { createClient } from '@/lib/supabase/server'
import { Home, LayoutDashboard, Calendar, ArrowRight, BarChart3, Clock } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Auth (server-side only)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const userId = user.id
  const lang = (user.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 2. STATS (USER SCOPED)
  const { count: propCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: taskCount } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // 3. RECENT DATA (USER SCOPED)
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .limit(2)

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, properties(name)')
    .eq('user_id', userId)
    .limit(3)

  return (
    <div className="space-y-12 pb-24 text-white font-sans">
      {/* HEADER */}
      <div className="px-4 md:px-0">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          {dict.dashboard.overview}
          <span className="text-amber-500">.</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">
          {lang === 'GR' ? 'ΓΕΝΙΚΗ ΚΑΤΑΣΤΑΣΗ ΣΥΣΤΗΜΑΤΟΣ' : 'SYSTEM OVERVIEW'}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        <div className="bg-zinc-950 p-8 rounded-[3rem] border border-zinc-800 shadow-2xl hover:border-amber-500/30 transition-all group">
          <Home className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
          <div className="text-5xl font-black tracking-tighter">{propCount || 0}</div>
          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2 italic">
            {dict.sidebar.properties}
          </div>
        </div>

        <div className="bg-zinc-950 p-8 rounded-[3rem] border border-zinc-800 shadow-2xl hover:border-amber-500/30 transition-all group">
          <LayoutDashboard className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
          <div className="text-5xl font-black tracking-tighter">{taskCount || 0}</div>
          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2 italic">
            {dict.sidebar.tasks}
          </div>
        </div>

        <div className="bg-zinc-950 p-8 rounded-[3rem] border border-zinc-800 shadow-2xl hover:border-amber-500/30 transition-all group">
          <Calendar className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={28} />
          <div className="text-5xl font-black tracking-tighter">{bookingCount || 0}</div>
          <div className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-2 italic">
            {dict.sidebar.bookings}
          </div>
        </div>
      </div>

      {/* PROPERTIES */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-4 md:px-0">
          <h2 className="text-xl font-black uppercase tracking-tight italic flex items-center gap-3">
            <BarChart3 size={20} className="text-amber-500" />
            {lang === 'GR'
              ? 'ΤΑ ΑΚΙΝΗΤΑ ΜΟΥ'
              : `${dict.common.my_prefix} ${dict.sidebar.properties} ${dict.common.my_suffix}`}
          </h2>
          <Link
            href="/dashboard/properties"
            className="text-[10px] font-black text-zinc-500 hover:text-amber-500 uppercase tracking-[0.2em] transition-colors italic"
          >
            {lang === 'GR' ? 'ΟΛΑ' : 'VIEW ALL'} →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
          {properties?.map((prop) => (
            <Link
              key={prop.id}
              href={`/dashboard/properties/${prop.id}`}
              className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 hover:border-amber-500/50 transition-all group shadow-xl flex justify-between items-center"
            >
              <div>
                <div className="text-amber-500 text-[8px] font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-amber-500" />
                  {lang === 'GR' ? 'ΑΚΙΝΗΤΟ' : 'PROPERTY'}
                </div>
                <div className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">
                  {prop.name}
                </div>
              </div>
              <div className="bg-zinc-900 p-3 rounded-2xl group-hover:bg-amber-500 group-hover:text-black transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-tight italic px-4 md:px-0 flex items-center gap-3">
          <Clock size={20} className="text-amber-500" />
          {dict.dashboard.next_tasks}
        </h2>

        <div className="grid gap-3 px-4 md:px-0">
          {tasks?.map((task) => (
            <div
              key={task.id}
              className="bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-1 h-12 bg-amber-500/20 group-hover:bg-amber-500 transition-colors rounded-full" />
                <div>
                  <div className="text-amber-500 text-[8px] font-black uppercase tracking-[0.2em] mb-1">
                    {task.properties?.name}
                  </div>
                  <div className="font-black uppercase text-lg italic tracking-tighter group-hover:text-amber-500 transition-colors">
                    {task.title.replace(/Reserved/gi, dict.bookings.guest)}
                  </div>
                </div>
              </div>
              <ArrowRight size={16} className="text-zinc-800 group-hover:text-amber-500 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
