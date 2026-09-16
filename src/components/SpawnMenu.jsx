import { useState, useEffect } from 'react';

export default function SpawnMenu({ onAddCard, onClose }) {
  const [player, setPlayer] = useState('p1');
  const [search, setSearch] = useState('');
  
  // Estado para armazenar o JSON local
  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Busca o arquivo cards.json que você vai criar na pasta public do GitHub
    fetch('/cards.json')
      .then(res => {
        if (!res.ok) throw new Error("Não foi possível carregar o arquivo cards.json. Verifique se ele está na pasta 'public'.");
        return res.json();
      })
      .then(data => {
        // Assume que data já é um array, conforme o modelo JSON fornecido
        setDb(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtra ignorando diferenças de maiúsculas/minúsculas
  const filteredCards = db.filter(card => 
    card.name && card.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50);

  const handleSelectCard = (cardData) => {
    onAddCard({
      id: `${cardData.id}-${Date.now()}`, 
      name: cardData.name,
      type: cardData.type,
      cost: cardData.cost !== null ? Number(cardData.cost) : undefined,
      power: cardData.power !== null ? Number(cardData.power) : undefined,
      zone: `hand-${player}`,
      rested: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 p-6 rounded-lg border-2 border-neutral-600 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Buscar Carta (Banco de Dados Local)</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-black text-xl">&times;</button>
        </div>

        <div className="mb-4 bg-neutral-900 p-3 rounded border border-neutral-700">
          <label className="text-neutral-400 text-sm font-bold mr-3">Enviar para a mão de:</label>
          <select 
            className="bg-neutral-800 text-white p-1 rounded outline-none border border-neutral-600 focus:border-blue-500" 
            value={player} 
            onChange={e => setPlayer(e.target.value)}
          >
            <option value="p1">Jogador 1 (Você)</option>
            <option value="p2">Jogador 2 (Oponente)</option>
          </select>
        </div>

        <input 
          type="text" 
          autoFocus 
          placeholder={loading ? "Carregando cartas..." : "Digite o nome da carta (ex: Nami)..."}
          className="w-full bg-neutral-900 text-white p-3 rounded border-2 border-neutral-700 outline-none focus:border-blue-500 text-lg mb-4" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          disabled={loading || error}
        />

        <div className="flex-1 overflow-y-auto bg-neutral-900 rounded border border-neutral-700 p-2">
          {loading && <div className="text-neutral-500 text-center mt-4 font-bold animate-pulse">Lendo banco de dados...</div>}
          
          {error && (
            <div className="text-red-500 text-center mt-4 p-4 border border-red-500/50 rounded bg-red-900/20">
              <span className="font-bold block mb-2">Erro de Leitura</span>
              {error}
            </div>
          )}
          
          {!loading && !error && search.length > 2 && filteredCards.length === 0 && (
            <div className="text-neutral-500 text-center mt-4 font-bold">Nenhuma carta encontrada.</div>
          )}

          {!loading && !error && search.length > 2 && filteredCards.map(card => (
            <div 
              key={card.id} 
              onClick={() => handleSelectCard(card)}
              className="flex justify-between items-center p-3 hover:bg-blue-600/20 border-b border-neutral-800 cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-white font-bold">{card.name} <span className="text-neutral-500 text-xs ml-2">({card.id})</span></span>
                <span className="text-neutral-400 text-xs mt-1 uppercase tracking-wider">{card.type} • {card.color}</span>
              </div>
              
              <div className="flex gap-3 text-sm">
                {card.cost !== null && <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-800 font-bold">Cost: {card.cost}</span>}
                {card.power !== null && <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-800 font-bold">Power: {card.power}</span>}
              </div>
            </div>
          ))}
          
          {!loading && !error && search.length <= 2 && (
            <div className="text-neutral-600 text-center mt-4 text-sm font-bold">
              Digite pelo menos 3 letras para buscar.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
