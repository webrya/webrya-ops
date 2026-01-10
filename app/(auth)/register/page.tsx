'use client'

import { useState } from 'react'
import { signup } from './actions'
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8 bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">
            JOIN <span className="text-amber-500">WEBRYA.</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            ΔΗΜΙΟΥΡΓΙΑ ΝΕΟΥ ΛΟΓΑΡΙΑΣΜΟΥ
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              name="displayName"
              type="text"
              placeholder="ΟΝΟΜΑΤΕΠΩΝΥΜΟ"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-black focus:border-amber-500 outline-none transition-all uppercase tracking-widest"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              name="email"
              type="email"
              placeholder="EMAIL ADDRESS"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-black focus:border-amber-500 outline-none transition-all uppercase tracking-widest"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              name="password"
              type="password"
              placeholder="PASSWORD"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-black focus:border-amber-500 outline-none transition-all uppercase tracking-widest"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] italic text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'ΔΗΜΙΟΥΡΓΙΑ...' : (
              <>
                ΕΓΓΡΑΦΗ <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
            ΕΧΕΤΕ ΗΔΗ ΛΟΓΑΡΙΑΣΜΟ; <span className="text-amber-500 italic">ΕΙΣΟΔΟΣ →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}