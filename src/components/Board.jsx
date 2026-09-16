import { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import Card from './Card';
import SpawnMenu from './SpawnMenu';

function DroppableZone({ id, className, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? 'ring-4 ring-green-500 bg-green-500/20' : ''} transition-all`}>
      {children}
    </div>
  );
}

function Hand({ title, id, cards = [], onDoubleClickCard }) {
  return (
    <div className="w-[1200px] h-40 bg-neutral-800 border-2 border-neutral-700 rounded-lg p-4 flex flex-col shadow-inner shrink-0">
      <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">{title}</span>
      <DroppableZone id={id} className="flex-1 flex gap-2 items-center justify-center border-2 border-dashed border-neutral-600/50 rounded bg-neutral-900/30 p-2 overflow-x-auto min-h-[140px]">
        {cards.map(card => <Card key={card.id} data={card} onDoubleClickCard={onDoubleClickCard} />)}
      </DroppableZone>
    </div>
  );
}

function Playmat({ inverted, isPlayerOne, cards, onDoubleClickCard }) {
  const playerPrefix = isPlayerOne ? 'p1' : 'p2';

  // NOVO SISTEMA DE EMPILHAMENTO (DON!! escorrega para baixo)
  const renderStackedCards = (zoneId) => {
    const zoneCards = cards.filter(c => c.zone === zoneId);
    if (zoneCards.length === 0) return null;
    
    const mainCards = zoneCards.filter(c => c.type !== 'DON!!');
    const dons = zoneCards.filter(c => c.type === 'DON!!');

    return (
      <div className="relative w-full h-full flex justify-center">
        {/* A carta principal fica sempre no topo exato da zona */}
        {mainCards.map((c) => (
          <div key={c.id} className="absolute z-20" style={{ top: '0px' }}>
            <Card data={c} onDoubleClickCard={onDoubleClickCard} />
          </div>
        ))}
        
        {/* Os DONs descem 28px cada um, mostrando a ponta de baixo. O hover:z-30 puxa ele pra frente ao passar o mouse */}
        {dons.map((c, index) => (
          <div 
            key={c.id} 
            className="absolute transition-all hover:z-30" 
            style={{ 
              top: `${(index + 1) * 28}px`, 
              zIndex: index 
            }}
          >
            <Card data={c} onDoubleClickCard={onDoubleClickCard} />
          </div>
        ))}
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
        
        <DroppableZone id={`don-deck-${playerPrefix}`} className="w-full h-40 bg-neutral-400 flex items-center justify-center rounded-sm relative border-2 border-transparent hover:ring-2 ring-blue-500/50 cursor-pointer">
          {cards.filter(c => c.zone === `don-deck-${playerPrefix}`).length === 0 && <span className="text-white font-black uppercase text-xl z-0">Vazio</span>}
          {cards.filter(c => c.zone === `don-deck-${playerPrefix}`).map((c, index) => (
            <div key={c.id} className="absolute hover:z-20 transition-all" style={{ top: `${10 + (index * 1.5)}px`, left: `${12 + (index * 1.5)}px`, zIndex: index }}>
               <Card data={c} onDoubleClickCard={onDoubleClickCard} />
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
             {cards.filter(c => c.zone === `stage-${playerPrefix}`).map(c => <Card key={c.id} data={c} onDoubleClickCard={onDoubleClickCard} />) || "Stage"}
          </DroppableZone>
          
          <div className="flex-1"></div>
          
          <DroppableZone id={`deck-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm border-2 border-transparent">Deck</DroppableZone>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
          <DroppableZone id={`cost-area-${playerPrefix}`} className="flex-1 bg-neutral-400 flex -space-x-10 items-center px-8 py-2 rounded-sm border-2 border-transparent shadow-inner min-w-0">
             {cards.filter(c => c.zone === `cost-area-${playerPrefix}`).length > 0 
              ? cards.filter(c => c.zone === `cost-area-${playerPrefix}`).map(c => (
                  <div key={c.id} className="relative hover:z-20 transition-all">
                    <Card data={c} onDoubleClickCard={onDoubleClickCard} />
                  </div>
                ))
              : <span className="text-white/50 font-black uppercase text-3xl tracking-widest w-full text-center pointer-events-none">Cost Area</span>}
          </DroppableZone>
          <DroppableZone id={`trash-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl rounded-sm border-2 border-transparent">Trash</DroppableZone>
        </div>
      </div>
    </div>
  );
}

const generateInitialState = () => {
  const setup = [
    { id: 'l1', name: 'Monkey.D.Luffy', power: 5000, type: 'Leader', zone: 'leader-p1', rested: false }
  ];
  for(let i = 1; i <= 10; i++) {
    setup.push({ id: `don-p1-${i}`, type: 'DON!!', zone: 'don-deck-p1', rested: false });
    setup.push({ id: `don-p2-${i}`, type: 'DON!!', zone: 'don-deck-p2', rested: false });
  }
  return setup;
};

export default function Board() {
  const [cards, setCards] = useState(generateInitialState);
  const [isSpawnMenuOpen, setIsSpawnMenuOpen] = useState(false);

  function handleDoubleClickCard(card) {
    const isDon = card.type === 'DON!!';
    const isPlayerOne = card.zone.includes('-p1');
    const playerSuffix = isPlayerOne ? 'p1' : 'p2';

    if (isDon) {
      if (card.zone.startsWith('don-deck-')) {
        // DON no Deck -> Cost Area (Ativo)
        setCards(current => current.map(c => c.id === card.id ? { ...c, zone: `cost-area-${playerSuffix}`, rested: false } : c));
      } else if (card.zone.startsWith('char-') || card.zone.startsWith('leader-')) {
        // DON Anexado -> Volta para Cost Area (Virado/Rested)
        setCards(current => current.map(c => c.id === card.id ? { ...c, zone: `cost-area-${playerSuffix}`, rested: true } : c));
      } else {
        // DON na Cost Area -> Apenas Vira
        setCards(current => current.map(c => c.id === card.id ? { ...c, rested: !c.rested } : c));
      }
    } else {
      // Cartas normais -> Apenas Vira
      setCards(current => current.map(c => c.id === card.id ? { ...c, rested: !c.rested } : c));
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    setCards((currentCards) => currentCards.map((card) => card.id === active.id ? { ...card, zone: over.id } : card));
  }

  function addCard(newCard) {
    setCards(current => [...current, newCard]);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center overflow-auto py-12 gap-8 relative">
        
        <div className="flex flex-col gap-4">
          <Hand id="hand-p2" title="Mão do Jogador 2 (Oponente)" cards={cards.filter(c => c.zone === 'hand-p2')} onDoubleClickCard={handleDoubleClickCard} />
          <Playmat inverted={true} isPlayerOne={false} cards={cards} onDoubleClickCard={handleDoubleClickCard} />
        </div>

        <div className="w-[1200px] h-2 bg-neutral-800 rounded-full my-4 flex items-center justify-center">
          <span className="bg-neutral-900 px-4 text-neutral-600 font-bold uppercase tracking-widest text-sm">Centro da Mesa</span>
        </div>

        <div className="flex flex-col gap-4">
          <Playmat inverted={false} isPlayerOne={true} cards={cards} onDoubleClickCard={handleDoubleClickCard} />
          <Hand id="hand-p1" title="Mão do Jogador 1 (Você)" cards={cards.filter(c => c.zone === 'hand-p1')} onDoubleClickCard={handleDoubleClickCard} />
        </div>

        <button 
          onClick={() => setIsSpawnMenuOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-full shadow-2xl font-black uppercase tracking-wider z-40 transition-transform hover:scale-105"
        >
          + Nova Carta
        </button>

        {isSpawnMenuOpen && (
          <SpawnMenu onAddCard={addCard} onClose={() => setIsSpawnMenuOpen(false)} />
        )}

      </div>
    </DndContext>
  );
}
