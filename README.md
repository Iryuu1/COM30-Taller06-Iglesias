# Taller 06 · Mesa de ayuda de TI

Aplicación Angular de una sola pantalla para registrar solicitudes de soporte y seguir su estado. Escenario E1: Mesa de ayuda de TI.

## Ejecutar

```bash
npm install
npm start
```

## Avance implementado

- Angular standalone, sin rutas ni NgModule.
- Formulario reactivo con solicitante, correo, categoría, prioridad, descripción e impacto.
- Validadores integrados, validador propio contra texto compuesto solo por espacios y regla de grupo: prioridad crítica requiere impacto.
- Servicio root con signal privada, asReadonly(), computed para total y pendientes, y actualización inmutable.
- FormArray para equipos afectados, con agregar, quitar (conserva una fila como mínimo) y validadores en cada fila.
- Listado con @for, @empty, seguimiento y cambio de estado.
- Resumen diferido con @defer.

## Validaciones

- Campos obligatorios y correo con formato válido.
- Descripción con mínimo de 10 caracteres.
- Validador propio para rechazar textos compuestos solo por espacios.
- Regla de grupo: una prioridad crítica exige explicar el impacto.
- Equipos: código con formato EQ-001 y ubicación obligatoria.

## Estructura elegida

Se usan archivos separados para el modelo, el servicio, los validadores y la pantalla. Para el alcance de una sola pantalla, mantener una única plantilla evita introducir componentes adicionales; el modelo y las reglas se separan para que el servicio, los datos y las validaciones tengan responsabilidades claras.
