# Taller 06 y Taller 07 · Mesa de ayuda de TI

Extensión del proyecto del Taller 06 para registrar y dar seguimiento a solicitudes de soporte. El Taller 07 agrega una búsqueda reactiva sobre las solicitudes, con RxJS, signals y Angular standalone.

La búsqueda se realiza en los campos **categoría** y **descripción**. Ignora mayúsculas y tildes, recorta espacios y requiere al menos dos caracteres. La semilla inicial contiene 12 solicitudes y los estados Recibida, En revisión y Resuelta.

## Requisitos

- Node.js y npm

## Instalar y ejecutar

```bash
npm ci
npm start
```

Abre `http://localhost:4200/` en el navegador.

## Compilar

```bash
npx ng build
```

## Funciones del Taller 07

- Servicio root con búsqueda observable, retardo simulado y contador de llamadas de solo lectura.
- Búsqueda con `valueChanges`, `map(trim)`, `debounceTime(300)`, `distinctUntilChanged()` y `switchMap`.
- Resultados conectados a signals; filtro por estado, resumen reactivo e historial de cinco consultas.
- Mensajes de mínimo de caracteres, búsqueda en curso y ausencia de coincidencias.

Los casos y resultados previstos para la semilla de ejemplo están documentados al final de este README.
