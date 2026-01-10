'use client'

import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-sm space-y-8 bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-900 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">
            Webrya <span className="text-amber-500">Ops</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Σύνδεση στον λογαριασμό σας
          </p>
        </div>

        <form action={login} className="space-y-4">
          <div className="relative">
            <input 
              name="email"
              type="email" 
              placeholder="EMAIL" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs font-black focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600 uppercase tracking-widest"
            />
          </div>
          <div className="relative">
            <input 
              name="password"
              type="password" 
              placeholder="PASSWORD" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-xs font-black focus:border-amber-500 outline-none transition-all placeholder:text-zinc-600 uppercase tracking-widest"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            Είσοδος
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-900">
          <Link 
            href="/register" 
            className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            Δεν έχετε λογαριασμό; <span className="text-amber-500 italic">Εγγραφή →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}