export interface Device {
  id: number;
  nombre_id: string;
  ubicacion: string;
  tipo: string; 
  estado: 0 | 1; // Un booleano representado como 0 o 1
  nivel: number; // Un valor entre 0 y 100
}