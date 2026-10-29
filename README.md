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
- Listado con @for, @empty y cambio de estado.

La lista dinámica de equipos (FormArray) y los requisitos restantes se completarán para la entrega final.
