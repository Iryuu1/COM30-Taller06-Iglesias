export type EstadoSolicitud = 'Recibida' | 'En revisión' | 'Resuelta';

export interface Solicitud {
  id: string;
  solicitante: string;
  correo: string;
  categoria: string;
  prioridad: string;
  descripcion: string;
  impacto: string;
  equipos: EquipoAfectado[];
  estado: EstadoSolicitud;
}

export interface EquipoAfectado {
  codigo: string;
  ubicacion: string;
}
