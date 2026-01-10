import { syncPropertyAction } from './actions'

export default function SyncPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-md mx-auto pb-24 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
         Sync <span className="text-amber-500">iCal</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">
          Airbnb / Booking / VRBO
        </p>
      </div>

      <form action={syncPropertyAction} className="space-y-4 bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl">
        <input type="hidden" name="propertyId" value={params.id} />
        
        <div className="space-y-1">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.2em]">iCal URL</label>
          <input 
            name="ical_url" 
            placeholder="https://www.airbnb.com/calendar/export..." 
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-700 text-[10px]"
          />
        </div>

        <button className="w-full bg-amber-500 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 uppercase tracking-[0.2em] text-[10px] mt-4 transition-all">
          Ενεργοποιηση Συγχρονισμου
        </button>
      </form>
    </div>
  )
}