import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Loader2, Plus, Search, X, MapPin } from 'lucide-react';

// Types
import { House, Room, Collaborator } from './types';

// Components
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { HousingPage } from './pages/HousingPage';
import { CollaboratorsPage } from './pages/CollaboratorsPage';
import { SearchPage } from './pages/SearchPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ActionsPage } from './pages/ActionsPage';

// v1.1.0 - Production Fix
const API_BASE_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
  ? `http://${window.location.hostname}/AlojadorLT/backend`
  : '/backend';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isAllocating, setIsAllocating] = useState<{ houseId: string, roomId: string, bedIndex: number } | null>(null);
  const [selectingCollabForRoom, setSelectingCollabForRoom] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ title: string, message: string, onConfirm: () => void } | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [allocationSearch, setAllocationSearch] = useState('');

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type });
  };

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [housesRes, collabRes] = await Promise.all([
        fetch(`${API_BASE_URL}/get_houses.php`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/get_collaborators.php`, { credentials: 'include' })
      ]);
      const [housesData, collabData] = await Promise.all([
        housesRes.json(),
        collabRes.json()
      ]);
      setHouses(housesData);
      setCollaborators(collabData);
    } catch (err) {
      showToast('Erro ao carregar dados');
    } finally {
      setIsLoadingData(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/check_session.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (err) { } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout.php`, { credentials: 'include' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) { }
  };

  const handleSaveCollaborator = async (collab: Partial<Collaborator>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_collaborator.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: collab.id,
          nome: collab.name || (collab as any).nome,
          cpf: collab.cpf,
          cargo: collab.role || (collab as any).cargo,
          empresa: collab.company || (collab as any).empresa
        }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        showToast(collab.id ? 'Colaborador atualizado' : 'Colaborador cadastrado', 'success');
      } else {
        showToast(data.error || 'Erro ao salvar colaborador');
      }
    } catch (err) { showToast('Erro de conexão'); }
  };

  const handleDeleteCollaborator = (id: string) => {
    setConfirmDialog({
      title: 'Excluir Pessoa',
      message: 'Tem certeza que deseja remover este colaborador permanentemente?',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const response = await fetch(`${API_BASE_URL}/delete_collaborator.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            showToast('Colaborador excluído', 'success');
          } else { showToast(data.error || 'Erro ao excluir'); }
        } catch (err) { showToast('Erro de conexão'); }
      }
    });
  };

  const handleSaveHouse = async (house: Partial<House>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_house.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: house.id,
          nome: house.name,
          endereco: (house as any).location
        }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        showToast('Sucesso', 'success');
      } else { showToast(data.error || 'Erro ao salvar'); }
    } catch (err) { showToast('Erro de conexão'); }
  };

  const handleDeleteHouse = (id: string) => {
    setConfirmDialog({
      title: 'Excluir República',
      message: 'Isso removerá a república e todos os quartos vazios. Confirmar?',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const response = await fetch(`${API_BASE_URL}/delete_house.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            showToast('República excluída da base!', 'success');
          } else { showToast(data.error); }
        } catch (err) { showToast('Erro de conexão ao servidor'); }
      }
    });
  };

  const handleSaveRoom = async (room: Partial<Room> & { houseId: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_room.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: room.id,
          republica_id: room.houseId,
          nome: room.name,
          capacidade: room.capacity
        }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        await loadAllData();
        showToast('Dados do quarto salvos!', 'success');
      } else { showToast(data.error); }
    } catch (err) { showToast('Erro de conexão ao servidor'); }
  };

  const handleDeleteRoom = (id: string) => {
    setConfirmDialog({
      title: 'Excluir Quarto',
      message: 'O quarto será removido permanentemente. Tem certeza?',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const response = await fetch(`${API_BASE_URL}/delete_room.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
            credentials: 'include'
          });
          const data = await response.json();
          if (data.success) {
            await loadAllData();
            showToast('Quarto removido!', 'success');
          } else { showToast(data.error); }
        } catch (err) { showToast('Erro de conexão ao servidor'); }
      }
    });
  };

  const handleCheckOut = async (houseId: string, roomId: string, bedIndex: number) => {
    const house = houses.find(h => h.id === houseId);
    const room = house?.rooms.find(r => r.id === roomId);
    if (!room) return;
    const collaboratorId = room.occupants[bedIndex];
    if (!collaboratorId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/checkout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaborador_id: collaboratorId, quarto_id: room.id }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        await loadAllData();
        showToast('Saída registrada com sucesso!', 'success');
      } else { showToast(data.error); }
    } catch (err) { showToast('Erro de conexão ao servidor'); }
  };

  const confirmAllocation = async (collaboratorId: string) => {
    if (!isAllocating) return;
    try {
      const response = await fetch(`${API_BASE_URL}/save_allocation.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaborador_id: collaboratorId, quarto_id: isAllocating.roomId }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsAllocating(null);
        await loadAllData();
        showToast('Colaborador alocado com sucesso!', 'success');
      } else { showToast(data.error); }
    } catch (err) { showToast('Erro de conexão ao servidor'); }
  };

  const directCheckIn = async (collabId: string, houseId: string, roomId: string, bedIdx: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save_allocation.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaborador_id: collabId, quarto_id: roomId }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSelectingCollabForRoom(null);
        await loadAllData();
        showToast('Alocação finalizada!', 'success');
      } else { showToast(data.error); }
    } catch (err) { showToast('Erro de conexão ao servidor'); }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary-vibrant" size={48} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onShowError={(m) => showToast(m)} onLogin={(u) => { setUser(u); setIsAuthenticated(true); showToast('Bem-vindo', 'success'); }} />} />

        {isAuthenticated ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/" element={<DashboardPage houses={houses} />} />
            <Route path="/republicas" element={<HousingPage houses={houses} onSave={handleSaveHouse} onDelete={handleDeleteHouse} onSaveRoom={handleSaveRoom} onDeleteRoom={handleDeleteRoom} />} />
            <Route path="/pessoas" element={<CollaboratorsPage collaborators={collaborators} houses={houses} onSave={handleSaveCollaborator} onDelete={handleDeleteCollaborator} onCheckOut={handleCheckOut} onCheckInRequest={(id) => setSelectingCollabForRoom(id)} />} />
            <Route path="/busca" element={<SearchPage collaborators={collaborators} houses={houses} />} />
            <Route path="/quarto/:houseId/:roomId" element={<RoomDetailPage houses={houses} collaborators={collaborators} onCheckOut={handleCheckOut} onCheckIn={(h, r, b) => setIsAllocating({ houseId: h, roomId: r, bedIndex: b })} />} />
            <Route path="/acoes" element={<ActionsPage onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>

      <AnimatePresence>
        {isAllocating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[100] flex items-end justify-center">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="bg-white w-full max-w-md rounded-t-[40px] p-8 max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-primary-dark uppercase">Alocar</h2>
                <button onClick={() => setIsAllocating(null)}><X size={24} className="text-slate-300" /></button>
              </div>
              <input type="text" placeholder="BUSCAR..." value={allocationSearch} onChange={(e) => setAllocationSearch(e.target.value.toUpperCase())} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 mb-6 font-semibold" />
              <div className="flex-1 overflow-y-auto space-y-2">
                {collaborators.filter(c => !houses.some(h => h.rooms.some(r => r.occupants.includes(c.id)))).filter(c => c.name.toLowerCase().includes(allocationSearch.toLowerCase())).map(c => (
                  <button key={c.id} onClick={() => confirmAllocation(c.id)} className="w-full p-4 bg-slate-50 rounded-2xl text-left hover:bg-slate-100 transition-colors">
                    <p className="font-bold text-primary-dark uppercase text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{c.role}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectingCollabForRoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[110] flex items-end justify-center">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white w-full max-w-md rounded-t-[40px] p-8 max-h-[92vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-accent font-black text-[10px] mb-1">DESTINO</p>
                  <h2 className="text-2xl font-black text-primary-dark uppercase">Escolha o Local</h2>
                </div>
                <button onClick={() => setSelectingCollabForRoom(null)}><X size={24} className="text-slate-300" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6">
                {houses.map(house => {
                  const av = house.rooms.filter(r => r.occupants.some(o => o === null));
                  if (av.length === 0) return null;
                  return (
                    <div key={house.id} className="space-y-3">
                      <div className="flex gap-2"><MapPin size={14} className="text-slate-300" /><span className="text-xs font-black uppercase text-slate-400">{house.name}</span></div>
                      {av.map(room => (
                        <div key={room.id} className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{room.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {room.occupants.map((occ, idx) => occ === null && (
                              <button key={idx} onClick={() => directCheckIn(selectingCollabForRoom, house.id, room.id, idx)} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-button border border-slate-100 shadow-sm">Vaga {idx + 1}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {confirmDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[200] flex items-center justify-center px-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-[280px] rounded-[32px] p-6 shadow-2xl text-center">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} />
              </div>
              <h3 className="text-lg font-black text-primary-dark tracking-tighter uppercase mb-2">{confirmDialog.title}</h3>
              <p className="text-xs font-semibold text-slate-400 mb-6 leading-relaxed px-2">{confirmDialog.message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-3.5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100"
                >
                  Não
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3.5 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20"
                >
                  Sim
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </BrowserRouter>
  );
}
