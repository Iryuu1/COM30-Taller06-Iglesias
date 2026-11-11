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

## Semilla de prueba

| Código | Categoría | Descripción | Estado |
| --- | --- | --- | --- |
| T07-R01 | Hardware | El portátil no enciende después de actualizar el sistema. | Recibida |
| T07-R02 | Software | Outlook no sincroniza el correo institucional. | En revisión |
| T07-R03 | Red | La conexión de red falla en la Sala 2. | Resuelta |
| T07-R04 | Acceso | Restablecer contraseña del correo institucional. | Recibida |
| T07-R05 | Hardware | La impresora no responde al enviar documentos. | En revisión |
| T07-R06 | Software | El sistema de nómina se cierra al consultar reportes. | Resuelta |
| T07-R07 | Red | Configurar acceso remoto para trabajo desde casa. | Recibida |
| T07-R08 | Acceso | Solicito acceso a la cuenta de correo institucional. | Resuelta |
| T07-R09 | Hardware | El teclado del portátil dejó de responder. | Recibida |
| T07-R10 | Software | El sistema de biblioteca solicita actualización. | En revisión |
| T07-R11 | Red | La señal Wi-Fi se interrumpe en el laboratorio. | En revisión |
| T07-R12 | Acceso | No puedo ingresar al portal administrativo. | Resuelta |

## Casos de prueba previstos

| Caso | Acción | Resultado y contador esperados |
| --- | --- | --- |
| C1 | Buscar `sistema` | T07-R01, T07-R06 y T07-R10; llamadas 1. |
| C2 | Cambiar a `sistema de` | T07-R06 y T07-R10; llamadas 2. |
| C3 | Cambiar a `red` | T07-R03, T07-R07 y T07-R11; llamadas 3. |
| C4 | Añadir espacio final: `red ` | Mismos tres resultados; llamadas 3. |
| C5 | Buscar `x` | Mensaje de mínimo dos caracteres; llamadas 3. |
| C6 | Buscar `zzz` | Sin coincidencias; llamadas 4. |
| C7 | Buscar `sistema` y filtrar por estado | Un resultado por estado; llamadas 5 antes y después del filtro. |
| C8 | Escribir `correo` letra por letra, sin pausas | T07-R02, T07-R04 y T07-R08; llamadas 6 (una consulta). |
| C9 | Escribir `ac`, esperar 400 ms y completar `acceso` antes de 300 ms | `ac` coincide con seis registros y `acceso` con T07-R04, T07-R07, T07-R08 y T07-R12. Termina con esos cuatro; llamadas 8. |

Los resultados de la tabla son las expectativas que se contrastan con la columna “Obtenido” del informe durante la ejecución en el navegador.
