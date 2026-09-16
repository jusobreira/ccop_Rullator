import { useDraggable } from '@dnd-kit/core';

export default function Card({ data, onToggleRest }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
    data: data,
  });

  // Se a carta estiver virada (rested = true), aplicamos a rotação
  const rotation = data.rested ? 'rotate(90deg)' : '';
  
  // Combina o movimento de arrastar do mouse com a rotação da carta
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) ${rotation}`,
    zIndex: 50,
  } : {
    transform: rotation,
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Animação suave ao virar
  };

  const isDon = data.type === 'DON!!';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => onToggleRest && onToggleRest(data.id)} // Ativa o Active/Rest
      className={`w-24 h-32 rounded-md border-2 flex flex-col items-center justify-center p-1 relative overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-blue-500 touch-none shadow-[2px_2px_10px_rgba(0,0,0,0.5)] ${
        isDon ? 'bg-neutral-900 border-white text-white' : 'bg-neutral-200 border-neutral-800'
      }`}
    >
      {isDon ? (
        // Design específico para a carta de DON!!
        <div className="font-black text-xl text-center leading-tight">
          DON!!<br/><span className="text-sm text-neutral-400">+1000</span>
        </div>
      ) : (
        // Design das cartas normais
        <>
          {data.cost !== undefined && (
            <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-neutral-800 shadow">
              {data.cost}
            </div>
          )}
          {data.power !== undefined && (
            <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black px-1 rounded border border-neutral-800 shadow">
              {data.power}
            </div>
          )}
          <span className="text-neutral-900 font-black text-xs text-center leading-tight mt-3 px-1">
            {data.name}
          </span>
          <span className="text-neutral-600 font-bold text-[8px] mt-1 uppercase tracking-tighter">
            {data.type}
          </span>
        </>
      )}
    </div>
  );
}
