'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Home, Calendar, CheckCircle2, Settings } from 'lucide-react'

// Ορίζουμε ότι το component δέχεται το dict ως "prop"
export function MobileNav({ dict }: { dict: any }) {
  const pathname = usePathname()

  // Αν το dict δεν έχει έρθει ακόμα, δείχνουμε ένα κενό για να μην κρασάρει
  if (!dict) return null

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: dict.sidebar.dashboard },
    { href: '/dashboard/properties', icon: Home, label: dict.sidebar.properties },
    { href: '/dashboard/bookings', icon: Calendar, label: dict.sidebar.bookings },
    { href: '/dashboard/tasks', icon: CheckCircle2, label: dict.sidebar.tasks },
    { href: '/dashboard/settings', icon: Settings, label: dict.sidebar.settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/90 backdrop-blur-xl border-t border-zinc-900 px-6 py-4">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all ${
                isActive ? 'text-amber-500 scale-110' : 'text-zinc-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className="text-[7px] font-black uppercase tracking-widest italic">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}