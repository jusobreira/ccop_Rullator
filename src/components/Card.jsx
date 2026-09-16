import { useDraggable } from '@dnd-kit/core';

export default function Card({ data }) {
  // Configuração do dnd-kit para tornar este elemento arrastável
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
    data: data, // Carrega as informações da carta durante o arraste
  });

  // Aplica a transformação visual (movimento) apenas quando estiver sendo arrastada
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50, // Garante que a carta fique por cima de tudo ao arrastar
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-24 h-32 bg-neutral-200 rounded-md border-2 border-neutral-800 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-1 relative overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-blue-500 transition-all touch-none"
    >
      {/* Custo */}
      {data.cost !== undefined && (
        <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-neutral-800 shadow">
          {data.cost}
        </div>
      )}

      {/* Poder */}
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
    </div>
  );
}
