import { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import Card from './Card';

function DroppableZone({ id, className, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? 'ring-4 ring-green-500 bg-green-500/20' : ''} transition-all`}>
      {children}
    </div>
  );
}

function Hand({ title, id, cards = [], onToggleRest }) {
  return (
    <div className="w-[1200px] h-40 bg-neutral-800 border-2 border-neutral-700 rounded-lg p-4 flex flex-col shadow-inner shrink-0">
      <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">{title}</span>
      <DroppableZone id={id} className="flex-1 flex gap-2 items-center justify-center border-2 border-dashed border-neutral-600/50 rounded bg-neutral-900/30 p-2 overflow-x-auto min-h-[140px]">
        {cards.map(card => <Card key={card.id} data={card} onToggleRest={onToggleRest} />)}
      </DroppableZone>
    </div>
  );
}

function Playmat({ inverted, isPlayerOne, cards, onToggleRest }) {
  const playerPrefix = isPlayerOne ? 'p1' : 'p2';

  const renderStackedCards = (zoneId) => {
    const zoneCards = cards.filter(c => c.zone === zoneId);
    if (zoneCards.length === 0) return null;

    const sorted = [...zoneCards].sort((a, b) => a.type === 'DON!!' ? -1 : 1);
    
    return (
      <div className="relative w-full h-full flex justify-center mt-2">
        {sorted.map((c, index) => {
          const isDon = c.type === 'DON!!';
          const offset = index * 20;
          return (
            <div key={c.id} className="absolute" style={{ top: isDon ? `${offset}px` : `${sorted.filter(x => x.type === 'DON!!').length * 20}px`, zIndex: isDon ? index : 10 }}>
              <Card data={c} onToggleRest={onToggleRest} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`w-[1200px] shrink-0 bg-white p-6 shadow-2xl rounded-lg flex gap-4 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
      
      <div className={`w-32 flex justify-between gap-4 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
        <div className={`flex gap-2 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
          <div className="w-full h-40 bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl">Life</div>
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-3 w-full border-2 border-neutral-400 bg-white rounded-sm"></div>)}
          </div>
        </div>
        
        {/* DON!! DECK: Agora é uma zona arrastável e empilha as 10 cartas */}
        <DroppableZone id={`don-deck-${playerPrefix}`} className="w-full h-40 bg-neutral-400 flex items-center justify-center rounded-sm relative border-2 border-transparent">
          {cards.filter(c => c.zone === `don-deck-${playerPrefix}`).length === 0 && <span className="text-white font-black uppercase text-xl z-0">Vazio</span>}
          {cards.filter(c => c.zone === `don-deck-${playerPrefix}`).map((c, index) => (
            <div key={c.id} className="absolute" style={{ top: `${10 + (index * 1.5)}px`, left: `${12 + (index * 1.5)}px`, zIndex: index }}>
               <Card data={c} onToggleRest={onToggleRest} />
            </div>
          ))}
        </DroppableZone>
      </div>

      <div className={`flex-1 flex gap-4 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
        <div className="w-full h-44 bg-neutral-400 relative flex items-center justify-center text-white font-black text-3xl tracking-widest rounded-sm">
          <span className="absolute opacity-80 pointer-events-none">CHARACTER AREA</span>
          <div className={`w-full h-full flex justify-between items-center px-6 gap-4 z-10 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <DroppableZone key={`char-${playerPrefix}-${i}`} id={`char-${playerPrefix}-${i}`} className="w-28 h-36 border-2 border-white/50 border-dashed bg-white/10 rounded">
                {renderStackedCards(`char-${playerPrefix}-${i}`)}
              </DroppableZone>
            ))}
          </div>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-20 flex flex-col justify-between py-1 items-center text-[10px] font-bold text-white uppercase bg-neutral-800 rounded px-1"><span>Fases</span></div>
          
          <DroppableZone id={`leader-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center rounded-sm border-2 border-transparent relative">
            {cards.some(c => c.zone === `leader-${playerPrefix}`) ? renderStackedCards(`leader-${playerPrefix}`) : <span className="text-white font-black uppercase">Leader</span>}
          </DroppableZone>

          <DroppableZone id={`stage-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm border-2 border-transparent">
             {cards.filter(c => c.zone === `stage-${playerPrefix}`).map(c => <Card key={c.id} data={c} onToggleRest={onToggleRest} />) || "Stage"}
          </DroppableZone>
          
          <div className="flex-1"></div>
          
          <DroppableZone id={`deck-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm border-2 border-transparent">Deck</DroppableZone>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* COST AREA: Aumentei o gap (gap-6) e o padding para caberem as cartas deitadas com folga */}
          <DroppableZone id={`cost-area-${playerPrefix}`} className="flex-1 bg-neutral-400 flex gap-6 items-center px-6 py-2 rounded-sm overflow-x-auto border-2 border-transparent shadow-inner min-w-0">
             {cards.filter(c => c.zone === `cost-area-${playerPrefix}`).length > 0 
              ? cards.filter(c => c.zone === `cost-area-${playerPrefix}`).map(c => <Card key={c.id} data={c} onToggleRest={onToggleRest} />)
              : <span className="text-white/50 font-black uppercase text-3xl tracking-widest w-full text-center pointer-events-none">Cost Area</span>}
          </DroppableZone>
          <DroppableZone id={`trash-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm border-2 border-transparent">Trash</DroppableZone>
        </div>
      </div>
    </div>
  );
}

// Função auxiliar para criar o setup inicial do jogo com os 10 DONs
const generateInitialState = () => {
  const setup = [
    { id: 'l1', name: 'Monkey.D.Luffy', power: 5000, type: 'Leader', zone: 'leader-p1', rested: false },
    { id: 'c1', name: 'Roronoa Zoro', cost: 3, power: 5000, type: 'Character', zone: 'hand-p1', rested: false },
    { id: 'c2', name: 'Nami', cost: 1, power: 1000, type: 'Character', zone: 'hand-p1', rested: false },
    { id: 'c3', name: 'Gum-Gum Pistol', cost: 2, type: 'Event', zone: 'hand-p1', rested: false }
  ];

  // Gera 10 DON!! para o Jogador 1 e 10 para o Jogador 2
  for(let i = 1; i <= 10; i++) {
    setup.push({ id: `don-p1-${i}`, type: 'DON!!', zone: 'don-deck-p1', rested: false });
    setup.push({ id: `don-p2-${i}`, type: 'DON!!', zone: 'don-deck-p2', rested: false });
  }
  return setup;
};

export default function Board() {
  // Inicializa o estado usando a função acima
  const [cards, setCards] = useState(generateInitialState);

  function toggleRest(cardId) {
    setCards(current => 
      current.map(card => 
        card.id === cardId ? { ...card, rested: !card.rested } : card
      )
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    setCards((currentCards) => 
      currentCards.map((card) => 
        card.id === active.id ? { ...card, zone: over.id } : card
      )
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center overflow-auto py-12 gap-8">
        
        <div className="flex flex-col gap-4">
          <Hand id="hand-p2" title="Mão do Jogador 2 (Oponente)" cards={cards.filter(c => c.zone === 'hand-p2')} onToggleRest={toggleRest} />
          <Playmat inverted={true} isPlayerOne={false} cards={cards} onToggleRest={toggleRest} />
        </div>

        <div className="w-[1200px] h-2 bg-neutral-800 rounded-full my-4 flex items-center justify-center">
          <span className="bg-neutral-900 px-4 text-neutral-600 font-bold uppercase tracking-widest text-sm">Centro da Mesa</span>
        </div>

        <div className="flex flex-col gap-4">
          <Playmat inverted={false} isPlayerOne={true} cards={cards} onToggleRest={toggleRest} />
          <Hand id="hand-p1" title="Mão do Jogador 1 (Você)" cards={cards.filter(c => c.zone === 'hand-p1')} onToggleRest={toggleRest} />
        </div>

      </div>
    </DndContext>
  );
}
