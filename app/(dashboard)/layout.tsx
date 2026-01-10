import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Home, Calendar, CheckCircle2, Settings, LogOut } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import { MobileNav } from '@/components/mobile-nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const userDisplayName = user.user_metadata?.display_name || user.email?.split('@')[0]
  const userLanguage = (user.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(userLanguage)

  return (
    <div className="flex min-h-screen bg-black text-white flex-col md:flex-row font-sans">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-800 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 font-black text-2xl tracking-tighter border-b border-zinc-800 uppercase italic">
          <span className="text-white">Webrya</span> <span className="text-amber-500">Ops</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded-xl transition-all font-black uppercase text-xs tracking-widest italic">
            <LayoutDashboard size={18} /> 
            {dict.sidebar.dashboard}
          </a>
          <a href="/dashboard/properties" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded-xl transition-all font-black uppercase text-xs tracking-widest italic">
            <Home size={18} /> 
            {dict.sidebar.properties}
          </a>
          <a href="/dashboard/bookings" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded-xl transition-all font-black uppercase text-xs tracking-widest italic">
            <Calendar size={18} /> 
            {dict.sidebar.bookings}
          </a>
          <a href="/dashboard/tasks" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded-xl transition-all font-black uppercase text-xs tracking-widest italic">
            <CheckCircle2 size={18} /> 
            {dict.sidebar.tasks}
          </a>
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2 bg-black">
          <div className="flex items-center justify-between px-3 py-2 mb-2 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
             <div className="flex flex-col min-w-0">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">User</span>
                <span className="text-[11px] font-black text-amber-500 uppercase tracking-tight truncate italic">
                   {userDisplayName}
                </span>
             </div>
             <span className="text-lg">{userLanguage === 'EN' ? 'EN' : 'GR'}</span>
          </div>

          <a href="/dashboard/settings" className="flex items-center gap-3 p-3 text-zinc-400 hover:text-amber-500 hover:bg-zinc-900 rounded-xl transition-all font-black uppercase text-xs tracking-widest italic">
            <Settings size={18} /> 
            {dict.sidebar.settings}
          </a>
          
          <form action="/signout" method="post">
            <button type="submit" className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-500/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest italic text-left">
              <LogOut size={18} /> 
              {dict.sidebar.signout}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6 md:p-10 pb-32 md:pb-10"> {/* pb-32: Padding bottom for Mobile Nav space */}
          {children}
        </main>
      </div>

      {/* Mobile Navigation (Visible only on Mobile) */}
      <MobileNav />
    </div>
  )
}