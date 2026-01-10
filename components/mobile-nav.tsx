'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Building2, Calendar, CheckSquare, Settings } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/properties', icon: Building2, label: 'Props' },
    { href: '/dashboard/bookings', icon: Calendar, label: 'Book' },
    { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/dashboard/settings', icon: Settings, label: 'Set' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-lg border-t border-zinc-800 px-6 py-3">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-amber-500 scale-110' : 'text-zinc-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}