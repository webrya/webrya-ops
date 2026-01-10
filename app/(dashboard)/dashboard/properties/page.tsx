import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getDictionary } from '@/lib/get-dictionary'
import { Folder, Plus, ChevronRight, Home } from 'lucide-react'

// Απενεργοποίηση cache για άμεση ενημέρωση
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PropertiesFoldersPage() {
  const supabase = await createClient()
  
  // 1. Λήψη χρήστη και γλώσσας
  const { data: { user } } = await supabase.auth.getUser()
  const lang = (user?.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 2. Ανάκτηση ακινήτων
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="space-y-10 pb-32 font-sans text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            {dict.common.my_prefix} <span className="text-amber-500">{dict.sidebar.properties}</span> {dict.common.my_suffix}
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">
            {lang === 'GR' ? 'ΟΡΓΑΝΩΣΗ ΑΡΧΕΙΩΝ ΑΚΙΝΗΤΩΝ' : 'PROPERTY FILE ORGANIZATION'}
          </p>
        </div>

        <Link 
          href="/dashboard/properties/new" 
          className="bg-amber-500 text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(245,158,11,0.2)] flex items-center gap-2 italic"
        >
          <Plus size={18} strokeWidth={3} />
          {dict.common.new_button}
        </Link>
      </div>

      {/* Grid με Φακέλους Ακινήτων */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {properties?.map((property) => (
          <Link 
            key={property.id} 
            href={`/dashboard/properties/${property.id}`}
            className="group bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 hover:border-amber-500 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
            {/* Folder Icon με διακριτικό Home */}
            <div className="relative mb-6">
              <Folder 
                size={80} 
                className="text-amber-500 group-hover:scale-110 transition-transform duration-500" 
                fill="currentColor" 
                fillOpacity={0.05} 
              />
              <Home 
                size={18} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500/50 group-hover:text-amber-500 transition-colors" 
              />
            </div>

            <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">
              {property.name}
            </h3>
            
            <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-2 truncate w-full px-4">
              {property.address}
            </p>

            <div className="mt-6 px-4 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-widest group-hover:border-amber-500/30 transition-all italic">
              {lang === 'GR' ? 'ΣΤΟΙΧΕΙΑ ΑΚΙΝΗΤΟΥ' : 'PROPERTY DETAILS'}
            </div>

            <ChevronRight 
              size={16} 
              className="absolute right-6 bottom-6 text-zinc-800 group-hover:text-amber-500 transition-colors" 
            />
          </Link>
        ))}

        {/* Empty State */}
        {(!properties || properties.length === 0) && (
          <div className="col-span-full py-20 text-center bg-zinc-950/50 rounded-[3rem] border border-dashed border-zinc-800">
            <Folder size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">
              {lang === 'GR' ? 'ΔΕΝ ΒΡΕΘΗΚΑΝ ΦΑΚΕΛΟΙ' : 'NO FOLDERS FOUND'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}