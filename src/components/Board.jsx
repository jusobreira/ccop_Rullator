export default function Board() {
  return (
    <div className="min-h-screen bg-neutral-900 p-8 text-white flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-4 gap-4 aspect-[16/9] border-2 border-neutral-700 rounded-xl p-6 bg-neutral-800/50 shadow-2xl">
        
        {/* Coluna 1: Leader & Stage */}
        <div className="flex flex-col gap-4">
          <div className="h-32 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-400 font-semibold hover:border-neutral-400 transition-colors">Stage</div>
          <div className="h-48 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-900/10 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]">Leader</div>
        </div>

        {/* Colunas 2 e 3: Character Area */}
        <div className="col-span-2 grid grid-cols-5 gap-3 content-end">
          {/* 5 slots para personagens */}
          {[1, 2, 3, 4, 5].map((slot) => (
            <div key={slot} className="h-40 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-500 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-400 transition-all cursor-pointer">
              Char {slot}
            </div>
          ))}
        </div>

        {/* Coluna 4: Deck, Trash & DON!! */}
        <div className="flex flex-col gap-4">
          <div className="h-32 border-2 border-dashed border-neutral-600 rounded-lg flex items-center justify-center text-neutral-400 font-semibold hover:border-neutral-400 transition-colors">Deck & Trash</div>
          <div className="h-48 border-2 border-purple-500 rounded-lg flex items-center justify-center bg-purple-900/10 text-purple-400 font-bold shadow-[0_0_15px_rgba(168,85,247,0.2)]">DON!! Deck</div>
        </div>

      </div>
    </div>
  );
}
