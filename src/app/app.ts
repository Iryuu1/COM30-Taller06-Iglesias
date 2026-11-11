import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Observable, debounceTime, distinctUntilChanged, filter, finalize, map, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { impactoSiCritico, minimoEquipos, noSoloEspacios } from './validadores-mesa-ayuda';
import { SolicitudesService } from './solicitudes.service';
import { EstadoSolicitud, Solicitud } from './solicitud.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly servicio = inject(SolicitudesService);
  protected readonly solicitudes = this.servicio.solicitudes;
  protected readonly total = this.servicio.total;
  protected readonly pendientes = this.servicio.pendientes;
  protected readonly estados: EstadoSolicitud[] = ['Recibida', 'En revisión', 'Resuelta'];
  protected readonly llamadas = this.servicio.llamadas;
  protected readonly busqueda = new FormControl('', { nonNullable: true });
  protected readonly buscando = signal(false);
  protected readonly filtroEstado = signal<'Todos' | EstadoSolicitud>('Todos');
  protected readonly historial = signal<string[]>([]);
  private readonly consultaProcesada = signal('');
  private readonly destroyRef = inject(DestroyRef);

  private readonly consultas$ = this.busqueda.valueChanges.pipe(
    map((texto) => texto.trim()),
    debounceTime(300),
    distinctUntilChanged(),
    startWith(this.busqueda.value),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly consultaActual = toSignal(
    this.busqueda.valueChanges.pipe(
      map((texto) => texto.trim()),
      startWith(this.busqueda.value),
    ),
    { initialValue: '' },
  );

  protected readonly resultados = toSignal(
    this.consultas$.pipe(
      tap((texto) => this.consultaProcesada.set(texto)),
      switchMap((texto): Observable<Solicitud[]> => {
        if (texto.length < 2) {
          this.buscando.set(false);
          return of([]);
        }

        this.buscando.set(true);
        return this.servicio.buscar(texto).pipe(
          finalize(() => this.buscando.set(false)),
        );
      }),
    ),
    { initialValue: [] },
  );

  protected readonly estadoBusqueda = computed(() => {
    const consulta = this.consultaActual();

    if (consulta.length < 2) return 'minimo';
    if (consulta !== this.consultaProcesada() || this.buscando()) return 'buscando';
    return this.resultados().length === 0 ? 'vacio' : 'resultados';
  });

  protected readonly resultadosVisibles = computed(() => {
    const estado = this.filtroEstado();
    const resultados = this.resultados();
    return estado === 'Todos'
      ? resultados
      : resultados.filter((solicitud) => solicitud.estado === estado);
  });

  protected readonly resumenBusqueda = computed(() => {
    const solicitudes = this.resultadosVisibles();
    return {
      total: solicitudes.length,
      recibidas: solicitudes.filter((solicitud) => solicitud.estado === 'Recibida').length,
      enRevision: solicitudes.filter((solicitud) => solicitud.estado === 'En revisión').length,
      resueltas: solicitudes.filter((solicitud) => solicitud.estado === 'Resuelta').length,
    };
  });

  constructor() {
    this.consultas$
      .pipe(
        filter((texto) => texto.length >= 2),
        tap((texto) => this.historial.update((actual) => [texto, ...actual].slice(0, 5))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected readonly form = this.fb.group(
    {
      solicitante: ['', [Validators.required, noSoloEspacios]],
      correo: ['', [Validators.required, Validators.email]],
      categoria: ['', Validators.required],
      prioridad: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10), noSoloEspacios]],
      impacto: [''],
      equipos: this.fb.array([this.nuevoEquipo()], minimoEquipos(1)),
    },
    { validators: [impactoSiCritico] },
  );

  protected get equipos(): FormArray {
    return this.form.controls.equipos;
  }

  protected controlEquipo(indice: number) {
    return this.equipos.at(indice) as ReturnType<App['nuevoEquipo']>;
  }

  private nuevoEquipo() {
    return this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^EQ-\d{3}$/)]],
      ubicacion: ['', [Validators.required, Validators.minLength(2), noSoloEspacios]],
    });
  }

  protected agregarEquipo(): void {
    this.equipos.push(this.nuevoEquipo());
  }

  protected quitarEquipo(indice: number): void {
    if (this.equipos.length > 1) this.equipos.removeAt(indice);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.servicio.agregar(this.form.getRawValue());
    this.form.reset({
      solicitante: '',
      correo: '',
      categoria: '',
      prioridad: '',
      descripcion: '',
      impacto: '',
    });
    this.form.setControl('equipos', this.fb.array([this.nuevoEquipo()], minimoEquipos(1)));
  }

  protected cambiarEstado(id: string, estado: EstadoSolicitud): void {
    this.servicio.cambiarEstado(id, estado);
  }

  protected cambiarFiltro(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    if (valor === 'Todos' || this.estados.includes(valor as EstadoSolicitud)) {
      this.filtroEstado.set(valor as 'Todos' | EstadoSolicitud);
    }
  }

  protected repetirConsulta(consulta: string): void {
    this.busqueda.setValue(consulta);
  }
}
