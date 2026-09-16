export default function Board() {
  return (
    // Fundo escuro para a tela, criando contraste com o playmat branco
    <div className="min-h-screen bg-neutral-900 p-8 flex items-center justify-center overflow-x-auto">
      
      {/* Container Principal do Playmat (Tamanho Fixo para manter proporção) */}
      <div className="w-[1200px] shrink-0 bg-white p-6 shadow-2xl rounded-lg flex gap-4">

        {/* COLUNA ESQUERDA: Life & Don!! */}
        <div className="w-32 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="w-full h-40 bg-neutral-400 flex items-center justify-center text-white font-black uppercase tracking-wider text-xl">
              Life
            </div>
            {/* Linhas indicativas das cartas de vida */}
            <div className="flex flex-col gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 w-full border-2 border-neutral-400 bg-white rounded-sm"></div>
              ))}
            </div>
          </div>

          <div className="w-full h-40 bg-neutral-400 flex flex-col items-center justify-center text-white font-black uppercase tracking-wider text-xl leading-tight">
            <span>DON!!</span>
          </div>
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Linha 1: Character Area */}
          <div className="w-full h-44 bg-neutral-400 relative flex items-center justify-center text-white font-black text-3xl tracking-widest rounded-sm">
            <span className="absolute opacity-80 pointer-events-none">CHARACTER AREA</span>
            <div className="w-full h-full flex justify-between items-center px-6 gap-4 z-10">
              {/* 5 Slots invisíveis para soltar as cartas futuramente */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-28 h-36 border-2 border-white/50 border-dashed bg-white/5 hover:bg-white/20 cursor-pointer transition-colors rounded"></div>
              ))}
            </div>
          </div>

          {/* Linha 2: Phases, Leader, Stage e Deck */}
          <div className="flex gap-4 h-40">
            {/* Lista de Fases do Turno */}
            <div className="w-20 flex flex-col justify-between py-1 items-center text-[10px] font-bold text-white uppercase">
              <div className="bg-neutral-800 w-full text-center py-1 rounded">Refresh</div>
              <div className="text-neutral-400">▼</div>
              <div className="bg-neutral-800 w-full text-center py-1 rounded">Draw</div>
              <div className="text-neutral-400">▼</div>
              <div className="bg-neutral-800 w-full text-center py-1 rounded">DON!!</div>
              <div className="text-neutral-400">▼</div>
              <div className="bg-neutral-800 w-full text-center py-1 rounded">Main</div>
              <div className="text-neutral-400">▼</div>
              <div className="bg-neutral-800 w-full text-center py-1 rounded">End</div>
            </div>

            {/* Leader Card */}
            <div className="w-28 h-full bg-neutral-400 flex flex-col items-center justify-center text-white font-black uppercase text-xl leading-tight rounded-sm">
              <span>Leader</span>
              <span>Card</span>
            </div>

            {/* Stage Card */}
            <div className="w-28 h-full bg-neutral-400 flex flex-col items-center justify-center text-white font-black uppercase text-xl leading-tight rounded-sm">
              <span>Stage</span>
              <span>Card</span>
            </div>

            {/* Espaçador flexível para empurrar o Deck para a direita */}
            <div className="flex-1"></div>

            {/* Deck */}
            <div className="w-28 h-full bg-neutral-400 flex flex-col items-center justify-center text-white font-black uppercase text-xl rounded-sm">
              <span>Deck</span>
            </div>
          </div>

          {/* Linha 3: Cost Area e Trash */}
          <div className="flex gap-4 h-40">
            {/* Cost Area (Alinhada abaixo das Fases/Leader/Stage) */}
            <div className="flex-1 bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-3xl tracking-widest rounded-sm">
              Cost Area
            </div>

            {/* Trash (Alinhada exatamente abaixo do Deck) */}
            <div className="w-28 h-full bg-neutral-400 flex flex-col items-center justify-center text-white font-black uppercase text-xl rounded-sm">
              <span>Trash</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
