# Archivo de Conocimiento #3 — Checklist Red Team y Anexos Operativos Banca Tier 1

> **Instrucción para el Agente:** Usa esta matriz en dos momentos:
> 1) Al auditar un Confluence (**Modo Red Team**) para localizar los 7 vectores críticos de fallo en producción antes del Refinamiento.
> 2) Al generar **Anexos Operativos Tier 1** (Analítica sin PII, Auditoría Legal y Diccionario `i18n`).

---

## 1. Los 7 Vectores Críticos de Auditoría (Comité Arquitectura + Riesgos + QA)

| # | Vector de Riesgo | Qué debe verificar el Agente en la especificación | Pregunta / Bloque a insertar si falta |
| :--- | :--- | :--- | :--- |
| **1** | **Corte de red en el peor milisegundo** | ¿Qué pasa si el cliente confirma, el servidor ejecuta la acción y cae el 4G antes de volver la respuesta `200 OK`? | Exigir `Idempotency-Key` (UUID v4) y ventana de caché para evitar doble ejecución. |
| **2** | **Ventanas Batch / Cierre Core** | ¿Está definido el comportamiento si el Host/Core está en cierre nocturno o mantenimiento (`503 CORE_MAINTENANCE`)? | Exigir comportamiento degradado (solo lectura o encolado) y banner con hora estimada. |
| **3** | **Condiciones de Carrera (*Race Conditions*)** | ¿Qué ocurre si el usuario hace doble clic rápido o tiene sesión abierta en Web y App ejecutando a la vez? | Exigir deshabilitación inmediata en UI + manejo de `HTTP 409 Conflict`. |
| **4** | **Fugas de PII y Logs** | ¿Se envían datos personales (DNI, IBAN, PAN, teléfonos, texto libre del chat) en URLs (`GET`), analítica o al LLM? | Exigir enmascaramiento DLP pre-LLM y prohibición de PII en tags de analítica. |
| **5** | **Deuda Móvil y WebView (Shell)** | ¿Se consideran diferencias reales iOS vs. Android (gesto *swipe back* iOS, botón físico atrás Android, visor PDF nativo vs. `PDF.js`, biometría)? | Exigir evento `shell:intercept_back` con soporte explícito para `UINavigationController` en iOS. |
| **6** | **UX de Errores Silenciosos** | ¿Queda alguna pantalla en blanco, spinner infinito o se pierden los datos rellenados tras un error `500/504`? | Exigir preservación de estado en cliente y literales humanos accionables. |
| **7** | **Trazabilidad Legal y Regulatoria** | ¿Queda claro qué evidencia inmutable se custodia ante una reclamación ante Atención al Cliente o regulador? | Exigir tabla de Pista de Auditoría (`Audit Trail`) con hash, sello UTC, método SCA e IP. |

---

## 2. Plantillas de Anexos Operativos Tier 1

### 2.1 Pista de Auditoría Inmutable (*Audit Trail*)
| Campo Obligatorio | Formato | Propósito Regulatorio / Soporte N2 |
| :--- | :--- | :--- |
| `audit_event_id` | UUID v4 | Trazabilidad única de operación crítica. |
| `resource_id` / `payload_sha256` | String / HEX 64 | Evidencia criptográfica exacta del documento o transacción confirmada. |
| `user_id` / `role` | String / Enum | Actor autenticado y facultad/rol verificado. |
| `sca_method` / `sca_ref` | Enum (`FIDO2`, `OTP_SMS`) | Prueba del segundo factor PSD2 superado (si aplica). |
| `timestamp_utc` / `ip_origen` | ISO-8601 / IPv4-v6 | Sello temporal certificado y origen de red. |
| `idempotency_key` | UUID v4 | Correlación ante reintentos de red. |

### 2.2 Plan de Etiquetado de Analítica Digital (Regla Anti-PII)
| Evento / Screen | Trigger Exacto | Dimensiones Permitidas | Datos Estrictamente Prohibidos (Anti-PII) |
| :--- | :--- | :--- | :--- |
| `screen_view_<modulo>` | Renderizado completo tras `200 OK`. | `channel`, `user_segment`, `item_count_bucket`. | `userId` en claro, NIF/CIF, nombres, importes exactos. |
| `action_<flujo>_submit` | Pulsación del CTA principal. | `channel`, `batch_size`, `auth_method`. | IBAN, números de tarjeta, identificadores de contrato. |
| `action_<flujo>_result` | Respuesta final del BFF. | `status` (`ok`\|`partial`\|`error`), `http_code`, `latency_ms_bucket`. | Stacktraces internos, teléfonos, mensajes de error libres. |
| `ai_query_sent` | Envío de consulta en Chatbot/IA. | `origin` (`chip`\|`free_text`), `topic_category` (anonimizada). | **PROHIBIDO** enviar el texto literal escrito por el cliente. |

### 2.3 Diccionario de Microcopy e Internacionalización (`i18n`)
| Clave Propuesta | Literal ES (UX Writing) | Máx. Chars (`375px`) | Ubicación |
| :--- | :--- | :--- | :--- |
| `<mod>.empty.title` | *<Título corto sin relleno>* | 25 | Estado vacío |
| `<mod>.error.generic` | *<Mensaje humano + datos conservados>* | 110 | Banner inline |
| `<mod>.limit.toast` | *<Límite numérico exacto>* | 75 | Toast superior |
