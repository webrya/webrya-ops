'use client'

import { useState } from 'react'
import { User, Languages, Save, Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateSettingsAction } from './actions'

export default function SettingsPage({ 
  // Περνάμε τα αρχικά δεδομένα από το layout ή μέσω props αν χρειάζεται, 
  // αλλά εδώ θα τα διαχειριστούμε με state για άμεση απόκριση
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 1. Έλεγχος αν οι κωδικοί ταιριάζουν (Client Side)
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'ΟΙ ΚΩΔΙΚΟΙ ΔΕΝ ΤΑΙΡΙΑΖΟΥΝ' })
      setLoading(false)
      return
    }

    try {
      const result = await updateSettingsAction(formData)
      setMessage({ type: 'success', text: 'ΟΙ ΡΥΘΜΙΣΕΙΣ ΕΝΗΜΕΡΩΘΗΚΑΝ ΜΕ ΕΠΙΤΥΧΙΑ' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'ΣΦΑΛΜΑ ΚΑΤΑ ΤΗΝ ΑΠΟΘΗΚΕΥΣΗ' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-32 text-white max-w-4xl mx-auto font-sans">
      <div className="px-4 md:px-0">
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          ΡΥΘΜΙΣΕΙΣ <span className="text-amber-500">.</span>
        </h1>
      </div>

      <form action={handleSubmit} className="grid gap-6 px-4 md:px-0">
        
        {/* Profile Section */}
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 text-amber-500">
              <User size={24} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">ΠΡΟΦΙΛ</h2>
          </div>

          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">ΟΝΟΜΑΤΕΠΩΝΥΜΟ</label>
              <input 
                name="displayName"
                placeholder="ΤΟ ΟΝΟΜΑ ΣΑΣ"
                className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 text-white font-bold focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20 text-red-500">
              <Lock size={24} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">ΑΣΦΑΛΕΙΑ</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">ΝΕΟΣ ΚΩΔΙΚΟΣ</label>
              <input 
                type="password"
                name="newPassword"
                placeholder="••••••••"
                className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 text-white font-bold focus:border-red-500 outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">ΕΠΙΒΕΒΑΙΩΣΗ ΚΩΔΙΚΟΥ</label>
              <input 
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="bg-zinc-900/50 p-5 rounded-3xl border border-zinc-800 text-white font-bold focus:border-red-500 outline-none transition-all placeholder:text-zinc-800"
              />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div className={`flex items-center gap-3 p-6 rounded-3xl border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-500' 
              : 'bg-red-500/10 border-red-500/20 text-red-500'
          } font-black uppercase italic text-xs tracking-widest animate-in fade-in slide-in-from-bottom-2`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl italic disabled:opacity-50"
          >
            {loading ? 'ΑΠΟΘΗΚΕΥΣΗ...' : (
              <>
                <Save size={20} />
                ΑΠΟΘΗΚΕΥΣΗ ΑΛΛΑΓΩΝ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}