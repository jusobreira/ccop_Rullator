import { useState } from 'react';

export default function SpawnMenu({ onAddCard, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Character',
    cost: '',
    power: '',
    player: 'p1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCard({
      id: `custom-${Date.now()}`,
      name: formData.name || 'Nova Carta',
      type: formData.type,
      cost: formData.cost ? Number(formData.cost) : undefined,
      power: formData.power ? Number(formData.power) : undefined,
      zone: `hand-${formData.player}`, // A carta sempre vai nascer na mão do jogador
      rested: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-800 p-6 rounded-lg border-2 border-neutral-600 w-full max-w-md shadow-2xl">
        <h2 className="text-white text-xl font-bold mb-4">Adicionar Nova Carta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="text-neutral-400 text-sm font-bold">Nome da Carta</label>
            <input type="text" autoFocus className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-700 outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-neutral-400 text-sm font-bold">Custo</label>
              <input type="number" className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-700 outline-none focus:border-blue-500" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="text-neutral-400 text-sm font-bold">Poder</label>
              <input type="number" className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-700 outline-none focus:border-blue-500" value={formData.power} onChange={e => setFormData({...formData, power: e.target.value})} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-neutral-400 text-sm font-bold">Tipo</label>
              <select className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-700 outline-none focus:border-blue-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Character">Character</option>
                <option value="Event">Event</option>
                <option value="Stage">Stage</option>
                <option value="Leader">Leader</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-neutral-400 text-sm font-bold">Destino (Mão)</label>
              <select className="w-full bg-neutral-900 text-white p-2 rounded border border-neutral-700 outline-none focus:border-blue-500" value={formData.player} onChange={e => setFormData({...formData, player: e.target.value})}>
                <option value="p1">Jogador 1 (Você)</option>
                <option value="p2">Jogador 2 (Oponente)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-white font-bold transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-500 transition-colors shadow-lg">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
