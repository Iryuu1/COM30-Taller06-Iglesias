import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const noSoloEspacios: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = String(control.value ?? '');
  return value.trim().length === 0 ? { soloEspacios: true } : null;
};

export const impactoSiCritico: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const prioridad = group.get('prioridad')?.value;
  const impacto = String(group.get('impacto')?.value ?? '').trim();
  return prioridad === 'Crítica' && !impacto
    ? { impactoRequerido: true }
    : null;
};
