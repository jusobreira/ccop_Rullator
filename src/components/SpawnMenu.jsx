import { useState, useEffect } from 'react';

export default function SpawnMenu({ onAddCard, onClose }) {
  const [player, setPlayer] = useState('p1');
  
  // Estados para a busca e base de dados
  const [db, setDb] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca o banco de dados oficial em JSON ao abrir o menu
  useEffect(() => {
    // Usando um repositório comunitário confiável que mantém o JSON das cartas
    fetch('https://raw.githubusercontent.com/The-Eggy/optcg-db-mirror/main/cards.json')
      .then(res => res.json())
      .then(data => {
        // Transforma o objeto do JSON em um array para facilitar a busca
        const cardsArray = Object.values(data);
        setDb(cardsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar DB:", err);
        setLoading(false);
      });
  }, []);

  // Filtra as cartas com base na busca (nome)
  const filteredCards = db.filter(card => 
    card.name && card.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 50); // Limita a 50 resultados para não travar a tela

  const handleSelectCard = (cardData) => {
    onAddCard({
      id: `${cardData.id}-${Date.now()}`, // Garante ID único caso coloque 2 cartas iguais
      name: cardData.name,
      type: cardData.type,
      cost: cardData.cost !== "" ? Number(cardData.cost) : undefined,
      power: cardData.power !== "" ? Number(cardData.power) : undefined,
      zone: `hand-${player}`, // Vai para a mão do jogador escolhido
      rested: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 p-6 rounded-lg border-2 border-neutral-600 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Buscar Carta Oficial (OPTCG-DB)</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-black text-xl">&times;</button>
        </div>

        {/* Controles de Destino */}
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

        {/* Barra de Busca */}
        <input 
          type="text" 
          autoFocus 
          placeholder={loading ? "Carregando base de dados..." : "Digite o nome da carta (ex: Zoro, OP01-001)..."}
          className="w-full bg-neutral-900 text-white p-3 rounded border-2 border-neutral-700 outline-none focus:border-blue-500 text-lg mb-4" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          disabled={loading}
        />

        {/* Lista de Resultados */}
        <div className="flex-1 overflow-y-auto bg-neutral-900 rounded border border-neutral-700 p-2">
          {loading && <div className="text-neutral-500 text-center mt-4">Conectando ao OPTCG-DB...</div>}
          
          {!loading && search.length > 2 && filteredCards.length === 0 && (
            <div className="text-neutral-500 text-center mt-4">Nenhuma carta encontrada.</div>
          )}

          {!loading && search.length > 2 && filteredCards.map(card => (
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
                {card.cost && <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-800">Cost: {card.cost}</span>}
                {card.power && <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-800">Power: {card.power}</span>}
              </div>
            </div>
          ))}
          
          {!loading && search.length <= 2 && (
            <div className="text-neutral-600 text-center mt-4 text-sm">
              Digite pelo menos 3 letras para buscar.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
