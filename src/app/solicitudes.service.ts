import { Injectable, computed, signal } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EstadoSolicitud, Solicitud } from './solicitud.model';

type NuevaSolicitud = Omit<Solicitud, 'id' | 'estado'>;

const SEMILLA_TALLER_07: Solicitud[] = [
  { id: 'T07-R01', solicitante: 'Ana Pérez', correo: 'ana@institucion.edu', categoria: 'Hardware', prioridad: 'Alta', descripcion: 'El portátil no enciende después de actualizar el sistema.', impacto: '', equipos: [{ codigo: 'EQ-001', ubicacion: 'Sala 101' }], estado: 'Recibida' },
  { id: 'T07-R02', solicitante: 'Luis Gómez', correo: 'luis@institucion.edu', categoria: 'Software', prioridad: 'Normal', descripcion: 'Outlook no sincroniza el correo institucional.', impacto: '', equipos: [{ codigo: 'EQ-002', ubicacion: 'Sala 102' }], estado: 'En revisión' },
  { id: 'T07-R03', solicitante: 'Marta Ruiz', correo: 'marta@institucion.edu', categoria: 'Red', prioridad: 'Alta', descripcion: 'La conexión de red falla en la Sala 2.', impacto: 'El equipo de trabajo no puede acceder a recursos compartidos.', equipos: [{ codigo: 'EQ-003', ubicacion: 'Sala 2' }], estado: 'Resuelta' },
  { id: 'T07-R04', solicitante: 'Diego Torres', correo: 'diego@institucion.edu', categoria: 'Acceso', prioridad: 'Normal', descripcion: 'Restablecer contraseña del correo institucional.', impacto: '', equipos: [{ codigo: 'EQ-004', ubicacion: 'Sala 103' }], estado: 'Recibida' },
  { id: 'T07-R05', solicitante: 'Sara Ríos', correo: 'sara@institucion.edu', categoria: 'Hardware', prioridad: 'Baja', descripcion: 'La impresora no responde al enviar documentos.', impacto: '', equipos: [{ codigo: 'EQ-005', ubicacion: 'Recepción' }], estado: 'En revisión' },
  { id: 'T07-R06', solicitante: 'Pablo León', correo: 'pablo@institucion.edu', categoria: 'Software', prioridad: 'Alta', descripcion: 'El sistema de nómina se cierra al consultar reportes.', impacto: 'Se requiere consultar la nómina antes del cierre.', equipos: [{ codigo: 'EQ-006', ubicacion: 'Sala 104' }], estado: 'Resuelta' },
  { id: 'T07-R07', solicitante: 'Elena Díaz', correo: 'elena@institucion.edu', categoria: 'Red', prioridad: 'Normal', descripcion: 'Configurar acceso remoto para trabajo desde casa.', impacto: '', equipos: [{ codigo: 'EQ-007', ubicacion: 'Sala 105' }], estado: 'Recibida' },
  { id: 'T07-R08', solicitante: 'Nicolás Mora', correo: 'nicolas@institucion.edu', categoria: 'Acceso', prioridad: 'Alta', descripcion: 'Solicito acceso a la cuenta de correo institucional.', impacto: 'La coordinación necesita recibir comunicaciones oficiales.', equipos: [{ codigo: 'EQ-008', ubicacion: 'Sala 106' }], estado: 'Resuelta' },
  { id: 'T07-R09', solicitante: 'Laura Vega', correo: 'laura@institucion.edu', categoria: 'Hardware', prioridad: 'Normal', descripcion: 'El teclado del portátil dejó de responder.', impacto: '', equipos: [{ codigo: 'EQ-009', ubicacion: 'Sala 107' }], estado: 'Recibida' },
  { id: 'T07-R10', solicitante: 'Andrés Gil', correo: 'andres@institucion.edu', categoria: 'Software', prioridad: 'Baja', descripcion: 'El sistema de biblioteca solicita actualización.', impacto: '', equipos: [{ codigo: 'EQ-010', ubicacion: 'Biblioteca' }], estado: 'En revisión' },
  { id: 'T07-R11', solicitante: 'Camila Peña', correo: 'camila@institucion.edu', categoria: 'Red', prioridad: 'Alta', descripcion: 'La señal Wi-Fi se interrumpe en el laboratorio.', impacto: 'Las consultas al servidor se detienen durante las clases.', equipos: [{ codigo: 'EQ-011', ubicacion: 'Laboratorio' }], estado: 'En revisión' },
  { id: 'T07-R12', solicitante: 'Julián Cruz', correo: 'julian@institucion.edu', categoria: 'Acceso', prioridad: 'Normal', descripcion: 'No puedo ingresar al portal administrativo.', impacto: '', equipos: [{ codigo: 'EQ-012', ubicacion: 'Sala 108' }], estado: 'Resuelta' },
];

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly _solicitudes = signal<Solicitud[]>(SEMILLA_TALLER_07);
  readonly solicitudes = this._solicitudes.asReadonly();
  private readonly _llamadas = signal(0);
  readonly llamadas = this._llamadas.asReadonly();
  readonly total = computed(() => this._solicitudes().length);
  readonly pendientes = computed(
    () => this._solicitudes().filter((s) => s.estado !== 'Resuelta').length,
  );

  buscar(texto: string): Observable<Solicitud[]> {
    const consulta = this.normalizar(texto);
    const retardo = Math.max(150, 1500 - 300 * texto.trim().length);

    return defer(() => {
      this._llamadas.update((total) => total + 1);
      const resultado = this._solicitudes().filter((solicitud) =>
        [solicitud.categoria, solicitud.descripcion].some((campo) =>
          this.normalizar(campo).includes(consulta),
        ),
      );

      return of(resultado).pipe(delay(retardo));
    });
  }

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

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('es')
      .trim();
  }
}
