import Card from './Card';

// Cartas Falsas (Mocks) para testarmos o visual
const mockCards = {
  leader: { id: 'l1', name: 'Monkey.D.Luffy', power: 5000, type: 'Leader' },
  hand: [
    { id: 'c1', name: 'Roronoa Zoro', cost: 3, power: 5000, type: 'Character' },
    { id: 'c2', name: 'Nami', cost: 1, power: 1000, type: 'Character' },
    { id: 'c3', name: 'Gum-Gum Pistol', cost: 2, type: 'Event' }
  ]
};

function Hand({ title, cards = [] }) {
  return (
    <div className="w-[1200px] h-40 bg-neutral-800 border-2 border-neutral-700 rounded-lg p-4 flex flex-col shadow-inner shrink-0">
      <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">{title}</span>
      <div className="flex-1 flex gap-2 items-center justify-center border-2 border-dashed border-neutral-600/50 rounded bg-neutral-900/30 p-2 overflow-x-auto">
        {cards.length === 0 ? (
          <span className="text-neutral-500 text-sm">Vazio</span>
        ) : (
          cards.map(card => <Card key={card.id} data={card} />)
        )}
      </div>
    </div>
  );
}

function Playmat({ inverted, isPlayerOne }) {
  return (
    <div className={`w-[1200px] shrink-0 bg-white p-6 shadow-2xl rounded-lg flex gap-4 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>

      <div className={`w-32 flex justify-between gap-4 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
        <div className={`flex gap-2 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
          <div className="w-full h-40 bg-neutral-400 flex items-center justify-center text-white font-black uppercase tracking-wider text-xl">Life</div>
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-3 w-full border-2 border-neutral-400 bg-white rounded-sm"></div>)}
          </div>
        </div>
        <div className="w-full h-40 bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl">DON!!</div>
      </div>

      <div className={`flex-1 flex gap-4 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
        <div className="w-full h-44 bg-neutral-400 relative flex items-center justify-center text-white font-black text-3xl tracking-widest rounded-sm">
          <span className="absolute opacity-80 pointer-events-none">CHARACTER AREA</span>
          <div className={`w-full h-full flex justify-between items-center px-6 gap-4 z-10 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-28 h-36 border-2 border-white/50 border-dashed bg-white/5 rounded"></div>
            ))}
          </div>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
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
          <div className="w-28 h-full bg-neutral-400 flex items-center justify-center rounded-sm">
             {/* Adiciona o líder apenas se for o Jogador 1 para teste */}
            {isPlayerOne ? <Card data={mockCards.leader} /> : <span className="text-white font-black uppercase">Leader</span>}
          </div>
          <div className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm">Stage</div>
          <div className="flex-1"></div>
          <div className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm">Deck</div>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex-1 bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-3xl tracking-widest rounded-sm">Cost Area</div>
          <div className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm">Trash</div>
        </div>
      </div>
    </div>
  );
}

export default function Board() {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center overflow-auto py-12 gap-8">
      
      <div className="flex flex-col gap-4">
        <Hand title="Mão do Jogador 2 (Oponente)" />
        <Playmat inverted={true} isPlayerOne={false} />
      </div>

      <div className="w-[1200px] h-2 bg-neutral-800 rounded-full my-4 flex items-center justify-center">
        <span className="bg-neutral-900 px-4 text-neutral-600 font-bold uppercase tracking-widest text-sm">Centro da Mesa</span>
      </div>

      <div className="flex flex-col gap-4">
        <Playmat inverted={false} isPlayerOne={true} />
        {/* Passa as cartas mockadas para a mão do jogador 1 */}
        <Hand title="Mão do Jogador 1 (Você)" cards={mockCards.hand} />
      </div>

    </div>
  );
}
