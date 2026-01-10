import { createClient } from '@/lib/supabase/server'
import { createTask } from '../actions'

export default async function NewTaskPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select('id, name')

  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
          Νεα <span className="text-amber-500">Εργασια</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
          Προγραμματισμος καθηκοντος
        </p>
      </div>
      
      <form action={createTask} className="space-y-4 bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">Τιτλος Εργασιας</label>
          <input 
            name="title" 
            placeholder="π.χ. Καθαρισμος πισινας" 
            required 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">Επιλογη Ακινητου</label>
          <select 
            name="property_id" 
            required 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all text-sm appearance-none"
          >
            <option value="" className="bg-zinc-900">Επιλεξτε καταλυμα...</option>
            {properties?.map(p => (
              <option key={p.id} value={p.id} className="bg-zinc-900">{p.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">Ημερομηνια Διεξαγωγης</label>
          <input 
            type="date" 
            name="due_date" 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all text-sm color-scheme-dark"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] mt-4"
        >
          Δημιουργια Tasks
        </button>
      </form>
    </div>
  )
}