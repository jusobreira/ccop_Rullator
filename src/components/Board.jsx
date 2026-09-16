import { useState } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import Card from './Card';

// 1. COMPONENTE DE ZONA SOLTÁVEL
// Transforma qualquer div em uma área que aceita cartas
function DroppableZone({ id, className, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div 
      ref={setNodeRef} 
      className={`${className} ${isOver ? 'ring-4 ring-green-500 bg-green-500/20' : ''} transition-all`}
    >
      {children}
    </div>
  );
}

// 2. MÃO DO JOGADOR (Agora é uma Zona)
function Hand({ title, id, cards = [] }) {
  return (
    <div className="w-[1200px] h-40 bg-neutral-800 border-2 border-neutral-700 rounded-lg p-4 flex flex-col shadow-inner shrink-0">
      <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-2">{title}</span>
      <DroppableZone id={id} className="flex-1 flex gap-2 items-center justify-center border-2 border-dashed border-neutral-600/50 rounded bg-neutral-900/30 p-2 overflow-x-auto min-h-[140px]">
        {cards.map(card => <Card key={card.id} data={card} />)}
      </DroppableZone>
    </div>
  );
}

// 3. PLAYMAT ESPELHADO
function Playmat({ inverted, isPlayerOne, cards }) {
  const playerPrefix = isPlayerOne ? 'p1' : 'p2';

  return (
    <div className={`w-[1200px] shrink-0 bg-white p-6 shadow-2xl rounded-lg flex gap-4 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
      
      <div className={`w-32 flex justify-between gap-4 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
        <div className={`flex gap-2 ${inverted ? 'flex-col-reverse' : 'flex-col'}`}>
          <div className="w-full h-40 bg-neutral-400 flex items-center justify-center text-white font-black uppercase text-xl">Life</div>
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
            {/* 5 Slots de Personagem agora são Droppables */}
            {[1, 2, 3, 4, 5].map((i) => {
              const zoneId = `char-${playerPrefix}-${i}`;
              return (
                <DroppableZone key={zoneId} id={zoneId} className="w-28 h-36 border-2 border-white/50 border-dashed bg-white/10 rounded flex items-center justify-center">
                  {cards.filter(c => c.zone === zoneId).map(c => <Card key={c.id} data={c} />)}
                </DroppableZone>
              );
            })}
          </div>
        </div>

        <div className={`flex gap-4 h-40 ${inverted ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-20 flex flex-col justify-between py-1 items-center text-[10px] font-bold text-white uppercase bg-neutral-800 rounded px-1">
            <span>Fases</span>
          </div>
          
          {/* Espaço do Líder */}
          <DroppableZone id={`leader-${playerPrefix}`} className="w-28 h-full bg-neutral-400 flex items-center justify-center rounded-sm">
            {cards.filter(c => c.zone === `leader-${playerPrefix}`).map(c => <Card key={c.id} data={c} />) || <span className="text-white font-black uppercase">Leader</span>}
          </DroppableZone>

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

// 4. COMPONENTE PRINCIPAL COM O ESTADO
export default function Board() {
  // Estado que controla TODAS as cartas do jogo e em que 'zone' elas estão
  const [cards, setCards] = useState([
    { id: 'l1', name: 'Monkey.D.Luffy', power: 5000, type: 'Leader', zone: 'leader-p1' },
    { id: 'c1', name: 'Roronoa Zoro', cost: 3, power: 5000, type: 'Character', zone: 'hand-p1' },
    { id: 'c2', name: 'Nami', cost: 1, power: 1000, type: 'Character', zone: 'hand-p1' },
    { id: 'c3', name: 'Gum-Gum Pistol', cost: 2, type: 'Event', zone: 'hand-p1' }
  ]);

  // Função que roda sempre que você solta uma carta
  function handleDragEnd(event) {
    const { active, over } = event;
    
    // Se soltou fora de uma área válida, não faz nada
    if (!over) return;

    // Atualiza a carta movida para a nova zona (ID do DroppableZone)
    setCards((currentCards) => 
      currentCards.map((card) => 
        card.id === active.id ? { ...card, zone: over.id } : card
      )
    );
  }

  return (
    // DndContext envolve tudo que pode ter interação de arrastar
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center overflow-auto py-12 gap-8">
        
        <div className="flex flex-col gap-4">
          <Hand id="hand-p2" title="Mão do Jogador 2 (Oponente)" cards={cards.filter(c => c.zone === 'hand-p2')} />
          <Playmat inverted={true} isPlayerOne={false} cards={cards} />
        </div>

        <div className="w-[1200px] h-2 bg-neutral-800 rounded-full my-4 flex items-center justify-center">
          <span className="bg-neutral-900 px-4 text-neutral-600 font-bold uppercase tracking-widest text-sm">Centro da Mesa</span>
        </div>

        <div className="flex flex-col gap-4">
          <Playmat inverted={false} isPlayerOne={true} cards={cards} />
          <Hand id="hand-p1" title="Mão do Jogador 1 (Você)" cards={cards.filter(c => c.zone === 'hand-p1')} />
        </div>

      </div>
    </DndContext>
  );
}
