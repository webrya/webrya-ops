import { createClient } from '@/lib/supabase/server'

export default async function NewBookingPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase.from('properties').select('id, name')

  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
          Νεα <span className="text-amber-500">Κρατηση</span>
        </h1>
      </div>
      
      <form className="space-y-4 bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <input 
          name="guest_name" 
          placeholder="Ονομα Επισκεπτη" 
          className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700"
        />

        <select 
          name="property_id" 
          className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all"
        >
          <option value="">Επιλογη Ακινητου</option>
          {properties?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-500 uppercase ml-2">Check In</label>
            <input type="date" name="check_in" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] font-black text-zinc-500 uppercase ml-2">Check Out</label>
            <input type="date" name="check_out" className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all" />
          </div>
        </div>

        <button className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] uppercase tracking-widest text-xs mt-4">
          Καταχωρηση Κρατησης
        </button>
      </form>
    </div>
  )
}