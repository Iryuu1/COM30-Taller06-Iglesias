import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { impactoSiCritico, noSoloEspacios } from './validadores-mesa-ayuda';
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
    },
    { validators: [impactoSiCritico] },
  );

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.servicio.agregar(this.form.getRawValue());
    this.form.reset();
  }

  protected cambiarEstado(id: string, estado: EstadoSolicitud): void {
    this.servicio.cambiarEstado(id, estado);
  }
}
