import { createClient } from '@/lib/supabase/server'
import { Folder, Plus, ChevronRight } from 'lucide-react'
import { getDictionary } from '@/lib/get-dictionary'
import Link from 'next/link'

// Απενεργοποίηση cache για άμεση ενημέρωση
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TasksFoldersPage() {
  const supabase = await createClient()
  
  // 1. Λήψη χρήστη και γλώσσας
  const { data: { user } } = await supabase.auth.getUser()
  const lang = (user?.user_metadata?.language as 'GR' | 'EN') || 'GR'
  const dict = await getDictionary(lang)

  // 2. Ανάκτηση των ακινήτων για τη δημιουργία των φακέλων
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <div className="space-y-10 pb-32 text-white font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            {dict.sidebar.tasks} <span className="text-amber-500">ΑΝΑ ΑΚΙΝΗΤΟ</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">
            {lang === 'GR' ? 'ΕΠΙΛΕΞΤΕ ΦΑΚΕΛΟ ΑΚΙΝΗΤΟΥ' : 'SELECT PROPERTY FOLDER'}
          </p>
        </div>

        <button className="bg-amber-500 text-black p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Grid με Φακέλους Ακινήτων */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {properties?.map((prop) => (
          <Link 
            key={prop.id} 
            href={`/dashboard/tasks/property/${prop.id}`}
            className="group bg-zinc-950 p-10 rounded-[3rem] border border-zinc-900 hover:border-amber-500 transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
          >
            {/* Folder Icon */}
            <div className="relative mb-6">
              <Folder 
                size={80} 
                className="text-amber-500 group-hover:scale-110 transition-transform duration-500" 
                fill="currentColor" 
                fillOpacity={0.05} 
              />
              <ChevronRight 
                size={20} 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            </div>

            <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">
              {prop.name}
            </h3>
            
            <div className="mt-4 px-4 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-widest group-hover:border-amber-500/30 transition-all">
              {lang === 'GR' ? 'ΠΡΟΒΟΛΗ ΕΡΓΑΣΙΩΝ' : 'VIEW TASKS'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}