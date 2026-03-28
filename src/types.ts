export interface Collaborator {
  id: string;
  name: string;
  role: string;
  cpf?: string;
  company?: string;
  houseId?: string;
  roomId?: string;
  bedIndex?: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  occupants: (string | null)[]; // Array of collaborator IDs or null for empty bed
}

export interface House {
  id: string;
  name: string;
  location: string;
  rooms: Room[];
}

export const MOCK_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "João Silva", role: "Eletricista" },
  { id: "2", name: "Pedro Santos", role: "Ajudante" },
  { id: "3", name: "Carlos Oliveira", role: "Encarregado" },
  { id: "4", name: "Marcos Souza", role: "Motorista" },
  { id: "5", name: "Ricardo Lima", role: "Eletricista" },
  { id: "6", name: "André Costa", role: "Ajudante" },
  { id: "7", name: "Felipe Rocha", role: "Eletricista" },
  { id: "8", name: "Bruno Mendes", role: "Ajudante" },
  { id: "9", name: "Tiago Alves", role: "Encarregado" },
  { id: "10", name: "Lucas Ferreira", role: "Eletricista" },
];

export const MOCK_HOUSES: House[] = Array.from({ length: 10 }, (_, i) => ({
  id: `house-${i + 1}`,
  name: `República ${String(i + 1).padStart(2, '0')} - ${["Centro", "Norte", "Sul", "Leste", "Oeste"][i % 5]}`,
  location: ["Rua A, 123", "Av. B, 456", "Rua C, 789", "Av. D, 101", "Rua E, 202"][i % 5],
  rooms: Array.from({ length: 3 }, (_, j) => ({
    id: `room-${i + 1}-${j + 1}`,
    name: `Quarto ${j + 1}`,
    capacity: 4,
    occupants: Array(4).fill(null),
  })),
}));

// Initial allocations
MOCK_HOUSES[0].rooms[0].occupants[0] = "1";
MOCK_HOUSES[0].rooms[0].occupants[1] = "2";
MOCK_HOUSES[0].rooms[1].occupants[0] = "3";
MOCK_HOUSES[1].rooms[0].occupants = ["4", "5", "6", "7"]; // Full room
