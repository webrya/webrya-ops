import { createProperty } from '../actions'

export default function NewPropertyPage() {
  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
          Νεο <span className="text-amber-500">Ακινητο</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
          Στοιχεια καταλυματος
        </p>
      </div>
      
      <form action={createProperty} className="space-y-4 bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">Ονομασια</label>
          <input 
            name="name" 
            placeholder="π.χ. Blue Horizon Villa" 
            required 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">Διευθυνση</label>
          <input 
            name="address" 
            placeholder="Οδος και Αριθμος" 
            required 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700 text-sm"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px] mt-4"
        >
          Αποθηκευση Ακινητου
        </button>
      </form>
    </div>
  )
}