import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { impactoSiCritico, minimoEquipos, noSoloEspacios } from './validadores-mesa-ayuda';
import { SolicitudesService } from './solicitudes.service';
import { EstadoSolicitud } from './solicitud.model';

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
}
