import { Injectable, computed, signal } from '@angular/core';
import { EstadoSolicitud, Solicitud } from './solicitud.model';

type NuevaSolicitud = Omit<Solicitud, 'id' | 'estado'>;

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly _solicitudes = signal<Solicitud[]>([]);
  readonly solicitudes = this._solicitudes.asReadonly();
  readonly total = computed(() => this._solicitudes().length);
  readonly pendientes = computed(
    () => this._solicitudes().filter((s) => s.estado !== 'Resuelta').length,
  );

  agregar(datos: NuevaSolicitud): void {
    const solicitud: Solicitud = {
      ...datos,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      estado: 'Recibida',
    };
    this._solicitudes.update((actuales) => [...actuales, solicitud]);
  }

  cambiarEstado(id: string, estado: EstadoSolicitud): void {
    this._solicitudes.update((actuales) =>
      actuales.map((s) => (s.id === id ? { ...s, estado } : s)),
    );
  }
}
