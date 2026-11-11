# Taller 06 y Taller 07 · Mesa de ayuda de TI

Extensión del proyecto del Taller 06 para registrar y dar seguimiento a solicitudes de soporte. El Taller 07 agrega una búsqueda reactiva sobre las solicitudes, con RxJS, signals y Angular standalone.

La búsqueda se realiza en los campos **categoría** y **descripción**. Ignora mayúsculas y tildes, recorta espacios y requiere al menos dos caracteres. La semilla inicial contiene 12 solicitudes propias del escenario de mesa de ayuda y conserva los estados del Taller 06: Recibida, En revisión y Resuelta. Las palabras de prueba en las descripciones permiten reproducir los nueve casos del enunciado.

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
| R01 | Hardware | El portátil no enciende después de actualizar el sistema; falla reportada en sala 1. | Recibida |
| R02 | Software | Outlook no sincroniza el correo institucional en sala 1; equipo asignado a biblioteca. | En revisión |
| R03 | Red | La conexión de red falla en la Sala 2; el equipo pertenece a Bienestar. | En revisión |
| R04 | Acceso | Restablecer contraseña institucional del sistema del laboratorio. | Recibida |
| R05 | Hardware | La impresora no responde al enviar documentos. | En revisión |
| R06 | Software | La nómina se cierra al consultar reportes en la Sala 2. | Resuelta |
| R07 | Red | Configurar acceso remoto desde el sistema de trabajo del laboratorio. | Recibida |
| R08 | Bienestar | Solicito acceso a la cuenta de correo institucional. | Resuelta |
| R09 | Hardware | El teclado del portátil dejó de responder en sala 1; equipo de biblioteca. | Resuelta |
| R10 | Software | La plataforma de biblioteca solicita actualización en sala 1. | En revisión |
| R11 | Red | La señal Wi-Fi se interrumpe en la sala 2; se requiere revisar el sistema de conexión. | Recibida |
| R12 | Bienestar | No puedo ingresar al portal administrativo del laboratorio. | Resuelta |

## Casos de prueba previstos

| Caso | Acción | Resultado y contador esperados |
| --- | --- | --- |
| C1 | Buscar `sala` | R01, R02, R03, R06, R09, R10 y R11; llamadas 1. |
| C2 | Cambiar a `sala 2` | R03, R06 y R11; llamadas 2. |
| C3 | Cambiar a `sist` | R01, R04, R07 y R11; llamadas 3. |
| C4 | Añadir espacio final: `sist ` | Mismos cuatro resultados; llamadas 3. |
| C5 | Buscar `x` | Mensaje de mínimo dos caracteres; llamadas 3. |
| C6 | Buscar `zzz` | Sin coincidencias; llamadas 4. |
| C7 | Buscar `sala` y filtrar por estado | Recibida: R01 y R11; En revisión: R02, R03 y R10; Resuelta: R06 y R09. Llamadas 5; el filtro no consulta. |
| C8 | Escribir `laboratorio` letra por letra, sin pausas | R04, R07 y R12; llamadas 6 (una consulta). |
| C9 | Escribir `bi`, esperar 400 ms y completar `bien` en menos de 300 ms | `bi` coincide con R02, R03, R08, R09 y R12; `bien` con R03, R08 y R12. Termina con esos tres; llamadas 8. |

Los resultados de la tabla son las expectativas que se contrastan con la columna “Obtenido” del informe durante la ejecución en el navegador.
