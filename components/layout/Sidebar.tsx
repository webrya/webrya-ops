'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Calendar, Settings, LogOut, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

const mainNavigation = [
  { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { name: 'ΑΚΙΝΗΤΑ', href: '/dashboard/properties', icon: Home },
  { name: 'ΚΡΑΤΗΣΕΙΣ', href: '/dashboard/bookings', icon: Calendar },
  { name: 'ΕΡΓΑΣΙΕΣ', href: '/dashboard/tasks', icon: CheckCircle2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-black border-r border-zinc-900 z-50">
        
        {/* Logo - Πάντα ορατό */}
        <div className="flex items-center h-20 px-6 shrink-0 border-b border-zinc-900/50">
          <span className="text-xl font-black tracking-tighter uppercase italic text-white">
            WEBRYA <span className="text-amber-500">OPS</span>
          </span>
        </div>

        {/* Main Menu - Scrollable αν χρειαστεί */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto pb-40">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center px-4 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
                  isActive 
                    ? "text-amber-500 bg-zinc-900/50" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-900/30"
                )}
              >
                <item.icon className={clsx("mr-3 h-4 w-4", isActive ? "text-amber-500" : "text-zinc-600")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section - ΚΑΡΦΩΜΕΝΟ ΤΕΡΜΑ ΚΑΤΩ */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-zinc-900 space-y-1">
          <Link
            href="/dashboard/settings"
            className={clsx(
              "group flex items-center px-4 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
              pathname === '/dashboard/settings'
                ? "text-amber-500 bg-zinc-900/50"
                : "text-zinc-500 hover:text-white hover:bg-zinc-900/30"
            )}
          >
            <Settings className={clsx("mr-3 h-4 w-4", pathname === '/dashboard/settings' ? "text-amber-500" : "text-zinc-600")} />
            ΡΥΘΜΙΣΕΙΣ
          </Link>
          
          <button className="w-full flex items-center px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-950/20 rounded-xl transition-all">
            <LogOut className="mr-3 h-4 w-4" />
            ΕΞΟΔΟΣ
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        {[...mainNavigation, { name: 'ΡΥΘΜΙΣΕΙΣ', href: '/dashboard/settings', icon: Settings }].map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-amber-500" : "text-zinc-600"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[8px] font-black uppercase">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}