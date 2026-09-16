export default function Card({ data }) {
  return (
    <div className="w-24 h-32 bg-neutral-200 rounded-md border-2 border-neutral-800 shadow-md flex flex-col items-center justify-center p-1 relative overflow-hidden cursor-grab hover:ring-2 hover:ring-blue-500 hover:scale-105 transition-all">
      
      {/* Custo (Topo Esquerda) */}
      {data.cost !== undefined && (
        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs font-bold px-1.5 rounded-full border border-neutral-800">
          {data.cost}
        </div>
      )}

      {/* Poder (Topo Direita) */}
      {data.power !== undefined && (
        <div className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-1 rounded border border-neutral-800">
          {data.power}
        </div>
      )}

      {/* Nome e Tipo */}
      <span className="text-neutral-900 font-extrabold text-[11px] text-center leading-tight mt-4">
        {data.name}
      </span>
      <span className="text-neutral-600 font-semibold text-[9px] mt-1 uppercase tracking-tighter">
        {data.type}
      </span>
    </div>
  );
}
