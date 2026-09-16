import { useDraggable } from '@dnd-kit/core';

// Função oficial descoberta no repositório para gerar o link da imagem via CDN
function getCardImageUrl(cardId) {
  if (!cardId) return '';
  // Pega apenas a parte principal do ID (ex: OP01-001 vira OP01)
  const upperCardId = cardId.toUpperCase();
  const serie = upperCardId.split('-')[0];
  return `https://d2spmnr3w7rm2f.cloudfront.net/Web/Cards/${serie}/${upperCardId}.webp`;
}

export default function Card({ data, onDoubleClickCard }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
    data: data,
  });

  const rotation = data.rested ? 'rotate(90deg)' : '';
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0) ${rotation}`,
    zIndex: 50,
  } : {
    transform: rotation,
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
  };

  const isDon = data.type === 'DON!!';
  
  // Extrai o ID base da carta (removendo sufixos gerados por timestamps como "-1711234")
  const originalCardId = data.id.includes('-') && data.id.length > 10 
    ? data.id.substring(0, data.id.lastIndexOf('-')) 
    : data.id;

  const imageUrl = getCardImageUrl(originalCardId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={() => onDoubleClickCard && onDoubleClickCard(data)} 
      className={`w-24 h-32 rounded-md border-2 flex flex-col items-center justify-center relative overflow-hidden cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-blue-500 touch-none shadow-[2px_2px_10px_rgba(0,0,0,0.5)] bg-neutral-900 ${
        isDon ? 'border-white text-white' : 'border-neutral-800'
      }`}
    >
      {isDon ? (
        <div className="font-black text-xl text-center leading-tight">
          DON!!<br/><span className="text-sm text-neutral-400">+1000</span>
        </div>
      ) : (
        // Carrega a imagem oficial direto do CDN do CloudFront usando o ID da carta
        <img 
          src={imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            // Fallback caso a imagem dê erro 404 (exibe o nome em texto para não quebrar a UI)
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      )}

      {/* Fallback oculto caso a imagem falhe ao carregar */}
      {!isDon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 bg-neutral-800 text-center" style={{ display: 'none' }}>
          <span className="text-white font-black text-[10px] leading-tight block">{data.name}</span>
          <span className="text-neutral-400 text-[8px] uppercase">{data.type}</span>
        </div>
      )}
    </div>
  );
}
