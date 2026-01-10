import { login } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            Webrya <span className="text-amber-500">Ops</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Σύνδεση στον λογαριασμό σας</p>
        </div>

        {/* Προσθήκη του action={login} */}
        <form action={login} className="space-y-4">
          <div>
            <input 
              name="email"
              type="email" 
              placeholder="Email" 
              required
              className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div>
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              required
              className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white outline-none focus:border-amber-500 transition-all placeholder:text-zinc-600"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-amber-500 text-black font-black py-4 rounded-2xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] uppercase tracking-widest"
          >
            Είσοδος
          </button>
        </form>
      </div>
    </div>
  )
}