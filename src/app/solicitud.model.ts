export type EstadoSolicitud = 'Recibida' | 'En revisión' | 'Resuelta';

export interface Solicitud {
  id: string;
  solicitante: string;
  correo: string;
  categoria: string;
  prioridad: string;
  descripcion: string;
  impacto: string;
  estado: EstadoSolicitud;
}
