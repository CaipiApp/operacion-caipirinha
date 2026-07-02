export interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  createdAt: Date;
  updatedAt?: Date | null;
}