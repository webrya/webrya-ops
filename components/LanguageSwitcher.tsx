'use client'

import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const changeLocale = (locale: 'en' | 'el') => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => changeLocale('en')} className="underline">EN</button>
      <button onClick={() => changeLocale('el')} className="underline">GR</button>
    </div>
  )
}
