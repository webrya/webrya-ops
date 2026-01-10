import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Settings, Activity, Globe, ArrowLeft } from 'lucide-react' // Προσθήκη ArrowLeft
import { deletePropertyAction } from '../actions'
import { getDictionary } from '@/lib/get-dictionary'

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // 1. Λήψη στοιχείων χρήστη για τη γλώσσα
  const { data: { user } } = await supabase.auth.getUser()
  const lang = (user?.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 2. Φέρνουμε τα στοιχεία του συγκεκριμένου ακινήτου
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!property) return notFound()

  return (
    <div className="space-y-8 pb-32 max-w-5xl mx-auto font-sans text-white">
      
      {/* Header με Back Button & Τίτλο */}
<div className="flex items-center gap-6 px-4 md:px-0 mb-10">
  <Link 
    href="/dashboard/properties" 
    className="p-3 bg-zinc-900 rounded-full hover:bg-amber-500 hover:text-black transition-all group"
  >
    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
  </Link>
  <div>
    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
      {property.name.split(' ')[0]} <span className="text-amber-500">{property.name.split(' ').slice(1).join(' ')}</span>
    </h1>
    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 ml-1">
      {property.address}
    </p>
  </div>
</div>

      {/* Header με Χρυσό Τίτλο */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            {property.name.split(' ')[0]} <span className="text-amber-500">{property.name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-4 ml-1">
            {property.address}
          </p>
        </div>
        
        {/* Κουμπί Ρυθμίσεων / Sync */}
        <Link 
          href={`/dashboard/properties/${params.id}/settings`}
          className="flex items-center gap-3 px-6 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-amber-500 transition-all group shadow-2xl"
        >
          <Settings size={18} className="text-zinc-500 group-hover:text-amber-500 transition-colors" />
          <span className="text-white text-xs font-black uppercase tracking-widest">
            {lang === 'GR' ? 'ΡΥΘΜΙΣΕΙΣ SYNC' : 'SYNC SETTINGS'}
          </span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 text-green-500">
              <Activity size={20} />
            </div>
            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{lang === 'GR' ? 'ΚΑΤΑΣΤΑΣΗ' : 'STATUS'}</h4>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse"></div>
            <span className="text-2xl font-black uppercase italic tracking-tighter">
              {lang === 'GR' ? 'ΕΝΕΡΓΟ' : 'ACTIVE'}
            </span>
          </div>
        </div>

        <div className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl transition-all hover:border-zinc-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-500">
              <Globe size={20} />
            </div>
            <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">ICAL SYNC</h4>
          </div>
          <span className="text-2xl font-black uppercase italic tracking-tighter">
            {property.ical_url 
              ? (lang === 'GR' ? 'ΣΥΝΔΕΔΕΜΕΝΟ' : 'CONNECTED') 
              : (lang === 'GR' ? 'ΧΩΡΙΣ ΣΥΝΔΕΣΗ' : 'NOT LINKED')}
          </span>
        </div>
      </div>

      {/* Danger Zone: Διαγραφή Ακινήτου */}
      <div className="mt-12 px-4 md:px-0">
        <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-red-500/10">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black uppercase italic text-red-500 tracking-tighter">
              {lang === 'GR' ? 'ΔΙΑΓΡΑΦΗ ΑΚΙΝΗΤΟΥ' : 'DELETE PROPERTY'}
            </h3>
            <p className="text-zinc-600 text-[10px] font-black uppercase mt-2 tracking-widest">
              {lang === 'GR' 
                ? 'ΠΡΟΣΟΧΗ: Η ΕΝΕΡΓΕΙΑ ΑΥΤΗ ΕΙΝΑΙ ΜΟΝΙΜΗ' 
                : 'WARNING: THIS ACTION IS PERMANENT'}
            </p>
          </div>

          <form action={async () => {
            'use server'
            await deletePropertyAction(params.id)
          }}>
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] transition-all flex items-center gap-4 shadow-2xl hover:scale-105 active:scale-95 italic text-xs"
            >
              <Trash2 size={18} />
              {lang === 'GR' ? 'ΟΡΙΣΤΙΚΗ ΔΙΑΓΡΑΦΗ' : 'DELETE PERMANENTLY'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}