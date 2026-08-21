const fs = require('fs');
const path = require('path');

// Raw text data containing all chapters and prompts from the user request
const dataOutlook = [
  {
    num: 1,
    title: "Triage y Priorización de Correos de Clientes Corporativos",
    prompt: "Revisa todos mis correos no leídos recibidos en las últimas 24 horas de dominios corporativos. Genera una lista priorizada en una tabla que clasifique cada mensaje según su impacto financiero o riesgo reputacional en: \"Crítico\", \"Urgente\" o \"Informativo\". Para los críticos, resume en una frase el problema y propón una acción inmediata basándote en nuestras políticas de atención.",
    objetivo: "Clasificar y priorizar correos de clientes.",
    contexto: "Retorno diario a la bandeja de entrada, optimizando el tiempo del Gestor de Relaciones (RM).",
    fuente: "Correos recibidos en las últimas 24 horas de clientes corporativos.",
    expectativas: "Tabla con clasificación de criticidad, resumen y acción propuesta."
  },
  {
    num: 2,
    title: "Solicitud Urgente de Documentación KYC Pendiente",
    prompt: "Redacta un correo de seguimiento asertivo pero muy profesional para el Director Financiero de [Grupo Comercial X] solicitando la entrega inmediata del acta de titularidad real (UBO) y el estado financiero auditado de 2025 que están pendientes. Explica detalladamente que la falta de esta documentación antes del viernes bloqueará temporalmente la renovación de su línea de crédito revolving de 15M€.",
    objetivo: "Solicitar documentación KYC pendiente.",
    contexto: "Proceso de renovación de línea de crédito bloqueado por cumplimiento normativo.",
    fuente: "Datos del cliente e historial de requerimientos regulatorios.",
    expectativas: "Correo electrónico asertivo, profesional, con plazos claros y consecuencias operativas explícitas."
  },
  {
    num: 3,
    title: "Solicitud de Aprobación de Tipo de Interés a Tesorería",
    prompt: "Redacta un correo interno dirigido al Jefe de Mesa de Tesorería de Empresas solicitando un precio especial (match funding) para un préstamo a plazo de 25M€ para [Cliente Corporativo Y]. Justifica la solicitud mencionando que este cliente tiene un saldo medio de depósito de 8M€ en nuestra entidad y que el competidor principal les ofrece un diferencial de Euribor + 1.15%. Exige una respuesta antes de las 16:00 de hoy.",
    objetivo: "Solicitar aprobación de tasa preferencial.",
    contexto: "Negociación competitiva para retener un cliente estratégico.",
    fuente: "Datos de rentabilidad del cliente y oferta de la competencia.",
    expectativas: "Correo interno breve, directo, con argumentos financieros sólidos y plazo de respuesta."
  },
  {
    num: 4,
    title: "Propuesta de Financiación de Proyecto de Energías Renovables",
    prompt: "Redacta un correo de seguimiento dirigido al Consorcio [Energía Verde] tras nuestra llamada de ayer. El objetivo es estructurar la propuesta preliminar de financiación de la planta fotovoltaica de 150MW. Plantea un esquema de \"Project Finance\" sin recurso con un ratio deuda-capital de 80/20 y una amortización a 18 años. Adopta un tono consultivo y propón una reunión por Teams el próximo lunes para revisar el modelo financiero adjunto.",
    objetivo: "Enviar propuesta técnica preliminar de Project Finance.",
    contexto: "Negociación comercial de una gran transacción de infraestructura.",
    fuente: "Minuta de la llamada de ayer y términos del modelo de negocio.",
    expectativas: "Correo de tono consultivo, estructura clara de plazos y llamada a la acción."
  },
  {
    num: 5,
    title: "Resumen de Pipeline Comercial para el Director Regional",
    prompt: "Analiza mis correos enviados sobre ofertas y cotizaciones comerciales activas de este mes. Genera un informe de pipeline en formato ejecutivo para mi Director Regional. Agrupa los casos en tres secciones: \"Cierre Probable en Q1\", \"En Negociación\" y \"En Fase de Análisis de Riesgos\". Para cada caso, incluye el nombre del cliente corporativo, el producto financiero (ej. Confirming, Leasing, Préstamo Sindicado), el volumen estimado en millones y el siguiente paso acordado.",
    objetivo: "Consolidar el pipeline comercial de la cartera de empresas.",
    contexto: "Reporte de gestión mensual para dirección de zona.",
    fuente: "Carpeta de elementos enviados e históricos de ofertas de este mes.",
    expectativas: "Informe jerarquizado por fases con datos de volumen, producto y siguientes pasos."
  },
  {
    num: 6,
    title: "Seguimiento Comercial de Propuesta de Cash Management",
    prompt: "Redacta un correo electrónico dirigido a la Tesorera de [Holding Retail Z]. Haz un seguimiento de la propuesta de Cash Management multi-país que le enviamos la semana pasada. Destaca el ahorro operativo estimado del 15% en comisiones de transferencias internacionales gracias a nuestra solución de pooling centralizado. Solicita una llamada de 10 minutos este jueves para resolver cualquier duda sobre la integración de sistemas host-to-host.",
    objetivo: "Reactivar oportunidad de venta cruzada de servicios transaccionales.",
    contexto: "Gestión de relación con un gran holding minorista.",
    fuente: "Propuesta enviada e informe de ahorro estimado de Cash Management.",
    expectativas: "Correo conciso, centrado en el valor del ahorro financiero y propuesta de llamada corta."
  },
  {
    num: 7,
    title: "Triage de Alertas de Incumplimiento de Límites de Riesgo",
    prompt: "Actúa como mi analista de control de riesgos en la bandeja de entrada. Escanea todas las alertas automáticas de sistema recibidas hoy sobre excesos de límites de crédito o descubiertos en cuenta de clientes comerciales. Genera una lista que resuma: 1. Nombre de la empresa; 2. Importe del exceso; 3. Tipo de facilidad afectada; 4. Si el descubierto supera las 48 horas de antigüedad.",
    objetivo: "Identificar excesos y descubiertos críticos de forma consolidada.",
    contexto: "Monitoreo diario de riesgos operativos de cartera.",
    fuente: "Alertas del sistema de monitoreo en Outlook.",
    expectativas: "Resumen estructurado por urgencia para toma de acciones inmediatas."
  },
  {
    num: 8,
    title: "Disculpas Formales por Incidencia en Plataforma de Confirming",
    prompt: "Redacta un correo de disculpas institucionales dirigido a todos los clientes corporativos que experimentaron retrasos en la carga de sus remesas de Confirming durante la mañana de hoy debido a una incidencia en nuestros servidores. Adopta un tono de alta consideración, asegura que el servicio ha sido completamente restablecido, y explica que se han procesado de forma prioritaria todos los pagos pendientes para evitar recargos.",
    objetivo: "Redactar un comunicado de disculpas por fallo técnico.",
    contexto: "Control de daños y gestión reputacional ante clientes clave.",
    fuente: "Comunicado técnico del departamento de TI y listado de empresas afectadas.",
    expectativas: "Correo institucional de tono formal y tranquilizador, con confirmación de medidas correctoras."
  },
  {
    num: 9,
    title: "Respuesta a Reclamación de Retraso en Desembolso de Préstamo",
    prompt: "Redacta una respuesta formal de correo electrónico al Director de Finanzas de [Grupo Industrial W] en respuesta a su reclamación por el retraso en el desembolso del Préstamo de Expansión de 5M€. Explica de manera transparente que la demora se debió a un retraso en la inscripción de la garantía hipotecaria de la nave en el Registro de la Propiedad, pero confirma que el abono se realizará de manera definitiva en su cuenta corriente mañana antes de las 11:00 AM.",
    objetivo: "Responder reclamación de desembolso y calmar la tensión.",
    contexto: "Incidencia operativa en la formalización de un crédito.",
    fuente: "Historial de correos y notas operativas de formalización corporativa.",
    expectativas: "Correo empático, formal y con resolución temporal concreta."
  },
  {
    num: 10,
    title: "Presentación e Introducción de M&A Advisory a Cliente de Cartera",
    prompt: "Redacta un correo de prospección dirigido al accionista mayoritario de [Empresa Familiar de Alimentación X], cliente histórico de nuestra cartera de empresas. El objetivo es presentar formalmente a nuestro equipo de Banca de Inversión (M&A Advisory) para asesorarle sobre el proceso de sucesión o venta parcial de la empresa. Enfatiza nuestro liderazgo en transacciones del sector agroalimentario de tamaño medio (de 20M€ a 80M€) y propón una visita presencial reservada en sus oficinas.",
    objetivo: "Introducir servicios de banca de inversión especializados en sucesión corporativa.",
    contexto: "Generación de oportunidades de asesoramiento financiero complejo.",
    fuente: "Casos de éxito de M&A del banco y perfil del cliente.",
    expectativas: "Correo con un enfoque consultivo de alta discreción, destacando experiencia sectorial."
  },
  {
    num: 11,
    title: "Consulta sobre Covenants Financieros a Analistas de Riesgos",
    prompt: "Redacta un correo electrónico interno dirigido al Analista de Riesgos asignado a la cuenta de [Grupo Hotelero H]. Pregúntale si es viable flexibilizar temporalmente el covenant de Ratio de Cobertura de Servicio de la Deuda (DSCR) de 1.25x a 1.10x en la próxima renovación de la póliza de crédito corporativo, basándote en que su previsión de reservas para la temporada de verano muestra un incremento del 20% interanual.",
    objetivo: "Consultar viabilidad de flexibilizar covenants financieros.",
    contexto: "Negociación interna previa al comité de riesgos.",
    fuente: "Proyecciones de tesorería del cliente y contrato vigente.",
    expectativas: "Correo interno técnico de tono profesional y con datos financieros de respaldo."
  },
  {
    num: 12,
    title: "Propuesta de Financiación Sostenible (ESG-Linked Loan)",
    prompt: "Redacta un correo dirigido al Director de Sostenibilidad de [Multinacional Química Y]. Preséntale nuestra nueva línea de Financiación Verde Vinculada a Criterios ESG (ESG-Linked Loans). Propón estructurar su próximo préstamo sindicado de 40M€ vinculando el tipo de interés al cumplimiento de dos indicadores clave: reducción de emisiones de CO2 de alcance 1 y aumento del porcentaje de envases reciclables. Adopta un tono innovador y de colaboración estratégica.",
    objetivo: "Promocionar opciones de financiación verde estructurada.",
    contexto: "Posicionamiento de la entidad como líder en finanzas sostenibles.",
    fuente: "Portafolio de productos ESG y objetivos públicos de sostenibilidad de la empresa.",
    expectativas: "Enfoque colaborativo y explicativo de los beneficios de costo (reducción de diferencial)."
  },
  {
    num: 13,
    title: "Invitación a Evento Exclusivo de Perspectivas Macroeconómicas",
    prompt: "Redacta un correo personalizado de invitación dirigido a los directores financieros y tesoreros de mi cartera comercial para que asistan al almuerzo privado de \"Perspectivas Macroeconómicas y Geopolíticas 2026\", que se celebrará en nuestra sede central el próximo 15 de octubre a las 13:30. El ponente principal será nuestro Economista Jefe. El tono debe ser muy exclusivo, formal y selecto. Limita la lista de confirmación a un máximo de 15 asistentes.",
    objetivo: "Redactar invitación formal a evento selecto.",
    contexto: "Fidelización y fortalecimiento de relaciones comerciales clave.",
    fuente: "Agenda del evento e información del ponente de la entidad.",
    expectativas: "Redacción elegante, formal, destacando la exclusividad y exigiendo RSVP antes del 5 de octubre."
  },
  {
    num: 14,
    title: "Reclamación de Comisiones de Comercio Exterior Pendientes",
    prompt: "Redacta un correo dirigido al Responsable de Finanzas de [Grupo Importador M]. Reclama de forma muy cordial pero rigurosa el abono de las comisiones pendientes por la apertura y confirmación de la Carta de Crédito de Importación nº LC-2026-998, cuyo importe asciende a 12,450€. Adjunta la liquidación de comisiones correspondiente y solicita que nos envíen el comprobante de la transferencia a la mayor brevedad para regularizar su cuenta de comercio exterior.",
    objetivo: "Reclamar el pago de comisiones pendientes por comercio exterior.",
    contexto: "Regularización de saldos acreedores de la cartera transaccional.",
    fuente: "Liquidación y estado de la Carta de Crédito.",
    expectativas: "Correo formal, educado pero directo, con datos exactos del importe y el número de referencia."
  },
  {
    num: 15,
    title: "Convocatoria para Reunión de Sindicación de Préstamo Corporativo",
    prompt: "Redacta un correo de convocatoria dirigido a los bancos participantes en la sindicación del Préstamo de Infraestructura de 100M€ para [Consorcio Vial S]. El objetivo de la reunión es acordar el reparto final de tramos, comisiones de aseguramiento (underwriting) y el calendario de firmas notariales. Plantea la sesión para el próximo jueves a las 11:00 AM vía Teams, e incluye una agenda de 4 puntos clave a tratar.",
    objetivo: "Convocar a comisiones y bancos participantes a mesa de sindicación.",
    contexto: "Coordinación de un pool bancario liderado por nuestra entidad (Lead Arranger).",
    fuente: "Borrador de hoja de condiciones de la sindicación.",
    expectativas: "Correo altamente formal, estructurado con agenda de puntos clave y enlace de Teams sugerido."
  },
  {
    num: 16,
    title: "Respuesta a Solicitud de Cobertura de Tipo de Cambio (FX Hedging)",
    prompt: "Redacta una respuesta rápida por correo electrónico a la consulta del Tesorero de [Exportadora Agrícola L]. El cliente necesita una cobertura para una exportación de 10M USD prevista para diciembre de 2026. Confirma que nuestra mesa de FX recomienda la contratación de un contrato Forward de divisas Euro/Dólar a plazo cerrado. Pídele que nos indique su precio objetivo (strike) para que el especialista de divisas se ponga en contacto con él hoy mismo.",
    objetivo: "Responder solicitud de cotización/asesoramiento de divisas.",
    contexto: "Cobertura de riesgo cambiario para exportaciones corporativas.",
    fuente: "Recomendación de la mesa de FX del banco.",
    expectativas: "Correo conciso, centrado en la viabilidad técnica y proponer contacto del especialista."
  },
  {
    num: 17,
    title: "Requerimiento de Estructura Societaria Completa (UBO) para AML",
    prompt: "Redacta un correo formal dirigido al Director Legal de [Holding Financiero G]. Solicita que nos envíe el organigrama societario completo y actualizado, firmado por el secretario del consejo, que demuestre la cadena de control hasta la persona física que ostente más del 25% de los derechos de voto (UBO). Explica de forma respetuosa que este requerimiento es obligatorio por la Ley de Prevención de Blanqueo de Capitales para poder procesar la transferencia internacional de 5M USD actualmente retenida en nuestra mesa de cumplimiento.",
    objetivo: "Requerir organigrama societario para liberar fondos retenidos en cumplimiento.",
    contexto: "Bloqueo de transferencias internacionales por políticas AML/KYC.",
    fuente: "Directivas de la normativa legal de prevención de blanqueo.",
    expectativas: "Correo formal, legalmente riguroso pero educado, enfatizando la obligatoriedad legal."
  },
  {
    num: 18,
    title: "Coordinación de Visita Técnica para Financiación de Infraestructura",
    prompt: "Redacta un correo electrónico dirigido al Ingeniero Jefe de [Construcciones Civiles K]. Coordina una visita técnica presencial para evaluar el avance de obra de la planta de tratamiento de aguas financiada por nuestro banco. Propón tres opciones de fecha en la última semana de este mes y detalla que asistiré acompañado por un analista de riesgos de infraestructuras y un auditor ambiental externo.",
    objetivo: "Coordinar visita a obra de proyecto financiado.",
    contexto: "Hito de control en el calendario de desembolsos de Project Finance.",
    fuente: "Contrato de financiación de proyecto y manual de seguimiento.",
    expectativas: "Correo organizativo claro, con propuesta de fechas y listado de participantes del banco."
  },
  {
    num: 19,
    title: "Renegociación de Colaterales por Depreciación de Activos",
    prompt: "Redacta un correo dirigido al Director de Finanzas de [Grupo Logístico D]. Explica que debido a la reciente tasación independiente de las naves industriales que respaldan su préstamo corporativo de 8M€, el ratio LTV (Loan-to-Value) ha superado el límite del 70% estipulado contractualmente, situándose en el 78%. Invítale de forma colaborativa a reunirnos para explorar alternativas, sugiriendo como opción la pignoración complementaria de carteras de inversión o la amortización extraordinaria de 1M€.",
    objetivo: "Solicitar garantías adicionales o amortización parcial.",
    contexto: "Desviación de colateral por depreciación de activos del mercado.",
    fuente: "Tasación del activo y cláusulas de garantía del contrato.",
    expectativas: "Correo diplomático, firme, con un enfoque de socio financiero que busca soluciones conjuntas."
  },
  {
    num: 20,
    title: "Integración de Sistemas Host-to-Host (Mesa de Tesorería)",
    prompt: "Redacta un correo dirigido al CIO de [Cadena de Supermercados Z]. El objetivo es presentar el equipo de integraciones tecnológicas de tesorería del banco para iniciar el proyecto de conexión Host-to-Host (API directa) para la carga diaria de extractos y conciliación automática. Adjunta el documento con las especificaciones técnicas de nuestra API de tesorería y propón una primera reunión técnica de 30 minutos para el miércoles.",
    objetivo: "Iniciar proyecto de integración tecnológica Host-to-Host.",
    contexto: "Venta transaccional avanzada para grandes corporaciones.",
    fuente: "Documento de especificaciones de API y notas de la reunión de ventas.",
    expectativas: "Correo de perfil técnico-comercial, con llamada a la acción y documentación técnica adjunta de referencia."
  },
  {
    num: 21,
    title: "Solicitud de Revisión de Acuerdo de Confidencialidad (NDA) Corporativo",
    prompt: "Redacta un correo interno dirigido al departamento de Asesoría Jurídica de Empresas. Solicita la revisión urgente del Acuerdo de Confidencialidad (NDA) adjunto, enviado por [Corporación Logística Global], que pretendemos firmar antes de compartir su información financiera para estructurar la emisión de pagarés. Destaca que han modificado la cláusula de jurisdicción aplicable (proponiendo los tribunales de Londres en lugar de España) y solicita su confirmación sobre si es aceptable para el banco.",
    objetivo: "Solicitar revisión de NDA con cláusula de jurisdicción modificada.",
    contexto: "Preparación jurídica previa a una operación de mercado de capitales.",
    fuente: "Borrador de NDA modificado por el cliente.",
    expectativas: "Solicitud interna precisa, técnica y directa al punto legal clave."
  },
  {
    num: 22,
    title: "Informe sobre Solicitud de Reestructuración de Deuda Comercial",
    prompt: "Redacta un correo interno de análisis para el Director de Control de Riesgos Comerciales. Resume la propuesta de reestructuración de deuda enviada por [Grupo Siderúrgico S]. Detalla en el texto que solicitan una carencia de principal de 12 meses y la unificación de tres préstamos comerciales vigentes en un único préstamo a plazo con un vencimiento ampliado a 7 años. Aporta mi recomendación favorable fundamentada en que el grupo mantiene contratos de suministro industrial firmados con clientes Tier 1 para los próximos 3 años.",
    objetivo: "Informar y dar recomendación sobre reestructuración de deuda corporativa.",
    contexto: "Negociación de alivio financiero a un cliente industrial en dificultades transitorias.",
    fuente: "Propuesta del cliente e informe de viabilidad sectorial.",
    expectativas: "Memo interno detallado, riguroso, estructurado con propuesta del cliente, análisis y recomendación justificada."
  },
  {
    num: 23,
    title: "Lanzamiento de Encuesta de Satisfacción a Clientes Grandes Cuentas",
    prompt: "Redacta un correo electrónico dirigido a los principales contactos financieros de mi cartera de grandes cuentas (ingresos >50M€) solicitando su participación en nuestra encuesta anual de calidad de servicio y soporte de banca corporativa. Redacta el correo con un tono que resalte el valor de su opinión para la personalización de nuestros servicios financieros y asegura que el cuestionario interactivo adjunto solo requiere 3 minutos de su tiempo.",
    objetivo: "Invitar a completar la encuesta de satisfacción de clientes.",
    contexto: "Campaña anual de calidad y fidelización de banca transaccional.",
    fuente: "Base de datos de satisfacción del cliente corporativo.",
    expectativas: "Correo cortés, de alta consideración corporativa, breve y con enlace directo de fácil visualización."
  },
  {
    num: 24,
    title: "Oferta de Factoring / Confirming para Proveedores de Cliente Ancla",
    prompt: "Redacta un correo dirigido al Director General de [Distribuidora Automotriz D], cliente ancla del banco. Propón el lanzamiento de un Programa de Confirming y Financiación de Proveedores (Supply Chain Finance) patrocinado por su empresa. Explica que esto permitirá a sus más de 120 proveedores locales cobrar sus facturas de forma anticipada al tipo de interés preferencial respaldado por el perfil crediticio del distribuidor, mejorando la estabilidad de su cadena de suministro.",
    objetivo: "Vender programa de Supply Chain Finance.",
    contexto: "Venta cruzada a cliente corporativo de alta solvencia con red de proveedores.",
    fuente: "Folleto de productos de financiación de capital de trabajo del banco.",
    expectativas: "Correo estratégico de ventas que destaque el beneficio tanto para el cliente ancla como para su cadena logística."
  },
  {
    num: 25,
    title: "Envío de Análisis Trimestral y Propuestas de Cross-Selling Activo",
    prompt: "Redacta un correo para el Director de Finanzas de [Grupo Alimentario del Sur] adjuntando su informe de rentabilidad comercial trimestral con el banco. Analiza la cartera de productos activos para sugerir formalmente la contratación de nuestra solución automatizada de cobertura de tipos de interés (Interest Rate Swap) para su préstamo a tipo variable de 12M€, protegiéndoles ante posibles subidas de tipos en el próximo trimestre.",
    objetivo: "Presentar informe de cuenta corporativa y proponer venta cruzada de IRS.",
    contexto: "Revisión trimestral de cuentas corporativas y detección de oportunidades de derivados.",
    fuente: "Informe financiero y tipos actuales del préstamo.",
    expectativas: "Enfoque comercial muy sólido, técnico y basado en la mitigación de riesgos de mercado."
  }
];

// Teams prompts 26 to 50
const dataTeams = [
  {
    num: 26,
    title: "Minería de Transcripción para un Comité de Riesgo de Crédito",
    prompt: "Analiza la transcripción de la reunión del Comité de Riesgos de hoy sobre la solicitud de financiación de 50M€ para [Grupo constructor Y]. Genera una minuta formal que resuma: 1. Los argumentos de los analistas que apoyan la operación; 2. Las objeciones específicas del Director de Riesgos respecto al ratio de endeudamiento; 3. Los condicionantes de garantías reales aprobados; 4. Las tareas asignadas con propietarios y plazos de entrega.",
    objetivo: "Consolidar minuta del comité de riesgos de crédito.",
    contexto: "Documentación obligatoria de decisiones colegiadas de riesgo corporativo.",
    fuente: "Transcripción de la sesión de Teams del Comité de Riesgos.",
    expectativas: "Estructura de acta de comité, identificando ponentes, objeciones y resoluciones finales acordadas."
  },
  {
    num: 27,
    title: "Consolidación de Acuerdos Comerciales tras Reunión con Cliente",
    prompt: "Revisa la transcripción de la videoconferencia con el CFO de [Holding Retail B]. Extrae todos los compromisos tarifarios que el banco ofreció sobre la tarifa transaccional de TPVs (terminales de punto de venta) y confirmanos si se alcanzó un acuerdo definitivo o si la negociación quedó pendiente de confirmación de márgenes. Estructura el resultado en formato de viñetas claras.",
    objetivo: "Documentar compromisos comerciales de precios y tarifas.",
    contexto: "Handoff comercial para actualización del gestor de cuentas de TPV.",
    fuente: "Transcripción de la reunión comercial en Teams.",
    expectativas: "Resumen específico de tarifas ofertadas, estado de aprobación y siguientes pasos comerciales directos."
  },
  {
    num: 28,
    title: "Identificación de Bloqueos en un Proyecto de Préstamo Sindicado",
    prompt: "Analiza la transcripción del chat del canal de Teams de \"Proyecto Atlas - Préstamo Sindicado 80M€\". Identifica y genera un informe de todos los bloqueos actuales comentados por el equipo legal o de estructuración en relación con las firmas de los contratos de garantía por parte de los bancos colaterales. Detalla las fechas clave mencionadas y los responsables de su resolución.",
    objetivo: "Identificar cuellos de botella en la estructuración de un sindicado.",
    contexto: "Gestión del flujo operativo de una gran transacción corporativa.",
    fuente: "Historial de chat del canal de Teams dedicado al proyecto.",
    expectativas: "Listado claro de incidentes, plazos en peligro y responsables asignados."
  },
  {
    num: 29,
    title: "Extracción de Preguntas del Cliente sobre Integración de APIs de Pagos",
    prompt: "Analiza la transcripción de la sesión técnica de hoy con el equipo de TI de [Grupo Distribuidor M] y extrae una lista detallada con todas las preguntas técnicas formuladas por sus ingenieros acerca de la integración de la API de pagos del banco y los mecanismos de autenticación OAuth 2.0. Añade un borrador preliminar de respuesta técnica recomendado basado en nuestros manuales de integración de la plataforma de banca online.",
    objetivo: "Extraer dudas de integración técnica y proponer respuestas.",
    contexto: "Soporte técnico post-venta corporativa transaccional.",
    fuente: "Transcripción de la sesión de Teams de soporte técnico.",
    expectativas: "Lista de preguntas con respuestas sugeridas, sin tecnicismos innecesarios pero con precisión de ingeniería de pagos."
  },
  {
    num: 30,
    title: "Triage Semanal de Compromisos de Venta Cruzada del Equipo RM",
    prompt: "Basado en las transcripciones de las reuniones de seguimiento comercial del equipo de Banca de Empresas de este lunes, consolida en una tabla todos los objetivos de venta cruzada (cross-selling) de derivados y seguros corporativos acordados por cada gestor de relaciones (RM) para este mes. Incluye la cartera de empresas asignada a cada uno, el volumen de primas estimadas y la fecha límite de reporte.",
    objetivo: "Consolidar planes de cross-selling por RM.",
    contexto: "Reunión de control comercial e incentivos comerciales del equipo.",
    fuente: "Transcripción de la reunión semanal del área comercial en Teams.",
    expectativas: "Tabla unificada con objetivos individuales, carteras asociadas y fechas de control."
  },
  {
    num: 31,
    title: "Detección de Discrepancias en Negociaciones de Tipo de Interés",
    prompt: "Revisa la transcripción del debate interno sostenido en Teams entre el analista de negocios y el director de riesgos sobre el pricing del nuevo préstamo verde para [Grupo Metalúrgico T]. Detalla cuáles son los puntos exactos de discrepancia en cuanto a la viabilidad de conceder una bonificación de 15 puntos básicos por cumplimiento de objetivos de huella de carbono y el impacto en el margen neto de la operación.",
    objetivo: "Resumir discrepancias internas sobre precios.",
    contexto: "Preparación previa a comités comerciales de toma de decisiones.",
    fuente: "Transcripción del chat de Teams o de la reunión de trabajo.",
    expectativas: "Exposición de argumentos cruzados, márgenes financieros discutidos e impacto operativo estimado."
  },
  {
    num: 32,
    title: "Resumen Ejecutivo para Ausente en Reunión de Planificación de Presupuestos",
    prompt: "No pude asistir a la reunión de planificación presupuestaria de Banca de Empresas de hoy. Analiza la transcripción oficial y genera un resumen de no más de 300 palabras que incluya únicamente las decisiones tomadas respecto a los límites de asignación de capital para préstamos de capital circulante en 2026 y la reducción esperada de márgenes comerciales para competir con la banca digital de empresas.",
    objetivo: "Proporcionar resumen ejecutivo rápido del presupuesto comercial de Q1/2026.",
    contexto: "Recuperación de información crítica de negocio tras ausencia.",
    fuente: "Transcripción de la junta de presupuesto corporativo en Teams.",
    expectativas: "Resumen de menos de 300 palabras centrado estrictamente en decisiones y datos clave."
  },
  {
    num: 33,
    title: "Identificación de Riesgos Operativos Mencionados en Chat Corporativo",
    prompt: "Escanea el chat de Teams del canal \"Gestión de Incidencias de Backoffice\" de esta semana. Identifica si se han reportado errores de liquidación de remesas internacionales de comercio exterior que afecten a clientes con volumen transaccional superior a 5M€ anuales. Genera una lista que incluya el nombre de la empresa afectada, la fecha del error, y si la solución requiere intervención manual de la mesa de operaciones.",
    objetivo: "Consolidar riesgos de incidencias operativas en grandes clientes.",
    contexto: "Asegurar la calidad operativa del servicio en banca comercial Tier 1.",
    fuente: "Chat de Teams del equipo de Backoffice de esta semana.",
    expectativas: "Listado estructurado con clientes afectados, impacto y estado actual de solución de la incidencia."
  },
  {
    num: 34,
    title: "Preparación de Notas para el Comité de Seguimiento ESG",
    prompt: "Analiza la transcripción del seminario interno de \"Sostenibilidad y Cartera de Crédito Corporativa\" de ayer. Extrae los tres requisitos normativos más importantes que el regulador bancario europeo exigirá a las entidades para el reporte de activos verdes en el próximo trimestre, y genera un borrador de notas para que el Director Comercial pueda presentarlas de forma ejecutiva en el comité de dirección de mañana.",
    objetivo: "Preparar notas de reporte regulatorio sobre activos verdes (ESG).",
    contexto: "Adaptación urgente de la cartera de empresas a las normativas de sostenibilidad.",
    fuente: "Transcripción del seminario web interno.",
    expectativas: "3 puntos clave redactados de forma clara, directa y con enfoque en la implicación de cumplimiento normativo."
  },
  {
    num: 35,
    title: "Consolidación de Acciones de Campaña de Confirming de Campaña Agrícola",
    prompt: "Revisa el chat del grupo de trabajo \"Campaña de Financiación de Cosecha 2026\". Genera un listado de las tareas asignadas para el lanzamiento de la línea especial de confirming agrícola. Clasifícalas según el departamento responsable: \"Red de Oficinas\", \"Mesa de Riesgos Sectorial\", \"TI y Soporte Digital\" o \"Marketing de Clientes de Empresa\", indicando fecha límite de cada una.",
    objetivo: "Crear un plan de acción multisectorial para campaña comercial.",
    contexto: "Lanzamiento comercial estacional clave para la banca de empresas.",
    fuente: "Historial de chats de Teams de planificación de la campaña.",
    expectativas: "Tareas estructuradas por departamentos clave con sus plazos críticos asociados."
  },
  {
    num: 36,
    title: "Extracción de Objeciones del Cliente en Solicitud de Leasing Maquinaria",
    prompt: "Analiza la transcripción de la llamada de cierre de operaciones con [Grupo Industrial del Norte] sobre la oferta de leasing de maquinaria de fabricación por valor de 8M€. Identifica todas las objeciones que el cliente planteó respecto a la comisión de amortización anticipada y la opción de compra al final del contrato. Redacta alternativas viables comercialmente y alineadas con nuestras políticas de precios vigentes.",
    objetivo: "Identificar objeciones de contrato de leasing y buscar alternativas de negociación.",
    contexto: "Negociación final de contratos corporativos de gran envergadura.",
    fuente: "Transcripción de la llamada de Teams con el cliente.",
    expectativas: "Objeciones clasificadas y propuestas comerciales de ajuste listas para aprobación de riesgos."
  },
  {
    num: 37,
    title: "Agenda para Kick-off de Financiación de Adquisiciones (M&A Loan)",
    prompt: "Con base en el chat técnico del proyecto \"Adquisición Alfa\", redacta una propuesta de agenda estructurada para la reunión de kick-off que mantendremos mañana con los abogados del cliente y nuestro equipo de banca de inversión estructurada. La agenda debe enfocar los puntos críticos en los plazos de redacción del contrato de préstamo de adquisición y las garantías corporativas cruzadas de las filiales.",
    objetivo: "Diseñar agenda de kick-off de estructuración de deuda de adquisición.",
    contexto: "Preparación organizativa para transacciones complejas corporativas.",
    fuente: "Información del chat técnico de Teams.",
    expectativas: "Estructura de agenda profesional con tiempos y objetivos de discusión definidos para cada punto de la sesión."
  },
  {
    num: 38,
    title: "Extracción de Temas de Interés Comercial en Reuniones con Clientes",
    prompt: "Revisa las transcripciones de las últimas 5 llamadas comerciales que mantuve con empresas del sector logístico en mi cartera de Teams. Identifica qué servicios del banco (ej. factoring internacional, confirming, gestión de divisas o seguros de crédito) fueron mencionados con mayor frecuencia por parte de los clientes e indica si mostraron intención inmediata de recibir una propuesta técnica.",
    objetivo: "Identificar oportunidades de venta basadas en necesidades del cliente.",
    contexto: "Planificación de la acción de venta cruzada mensual.",
    fuente: "Transcripciones de Teams de llamadas comerciales del sector logístico.",
    expectativas: "Análisis cuantitativo y cualitativo breve de interés en productos por cliente."
  },
  {
    num: 39,
    title: "Triage de Cambios en Plazos de Entrega de Auditorías de Crédito",
    prompt: "Analiza los últimos mensajes compartidos en el canal \"Auditoría Interna de Créditos Corporativos\" y busca cualquier retraso en los plazos previstos de entrega de las auditorías de riesgo para las grandes cuentas corporativas. Genera un aviso resumen que podamos enviar al Director de Control para advertir de cuellos de botella e incumplimiento de entregas al regulador.",
    objetivo: "Detectar retrasos en entregas de control y alertar de riesgo de incumplimiento.",
    contexto: "Mitigar riesgos operativos y regulatorios en procesos internos del banco.",
    fuente: "Canal de Teams de auditoría de riesgos de esta semana.",
    expectativas: "Mensaje de alerta conciso, con impacto operativo de los retrasos identificados."
  },
  {
    num: 40,
    title: "Extracción de Criterios de Aprobación Excepcional en Reunión de Dirección",
    prompt: "Revisa la transcripción de la sesión de hoy de la Dirección de Riesgos del banco y extrae todos los criterios bajo los cuales se permitirá la aprobación excepcional de operaciones de financiación comercial que superen el ratio estándar de Deuda Neta/EBITDA de 4.0x. Estructura estos criterios en formato de directrices operativas numeradas claras para la red de gestores comerciales.",
    objetivo: "Traducir acuerdos de alta dirección en guías de actuación comercial operativas.",
    contexto: "Adaptación de las políticas de concesión crediticia corporativa a las condiciones actuales del mercado.",
    fuente: "Transcripción de la reunión de la Dirección de Riesgos en Teams.",
    expectativas: "Guía de directrices técnicas numeradas, redactada de forma restrictiva y profesional."
  },
  {
    num: 41,
    title: "Solicitud de Cierre de Cuentas por Inactividad (Control de Red)",
    prompt: "Analiza el historial de mensajes de este mes en el canal de Teams \"Control Operativo de Red de Oficinas\" y genera un informe consolidado que liste todas las cuentas corrientes corporativas inactivas propuestas para cierre. Identifica si alguna de estas empresas tiene préstamos comerciales vigentes para evitar cierres erróneos de cuentas con deudas vigentes.",
    objetivo: "Identificar cuentas corporativas propuestas para cierre de red y cruzar con facilidades activas de crédito.",
    contexto: "Saneamiento de cartera corporativa inactiva e higiene de sistemas.",
    fuente: "Canal de Teams de Control de Red.",
    expectativas: "Tabla con empresa, cuenta, saldo, estado de préstamo vigente y recomendación comercial (Cierre aprobado o Mantener abierta por deuda activa)."
  },
  {
    num: 42,
    title: "Resumen de Requisitos para el Proceso de Pre-evaluación Crediticia",
    prompt: "Analiza la transcripción de la sesión formativa técnica de hoy \"Procedimiento de Pre-evaluación Crediticia Automatizada en Empresas\". Genera un checklist estructurado para que los gestores comerciales lo utilicen antes de someter cualquier propuesta de crédito al sistema de scoring de riesgos. Detalla qué documentos financieros mínimos del cliente comercial son requeridos de forma obligatoria por el sistema.",
    objetivo: "Diseñar checklist para pre-evaluación de riesgos en oficinas corporativas.",
    contexto: "Homogeneización de procesos y optimización de la tasa de aprobación de operaciones de crédito.",
    fuente: "Transcripción de la sesión formativa en Teams.",
    expectativas: "Checklist de control estructurado por tipos de sociedades mercantiles."
  },
  {
    num: 43,
    title: "Extracción de KPI Operativos de la Mesa de Cash Management",
    prompt: "Revisa los últimos chats de Teams de la Mesa de Soporte de Cash Management de hoy y consolida los indicadores de tiempo medio de resolución de incidencias técnicas en el alta de nuevos clientes para el servicio Swift GPI. Identifica los cuellos de botella operativos informados en relación con el departamento de homologación de firmas corporativas.",
    objetivo: "Consolidar tiempos de atención operativa en servicios transaccionales internacionales clave.",
    contexto: "Control de calidad operativa (SLA) para clientes grandes cuentas de banca corporativa.",
    fuente: "Chats de Teams de la mesa de soporte de hoy.",
    expectativas: "Resumen numérico de SLA con identificación exacta de fallos en el proceso de alta corporativa."
  },
  {
    num: 44,
    title: "Resumen de Acciones de Contingencia por Caída del Sistema Cambiario",
    prompt: "Analiza la transcripción de la llamada del Comité de Emergencia Operativa sobre la caída temporal del módulo de liquidación de divisas de banca electrónica comercial de esta mañana. Resume detalladamente el procedimiento de contingencia operativa manual que deben seguir los gestores para la ejecución telefónica de órdenes de compra/venta de divisas de clientes corporativos hasta que se restablezca el sistema.",
    objetivo: "Elaborar guía de contingencia por incidencia técnica en el sistema transaccional del banco.",
    contexto: "Continuidad de negocio (BCP) en operativa de divisas comerciales de alto volumen.",
    fuente: "Transcripción de la videollamada del Comité de Emergencia en Teams.",
    expectativas: "Protocolo de actuación de 5 pasos claros e inmediatos para la red de oficinas comerciales."
  },
  {
    num: 45,
    title: "Extracción de Datos de Comisiones Ofertadas para la Cartera Inmobiliaria",
    prompt: "Escanea la transcripción de la sesión de revisión de hoy del equipo comercial inmobiliario y extrae en una tabla todas las comisiones de apertura y corretaje que se ofertaron a las constructoras para la financiación de promociones residenciales en Q1. Resalta en la tabla si alguna cotización especial se situó por debajo de la comisión estándar de tarifa oficial de la entidad (0.50% de apertura).",
    objetivo: "Consolidar comisiones de apertura inmobiliarias y alertar de cotizaciones excepcionalmente bajas.",
    contexto: "Monitoreo y control de márgenes financieros de rentabilidad comercial sectorial.",
    fuente: "Transcripción de la sesión de control en Teams.",
    expectativas: "Tabla unificada con constructoras, comisiones propuestas, importes financiados y alerta de excepción de rentabilidad."
  },
  {
    num: 46,
    title: "Notas para Almuerzo de Trabajo Comercial (Corporate Deal Preparation)",
    prompt: "Analiza el canal de chat Teams \"Preparación de Cuenta - Grupo Hotelero R\" de las últimas dos semanas. Genera unas notas comerciales sintéticas para mi almuerzo de mañana con su Consejero Delegado. Destaca: 1. El volumen actual de depósitos del grupo en nuestro banco; 2. Sus proyectos actuales de expansión internacional en el Caribe y 3. Si existe alguna propuesta comercial de financiación de activos en estudio por nuestra mesa de riesgos en este momento.",
    objetivo: "Preparar notas estratégicas de relación para visita comercial de alto nivel.",
    contexto: "Reuniones de retención y cross-selling con clientes estratégicos corporativos.",
    fuente: "Chat de Teams sobre la preparación de la cuenta del Grupo Hotelero R.",
    expectativas: "Notas comerciales concisas estructuradas en 3 apartados temáticos diferenciados."
  },
  {
    num: 47,
    title: "Identificación de Nuevos Clientes Candidatos para Banca Transaccional",
    prompt: "Escanea los chats compartidos de este mes en el Teams de \"Banca Corporativa Transaccional\" y genera una lista consolidada con todas las empresas propuestas por los analistas locales de zona como candidatas idóneas para campañas específicas de captación de servicios de cobro por recibos comerciales directos (B2B Direct Debits).",
    objetivo: "Captar cuentas corporativas transaccionales de alto valor estratégico para depósitos y comisiones.",
    contexto: "Campañas de captación activa de depósitos operativos estacionales.",
    fuente: "Chats de Teams de la división transaccional.",
    expectativas: "Listado de candidatos con justificación sectorial corta y volumen estimado de remesas comerciales de cobro."
  },
  {
    num: 48,
    title: "Agenda para Comité Interbancario de Préstamo Sindicado de 250M€",
    prompt: "Analiza la correspondencia reciente del canal de Teams \"Comité Bancario - Préstamo Sindicado Consorcio Energético\" y redacta una propuesta de agenda detallada de 1 hora para nuestra próxima sesión interbancaria de negociación. El enfoque principal de la agenda debe ser resolver las diferencias con los bancos de segundo nivel respecto a la prioridad de cobro en caso de ejecución de garantías (pari passu vs subordinación).",
    objetivo: "Organizar comité interbancario de préstamo estructurado complejo.",
    contexto: "Negociaciones complejas en operaciones sindicadas internacionales de alta envergadura.",
    fuente: "Historial de Teams de coordinación interbancaria.",
    expectativas: "Agenda estructurada minuto a minuto con enfoque prioritario en los tramos de deuda en conflicto operativo."
  },
  {
    num: 49,
    title: "Resumen de Objeciones del Departamento Legal sobre el Contrato de Confirming",
    prompt: "Revisa la transcripción del chat del canal \"Legal de Confirming Corporativo\" de este mes. Consolida en una lista todas las objeciones normativas recurrentes planteadas por el departamento legal con respecto al borrador estándar de contrato de confirming nacional, especialmente en las cláusulas de cesión de crédito de proveedores no residentes.",
    objetivo: "Identificar objeciones de contratos de factoring/confirming internacional de la mesa de TI legal.",
    contexto: "Minimizar riesgos jurídicos en contratos de servicios transaccionales corporativos.",
    fuente: "Chat de Teams del canal legal.",
    expectativas: "Listado de objeciones estructurales con propuestas redactadas de cláusulas de subsanación recomendadas por riesgos jurídicos."
  },
  {
    num: 50,
    title: "Informe de Desviación de Objetivos Comerciales del Área de Empresas",
    prompt: "Revisa la transcripción de la sesión comercial mensual del área de Banca de Empresas de esta zona. Genera un informe sintético que resuma qué oficinas de empresas presentan desviaciones negativas superiores al 15% respecto a sus objetivos anuales de colocación de préstamos corporativos a largo plazo, y resume en tres viñetas claras las razones operativas explicadas por los directores de esas oficinas para justificar la desviación comercial.",
    objetivo: "Analizar desvíos de colocación crediticia en oficinas de la zona corporativa.",
    contexto: "Planificación comercial de medidas correctoras en la red comercial del banco.",
    fuente: "Transcripción de la sesión de control de zona de Teams.",
    expectativas: "Informe comercial conciso con oficinas rezagadas, porcentajes de desviación y argumentos operativos detallados de justificación."
  }
];

// SharePoint prompts 51 to 75
const dataSharePoint = [
  {
    num: 51,
    title: "Análisis de Consistencia Financiera en Expedientes de Crédito Cruzado",
    prompt: "Analiza los documentos financieros guardados en la carpeta de SharePoint del cliente corporativo [Grupo Agroalimentario S]. Revisa su balance consolidado de 2025 y su estado de flujos de efectivo de 2025. Genera un informe técnico de consistencia financiera de dos páginas que identifique si el incremento reportado del 15% en el inventario de materias primas está debidamente financiado con líneas de crédito de circulante a corto plazo o si está drenando la tesorería operativa corporativa.",
    objetivo: "Evaluar la consistencia financiera operativa del cliente comercial.",
    contexto: "Preparación previa al análisis de riesgos para concesión de financiación.",
    fuente: "Balances y estados de flujos de efectivo en el sitio de SharePoint del expediente de crédito del cliente.",
    expectativas: "Informe técnico detallado de dos páginas con cálculos de rotación de activos y flujos de tesorería operativa."
  },
  {
    num: 52,
    title: "Auditoría de Cumplimiento de Políticas de Crédito Sectoriales (ESG)",
    prompt: "Analiza el documento de \"Políticas de Crédito y Concesión Sectorial ESG 2026\" guardado en nuestro portal normativo de SharePoint. Revisa la propuesta de préstamo de expansión para [Industria Minera M] y compárala con las restricciones vigentes de financiamiento a sectores de combustibles fósiles y minería a cielo abierto definidas en la política. Determina explícitamente si la operación infringe alguna cláusula de exclusión ESG.",
    objetivo: "Auditar la operación de crédito frente a políticas ESG vigentes de la entidad.",
    contexto: "Asegurar el cumplimiento regulatorio de políticas ambientales de riesgos corporativos.",
    fuente: "Documento de políticas ESG de SharePoint y propuesta de crédito comercial en estudio.",
    expectativas: "Informe técnico de cumplimiento estricto (Aprobado, Condicionado o Denegado por exclusión ESG)."
  },
  {
    num: 53,
    title: "Comparativa de Ofertas de Coaseguramiento en Préstamos Sindicados",
    prompt: "Revisa las propuestas de coaseguramiento económico y tramos comerciales enviadas por los 5 bancos participantes en la sindicación del proyecto \"Parque Eólico Sur\" y guardadas en la biblioteca de SharePoint de estructuración de deuda. Genera una tabla comparativa side-by-side que evalúe: 1. Comisión de aseguramiento (underwriting fee); 2. Tipo de interés de retención propuesto; 3. Volumen de tramo comprometido en millones.",
    objetivo: "Comparar ofertas interbancarias para sindicación de préstamo corporativo.",
    contexto: "Análisis y reparto final de tramos de co-líder de sindicación.",
    fuente: "Biblioteca documental de SharePoint del proyecto del parque eólico.",
    expectativas: "Tabla comparativa estructurada e identificación detallada de cuál es la oferta de coaseguro más rentable para el banco originador."
  },
  {
    num: 54,
    title: "Verificación de KYC en Expediente Corporativo de Multicuentas",
    prompt: "Escanea todos los documentos guardados en la subcarpeta \"KYC de Socios\" del cliente corporativo [Holding Corporativo Inmobiliario G] en SharePoint. Comprueba de forma automatizada si todos los pasaportes, poderes de representación notarial y declaraciones de titularidad real están vigentes y firmados. Genera un aviso resumen en formato checklist que resalte de manera inmediata los nombres de los representantes legales cuyos poderes societarios estén pendientes de actualización.",
    objetivo: "Auditar expedientes de socios comerciales para vigencia de poderes jurídicos.",
    contexto: "Higiene regulatoria obligatoria de cartera comercial ante auditorías KYC internas.",
    fuente: "Expediente documental del Holding Inmobiliario G en SharePoint.",
    expectativas: "Checklist simplificado identificando socios conformes y anomalías de documentación regulatoria caducada o sin firma."
  },
  {
    num: 55,
    title: "Análisis de Cláusulas de Terminación Anticipada en Contratos de Alquiler de Activos",
    prompt: "Analiza los contratos de arrendamiento y leasing financiero de equipos de transporte industrial activos de la cartera de empresas guardados en la biblioteca de SharePoint de Operaciones Comerciales. Extrae en una tabla resumen todas las penalizaciones económicas y plazos de preaviso requeridos en caso de terminación anticipada del contrato por parte del cliente corporativo.",
    objetivo: "Extraer plazos y costes de salida anticipada de contratos vigentes de leasing.",
    contexto: "Renegociación comercial con clientes corporativos que buscan reestructuración logística.",
    fuente: "Biblioteca de SharePoint de contratos vigentes de arrendamiento y leasing financiero.",
    expectativas: "Tabla unificada con número de contrato, nombre de la empresa, meses restantes de vigencia de arrendamiento y costes estimados de finalización anticipada."
  },
  {
    num: 56,
    title: "Extracción de Métricas ESG de Informes Anuales de Clientes Corporativos",
    prompt: "Revisa las memorias anuales de sostenibilidad de las 10 principales empresas clientes de mi cartera comercial (almacenadas en SharePoint). Extrae sus indicadores anuales de emisiones de gases de efecto invernadero (Scope 1 y Scope 2) y el porcentaje de consumo de energía procedente de fuentes renovables. Genera una tabla unificada con estos KPIs para preparar el análisis de riesgo climático de la cartera.",
    objetivo: "Extraer KPIs de emisiones de carbono corporativos de SharePoint para análisis climático.",
    contexto: "Adaptación de cartera comercial a la taxonomía verde europea.",
    fuente: "Memorias anuales de sostenibilidad de las empresas de la cartera guardadas en SharePoint.",
    expectativas: "Tabla estructurada con columnas para: Nombre de empresa, Sector, Emisiones Scope 1 (tCO2e), Emisiones Scope 2 (tCO2e) e Intensidad de fuentes renovables (%)."
  },
  {
    num: 57,
    title: "Resumen de Cambios en la Directiva de Blanqueo de Capitales (DBC)",
    prompt: "Analiza la circular técnica interna de SharePoint \"Directiva Europea de Blanqueo de Capitales nº 7: Adaptación Operativa en Banca Comercial\". Genera un manual breve de 1 página en formato Word que resuma los tres cambios principales aplicados al análisis de operaciones internacionales que involucren paraísos fiscales o jurisdicciones no cooperadoras.",
    objetivo: "Elaborar manual técnico sobre directivas de blanqueo de capitales.",
    contexto: "Cumplimiento interno y formación urgente de la red comercial de empresas de banca Tier 1.",
    fuente: "Circular interna sobre DBC nº 7 almacenada en el SharePoint normativo.",
    expectativas: "Documento ejecutivo resumido en 1 página con cambios obligatorios y multas asociadas por omisión regulatoria."
  },
  {
    num: 58,
    title: "Consolidación de Garantías Pignoraticias en Préstamos de Financiación de Activos",
    prompt: "Revisa los expedientes de préstamos corporativos garantizados de la cartera agroalimentaria almacenados en SharePoint. Genera una lista unificada de todas las fincas rústicas y activos agrarios pignorados como colaterales de crédito. Para cada activo, indica la fecha de tasación de la finca, el valor neto de la tasación oficial independiente y si el informe de valoración requiere actualización de precios.",
    objetivo: "Consolidar e identificar tasaciones obsoletas de fincas agrarias colaterales.",
    contexto: "Mitigar riesgos de pérdida de valor de colaterales hipotecarios de la red comercial agraria.",
    fuente: "Expedientes de garantías de la cartera agraria en SharePoint.",
    expectativas: "Listado consolidado con alertas visuales de tasaciones con más de 3 años de antigüedad."
  },
  {
    num: 59,
    title: "Auditoría de Covenants Financieros en Contratos de Deuda de Empresas",
    prompt: "Revisa el contrato de financiación sindicada nº CR-2025-456 de la biblioteca de SharePoint de estructuración de deuda corporativa. Extrae todas las obligaciones de hacer y no hacer (covenants financieros) que el deudor corporativo está obligado a reportar anualmente al sindicato de bancos y genera un calendario de control que identifique las fechas de vencimiento de cada obligación de reporte trimestral.",
    objetivo: "Diseñar calendario de control y cumplimiento de covenants financieros corporativos.",
    contexto: "Gestión del riesgo de default técnico en préstamos de alto volumen.",
    fuente: "Contrato de financiación sindicada de SharePoint del deudor.",
    expectativas: "Calendario cronológico de obligaciones de reporte del deudor con propietarios del banco responsables de su recepción y control."
  },
  {
    num: 60,
    title: "Consolidación de Resoluciones de Comités Comerciales de Zona",
    prompt: "Analiza las actas de comités comerciales semanales de banca de empresas de la zona este guardadas en SharePoint de los últimos tres meses. Genera una tabla resumen que agrupe las operaciones comerciales autorizadas por tipo de producto financiero (ej. Confirming, Avales, Préstamo Sindicado) y desglose el volumen acumulado de comisiones de apertura aprobadas por cada oficina de la zona.",
    objetivo: "Consolidar transacciones autorizadas y comisiones por oficina en comités semanales.",
    contexto: "Reporte analítico de rentabilidad comercial de zona para la dirección regional.",
    fuente: "Actas de comités comerciales semanales de SharePoint.",
    expectativas: "Tabla unificada con volúmenes de negocio formalizados y comisiones devengadas reales."
  },
  {
    num: 61,
    title: "Análisis de Capacidad de Re-financiación en Contratos de Préstamos LBO",
    prompt: "Analiza la documentación de financiación apalancada (LBO) de [Holding Alimentario M] almacenada en SharePoint. Revisa el calendario de amortización de la deuda de adquisición y las cláusulas de \"Bullet Payment\" (vencimiento único de capital al final del plazo de la deuda de adquisición). Identifica si el holding cuenta con un acuerdo de re-financiación autorizado y aprobado por riesgos comerciales y genera una estimación de riesgo financiero en caso de impago en el vencimiento final.",
    objetivo: "Evaluar riesgos financieros de vencimientos Bullet en financiación apalancada LBO.",
    contexto: "Control y monitoreo de riesgos de impago extraordinario en la cartera corporativa.",
    fuente: "Documentos de LBO del Holding M de SharePoint.",
    expectativas: "Informe técnico de riesgo crediticio estructurado, con escenarios financieros de re-financiación simulados y recomendación técnica."
  },
  {
    num: 62,
    title: "Consolidación de Propuestas de Confirming para Importadoras de Automóviles",
    prompt: "Revisa las propuestas de Confirming Internacional enviadas a los fabricantes e importadores de automoción de la cartera corporativa en SharePoint. Genera una tabla comparativa side-by-side que compare los tipos de interés de descuento de facturas ofertados a los proveedores extranjeros, las divisas internacionales soportadas por el sistema y si la comisión de gestión transaccional comercial cuenta con descuento por volumen de remesas anuales.",
    objetivo: "Comparar ofertas transaccionales de Confirming Internacional.",
    contexto: "Venta y optimización tarifaria para clientes de alto volumen de comercio internacional.",
    fuente: "Biblioteca de propuestas comerciales de SharePoint.",
    expectativas: "Cuadro comparativo estructurado y recomendación comercial interna para el RM sobre propuesta competitiva."
  },
  {
    num: 63,
    title: "Auditoría de Expedientes de Cartas de Crédito de Importación Caducadas",
    prompt: "Escanea todos los documentos guardados en la carpeta de SharePoint de \"Operaciones de Comercio Exterior - Cartas de Crédito\" de este año. Genera un listado consolidado de todas las Cartas de Crédito de Importación caducadas o próximas a expirar en los próximos 15 días hábiles que presenten saldos de cobro o comisiones bancarias comerciales de importación pendientes de liquidación.",
    objetivo: "Identificar comisiones y saldos comerciales pendientes en importaciones.",
    contexto: "Recobro comercial transaccional e higiene operativa de cartera comercial de comercio exterior.",
    fuente: "Biblioteca de expedientes de Cartas de Crédito de SharePoint de comercio exterior.",
    expectativas: "Tabla con cliente importador, referencia de Carta de Crédito, fecha de vencimiento y saldos e importes bancarios pendientes de liquidación regularizada."
  },
  {
    num: 64,
    title: "Extracción de Previsiones de Pérdida Esperada de Préstamos Incobrables",
    prompt: "Analiza el informe anual de provisiones y previsiones de insolvencia comercial de la cartera inmobiliaria de la zona norte guardado en SharePoint. Extrae las estimaciones de Pérdida Esperada (Expected Loss) y los porcentajes de provisión de cobertura asociados a las naves industriales con mayor antigüedad media de depreciación del mercado.",
    objetivo: "Extraer estimación de Pérdida Esperada por provisiones comerciales de SharePoint.",
    contexto: "Planificación y aprovisionamiento económico regulatorio de riesgos crediticios del banco Tier 1.",
    fuente: "Informe de provisiones comerciales e insolvencias sectoriales de SharePoint.",
    expectativas: "Resumen técnico numérico estructurado por tramos de riesgo inmobiliario con impacto neto en provisiones estimadas."
  },
  {
    num: 65,
    title: "Auditoría de Declaraciones de Origen de Fondos (AML) en Préstamos Comerciales",
    prompt: "Revisa las declaraciones de origen de fondos y escrituras de ampliación de capital de [Inversiones Corporativas P] almacenadas en SharePoint. Genera un informe detallado de idoneidad y cumplimiento AML que compruebe si los fondos de aportación de capital proceden de filiales operativas del grupo localizadas en la Unión Europea o si existen aportaciones procedentes de paraísos fiscales no revelados.",
    objetivo: "Auditar escrituras e informes financieros corporativos de SharePoint para mitigación de blanqueo de capitales.",
    contexto: "Control y monitoreo normativo de blanqueo en banca corporativa e institucional de empresas.",
    fuente: "Expedientes del cliente e informes financieros en SharePoint.",
    expectativas: "Informe técnico riguroso de cumplimiento con veredicto final claro de idoneidad corporativa."
  },
  {
    num: 66,
    title: "Consolidación de Garantías Personales y Avalistas de Préstamos",
    prompt: "Revisa las escrituras de formalización de préstamos a pymes comerciales y de empresas guardadas en SharePoint de la delegación sur. Genera una base de datos consolidada en formato de tabla de todas las garantías personales (avalistas corporativos e individuales) de los préstamos comerciales vigentes de la cartera.",
    objetivo: "Consolidar avalistas y garantías de la cartera comercial del banco.",
    contexto: "Monitoreo y control de solvencia financiera de avalistas en situaciones de re-financiación del grupo societario.",
    fuente: "Escrituras y pólizas formalizadas en SharePoint.",
    expectativas: "Tabla unificada con nombre de empresa deudora principal, nombre de la sociedad mercantil avalista, volumen avalado y fecha de vencimiento del aval del préstamo."
  },
  {
    num: 67,
    title: "Análisis de Cláusulas de Cambio de Control (Change of Control) en Deuda Corporativa",
    prompt: "Revisa el contrato de emisión de pagarés corporativos de [Holding Logístico X] almacenado en SharePoint. Extrae la cláusula técnica que defina qué eventos societarios se consideran un \"Cambio de Control\" de la sociedad deudora y explica si este evento de fusión o venta de accionariado del grupo otorga al banco el derecho de exigir de manera inmediata la amortización anticipada del préstamo corporativo vigente.",
    objetivo: "Identificar penalizaciones y derechos de amortización anticipada por fusión corporativa.",
    contexto: "Defensa ante fusiones corporativas imprevistas de clientes comerciales.",
    fuente: "Contratos de emisión de deuda del deudor en SharePoint.",
    expectativas: "Resumen técnico de la cláusula legal con explicaciones operativas y de riesgos financieros de respaldo para el RM."
  },
  {
    num: 68,
    title: "Auditoría de Autorizaciones de Préstamos Comerciales con Tipo de Interés Flotante",
    prompt: "Escanea todas las autorizaciones formales de préstamos a empresas con tipo de interés flotante de la red comercial oeste de este año almacenadas en SharePoint. Genera una lista resumen de todas las operaciones comerciales que superen un volumen de 10M€ y verifique si la póliza aprobada cuenta con un tipo mínimo de interés (Floor Rate o cláusula suelo) o si el préstamo queda expuesto a tipos Euribor de cotización variable ilimitada.",
    objetivo: "Consolidar autorizaciones de préstamos variables e identificar existencia de Floor.",
    contexto: "Monitoreo de riesgos ante escenarios de bajadas agresivas de tipos de interés de mercado.",
    fuente: "Pólizas y actas de comisiones comerciales de SharePoint del banco.",
    expectativas: "Tabla unificada destacando préstamos de alto volumen que no cuenten con Floor."
  },
  {
    num: 69,
    title: "Consolidación de Propuestas Comerciales del Segmento de Empresas",
    prompt: "Revisa las propuestas comerciales del segmento de banca de empresas enviadas a las pymes comerciales e industriales almacenadas en la biblioteca de SharePoint. Genera una lista unificada de todas las operaciones pendientes de aceptación que tengan un volumen acumulado de comisiones de apertura superior a 5,000€ anuales por cliente.",
    objetivo: "Consolidar oportunidades pendientes de alta rentabilidad de comisiones de banca comercial.",
    contexto: "Control comercial y previsión trimestral de ingresos por comisiones bancarias del banco Tier 1.",
    fuente: "Biblioteca de SharePoint de propuestas enviadas del segmento corporativo.",
    expectativas: "Tabla unificada por oficinas corporativas locales con importes estimados y RMs asignados."
  },
  {
    num: 70,
    title: "Verificación de KYC de Fideicomisos y Trust Extranjeros de Clientes Corporativos",
    prompt: "Revisa todos los contratos de fideicomisos mercantiles (Trust) de clientes corporativos extranjeros en SharePoint. Genera un checklist estructurado de cumplimiento regulatorio KYC que identifique los fideicomitentes, fiduciarios, beneficiarios últimos de los fideicomisos mercantiles corporativos y confirme si la documentación legal cuenta con su certificado de apostilla del Convenio de La Haya.",
    objetivo: "Auditar estructura societaria de Trust para el cumplimiento de normativas de blanqueo de capitales.",
    contexto: "Asegurar la solidez regulatoria de la cartera transaccional internacional de banca corporativa.",
    fuente: "Escrituras de Trust mercantiles en SharePoint.",
    expectativas: "Checklist simplificado destacando anomalías societarias y documentación legal pendiente de apostillar."
  },
  {
    num: 71,
    title: "Consolidación de Informes de Avales de Comercio Exterior",
    prompt: "Revisa todos los informes de emisión de avales internacionales y garantías de comercio exterior de las constructoras de la cartera corporativa en SharePoint. Genera una tabla de control consolidada que resuma todas las garantías de ejecución de obra pública (Performance Bonds) emitidas este año a favor de administraciones públicas extranjeras de la zona sur.",
    objetivo: "Consolidar emisión de Performance Bonds de comercio exterior en SharePoint.",
    contexto: "Monitoreo y control de riesgos comerciales de ejecución de obra civil financiada.",
    fuente: "Biblioteca documental de avales emitidos en SharePoint de comercio exterior.",
    expectativas: "Tabla unificada con cliente constructor, beneficiario internacional, volumen avalado e hito de finalización de obra de la planta de construcción."
  },
  {
    num: 72,
    title: "Consolidación de Informes de Inspección Ambiental de Proyectos Industriales",
    prompt: "Revisa los informes de auditorías de inspección técnica y de impacto ambiental de las plantas químicas financiadas por el banco y guardadas en SharePoint de los últimos tres meses. Extrae en una lista resumen todos los riesgos e incidencias de contaminación de suelos o multas gubernamentales medioambientales que pudieran afectar al deudor comercial químico.",
    objetivo: "Extraer riesgos de multas ambientales de SharePoint para la mitigación del riesgo operacional.",
    contexto: "Gestión del riesgo de reputación y solvencia sectorial química.",
    fuente: "Biblioteca de informes de inspección medioambiental en SharePoint.",
    expectativas: "Listado de riesgos e impactos operativos con su estimación de sanciones financieras asociadas por planta de producción química."
  },
  {
    num: 73,
    title: "Consolidación de Solicitudes de Cartas de Patrocinio (Comfort Letters)",
    prompt: "Revisa las solicitudes de Cartas de Patrocinio (Comfort Letters) enviadas por las multinacionales matrices a favor de sus filiales locales de nuestra cartera de empresas guardadas en SharePoint. Genera un informe que clasifique cada Comfort Letter en: \"Fuerte\" (compromiso explícito de cobertura de deudas) o \"Débil\" (compromiso puramente de mantener accionariado), indicando fecha límite de vencimiento.",
    objetivo: "Clasificar cartas de patrocinio corporativas matrices por el nivel de garantía financiera de riesgos.",
    contexto: "Monitoreo de garantías del holding comercial internacional de banca corporativa.",
    fuente: "Biblioteca de SharePoint de Comfort Letters.",
    expectativas: "Informe ejecutivo detallado de riesgos financieros de respaldo de deudas filiales corporativas."
  },
  {
    num: 74,
    title: "Consolidación de Resoluciones Judiciales que Afecten a Clientes de la Cartera",
    prompt: "Revisa la base de datos de SharePoint de \"Incidentes Legales y Litigios de Clientes Corporativos\" y genera una lista consolidada que resuma los litigios judiciales comerciales vigentes contra empresas activas con deudas superiores a 5M€ con el banco. Resalta si existe algún auto judicial de embargo preventivo de cuentas corrientes de deudores del banco.",
    objetivo: "Identificar embargos judiciales de deudores de SharePoint para protección del riesgo crediticio.",
    contexto: "Protección de saldos acreedores de la cartera transaccional comercial e institucional.",
    fuente: "Biblioteca de SharePoint de litigios de clientes.",
    expectativas: "Alerta resumida con clientes deudores de alto riesgo crediticio con cuentas embargadas judicialmente."
  },
  {
    num: 75,
    title: "Consolidación de Propuestas de Confirming para Importadoras de Productos Tecnológicos",
    prompt: "Revisa las propuestas de Confirming y Factoring de importación de productos y equipos de tecnología de la cartera de empresas guardadas en SharePoint. Genera una lista unificada de todas las operaciones aprobadas que presenten un volumen transaccional de remesas mensuales de confirming superior a 2M€ por cliente de banca comercial Tier 1.",
    objetivo: "Consolidar importes comerciales transaccionales de confirming de SharePoint.",
    contexto: "Control comercial trimestral de comisiones y rentabilidad de cartera comercial de comercio de tecnología.",
    fuente: "Biblioteca documental de propuestas de Confirming de SharePoint.",
    expectativas: "Tabla unificada con cliente importador, volumen de confirming, divisas soportadas y comisiones acordadas."
  }
];

// Word prompts 76 to 100
const dataWord = [
  {
    num: 76,
    title: "Propuesta de Financiación Multiproducto para Expansión de Negocios",
    prompt: "Redacta una propuesta comercial multiproducto de 4 páginas en Word dirigida a [Holding de Servicios Turísticos T]. El objetivo es financiar la adquisición y remodelación de 3 complejos hoteleros. Estructura la propuesta con las secciones obligatorias: Resumen Ejecutivo, Préstamo Sindicado de Adquisición (25M€), Línea de Confirming de Proveedores (5M€), Cobertura de Tipos de Interés, y Plan de Pago Trimestral. Adopta un tono institucional, formal e innovador.",
    objetivo: "Redactar propuesta multiproducto para financiación de expansión empresarial.",
    contexto: "Negociación comercial de alto valor para banca de empresas corporativas.",
    fuente: "Borrador técnico de comisiones comerciales e importes financieros.",
    expectativas: "Estructura comercial de 4 páginas con secciones diferenciadas por producto financiero corporativo."
  },
  {
    num: 77,
    title: "Conversión de Notas de Visita en Informe de Comité de Riesgo",
    prompt: "Utiliza las notas de campo de mi visita comercial a [Planta Química de Agroquímicos A] guardadas en este documento de Word como la única fuente. Genera un informe técnico de solicitud de crédito comercial estructurado con las siguientes secciones: Historial del Cliente, Diagnóstico Técnico del Activo, Análisis de Impacto Operativo y Recomendaciones de Concesión Comercial. Simplifica la terminología química compleja y adapta la propuesta a un tono ejecutivo para el Comité de Dirección de Riesgos Financieros.",
    objetivo: "Convertir notas de visita comercial en informe técnico de comités de riesgo.",
    contexto: "Presentación de operaciones de crédito complejas para banca comercial e industrial.",
    fuente: "Notas de campo adjuntas en el propio documento Word.",
    expectativas: "Informe estructurado con tono corporativo refinado, conclusiones y recomendaciones claras."
  },
  {
    num: 78,
    title: "Auditoría Interna de Coherencia Normativa en Borradores de Contratos",
    prompt: "Revisa minuciosamente el borrador del acuerdo de covenants financieros y garantías cruzadas redactado en este documento Word de [Holding Logístico Internacional]. Identifica si existen ambigüedades en las obligaciones de información trimestral, si los plazos de entrega de los balances auditados presentan contradicciones entre las secciones de plazos y cumplimiento, o si se omiten términos clave del glosario técnico. Provee una propuesta de redacción alternativa profesional que mitigue el riesgo legal del banco de empresas.",
    objetivo: "Auditar y re-escribir contratos comerciales en Word para consistencia jurídica del banco.",
    contexto: "Mitigar riesgos legales y jurídicos en formalizaciones crediticias corporativas avanzadas.",
    fuente: "Contrato adjunto en el documento Word activo.",
    expectativas: "Detalle de inconsistencias encontradas y propuestas de cláusulas alternativas redactadas de forma restrictiva y profesional."
  },
  {
    num: 79,
    title: "Redacción de Borrador de Carta de Intenciones (LOI) de Adquisición",
    prompt: "Redacta un borrador formal de Carta de Intenciones (Letter of Intent - LOI) de 3 páginas en Word para la adquisición y participación en el capital social de [Grupo Constructor K] por parte de nuestro banco a través de la gestora de capital de riesgo corporativo. Estructura el borrador con cláusulas de confidencialidad, exclusividad de negociación comercial de 120 días y condiciones suspensivas de due diligence técnica de riesgos.",
    objetivo: "Redactar borrador de LOI para adquisiciones de empresas.",
    contexto: "Operaciones complejas de banca de inversión de fusiones y adquisiciones corporativas de zona.",
    fuente: "Notas de estructuración de transacciones del segmento corporativo.",
    expectativas: "Estructura elegante, tono jurídicamente riguroso y formal bancario de primer nivel."
  },
  {
    num: 80,
    title: "Resumen Ejecutivo de Contrato de Préstamo Sindicado de Infraestructuras",
    prompt: "Analiza el borrador del contrato de préstamo sindicado de infraestructuras de 120 páginas adjunto y redacta un resumen ejecutivo formal de 1 página en Word. Estructura el resumen con subtítulos para: Tranches de Deuda, Comisiones de la Sindicación, Calendario de Amortización, Covenants Financieros y Obligaciones de Garantías Reales Cruzadas. Adopta un tono sintético y directo.",
    objetivo: "Resumir el contrato de sindicación de infraestructuras de SharePoint/Word.",
    contexto: "Facilitar la lectura del expediente de crédito corporativo para comisiones de aprobación.",
    fuente: "Documento de Word activo del contrato sindicado.",
    expectativas: "Resumen técnico riguroso de 1 página de extensión máxima."
  },
  {
    num: 81,
    title: "Redacción de Propuesta de Servicios de Cobertura Cambiaria (FX Hedging Proposal)",
    prompt: "Redacta una propuesta de servicios de cobertura cambiaria (FX Hedging Proposal) de 2 páginas en Word dirigida a [Importadora de Maquinaria Industrial L]. Presenta detalladamente las ventajas y características financieras de la contratación de un Forward de divisas Euro/Dólar y un Swap de tipos de interés para estabilizar sus márgenes netos comerciales de importación frente a fluctuaciones de divisas.",
    objetivo: "Redactar propuesta de cobertura de divisas y tipos de cambio en Word.",
    contexto: "Venta transaccional de derivados de mercado de capitales corporativos de zona.",
    fuente: "Folleto técnico de productos de cobertura cambiaria del banco.",
    expectativas: "Propuesta comercialmente estructurada con secciones diferenciadas por producto financiero de divisas corporativo."
  },
  {
    num: 82,
    title: "Redacción de Informe de Análisis Sectorial de la Construcción para Comités",
    prompt: "Redacta un informe de análisis sectorial del mercado de la construcción residencial e inmobiliaria de la zona norte de 3 páginas en Word. Incluye apartados de: Evolución del Stock de Viviendas, Previsiones de Demanda de Financiación Promotora en Q1, Análisis de Solvencia de Constructoras Locales e Impacto de las Subidas de Tipos. Adopta un tono analítico, riguroso y académico de riesgos.",
    objetivo: "Redactar informe sectorial inmobiliario para comités de zona.",
    contexto: "Planificación y posicionamiento sectorial de riesgos del banco comercial Tier 1.",
    fuente: "Estudios macroeconómicos sectoriales del banco de SharePoint/Word.",
    expectativas: "Informe estructurado con tono de riesgos corporativos, conclusiones sectoriales y recomendaciones de concesión de créditos promotores."
  },
  {
    num: 83,
    title: "Adaptación de Contrato de Confirming para Clientes No Residentes",
    prompt: "Revisa el contrato estándar de confirming nacional de este documento Word y adáptalo para su firma por parte de una empresa proveedora de insumos no residente en la Unión Europea. Modifica de forma explícita las cláusulas de jurisdicción aplicable (proponiendo derecho internacional privado o los tribunales de Ginebra en su lugar) e incluye cláusulas de doble imposición fiscal internacional.",
    objetivo: "Adaptar contrato estándar de confirming nacional a transacciones internacionales de comercio exterior de Word.",
    contexto: "Mitigación de riesgos jurídicos y fiscales internacionales en transacciones comerciales de empresas.",
    fuente: "Contrato estándar nacional de confirming en Word.",
    expectativas: "Contrato jurídicamente riguroso, formal y de cumplimiento normativo internacional."
  },
  {
    num: 84,
    title: "Redacción de Propuesta de Préstamo Verde Vinculado a ESG (ESG Loan Proposal)",
    prompt: "Redacta una propuesta comercial para estructurar un Préstamo Verde Vinculado a Sostenibilidad (ESG-Linked Loan) de 3 páginas en Word dirigida a [Multinacional Química del Sur]. Detalla los mecanismos de bonificación de tipos de interés vinculados al cumplimiento de objetivos de reducción de residuos industriales y emisiones de CO2 Scope 1 de la fábrica química.",
    objetivo: "Redactar propuesta de ESG-Linked Loan para banca corporativa de Word.",
    contexto: "Promoción de opciones de financiación verde de alto impacto en zona.",
    fuente: "Folleto de productos ESG y objetivos de sostenibilidad de la corporación.",
    expectativas: "Propuesta comercial consultiva de alta consideración institucional, destacando beneficios mutuos."
  },
  {
    num: 85,
    title: "Consolidación de Notas de Reunión en Acta Formal de Sindicación de Deuda",
    prompt: "Revisa mis notas del comité de hoy adjuntas en este Word sobre la negociación de la sindicación de la línea de crédito de 100M€ para [Consorcio del Gas P]. Genera un acta formal de sindicación estructurada de 3 páginas que incluya los tramos asignados a cada banco comercial, las comisiones de estructuración acordadas, y las garantías cruzadas de filiales locales.",
    objetivo: "Convertir notas de Teams/Word en acta formal de sindicación de deuda corporativa en Word.",
    contexto: "Formalización jurídica obligatoria de transacciones interbancarias sindicadas de zona.",
    fuente: "Notas de comisiones de la reunión de sindicación adjuntas.",
    expectativas: "Acta formal de sindicación con estructura interbancaria rigurosa, de tono y formato impecable bancario."
  },
  {
    num: 86,
    title: "Redacción de Propuesta de Factoring de Exportación para el Sector Alimentario",
    prompt: "Redacta una propuesta comercial de servicios de Factoring de Exportación con recurso de 2 páginas en Word dirigida a [Exportadora Hortofrutícola M]. Presenta detalladamente los mecanismos de cobro anticipado de remesas de comercio exterior, coberturas de riesgo de insolvencia de clientes extranjeros y tipos de interés de descuento aplicables de tarifa preferencial de la entidad.",
    objetivo: "Redactar propuesta de factoring internacional en Word.",
    contexto: "Captación de cuentas transaccionales internacionales del sector primario de la zona.",
    fuente: "Folleto de productos de financiación internacional del banco de SharePoint/Word.",
    expectativas: "Propuesta con enfoque comercial claro, que resalte los ahorros de costes de comisiones transaccionales de comercio exterior para el RM."
  },
  {
    num: 87,
    title: "Análisis de Cláusulas de Indemnización de Daños y Perjuicios en Contratos Sindicados",
    prompt: "Revisa el borrador del contrato de préstamo sindicado corporativo en este Word de [Grupo Constructor Alfa] y analiza las cláusulas técnicas que regulen la indemnización de daños y perjuicios por el deudor en caso de incumplimiento técnico de covenants financieros. Identifica si existen límites económicos de responsabilidad civil u omisiones legales que supongan un riesgo operativo para el banco comercial Tier 1.",
    objetivo: "Auditar y proponer alternativas de redacción a las cláusulas de indemnización de contratos de deudores de Word.",
    contexto: "Protección legal y jurídica avanzada en transacciones de gran envergadura.",
    fuente: "Contrato adjunto en el documento Word activo de deudores.",
    expectativas: "Detalle técnico riguroso de riesgos e inconsistencias contractuales con propuestas de cláusulas correctoras redactadas de forma profesional bancaria."
  },
  {
    num: 88,
    title: "Redacción de Propuesta de Cuenta de Depósitos Operativos Especiales (Cash Pooling)",
    prompt: "Redacta una propuesta comercial de Cash Pooling de barrido automático y depósito de excedentes de tesorería a tipo de interés preferencial de 2 páginas en Word dirigida a [Holding de Servicios de Seguridad G]. Detalla las ventajas operativas de la concentración de saldos y la conciliación de multicuentas en tiempo real a través de nuestra plataforma digital.",
    objetivo: "Redactar propuesta de Cash Pooling en Word.",
    contexto: "Venta transaccional avanzada para holding societario de empresas de zona.",
    fuente: "Portafolio técnico de productos de tesorería corporativa del banco de SharePoint/Word.",
    expectativas: "Propuesta estructurada comercial de tono corporativo refinado bancario."
  },
  {
    num: 89,
    title: "Redacción de Solicitud de Formalización de Préstamo con Garantía Inmobiliaria",
    prompt: "Redacta una solicitud formal de formalización de un préstamo corporativo con garantía hipotecaria comercial de 3 páginas en Word para la construcción de una planta de almacenamiento logístico para [Operadora Inmobiliaria H]. Detalla la tasación de las naves colaterales, los plazos de carencia de principal propuestos de 18 meses, y las condiciones de desembolso por certificación de obra civil.",
    objetivo: "Redactar informe técnico de formalización hipotecaria corporativa de Word.",
    contexto: "Presentación de expedientes de crédito a comités de aprobación del banco comercial Tier 1.",
    fuente: "Datos financieros del cliente e informes de tasación de activos de SharePoint/Word.",
    expectativas: "Estructura formal impecable con desglose de colaterales, ratios LTV y de riesgo financiero operativo."
  },
  {
    num: 90,
    title: "Redacción de Propuesta de Línea de Avales Internacionales (Performance Bonds)",
    prompt: "Redacta una propuesta de emisión de Línea de Avales Internacionales de Ejecución de Obra (Performance Bonds) de 2 páginas en Word dirigida a [Consorcio Constructor Vial G] para respaldar su participación en licitaciones internacionales públicas en el mercado latinoamericano. Presenta detalladamente las tarifas oficiales comisiones aplicables y tipos de cambio de divisas del banco comercial Tier 1.",
    objetivo: "Redactar propuesta de avales y garantías internacionales en Word.",
    contexto: "Licitación de obra pública internacional de grandes constructoras de la delegación sur.",
    fuente: "Folleto de avales de comercio exterior del banco de SharePoint/Word.",
    expectativas: "Propuesta comercial consultiva de alto nivel, de tono impecable bancario."
  },
  {
    num: 91,
    title: "Análisis de Covenants en Contratos de Deuda de Empresas",
    prompt: "Revisa el contrato de deudor de financiación corporativa nº CR-2025-998 en este Word y extrae todas las cláusulas que definan obligaciones de información financiera de reporting trimestral del cliente comercial. Identifica si existe algún covenant de ratio de solvencia técnica no declarado de forma explícita en las secciones de riesgos y propón una redacción aclaratoria profesional de riesgos crediticios.",
    objetivo: "Auditar covenants y obligaciones de reporting financiero del cliente en Word para consistencia técnica.",
    contexto: "Asegurar la consistencia técnica de contratos vigentes corporativos de zona.",
    fuente: "Contrato corporativo en el documento Word activo.",
    expectativas: "Detalle de inconsistencias contractuales detectadas con propuestas alternativas redactadas de forma profesional bancaria."
  },
  {
    num: 92,
    title: "Redacción de Propuesta de Confirming Nacional (Factoring de Proveedores)",
    prompt: "Redacta una propuesta comercial de Confirming Nacional sin recurso de 2 páginas en Word dirigida a [Holding de Alimentación de Supermercados Z]. Detalla detalladamente las ventajas y características financieras de la contratación del servicio para el cobro anticipado de remesas de proveedores locales y tipos de descuento de tarifa preferencial de la entidad.",
    objetivo: "Redactar propuesta de confirming nacional de proveedores en Word.",
    contexto: "Venta transaccional de capital de circulante para grandes mayoristas de zona.",
    fuente: "Folleto de confirming del banco de SharePoint/Word.",
    expectativas: "Propuesta comercial clara y atractiva que resalte el valor tanto para el cliente ancla como para su cadena logística local en Word."
  },
  {
    num: 93,
    title: "Redacción de Informe de Análisis de Riesgos Financieros Corporativos (Risk Memo)",
    prompt: "Redacta un informe de análisis de riesgos financieros corporativos (Risk Memo) de 3 páginas en Word para la evaluación de riesgos crediticios de [Grupo Industrial del Norte] en su solicitud de crédito de expansión de 15M€. Estructura el memo con secciones de: Análisis de Balance de Situación de la Empresa, Evolución de Flujos de Caja, Cobertura de Servicio de Deuda, Covenants de ratios financieros y Calificación Final de Riesgos.",
    objetivo: "Redactar Risk Memo para evaluación de riesgos de empresas de Word.",
    contexto: "Aprobación de operaciones crediticias corporativas avanzadas de la zona.",
    fuente: "Balances y cuentas analíticas de la empresa en SharePoint/Word.",
    expectativas: "Informe riguroso técnico de tono corporativo refinado bancario."
  },
  {
    num: 94,
    title: "Redacción de Propuesta de Servicios de Emisión de Deuda Corporativa (Pagarés)",
    prompt: "Redacta una propuesta de servicios de colocación y estructuración de emisión de pagarés corporativos de 3 páginas en Word dirigida a [Holding Tecnológico Z] para captar financiación en los mercados de capitales a corto plazo. Presenta las ventajas de coste financiero de la emisión frente al crédito comercial tradicional, comisiones de aseguramiento del banco, y calendario estimado de estructuración de transacciones de la delegación sur.",
    objetivo: "Redactar propuesta de estructuración de emisión de pagarés en Word.",
    contexto: "Originación de transacciones en mercados de capitales corporativos de zona.",
    fuente: "Datos macroeconómicos y portafolio de banca de inversión de SharePoint/Word.",
    expectativas: "Propuesta técnica rigurosa de alto nivel, de tono impecable bancario."
  },
  {
    num: 95,
    title: "Redacción de Propuesta de Financiación Sindicada (Corporate Club Loan)",
    prompt: "Redacta una propuesta comercial para estructurar un préstamo sindicado privado (Corporate Club Loan) de 3 páginas en Word dirigida a [Grupo Constructor del Sur] para la financiación de proyectos de infraestructura local por valor de 50M€. Detalla el papel del banco como entidad coordinadora (Lead Arranger), tramos participantes de co-líderes e importes de comisiones de aseguramiento del banco de empresas Tier 1.",
    objetivo: "Redactar propuesta de estructuración de club loan para banca de empresas de Word.",
    contexto: "Sindicaciones bilaterales privadas de infraestructuras de la delegación.",
    fuente: "Borrador de hoja de condiciones de la sindicación comercial en SharePoint/Word.",
    expectativas: "Propuesta altamente estructurada de tono formal e institucional bancario."
  },
  {
    num: 96,
    title: "Análisis de Cláusulas de Default Cruzado (Cross-Default) en Préstamos de Empresas",
    prompt: "Revisa el contrato de deudor de financiación corporativa en este Word de [Holding Logístico X] y analiza las cláusulas técnicas que regulen los eventos de default cruzado (cross-default). Comprueba si el impago o vencimiento de deudas con filiales extranjeras del deudor no declaradas contractualmente se considera un evento de default para el banco comercial Tier 1 e indica propuestas alternativas de redacción profesional de riesgos crediticios.",
    objetivo: "Auditar y proponer alternativas de redacción a las cláusulas de cross-default de contratos de deudores de Word.",
    contexto: "Protección legal y jurídica avanzada frente a riesgos internacionales de grupos societarios.",
    fuente: "Contrato corporativo en el documento Word activo.",
    expectativas: "Detalle de inconsistencias contractuales detectadas con propuestas de cláusulas alternativas redactadas de forma profesional bancaria."
  },
  {
    num: 97,
    title: "Redacción de Propuesta de Cuenta de Depósitos en Divisas Extranjeras (FX Deposits)",
    prompt: "Redacta una propuesta comercial de Cuenta de Depósitos en Divisas Extranjeras a tipo fijo de 2 páginas en Word dirigida a [Holding de Exportación Hortofrutícola L]. Presenta las ventajas financieras de rentabilidad de tipos de interés preferenciales del banco comercial Tier 1 para depósitos en Dólares Estadounidenses (USD), Libras Esterlinas (GBP) y Francos Suizos (CHF) con plazos flexibles de colocación de excedentes de comercio exterior en Word.",
    objetivo: "Redactar propuesta de depósitos en divisas extranjeras en Word.",
    contexto: "Captación y retención de depósitos operativos estacionales del segmento de empresas de zona.",
    fuente: "Portafolio de productos de tesorería cambiaria del banco de SharePoint/Word.",
    expectativas: "Propuesta con enfoque comercial y de rentabilidad clara, de tono impecable bancario."
  },
  {
    num: 98,
    title: "Redacción de Propuesta de Leasing Financiero de Flotas de Transporte",
    prompt: "Redacta una propuesta de leasing de adquisición de flotas de vehículos industriales de 2 páginas en Word dirigida a [Holding Logístico Internacional G]. Presenta detalladamente las ventajas fiscales de deducibilidad tributaria y depreciación acelerada aplicables, condiciones de amortización trimestral con cuotas flexibles y opción de compra final de tarifa preferencial de la entidad en Word.",
    objetivo: "Redactar propuesta de leasing automotriz corporativo en Word.",
    contexto: "Captación de cuentas del segmento logístico e industrial de la delegación.",
    fuente: "Folleto de leasing del banco de SharePoint/Word.",
    expectativas: "Propuesta con enfoque comercial y fiscal detallado, de tono impecable bancario."
  },
  {
    num: 99,
    title: "Redacción de Informe de Análisis de Viabilidad de Créditos Sindicados (Syndication Memo)",
    prompt: "Redacta un informe de análisis de viabilidad de sindicados (Syndication Memo) de 3 páginas en Word para la evaluación de riesgos crediticios interbancarios de [Consorcio del Gas P] en su solicitud de crédito de infraestructura de 100M€. Estructura el memo con secciones de: Análisis de Flujos de Tesorería de Deudores, Reparto de Tramos del Sindicato de Bancos, Comisiones de Aseguramiento de Originadores, Covenants de ratios financieros y Recomendación Técnica Final del Coordinador General (Lead Arranger).",
    objetivo: "Redactar Syndication Memo para comités interbancarios de Word.",
    contexto: "Originación y sindicación interbancaria de transacciones complejas de zona.",
    fuente: "Datos macroeconómicos e informes financieros corporativos de SharePoint/Word.",
    expectativas: "Informe riguroso técnico de tono corporativo refinado bancario."
  },
  {
    num: 100,
    title: "Redacción de Propuesta de Financiación de Importaciones (Import Loans)",
    prompt: "Redacta una propuesta comercial para estructurar un préstamo de importación (Import Loan) de 2 páginas en Word dirigida a [Grupo Metalúrgico T]. Detalla detalladamente las ventajas financieras de financiación a corto plazo de compras de materias primas a proveedores extranjeros, comisiones de comercio exterior de la entidad y calendarios flexibles de devolución del capital financiados por el banco comercial Tier 1 en Word.",
    objetivo: "Redactar propuesta de préstamo de importación de comercio exterior en Word.",
    contexto: "Financiación internacional sectorial de materias primas de la delegación sur.",
    fuente: "Folleto de comercio exterior del banco de SharePoint/Word.",
    expectativas: "Propuesta comercial consultiva de alto nivel, de tono impecable bancario."
  }
];

// Excel prompts 101 to 125
const dataExcel = [
  {
    num: 101,
    title: "Proyección Financiera de Modelos de Negocio en Préstamos LBO (Python)",
    prompt: "Accede al modo de análisis avanzado con Python integrado en Excel. Utiliza los datos históricos de flujos de caja y endeudamiento de [Holding Logístico X] de la tabla activa para construir una proyección de flujos de tesorería mensuales a 5 años. Calcula la capacidad de pago de la deuda (Debt Service Coverage Ratio - DSCR) y simula tres escenarios de estrés de tipos Euribor (subidas de 100, 200 y 300 puntos básicos). Genera un gráfico de líneas con las tendencias del DSCR por escenario y guárdalo en una nueva hoja.",
    objetivo: "Construir modelo predictivo y simular escenarios de estrés de tipos Euribor en préstamos LBO corporativos con Python integrado.",
    contexto: "Evaluación rigurosa de solvencia crediticia avanzada ante comités de riesgos.",
    fuente: "Tabla de datos financieros de la empresa activa en el libro de trabajo.",
    expectativas: "Proyecciones mensuales calculadas a 5 años, análisis de DSCR con escenarios de subidas de tipos y gráfico guardado de forma independiente en el libro."
  },
  {
    num: 102,
    title: "Análisis de Desviaciones de Presupuestos Comerciales por Oficinas (Varianza)",
    prompt: "Analiza la tabla de ingresos comerciales y provisiones por oficinas de banca de empresas de la zona este. Compara las comisiones netas generadas reales frente al presupuesto comercial fijado de Q1. Identifica las tres oficinas con mayores desviaciones negativas (varianzas de comisiones) y marca aquellas oficinas que presenten provisiones de mora superiores a la media sectorial de la zona. Presenta los resultados en una tabla de resumen.",
    objetivo: "Identificar desvíos presupuestarios corporativos e incidencias de provisiones.",
    contexto: "Planificación y monitoreo de la eficiencia de la red comercial de oficinas.",
    fuente: "Tabla unificada del presupuesto de zona de empresas de la hoja de cálculo.",
    expectativas: "Tabla resumida ordenada por mayor desvío negativo con análisis corto en lenguaje sencillo para toma de decisiones del Director Regional."
  },
  {
    num: 103,
    title: "Modelado de Regresión Lineal para Proyectar Demanda de Depósitos Corporativos",
    prompt: "Ejecuta un análisis de datos con Python en Excel. Utiliza la serie histórica de depósitos mensuales corporativos de grandes cuentas de este libro y construye un modelo de regresión lineal simple que proyecte la evolución estimada de saldos de depósitos operativos para el próximo trimestre. Genera un gráfico de dispersión con la tendencia calculada y el intervalo de confianza estadística del 95% para tesorería.",
    objetivo: "Proyectar saldos de depósitos corporativos a tres meses mediante modelos estadísticos predictivos de Python.",
    contexto: "Planificación financiera de liquidez operativa del banco comercial Tier 1.",
    fuente: "Tabla histórica de saldos de depósitos mensuales de la hoja de cálculo.",
    expectativas: "Código Python ejecutado y explicado, con tabla de estimación trimestral y gráfico guardado en una hoja de control de liquidez del libro."
  },
  {
    num: 104,
    title: "Detección de Anomalías e Incidencias en Remesas de Confirming de Factores de Riesgo",
    prompt: "Analiza de forma sistemática la tabla de remesas de Confirming corporativo de este libro de trabajo y busca anomalías operativas. Identifica registros donde el número de facturas emitidas por proveedor presente una duplicación inusual de importes exactos en la misma fecha de descuento, o remesas cuyas comisiones transaccionales de descuento no se ajusten a la tarifa oficial pactada por contrato de la entidad.",
    objetivo: "Detectar fraude transaccional o anomalías operativas en remesas de Confirming en Excel.",
    contexto: "Asegurar la calidad e integridad operativa de los cobros comerciales de clientes.",
    fuente: "Tabla unificada de remesas de confirming de la hoja de cálculo.",
    expectativas: "Listado claro detallando las facturas en conflicto técnico y las anomalías de tarifas financieras identificadas de forma automatizada por el RM."
  },
  {
    num: 105,
    title: "Análisis de Correlación entre la Tasa de Descuento de Factoring y Solvencia Sectorial",
    prompt: "Accede al modo de análisis con Python en Excel. Calcula la matriz de correlación estadística de Pearson entre el tipo de interés de descuento aplicado a las remesas de Factoring de pymes y el ratio de rentabilidad de capital (ROE) consolidado del sector industrial del deudor principal de la tabla de la hoja. Genera un gráfico de dispersión y presenta las conclusiones de riesgos.",
    objetivo: "Evaluar correlación estadística entre tasas de financiación comercial y solvencia sectorial en Excel con Python.",
    contexto: "Modelado y control de precios comerciales ajustados por riesgos sectoriales.",
    fuente: "Tabla unificada de operaciones de factoring sectoriales e indicadores macroeconómicos sectoriales de la hoja de cálculo.",
    expectativas: "Análisis estadístico de correlación calculado y explicado con gráfico insertado de forma estática en la hoja."
  },
  {
    num: 106,
    title: "Simulación Monte Carlo de Pérdida Esperada por Insolvencias Corporativas (Python)",
    prompt: "Ejecuta una simulación Monte Carlo con 10,000 iteraciones en Python en Excel. Utiliza las probabilidades de default (PD) e importes en riesgo en el momento de default (EAD) de la cartera de empresas industriales de este libro para proyectar la Pérdida Esperada (Expected Loss) agregada del próximo año. Genera un histograma con la distribución de pérdidas corporativas acumuladas de simulación.",
    objetivo: "Modelar pérdidas agregadas e insolvencias de cartera comercial de Excel con simulaciones estocásticas Monte Carlo de Python.",
    contexto: "Planificación y aprovisionamiento económico regulatorio de riesgos crediticios del banco Tier 1.",
    fuente: "Tabla de PD, LGD e importes de deuda corporativa activa de la hoja de cálculo.",
    expectativas: "Distribución simulada con análisis estadístico de pérdidas centiles y gráfico insertado de forma estática en la hoja de control de riesgos del deudor."
  },
  {
    num: 107,
    title: "Cálculo de Márgenes Comerciales de Coaseguros en Préstamos Sindicados",
    prompt: "Analiza la tabla de tramos y comisiones de sindicación del préstamo corporativo de 150M€ en este libro de trabajo y calcula de forma automatizada el margen comercial neto devengado para cada banco participante co-líder (Lead Arranger), deduciendo las comisiones de aseguramiento (underwriting fee) y de sindicación del pool bancario del deudor.",
    objetivo: "Calcular rentabilidad económica interbancaria en sindicaciones de Excel.",
    contexto: "Control y análisis de márgenes de co-líderes comerciales del banco originador.",
    fuente: "Tabla de comisiones de sindicación del deudor de la hoja de cálculo.",
    expectativas: "Fórmulas de desglose de tramos y comisiones netas calculadas de forma directa y explicadas en el libro."
  },
  {
    num: 108,
    title: "Proyección de Ratios de Solvencia Crediticia para Empresas del Sector Químico",
    prompt: "Utiliza los estados financieros históricos de las empresas químicas del segmento corporativo activas de la tabla de este libro y proyecta de forma automatizada sus ratios de solvencia (Ratio de Endeudamiento, Cobertura de Servicio de Deuda, Cobertura de Intereses) para los próximos tres trimestres de la hoja.",
    objetivo: "Proyectar ratios de solvencia e insolvencia sectorial de Excel.",
    contexto: "Monitoreo y control de riesgos sectoriales químicos del banco comercial Tier 1.",
    fuente: "Tabla unificada de balances e indicadores macroeconómicos sectoriales de la hoja de cálculo.",
    expectativas: "Tabla unificada con ratios proyectados, alertas de desvíos técnicos y fórmulas explicadas de Excel de la hoja de cálculo."
  },
  {
    num: 109,
    title: "Análisis de Margen Neto de Intereses (NIM) en Pólizas de Crédito Variables",
    prompt: "Analiza la tabla de pólizas de crédito corporativas variables vinculadas a Euribor de este libro de trabajo. Calcula de forma automatizada el margen neto de intereses (NIM) devengado para cada póliza basándote en el diferencial oficial de precios pactado en el contrato del deudor y los costes de financiación internos de tesorería (match funding) de la hoja.",
    objetivo: "Calcular rentabilidad neta de carteras variables corporativas de Excel.",
    contexto: "Control comercial y análisis de rentabilidad financiera de márgenes sectoriales.",
    fuente: "Tabla unificada de pólizas de crédito activas corporativas de la hoja de cálculo.",
    expectativas: "Márgenes calculados por póliza, con resúmenes por delegación de zona comercial de empresas de banca Tier 1."
  },
  {
    num: 110,
    title: "Proyección de Amortizaciones de Préstamos Hipotecarios Comerciales (Python)",
    prompt: "Accede al modo de análisis avanzado con Python integrado en Excel. Utiliza los datos de amortización de préstamos corporativos con garantía hipotecaria comercial de este libro y construye un modelo de proyección de flujos mensuales de cobro para el próximo año. Simula un escenario de amortización anticipada excepcional del 15% de la deuda agregada de la hoja de cálculo.",
    objetivo: "Proyectar amortizaciones mensuales de préstamos variables corporativos e hipotecarios con Python integrado.",
    contexto: "Planificación financiera de liquidez del banco comercial Tier 1 de zona.",
    fuente: "Tabla de datos financieros de amortización hipotecaria corporativa de la hoja de cálculo.",
    expectativas: "Tabla de estimaciones de cobros calculados con proyecciones mensuales y gráfico de líneas insertado de forma estática en la hoja."
  },
  {
    num: 111,
    title: "Análisis de Varianza de Ingresos por Comisiones de Comercio Exterior",
    prompt: "Analiza la tabla de ingresos por comisiones transaccionales de comercio exterior (Cartas de Crédito, Avales, Remesas Documentarias) de este libro de trabajo. Compara de forma automatizada los ingresos devengados reales acumulados del año frente al presupuesto comercial fijado de Q1 e identifica las delegaciones de zona con mayor desvío negativo de comisiones de la hoja.",
    objetivo: "Identificar desviaciones de ingresos y comisiones de comercio exterior por zona de Excel.",
    contexto: "Reporte analítico de rentabilidad comercial sectorial de empresas del banco comercial Tier 1.",
    fuente: "Tabla unificada de comisiones de comercio exterior de la hoja de cálculo.",
    expectativas: "Tabla unificada por zonas con porcentajes de varianza de ingresos y alertas de desvíos técnicos."
  },
  {
    num: 112,
    title: "Proyección de Ratios de Liquidez Operativa en Cash Pooling de Multicuentas",
    prompt: "Analiza la tabla de extractos diarios y saldos agregados de multicuentas en el Cash Pooling corporativo de este libro de trabajo. Calcula de forma automatizada los ratios de liquidez operativa agregados mensuales de la hoja y proyecta la evolución de depósitos operativos especiales para el próximo trimestre.",
    objetivo: "Proyectar saldos de tesorería corporativa y liquidez operativa de Excel.",
    contexto: "Planificación y optimización de excedentes de tesorería del holding societario de empresas de zona.",
    fuente: "Tabla histórica de saldos de Cash Pooling de la hoja de cálculo.",
    expectativas: "Ratios mensuales de liquidez calculados, con proyecciones de tesorería trimestrales y fórmulas explicadas de Excel de la hoja de cálculo."
  },
  {
    num: 113,
    title: "Análisis de Riesgos de Concentración Inmobiliaria por Promotoras (Gini)",
    prompt: "Accede al modo de análisis con Python en Excel. Calcula el índice de concentración de Gini para el volumen de crédito de promotoras inmobiliarias e industriales activas de este libro de trabajo. Genera un gráfico de curvas de Lorenz que visualice la distribución acumulada de crédito promotor e indica el porcentaje de riesgo crediticio concentrado en las tres principales constructoras de la hoja.",
    objetivo: "Evaluar riesgos de concentración inmobiliaria de cartera de Excel con modelos de Gini con Python.",
    contexto: "Planificación y control de riesgos de concentración sectorial inmobiliaria.",
    fuente: "Tabla unificada de préstamos promotores de la hoja de cálculo.",
    expectativas: "Índice de Gini calculado con curva de Lorenz insertada de forma estática en la hoja de control de riesgos del deudor."
  },
  {
    num: 114,
    title: "Simulación Monte Carlo de Pérdida por Incumplimiento de Garantías Personales (Python)",
    prompt: "Ejecuta una simulación Monte Carlo con 5,000 iteraciones en Python en Excel para evaluar las pérdidas estimadas agregadas de la cartera de pymes comerciales de este libro que presenten garantías y avales personales en caso de default de la hoja de cálculo de riesgos. Genera un histograma con la distribución de pérdidas simuladas.",
    objetivo: "Modelar pérdidas agregadas de avales en Excel con simulaciones estocásticas Monte Carlo de Python.",
    contexto: "Planificación y aprovisionamiento económico regulatorio de riesgos crediticios del banco Tier 1 de zona.",
    fuente: "Tabla de datos financieros de deudores y garantías de la hoja de cálculo.",
    expectativas: "Distribución calculada con análisis de pérdidas de centiles y gráfico de histograma guardado en una hoja del libro."
  },
  {
    num: 115,
    title: "Análisis de Varianza de Gastos Operativos de Auditoría de Crédito",
    prompt: "Analiza la tabla de gastos de auditoría e inspección técnica y medioambiental de promociones industriales financiadas de este libro de trabajo. Compara de forma automatizada los gastos acumulados reales del año frente al presupuesto operativo de riesgos corporativos de Q1 de la hoja de cálculo de comisiones.",
    objetivo: "Identificar desvíos operativos de auditorías de riesgos de Excel.",
    contexto: "Optimización y control de la eficiencia de procesos internos de banca de empresas.",
    fuente: "Tabla de gastos de auditoría técnica sectorial de la hoja de cálculo.",
    expectativas: "Tabla unificada de desviaciones de gastos acumulados con alertas de desvíos técnicos."
  },
  {
    num: 116,
    title: "Proyección de Ingresos Netos de la Mesa de Confirming de Proveedores (Python)",
    prompt: "Ejecuta un modelo predictivo con Python en Excel para proyectar los ingresos netos de comisiones por factoring de proveedores (Confirming) de la tabla de la hoja de cálculo de comisiones para los próximos tres trimestres de la hoja, basándote en la tasa de crecimiento histórico de las remesas de confirming de la cartera.",
    objetivo: "Proyectar ingresos netos y comisiones de confirmings corporativos de Excel con Python.",
    contexto: "Planificación comercial de ingresos por servicios transaccionales corporativos avanzados de zona.",
    fuente: "Tabla histórica de ingresos de la mesa de confirming de la hoja de cálculo.",
    expectativas: "Código Python ejecutado y explicado, con tabla de estimación trimestral e histogramas de tendencias comerciales en Excel de la hoja de cálculo."
  },
  {
    num: 117,
    title: "Análisis de Relación de Tasas de Interés de Préstamos LBO con Rating Corporativo",
    prompt: "Accede al modo de análisis avanzado con Python en Excel. Calcula el coeficiente de correlación de Spearman entre el tipo de interés nominal aplicado a la cartera de préstamos de adquisición apalancada (LBO) corporativa y el rating crediticio oficial asignado por agencias de calificación de la tabla de la hoja de riesgos. Genera un diagrama de caja (box plot) de riesgos.",
    objetivo: "Evaluar relación de tasas y precios de préstamos apalancados con rating corporativo de Excel con Python.",
    contexto: "Control y monitoreo de precios comerciales ajustados por rating corporativo y de riesgos financieros de deudores.",
    fuente: "Tabla unificada de deudores LBO y calificaciones de la hoja de cálculo.",
    expectativas: "Coeficiente calculado con diagrama de caja insertado de forma estática en la hoja."
  },
  {
    num: 118,
    title: "Proyección de Ratios de Cobertura de Intereses en Financiaciones Sindicadas",
    prompt: "Analiza la tabla de estados financieros consolidados de las corporaciones deudoras de préstamos sindicados complejos de este libro de trabajo. Calcula de forma automatizada los ratios de cobertura de intereses de deudores de la hoja y proyecta la evolución de ratios de riesgos para el próximo año.",
    objetivo: "Proyectar ratios de cobertura de intereses corporativos y de deudores de Excel.",
    contexto: "Monitoreo y prevención de default técnico de tramos y comisiones de deudores sindicados de zona.",
    fuente: "Tabla histórica de balances consolidados de la hoja de cálculo.",
    expectativas: "Tabla de estimaciones de ratios calculados, con alertas de desvíos técnicos y fórmulas explicadas de Excel de la hoja de cálculo."
  },
  {
    num: 119,
    title: "Análisis de Rentabilidad sobre Activos Ajustados por Riesgos (RAROC) (Python)",
    prompt: "Accede al modo de análisis avanzado con Python integrado en Excel. Calcula el ratio RAROC (Risk-Adjusted Return on Capital) para cada préstamo a gran empresa activo en este libro de trabajo de la hoja de riesgos de deudores corporativos, deduciendo la Pérdida Esperada (Expected Loss) y el Capital Económico Regulatorio asignado por riesgos sectoriales.",
    objetivo: "Calcular RAROC de la cartera de empresas de Excel con Python integrado.",
    contexto: "Modelado y control de rentabilidad ajustada a riesgos de deudores corporativos de zona.",
    fuente: "Tabla unificada de préstamos corporativos, PD, LGD y Capital de la hoja de cálculo.",
    expectativas: "Ratio RAROC calculado por préstamo, con promedios por delegaciones de zona comercial de empresas de banca Tier 1 en el libro."
  },
  {
    num: 120,
    title: "Proyección de Ratios Loan-to-Value (LTV) de Préstamos Inmobiliarios",
    prompt: "Analiza la tabla de préstamos promotores con garantía hipotecaria de este libro de trabajo. Calcula de forma automatizada la evolución estimada de ratios LTV (Loan-to-Value) para los próximos dos trimestres de la hoja, basándote en las proyecciones de depreciación del valor neto de naves inmobiliarias de la cartera sectorial de zona de deudores.",
    objetivo: "Proyectar ratios LTV de promociones inmobiliarias y de constructoras de Excel.",
    contexto: "Monitoreo y prevención de excesos de límites de garantía colateral sectorial inmobiliaria.",
    fuente: "Tabla unificada de préstamos promotores y tasaciones de la hoja de cálculo.",
    expectativas: "Tabla unificada con ratios proyectados, alertas de desvíos técnicos y fórmulas explicadas de Excel de la hoja de cálculo."
  },
  {
    num: 121,
    title: "Análisis de Margen Comercial de Préstamos Verdes ESG frente a Préstamos Estándar",
    prompt: "Analiza la tabla de operaciones crediticias formalizadas en este libro de trabajo y calcula de forma automatizada el margen neto medio devengado de los préstamos vinculados a criterios ESG de la hoja, comparándolo de forma comparativa con los márgenes de los préstamos tradicionales comerciales corporativos.",
    objetivo: "Comparar márgenes financieros y rentabilidad comercial de préstamos verdes en Excel.",
    contexto: "Control comercial y rentabilidad de productos ESG de banca corporativa e institucional de empresas.",
    fuente: "Tabla unificada de operaciones comerciales de la hoja de cálculo.",
    expectativas: "Márgenes netos calculados con resúmenes por tipo de financiación y fórmulas explicadas de Excel de la hoja de cálculo."
  },
  {
    num: 122,
    title: "Proyección de Márgenes de Comisiones de Comercio Exterior (Python)",
    prompt: "Ejecuta un modelo predictivo con Python en Excel para proyectar los ingresos netos de comisiones transaccionales de comercio exterior (Cartas de Crédito, Avales, Remesas) de este libro de trabajo de la hoja para los próximos dos trimestres, basándote en la tasa de exportación histórica sectorial de zona en Excel.",
    objetivo: "Proyectar ingresos de comisiones transaccionales internacionales de Excel con Python.",
    contexto: "Planificación comercial de ingresos transaccionales de banca de comercio exterior de zona.",
    fuente: "Tabla histórica de comisiones de comercio exterior de la hoja de cálculo.",
    expectativas: "Código Python ejecutado y explicado, con tabla de estimación trimestral e histogramas de tendencias comerciales en Excel de la hoja de cálculo."
  },
  {
    num: 123,
    title: "Análisis de Concentración de Riesgos de Deudores por Holding Societario",
    prompt: "Analiza la tabla de deudores y subsidiarias corporativas activas de este libro de trabajo. Calcula de forma automatizada la concentración agregada de riesgo de deuda comercial por holding societario de la hoja e identifica los holdings que superen un volumen de crédito corporativo agregado superior a 20M€ del banco.",
    objetivo: "Consolidar e identificar concentración agregada de deudas por holding de Excel.",
    contexto: "Monitoreo de límites regulatorios de grandes exposiciones de riesgos crediticios del deudor.",
    fuente: "Tabla unificada de deudores y grupos societarios de la hoja de cálculo.",
    expectativas: "Tabla unificada de holdings de alto volumen de deudas agregadas con alertas de desvíos técnicos de la hoja."
  },
  {
    num: 124,
    title: "Simulación Monte Carlo de Pérdida Esperada de Préstamos LBO Corporativos (Python)",
    prompt: "Ejecuta una simulación Monte Carlo con 10,000 iteraciones en Python en Excel para evaluar las pérdidas estimadas agregadas de la cartera de préstamos apalancados (LBO) corporativos de este libro de la hoja de riesgos de deudores, basándote en las PD y LGD de la hoja de cálculo. Genera un histograma con la distribución de pérdidas simuladas.",
    objetivo: "Modelar pérdidas agregadas de LBO de Excel con simulaciones estocásticas Monte Carlo de Python.",
    contexto: "Planificación y aprovisionamiento económico regulatorio de riesgos crediticios de banca corporativa.",
    fuente: "Tabla de datos de deudores apalancados, PD y LGD de la hoja de cálculo.",
    expectativas: "Distribución calculada con análisis de pérdidas de centiles y gráfico de histograma guardado en una hoja del libro."
  },
  {
    num: 125,
    title: "Proyección de Gastos de Comisiones Transaccionales de Factoring de Proveedores",
    prompt: "Analiza la tabla de transacciones de factoring comercial de este libro de trabajo y calcula de forma automatizada las proyecciones de ingresos de comisiones transaccionales de descuento para el próximo trimestre de la hoja de comisiones.",
    objetivo: "Proyectar ingresos de comisiones transaccionales corporativos de Excel.",
    contexto: "Planificación comercial de ingresos por servicios transaccionales corporativos avanzados de zona.",
    fuente: "Tabla unificada de operaciones de factoring de la hoja de cálculo.",
    expectativas: "Tabla unificada por zonas con porcentajes de varianza de ingresos y fórmulas de Excel."
  }
];

// PowerPoint prompts 126 to 150
const dataPowerPoint = [
  {
    num: 126,
    title: "Pitch de Captación de Financiación Sindicada (Club Loan 50M€)",
    prompt: "Genera una propuesta de esquema estructural de 12 diapositivas en PowerPoint basada en el reporte de due diligence del proyecto de infraestructuras \"Consorcio de Transportes T\". Diseña la estructura narrativa para captar la co-líder (Lead Arranger) de la sindicación. Para cada diapositiva, define el título formal, un máximo de tres viñetas breves que sinteticen las cifras del tramo de deuda propuesto y las comisiones bancarias comerciales, sugerencias de gráficos de barras horizontales, y notas de orador técnicas de riesgos de comisiones.",
    objetivo: "Diseñar storyboard y estructura para pitch comercial interbancario en PowerPoint.",
    contexto: "Captación de co-líderes e inversores en sindicaciones privadas complejas.",
    fuente: "Reporte de due diligence y hoja de condiciones de la sindicación comercial de SharePoint/Word.",
    expectativas: "Storyboard de 12 diapositivas estructurado con mensajes de tramos de deuda, comisiones y notas de orador detalladas de riesgos crediticios."
  },
  {
    num: 127,
    title: "Presentación del Desempeño Trimestral de la Cartera de Empresas",
    prompt: "Estructura una presentación de 10 diapositivas en PowerPoint basada en los informes financieros de rentabilidad comercial de empresas de este trimestre de la zona este de la hoja de Excel. Diseña las diapositivas para la junta mensual del Director Regional de Empresas. Incluye una agenda con secciones para: Evolución del Margen Neto, Volumen de Crédito Formalizado, Mora de Cartera y Captación de Depósitos Corporativos. Detalla recomendaciones visuales e indicaciones para el ponente de los desvíos comerciales detectados.",
    objetivo: "Diseñar storyboard y estructura para reporte ejecutivo trimestral en PowerPoint.",
    contexto: "Presentación comercial interna de resultados de zona de empresas de banca Tier 1.",
    fuente: "Informes financieros de rentabilidad comercial e históricos de comisiones de zona en Excel.",
    expectativas: "Presentación de 10 diapositivas estructuradas con secciones comerciales diferenciadas por producto financiero de empresas corporativo."
  },
  {
    num: 128,
    title: "Pitch Comercial para la Venta de Solución Host-to-Host (API Directa)",
    prompt: "Genera una propuesta de esquema estructural de 8 diapositivas en PowerPoint dirigida a [Holding de Supermercados Z] para la venta transaccional avanzada de nuestra API directa (Host-to-Host) de conciliación y carga automática de remesas. Define para cada diapositiva el título formal, los mensajes de ahorro de tiempos operativos y conciliación diaria en viñetas cortas, y las notas técnicas de soporte para los analistas de tesorería corporativa.",
    objetivo: "Diseñar storyboard y estructura para propuesta técnica de tesorería digital de PowerPoint.",
    contexto: "Venta de servicios transaccionales avanzados para grandes holdings comerciales de zona.",
    fuente: "Especificaciones técnicas de la API de tesorería del banco y notas de reuniones comerciales.",
    expectativas: "Storyboard de 8 diapositivas estructurado de tono tecnológico e innovador bancario de primer nivel."
  },
  {
    num: 129,
    title: "Diapositiva Resumen de Covenants Financieros y Riesgos del Deudor",
    prompt: "Crea una propuesta para una diapositiva resumen en PowerPoint que sintetice los covenants financieros y ratios de apalancamiento obligatorios aprobados para [Holding Constructor K]. Diseña un diseño visual en tres bloques verticales diferenciados por ratios: 1. Deuda Neta/EBITDA de control (<3.5x); 2. Ratio DSCR de amortizaciones (>1.2x); 3. Covenants de información y reporting trimestral. Incluye notas de orador de alertas de riesgos de default técnico.",
    objetivo: "Diseñar una diapositiva estructural de control de riesgos crediticios en PowerPoint.",
    contexto: "Presentación de expedientes de crédito a comités de aprobación del banco comercial Tier 1.",
    fuente: "Contrato de deudores e informes de riesgos de la empresa en SharePoint/Word.",
    expectativas: "Propuesta visual de un solo slide con estructura analítica rigurosa, notas del RM de riesgos financieros."
  },
  {
    num: 130,
    title: "Presentación para el Comité de Seguimiento ESG y Cartera Verde",
    prompt: "Genera una propuesta de esquema estructural de 6 diapositivas en PowerPoint sobre la evolución de la cartera verde y préstamos vinculados a sostenibilidad de la zona norte de este trimestre de la hoja de Excel. Incluye diapositivas de: Objetivos ESG de Cartera de Empresas, Volumen de Préstamos Verdes Formalizados, Cumplimiento de Ratios de Emisiones de Deudores y Conclusiones del Comité. Define las notas de orador del ponente del área comercial.",
    objetivo: "Diseñar storyboard de cartera verde y productos de sostenibilidad ESG de PowerPoint.",
    contexto: "Reporte analítico de rentabilidad comercial y colocación de productos ESG para la dirección regional.",
    fuente: "Datos macroeconómicos e informes financieros corporativos ESG de la cartera en Excel.",
    expectativas: "Storyboard de 6 diapositivas estructurado con secciones comerciales diferenciadas de tono institucional bancario."
  },
  {
    num: 131,
    title: "Pitch de Venta Cruzada de Derivados (Interest Rate Swap IRS)",
    prompt: "Genera una propuesta de esquema estructural de 7 diapositivas en PowerPoint dirigida a [Grupo Alimentario del Sur] para la venta cruzada de nuestra cobertura de tipo de interés Swap (IRS) para su préstamo corporativo de 12M€. Define para cada diapositiva el título formal, los mensajes de mitigación de fluctuaciones de tipos Euribor en viñetas cortas, y las notas técnicas de riesgos financieros para el RM de zona.",
    objetivo: "Diseñar storyboard de cobertura de tipos IRS en PowerPoint.",
    contexto: "Venta y optimización tarifaria de derivados de mercado de capitales corporativos.",
    fuente: "Contratos de préstamo y cotizaciones actuales de la mesa de IRS del banco.",
    expectativas: "Storyboard de 7 diapositivas estructurado con un diseño visual de tono financiero riguroso."
  },
  {
    num: 132,
    title: "Diapositiva Resumen de Garantías Pignoraticias e Hipotecarias Promotoras",
    prompt: "Diseña una propuesta para una diapositiva resumen en PowerPoint que sintetice las naves industriales y terrenos pignorados como colaterales para la promoción logística de [Grupo Inmobiliario H]. Define un diseño visual en dos bloques horizontales que comparen las valoraciones de tasación oficial independiente vigentes, ratios LTV calculados, y plazos de actualización requeridos por control operativo.",
    objetivo: "Diseñar diapositiva de colaterales y garantías hipotecarias corporativas en PowerPoint.",
    contexto: "Análisis y control de colaterales de crédito de comités de zona.",
    fuente: "Tasaciones e informes de valoración de colaterales de SharePoint/Word.",
    expectativas: "Propuesta visual de un solo slide con estructura analítica rigurosa, de tono y formato formal de riesgos."
  },
  {
    num: 133,
    title: "Presentación de Resultados de Captación de Depósitos Corporativos de Zona",
    prompt: "Estructura una presentación de 8 diapositivas en PowerPoint sobre los resultados de captación de depósitos operativos especiales y Cash Pooling del segmento de empresas de la delegación sur de este mes de la hoja de Excel. Incluye diapositivas de: Ingresos netos, Saldos agregados, Oficinas líderes comerciales y Previsión de ingresos por comisiones bancarias del banco Tier 1 de zona.",
    objetivo: "Diseñar storyboard de captación de depósitos de empresas en PowerPoint.",
    contexto: "Junta mensual del Director Regional de Banca Comercial.",
    fuente: "Informes mensuales de tesorería y depósitos de la delegación en Excel.",
    expectativas: "Storyboard de 8 diapositivas estructurado con secciones diferenciadas por oficina comercial corporativa."
  },
  {
    num: 134,
    title: "Storyboard de Presentación de Informe Anual de Compliance e ID de Socios KYC",
    prompt: "Genera una propuesta de esquema estructural de 10 diapositivas en PowerPoint basada en las auditorías de vigencia societaria e ID de socios corporativos del Holding de la zona este de SharePoint. Define diapositivas para: Estado de Consecución KYC de zona, Alertas de poderes caducados detectadas, Medidas de saneamiento aplicadas y Directrices de Prevención de Blanqueo de Capitales.",
    objetivo: "Diseñar storyboard de cumplimiento normativo e ID de representantes en PowerPoint.",
    contexto: "Junta trimestral de control de cumplimiento normativo e ID del deudor del banco Tier 1.",
    fuente: "Informes de auditorías societarias KYC de SharePoint/Word.",
    expectativas: "Storyboard de 10 diapositivas estructurado de tono jurídicamente riguroso y formal bancario."
  },
  {
    num: 135,
    title: "Diapositiva Resumen de Tramos de Coaseguro de Financiación Sindicada",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que resuma de forma comparativa los tramos y sub-líneas financieras participantes de los co-líderes bancarios en la sindicación del proyecto del parque eólico. Estructura un diseño en forma de tabla side-by-side de 4 columnas que compare el volumen de deudas agregadas comprometidas en millones, comisiones netas pactadas, y plazos de aseguramiento.",
    objetivo: "Diseñar una diapositiva comparativa interbancaria en PowerPoint.",
    contexto: "Reuniones de control interbancario de estructuración de deuda.",
    fuente: "Borrador de hoja de condiciones de la sindicación de SharePoint/Word.",
    expectativas: "Propuesta visual de un solo slide con formato técnico riguroso de deudores."
  },
  {
    num: 136,
    title: "Storyboard de Propuesta de Financiación de Comercio de Automóviles (Confirming)",
    prompt: "Genera una propuesta de esquema estructural de 9 diapositivas en PowerPoint de la propuesta de confirming nacional de proveedores y factoring de importación de automoción de SharePoint. Define diapositivas para: Ventajas logísticas del confirming para el importador ancla, Tarifas de descuento de facturas de proveedores locales y extranjeros, Plazos de liquidación de remesas y notas de orador de ventas.",
    objetivo: "Diseñar storyboard de confirming e importación automotriz en PowerPoint.",
    contexto: "Venta y colocación transaccional comercial de circulante en zona.",
    fuente: "Folletos técnicos y propuestas de Confirming e importación.",
    expectativas: "Storyboard de 9 diapositivas estructurado de tono corporativo refinado bancario."
  },
  {
    num: 137,
    title: "Diapositiva Resumen de Auditorías de Riesgos de Concentración Sectorial",
    prompt: "Crea una propuesta para una diapositiva de PowerPoint que resuma los ratios e índices de Gini calculados para el volumen de deudas agregadas sectoriales de constructoras de la hoja de Excel. Diseña un diseño visual que compare el porcentaje de riesgo crediticio concentrado en naves industriales en Q1 frente a Q2 de zona.",
    objetivo: "Diseñar diapositiva de riesgos de concentración inmobiliaria en PowerPoint.",
    contexto: "Comités de seguimiento de riesgos sectoriales del deudor de banca comercial Tier 1 de zona.",
    fuente: "Cálculos de Gini e informes de concentración de la cartera de empresas en Excel.",
    expectativas: "Propuesta visual de un solo slide con estructura analítica rigurosa, de tono formal de riesgos."
  },
  {
    num: 138,
    title: "Storyboard de Pitch de Captación de Financiación Apalancada (LBO Loan 20M€)",
    prompt: "Genera una propuesta de esquema estructural de 11 diapositivas en PowerPoint de la propuesta de estructuración de deuda corporativa para la adquisición apalancada (LBO) del holding de transportes en SharePoint/Word. Define para cada diapositiva el título formal, los mensajes de flujos de caja proyectados e intereses calculados, ratios DSCR simulados y análisis de covenants.",
    objetivo: "Diseñar storyboard y estructura para pitch comercial corporativo en PowerPoint.",
    contexto: "Negociaciones bilaterales privadas de banca de inversión de fusiones e insolvencias corporativas de zona.",
    fuente: "Balances consolidados e informes de viabilidad de LBO.",
    expectativas: "Storyboard de 11 diapositivas de tono corporativo refinado, con notas de orador detalladas de riesgos."
  },
  {
    num: 139,
    title: "Diapositiva Resumen de Previsiones de Pérdida Esperada por Insolvencias",
    prompt: "Crea una propuesta para una diapositiva de PowerPoint que sintetice las estimaciones de Pérdida Esperada (Expected Loss) y cobertura de provisiones calculadas con Python para deudores inmobiliarios de Excel de la hoja de riesgos de zona. Estructura un diseño en forma de gráfico de barras horizontales de pérdidas acumuladas.",
    objetivo: "Diseñar diapositiva de previsiones de insolvencia y provisiones de Excel en PowerPoint.",
    contexto: "Planificación y control de riesgos de dotación económica regulatoria del banco comercial Tier 1 de zona.",
    fuente: "Estimaciones de Pérdida Esperada e informes de insolvencias en Excel.",
    expectativas: "Propuesta visual de un solo slide con formato técnico riguroso de riesgos de deudores."
  },
  {
    num: 140,
    title: "Storyboard de Presentación de Programa de Factoring de Exportación de Frutas",
    prompt: "Genera una propuesta de esquema estructural de 8 diapositivas en PowerPoint de la propuesta comercial de factoring internacional de la exportadora agroalimentaria de Word. Define diapositivas para: Ventajas de cobro anticipado de remesas de comercio exterior, Coberturas de riesgos de impago de clientes de importación extranjeros y comisiones.",
    objetivo: "Diseñar storyboard de factoring internacional y comercio exterior en PowerPoint.",
    contexto: "Captación comercial sectorial del sector primario de la delegación sur.",
    fuente: "Propuesta comercial e informes de comisiones de comercio exterior de la cartera.",
    expectativas: "Storyboard de 8 diapositivas de tono comercial claro, de formato formal de banca de empresas."
  },
  {
    num: 141,
    title: "Diapositiva Resumen de Criterios de Aprobación Excepcional de Riesgo",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que resuma las directrices y criterios de aprobación excepcional de propuestas de crédito que superen el ratio estándar de endeudamiento de 4.0x Deuda Neta/EBITDA de la transcripción de Teams. Estructura un diseño visual en tres bloques verticales numerados claros para la red comercial.",
    objetivo: "Diseñar diapositiva de directrices de autorización excepcional en PowerPoint.",
    contexto: "Adaptación de políticas de concesión a las condiciones de mercado de banca de empresas de zona.",
    fuente: "Transcripción de la reunión de Dirección de Riesgos en Teams.",
    expectativas: "Propuesta de slide única estructurada con formato riguroso de riesgos, de tono instructivo de red."
  },
  {
    num: 142,
    title: "Storyboard de Propuesta de Cuenta de Depósitos en Dólares (FX Deposits)",
    prompt: "Genera una propuesta de esquema estructural de 6 diapositivas en PowerPoint de la propuesta comercial de depósitos en divisas de la exportadora hortofrutícola de Word. Define diapositivas para: Rentabilidad de tipos de interés preferenciales del banco Tier 1 para USD, GBP y CHF, Plazos flexibles de colocación, Coberturas de fluctuación de tipos de cambio de divisas y comisiones transaccionales.",
    objetivo: "Diseñar storyboard de depósitos en divisas extranjeras corporativos de PowerPoint.",
    contexto: "Captación y retención de depósitos operativos del segmento de empresas de zona.",
    fuente: "Propuesta comercial e informes de divisas de la cartera.",
    expectativas: "Storyboard de 6 diapositivas estructurado con diseño de formato formal de banca corporativa."
  },
  {
    num: 143,
    title: "Diapositiva Resumen de Casos de Éxito de M&A Inmobiliario de la Delegación",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que resuma los casos de éxito de fusiones e inversiones de M&A corporativo inmobiliarias de la zona norte de este año en SharePoint. Estructura un diseño en forma de mapa de transacciones que compare volúmenes y comisiones de estructuración devengadas.",
    objetivo: "Diseñar diapositiva de transacciones de M&A corporativas de SharePoint en PowerPoint.",
    contexto: "Presentación de capacidades del equipo de M&A Advisory para la captación de grandes clientes.",
    fuente: "biblioteca documental de SharePoint de transacciones M&A.",
    expectativas: "Propuesta visual de un solo slide de alto impacto visual y tono comercial de banca de inversión de zona."
  },
  {
    num: 144,
    title: "Storyboard de Pitch de Soluciones de Confirming para el Sector de Distribución",
    prompt: "Genera una propuesta de esquema estructural de 10 diapositivas en PowerPoint de la propuesta de Confirming de proveedores y factoring de la distribuidora automotriz de Word. Define diapositivas para: Estructura del programa Supply Chain Finance patrocinado por el cliente ancla, Comisiones transaccionales y de gestión de remesas, Canales digitales de alta de proveedores locales.",
    objetivo: "Diseñar storyboard de confirming nacional y Supply Chain Finance en PowerPoint.",
    contexto: "Captación de cuentas y colocación transaccional de circulante de empresas de la zona.",
    fuente: "Propuesta comercial y folleto técnico de factoring de proveedores.",
    expectativas: "Storyboard de 10 diapositivas de tono corporativo de alto nivel de banca corporativa transaccional."
  },
  {
    num: 145,
    title: "Diapositiva Resumen de Ratios LTV de Préstamos Inmobiliarios de Zona",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que resuma los ratios LTV calculados en Excel para deudores hipotecarios promotores de la zona inmobiliaria este de risks de naves de zona. Estructura un diseño visual en dos bloques horizontales que resalten operaciones con LTV superiores al límite del 70%.",
    objetivo: "Diseñar diapositiva de control de garantías de LTV en PowerPoint.",
    contexto: "Comités de seguimiento de colaterales de crédito de zona.",
    fuente: "Cálculos de LTV e informes de tasación de activos promotores en Excel.",
    expectativas: "Propuesta visual de un solo slide con alertas de excesos técnicos de riesgos de deudores."
  },
  {
    num: 146,
    title: "Storyboard de Presentación de Informe de Impacto de Cierre de Cuentas Inactivas",
    prompt: "Genera una propuesta de esquema estructural de 8 diapositivas en PowerPoint del informe de cuentas inactivas de la red de oficinas de la delegación de Teams de este mes. Define diapositivas para: Volumen de cuentas inactivas propuestas, Cruce de préstamos activos vigentes identificados, Impacto comercial neto del saneamiento corporativo e indicaciones de red.",
    objetivo: "Diseñar storyboard de higiene operativa de cuentas corporativas en PowerPoint.",
    contexto: "Control y saneamiento de cartera corporativa de zona de empresas.",
    fuente: "Informe de cuentas inactivas y pólizas formalizadas en Teams.",
    expectativas: "Storyboard de 8 diapositivas estructurado con formato de control y cumplimiento normativo."
  },
  {
    num: 147,
    title: "Diapositiva Resumen de Criterios de Pre-evaluación Crediticia Automatizada",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que sintetice el checklist y criterios de pre-evaluación crediticia de la sesión técnica formativa de Teams. Estructura un diseño visual en forma de diagrama de flujo de 4 pasos interactivo que guíe a los gestores en la documentación obligatoria antes de someter propuestas comerciales.",
    objetivo: "Diseñar diapositiva instructiva de pre-evaluación de riesgos en PowerPoint.",
    contexto: "Homogeneización de procesos y optimización de aprobación de operaciones de crédito.",
    fuente: "Transcripción de la sesión formativa de Teams.",
    expectativas: "Propuesta de slide única estructurada con formato instructivo claro para oficinas corporativas."
  },
  {
    num: 148,
    title: "Storyboard de Propuesta de Cuenta de Depósitos de Fideicomisos Trust",
    prompt: "Genera una propuesta de esquema estructural de 7 diapositivas en PowerPoint de la propuesta comercial de depósitos para fideicomisos mercantiles de SharePoint. Define diapositivas para: Criterios KYC de Trust aprobados por riesgos, Jurisdicciones y apoderados vigentes, Tipos de interés aplicables para colocación de excedentes transaccionales y comisiones de cambio.",
    objetivo: "Diseñar storyboard de depósitos para fideicomisos corporativos en PowerPoint.",
    contexto: "Captación y retención de depósitos operativos internacionales de banca institucional.",
    fuente: "Contratos de fideicomisos e informes de cumplimiento societario de SharePoint.",
    expectativas: "Storyboard de 7 diapositivas de tono corporativo riguroso, de formato formal de cumplimiento normativo."
  },
  {
    num: 149,
    title: "Diapositiva Resumen de Litigios Judiciales y Autos de Embargo",
    prompt: "Diseña una propuesta para una diapositiva de PowerPoint que resuma los incidentes legales y autos de embargos judiciales activos en SharePoint contra deudores con deudas superiores a 5M€ de risks de zona. Estructura un diseño visual en tres bloques horizontales que comparen clientes deudores de alto riesgo crediticio.",
    objetivo: "Diseñar diapositiva de alertas de riesgos legales en PowerPoint.",
    contexto: "Defensa ante insolvencias y comités de seguimiento de riesgos del deudor de zona de riesgos de deudores.",
    fuente: "Base de datos de litigios e incidentes legales de SharePoint.",
    expectativas: "Alerta de slide única con formato riguroso de riesgos, de tono preventivo de risks."
  },
  {
    num: 150,
    title: "Storyboard de Presentación de Préstamo Verde Vinculado a Sostenibilidad Química",
    prompt: "Genera una propuesta de esquema estructural de 9 diapositivas en PowerPoint de la propuesta comercial de ESG Loan de la multinacional química del Sur de Word. Define diapositivas para: Bonificaciones de tipos de interés vinculadas a objetivos de reducción de residuos y emisiones de CO2 Scope 1 de la fábrica, Calendarios de amortización de préstamos y comisiones.",
    objetivo: "Diseñar storyboard de ESG Loan y financiación de sostenibilidad en PowerPoint.",
    contexto: "Colocación de productos crediticios de alto valor de banca corporativa e institucional de zona.",
    fuente: "Propuesta comercial e informes ESG de la cartera.",
    expectativas: "Storyboard de 9 diapositivas estructurado con un diseño visual de tono impecable bancario."
  }
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPromptCard(p, appBadge, appClass) {
  return `
    <div class="prompt-card" id="p${p.num}">
      <div class="prompt-card-header">
        <h4 class="prompt-card-title">${p.num}. ${escapeHtml(p.title)}</h4>
        <span class="prompt-badge ${appClass}">${appBadge}</span>
      </div>
      <div class="prompt-box" id="prompt-text-${p.num}">${escapeHtml(p.prompt)}</div>
      
      <div class="ocfe-breakdown">
        <div class="ocfe-item"><span class="ocfe-tag goal">Objetivo</span> <span class="ocfe-desc">${escapeHtml(p.objetivo)}</span></div>
        <div class="ocfe-item"><span class="ocfe-tag ctx">Contexto</span> <span class="ocfe-desc">${escapeHtml(p.contexto)}</span></div>
        <div class="ocfe-item"><span class="ocfe-tag src">Fuente</span> <span class="ocfe-desc">${escapeHtml(p.fuente)}</span></div>
        <div class="ocfe-item"><span class="ocfe-tag exp">Expectativas</span> <span class="ocfe-desc">${escapeHtml(p.expectativas)}</span></div>
      </div>
      
      <div class="prompt-footer" style="margin-top: 0.75rem;">
        <button class="tool-btn copy-prompt-btn" onclick="navigator.clipboard.writeText(document.getElementById('prompt-text-${p.num}').innerText); this.innerText='¡Copiado! ✓'; setTimeout(()=>this.innerText='Copiar Prompt 📋', 2000);">Copiar Prompt 📋</button>
      </div>
    </div>
  `;
}

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Guía Práctica de Ingeniería de Prompts Avanzada para Banca Comercial (Tier 1). Manual de Adopción, Extensibilidad y 150 Casos de Uso con Microsoft 365 Copilot (Outlook, Teams, SharePoint, Word, Excel con Python, PowerPoint), Copilot Studio y Copilot Notebooks.">
  <meta name="keywords" content="Microsoft 365 Copilot, Banca Comercial, Tier 1, Prompt Engineering, Framework OCFE, Copilot Studio, Copilot Notebooks, Outlook, Teams, SharePoint, Word, Excel Python, PowerPoint, Riesgo de Crédito, KYC, AML, Cash Management, Sindicaciones">
  <title>Cuaderno 06 — Guía Práctica de M365 Copilot para Banca Comercial (Tier 1) | Curso IA Commercial</title>
  <link rel="manifest" href="../manifest.json">
  <link rel="stylesheet" href="../css/styles.css">
  <style>
    .ocfe-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 0.6rem 0.75rem;
      font-size: 0.78rem;
    }
    .ocfe-item {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      line-height: 1.4;
    }
    .ocfe-tag {
      font-weight: 700;
      font-size: 0.68rem;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 4px;
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }
    .ocfe-tag.goal { background: rgba(139, 92, 246, 0.18); color: var(--accent-violet); }
    .ocfe-tag.ctx  { background: rgba(59, 130, 246, 0.18); color: var(--accent-blue); }
    .ocfe-tag.src  { background: rgba(245, 158, 11, 0.18); color: var(--accent-amber); }
    .ocfe-tag.exp  { background: rgba(16, 185, 129, 0.18); color: var(--accent-emerald); }
    .ocfe-desc { color: var(--text-secondary); }
    
    .agent-system-prompt {
      background: var(--bg-primary);
      border: 1px solid var(--border-medium);
      border-left: 4px solid var(--accent-violet);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--text-primary);
      white-space: pre-wrap;
      line-height: 1.55;
      max-height: 450px;
      overflow-y: auto;
      margin: 1rem 0;
    }
    
    .app-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .app-badge-pill {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: var(--radius-full);
    }
    .app-badge-pill.outlook { background: rgba(0, 120, 212, 0.15); color: #0078d4; border: 1px solid rgba(0,120,212,0.3); }
    .app-badge-pill.teams { background: rgba(98, 100, 167, 0.15); color: #6264a7; border: 1px solid rgba(98,100,167,0.3); }
    .app-badge-pill.sharepoint { background: rgba(0, 130, 135, 0.15); color: #008287; border: 1px solid rgba(0,130,135,0.3); }
    .app-badge-pill.word { background: rgba(43, 87, 154, 0.15); color: #2b579a; border: 1px solid rgba(43,87,154,0.3); }
    .app-badge-pill.excel { background: rgba(33, 115, 70, 0.15); color: #217346; border: 1px solid rgba(33,115,70,0.3); }
    .app-badge-pill.powerpoint { background: rgba(209, 68, 36, 0.15); color: #d14424; border: 1px solid rgba(209,68,36,0.3); }
    .app-badge-pill.studio { background: rgba(139, 92, 246, 0.15); color: var(--accent-violet); border: 1px solid rgba(139,92,246,0.3); }
    .app-badge-pill.notebooks { background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border: 1px solid rgba(6,182,212,0.3); }
  </style>
</head>
<body>

  <!-- Top Navigation -->
  <nav class="top-nav">
    <button class="menu-toggle" aria-label="Abrir menú">☰</button>
    <a href="../index.html" class="nav-brand">
      <div class="nav-brand-icon">IA</div>
      <div class="nav-brand-text"><span>Curso IA</span> Commercial</div>
    </a>
    <div class="nav-links">
      <a href="../index.html" class="nav-link">Cuadernos</a>
      <a href="../muro.html" class="nav-link">Lienzo</a>
      <a href="../recursos.html" class="nav-link">Recursos</a>
      <a href="../examen.html" class="nav-link">Examen Oficial</a>
      <a href="#" class="nav-link">Acerca de</a>
    </div>
  </nav>

  <!-- Reading Progress -->
  <div class="progress-bar">
    <div class="progress-bar-fill"></div>
  </div>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-section">
      <div class="sidebar-section-title">Estructura del Cuaderno</div>
      <a href="#intro" class="sidebar-link active">
        <span class="sidebar-link-number">00</span>
        Introducción & Marco OCFE
      </a>
      <a href="#capitulo-1" class="sidebar-link">
        <span class="sidebar-link-number">01</span>
        Capítulo 1: Framework OCFE
      </a>
      <a href="#capitulo-2" class="sidebar-link">
        <span class="sidebar-link-number">02</span>
        Capítulo 2: Outlook (25 Prompts)
      </a>
      <a href="#capitulo-3" class="sidebar-link">
        <span class="sidebar-link-number">03</span>
        Capítulo 3: Teams (25 Prompts)
      </a>
      <a href="#capitulo-4" class="sidebar-link">
        <span class="sidebar-link-number">04</span>
        Capítulo 4: SharePoint (25 Prompts)
      </a>
      <a href="#capitulo-5" class="sidebar-link">
        <span class="sidebar-link-number">05</span>
        Capítulo 5: Word (25 Prompts)
      </a>
      <a href="#capitulo-6" class="sidebar-link">
        <span class="sidebar-link-number">06</span>
        Capítulo 6: Excel con Python (25 Prompts)
      </a>
      <a href="#capitulo-7" class="sidebar-link">
        <span class="sidebar-link-number">07</span>
        Capítulo 7: PowerPoint (25 Prompts)
      </a>
      <a href="#capitulo-8" class="sidebar-link">
        <span class="sidebar-link-number">08</span>
        Capítulo 8: Extensibilidad & Copilot Studio
      </a>
      <a href="#capitulo-9" class="sidebar-link">
        <span class="sidebar-link-number">09</span>
        Capítulo 9: Copilot Notebooks
      </a>
    </div>
  </aside>
  <div class="sidebar-overlay"></div>

  <!-- Main Content -->
  <main class="main-content">
    <div class="content-wrapper">

      <!-- Page Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a href="../index.html">Cuadernos</a>
          <span class="separator">/</span>
          <span>Cuaderno 06</span>
        </div>

        <div class="page-meta">
          <span class="meta-badge">CUADERNO 06</span>
          <span class="meta-badge blue">Microsoft 365 Copilot</span>
          <span class="meta-badge green">Banca Comercial Tier 1</span>
          <span class="meta-info">Manual Completo + 150 Prompts + Agentes Studio</span>
        </div>

        <h1 class="page-title">Guía Práctica de Ingeniería de Prompts Avanzada para Banca Comercial (Tier 1)</h1>
        <p class="page-subtitle">Manual de Adopción, Extensibilidad y Casos de Uso con Microsoft 365 Copilot, Copilot Studio y Copilot Notebooks.</p>

        <!-- Ficha de Objetivos Pedagógicos (Taxonomía de Bloom) -->
        <div class="bloom-card">
          <div class="bloom-header">
            <h3 class="bloom-title">🎯 Objetivos de Aprendizaje & Competencias Clave</h3>
            <div class="bloom-meta-pills">
              <span class="bloom-pill time">⏱️ 45 min lectura · 90 min práctica interactiva</span>
              <span class="bloom-pill diff-advanced">Nivel: Profesional / Tier 1</span>
            </div>
          </div>
          <div class="bloom-grid">
            <div class="bloom-col">
              <div class="bloom-col-header understand">🧠 1. Comprender</div>
              <ul>
                <li>Arquitectura de anclaje (grounding) estricto de Microsoft 365 Copilot en el Semantic Index y Microsoft Graph.</li>
                <li>Estructura del <strong>Framework OCFE</strong> (Objetivo, Contexto, Fuente, Expectativas) para eliminar alucinaciones estadísticas.</li>
                <li>Límites operativos y sandbox protegido de Copilot Notebooks (hasta 300 referencias acotadas).</li>
              </ul>
            </div>
            <div class="bloom-col">
              <div class="bloom-col-header analyze">⚖️ 2. Analizar</div>
              <ul>
                <li>Auditoría de estados financieros, covenants (DSCR, LTV, Deuda Neta/EBITDA) y mitigación de riesgos de default.</li>
                <li>Evaluación de expedientes regulatorios KYC/AML, fideicomisos Trust y titularidad real (UBO).</li>
                <li>Modelado financiero con Python integrado en Excel (simulaciones estocásticas Monte Carlo, RAROC, NIM y Gini).</li>
              </ul>
            </div>
            <div class="bloom-col">
              <div class="bloom-col-header apply">🚀 3. Aplicar</div>
              <ul>
                <li>150 prompts ejecutables en Outlook, Teams, SharePoint, Word, Excel y PowerPoint.</li>
                <li>Configuración de 5 Agentes declarativos especializados con System Instructions en Copilot Studio.</li>
                <li>Despliegue de 5 Cuadernos de trabajo (Sandboxes) para Comités de Riesgos, Sindicaciones y Operaciones.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 00: INTRODUCCIÓN -->
      <section id="intro" class="transcript-section">
        <div class="section-header">
          <span class="section-number">00</span>
          <h2 class="section-title">Introducción: El Valor Estratégico de Copilot en Banca de Empresas (Tier 1)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p class="editorial-lead">
            En la banca corporativa y comercial de primer nivel (Tier 1), la gestión de la información, el rigor en el análisis de riesgos y la velocidad de respuesta comercial son factores diferenciales.
          </p>
          <p>
            Los equipos de Banca de Empresas (<em>Commercial & Corporate Banking</em>) se enfrentan diariamente a una enorme carga cognitiva: desde el análisis de complejos estados financieros y la estructuración de créditos sindicados, hasta la auditoría de cumplimiento normativo (KYC/AML) y la preparación de propuestas comerciales multi-producto.
          </p>
          <p>
            Esta guía metodológica está diseñada como un recurso de autoaprendizaje y transferencia de conocimiento. Su objetivo es capacitar a los profesionales del área comercial y de riesgos en el diseño de instrucciones (prompts) avanzadas, estructuradas bajo el <strong>framework OCFE (Objetivo, Contexto, Fuente y Expectativas)</strong>, minimizando las alucinaciones del modelo y anclando (<em>grounding</em>) las respuestas estrictamente en la información fidedigna de la entidad.
          </p>

          <div class="concept-card highlight">
            <div class="concept-card-label">🔑 Principio de Anclaje Restrictivo (Grounding)</div>
            <p>
              Un modelo de lenguaje generalista tiende a rellenar los vacíos de información con promedios probabilísticos de su entrenamiento. En banca Tier 1, donde los márgenes de error financiero y regulatorio son cero, <strong>el anclaje explícito a fuentes internas gobernadas (SharePoint, Graph, Dataverse) es un mandato obligatorio</strong>.
            </p>
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 1: EL FRAMEWORK OCFE -->
      <section id="capitulo-1" class="transcript-section">
        <div class="section-header">
          <span class="section-number">01</span>
          <h2 class="section-title">Capítulo 1: El Framework de Ingeniería de Prompts Corporativos (OCFE)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p>
            Para maximizar el retorno de inversión en Microsoft 365 Copilot y evitar respuestas genéricas u obsoletas (que ocurren porque la IA rellena los vacíos con promedios estadísticos de su entrenamiento general), cada interacción debe estructurarse utilizando cuatro componentes obligatorios:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-left: 4px solid var(--accent-violet); padding: 1rem; border-radius: var(--radius-md);">
              <strong style="color: var(--accent-violet); font-size: 1rem;">1. Objetivo (Goal)</strong>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">
                La acción principal e inequívoca utilizando verbos imperativos en infinitivo o imperativo (ej. <em>analizar, consolidar, redactar, auditar, proyectar</em>).
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-left: 4px solid var(--accent-blue); padding: 1rem; border-radius: var(--radius-md);">
              <strong style="color: var(--accent-blue); font-size: 1rem;">2. Contexto (Context)</strong>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">
                El entorno de negocio, el rol asumido (ej. <em>Analista Senior de Riesgos, Relationship Manager</em>), la audiencia destino y el tono profesional requerido.
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-left: 4px solid var(--accent-amber); padding: 1rem; border-radius: var(--radius-md);">
              <strong style="color: var(--accent-amber); font-size: 1rem;">3. Fuente (Source)</strong>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">
                Los límites de anclaje (<em>grounding</em>) exactos: documentos específicos de SharePoint, transcripciones de Teams, hojas activas de Excel o bandejas de Outlook.
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-left: 4px solid var(--accent-emerald); padding: 1rem; border-radius: var(--radius-md);">
              <strong style="color: var(--accent-emerald); font-size: 1rem;">4. Expectativas (Expectations)</strong>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">
                La estructura milimétrica del resultado: formato (tabla, memo, viñetas), límites de extensión (ej. <em>máximo 300 palabras</em>), directrices de exclusión y qué evitar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 2: OUTLOOK (25 PROMPTS) -->
      <section id="capitulo-2" class="transcript-section">
        <div class="section-header">
          <span class="section-number">02</span>
          <h2 class="section-title">Capítulo 2: Catálogo de Prompts Avanzados para Microsoft Outlook (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Casos de uso del área comercial de banca corporativa aplicados a la gestión de correos, triage, minutas y solicitudes operativas bajo el framework OCFE.
            </p>
            <span class="app-badge-pill outlook">📧 Microsoft Outlook · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataOutlook.map(p => renderPromptCard(p, "Outlook", "ideami")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 3: TEAMS (25 PROMPTS) -->
      <section id="capitulo-3" class="transcript-section">
        <div class="section-header">
          <span class="section-number">03</span>
          <h2 class="section-title">Capítulo 3: Catálogo de Prompts Avanzados para Microsoft Teams (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Casos de uso para Teams enfocados en la coordinación, actas de comités de crédito, minería de transcripciones y seguimiento de compromisos comerciales.
            </p>
            <span class="app-badge-pill teams">💬 Microsoft Teams · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataTeams.map(p => renderPromptCard(p, "Teams", "cot")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 4: SHAREPOINT (25 PROMPTS) -->
      <section id="capitulo-4" class="transcript-section">
        <div class="section-header">
          <span class="section-number">04</span>
          <h2 class="section-title">Capítulo 4: Catálogo de Prompts Avanzados para Microsoft SharePoint (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Prompts avanzados enfocados en la minería de repositorios documentales corporativos, expedientes de crédito, contratos hipotecarios y políticas sectoriales ESG.
            </p>
            <span class="app-badge-pill sharepoint">📁 Microsoft SharePoint · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataSharePoint.map(p => renderPromptCard(p, "SharePoint", "schema")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 5: WORD (25 PROMPTS) -->
      <section id="capitulo-5" class="transcript-section">
        <div class="section-header">
          <span class="section-number">05</span>
          <h2 class="section-title">Capítulo 5: Catálogo de Prompts Avanzados para Microsoft Word (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Prompts avanzados enfocados en la redacción, re-escritura, propuestas comerciales multiproducto, cartas de intenciones (LOI) e informes técnicos de riesgos.
            </p>
            <span class="app-badge-pill word">📄 Microsoft Word · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataWord.map(p => renderPromptCard(p, "Word", "fewshot")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 6: EXCEL (25 PROMPTS) -->
      <section id="capitulo-6" class="transcript-section">
        <div class="section-header">
          <span class="section-number">06</span>
          <h2 class="section-title">Capítulo 6: Catálogo de Prompts Avanzados para Microsoft Excel con Python (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Prompts avanzados de computación y modelado financiero: simulaciones Monte Carlo, análisis de covarianza, RAROC, regresión lineal y proyecciones DSCR con Python en Excel.
            </p>
            <span class="app-badge-pill excel">📊 Microsoft Excel · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataExcel.map(p => renderPromptCard(p, "Excel", "schema")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 7: POWERPOINT (25 PROMPTS) -->
      <section id="capitulo-7" class="transcript-section">
        <div class="section-header">
          <span class="section-number">07</span>
          <h2 class="section-title">Capítulo 7: Catálogo de Prompts Avanzados para Microsoft PowerPoint (25 Ejemplos)</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <div class="app-section-header">
            <p style="margin: 0; color: var(--text-secondary);">
              Prompts enfocados en la estructuración de narrativas visuales, storyboards para pitches comerciales corporativos, resúmenes de comités y presentaciones para dirección.
            </p>
            <span class="app-badge-pill powerpoint">📽️ Microsoft PowerPoint · 25 Prompts</span>
          </div>

          <div class="prompt-matrix-grid">
            ${dataPowerPoint.map(p => renderPromptCard(p, "PowerPoint", "react")).join('\n')}
          </div>
        </div>
      </section>

      <!-- CAPÍTULO 8: COPILOT STUDIO & EXTENSIBILIDAD -->
      <section id="capitulo-8" class="transcript-section">
        <div class="section-header">
          <span class="section-number">08</span>
          <h2 class="section-title">Capítulo 8: Guía de Extensibilidad: Creación de Agentes y Modelado de Instrucciones en Copilot Studio</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p>
            Cuando los flujos de trabajo de una entidad financiera de primer nivel (Tier 1) exceden las capacidades de recuperación de información provistas por el orquestador nativo de Microsoft 365 Copilot, es necesario implementar estrategias de extensibilidad de la plataforma. El desarrollo de Agentes (tanto declarativos como de motor personalizado o Custom Engine Agents) permite consolidar conocimiento de nicho, automatizar flujos complejos de Power Automate e integrarse con bases de datos en Dataverse bajo un entorno gobernado y seguro.
          </p>

          <h3 style="color: var(--accent-violet); margin-top: 2rem;">1. Canales y Herramientas de Creación de Agentes</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin: 1rem 0;">
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="color: var(--accent-violet); margin-top: 0;">Agent Builder en M365 Copilot (No-Code)</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Diseñado para usuarios de negocio y gestores comerciales que necesitan un asistente ligero e instantáneo. Permite definir instrucciones conversacionales, anclar conocimiento a un sitio de SharePoint o carpetas de OneDrive, y habilitar el intérprete de código por defecto.
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="color: var(--accent-blue); margin-top: 0;">Copilot Studio (Low-Code)</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                El entorno corporativo principal para el desarrollo departamental. Permite a los analistas de negocio modelar la lógica conversacional mediante un canvas visual de arrastrar y soltar, integrar conectores de Power Platform, utilizar variables de contexto del usuario y gestionar el ciclo de vida del desarrollo (ALM).
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="color: var(--accent-emerald); margin-top: 0;">SharePoint Integrated Agents (No-Code)</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                Permite a los propietarios y editores de sitios crear agentes integrados de forma nativa que limitan sus búsquedas y respuestas estrictamente a la documentación, metadatos y archivos almacenados en bibliotecas de SharePoint específicas.
              </p>
            </div>
            <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 1.25rem; border-radius: var(--radius-md);">
              <h4 style="color: var(--accent-amber); margin-top: 0;">M365 Agents Toolkit con VS Code (Pro-Code)</h4>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                El entorno preferido por los desarrolladores del banco para crear tanto agentes declarativos altamente personalizados (manifiestos JSON) como Custom Engine Agents avanzados con Semantic Kernel o LangChain, e interfaces ricas con Adaptive Cards.
              </p>
            </div>
          </div>

          <h3 style="color: var(--accent-violet); margin-top: 2.5rem;">2. Modelado de Instrucciones Conversacionales para Banca Comercial (5 System Prompts de Producción)</h3>
          <p>
            Las instrucciones del sistema de un agente declarativo (su metatranscripción de comportamiento o <em>System Prompt</em>) son el pilar que define su rigurosidad, límites de datos y capacidad de respuesta. A continuación, se definen las directrices de configuración completas para cinco agentes bancarios especializados listos para importarse en Copilot Studio:
          </p>

          <!-- Agente A -->
          <div style="margin: 2rem 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h4 style="color: var(--text-primary); font-size: 1.15rem; margin: 0;">🤖 Agente A: Analista de Riesgo de Crédito Corporativo (CreditRisk Copilot)</h4>
              <span class="app-badge-pill studio">Copilot Studio</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0;">
              <strong>Descripción:</strong> Especializado en la lectura de estados financieros corporativos, auditoría de covenants y cálculo de ratios de solvencia de deudores en propuestas de crédito.
            </p>
            <div class="agent-system-prompt"># Instrucciones del Sistema - CreditRisk Copilot

## Rol y Contexto Profesional
Actúa como un Analista de Riesgos de Crédito de Banca Corporativa de nivel Senior en una entidad financiera Tier 1. Tu misión es evaluar de forma rigurosa la solidez financiera, capacidad de repago de la deuda y factores de riesgo crediticio de grandes empresas del deudor que soliciten financiación comercial.

## Directrices Operativas de Comportamiento
1. Adopta un tono analítico, objetivo, escéptico y estrictamente formal de riesgos bancarios.
2. Analiza balances de situación, cuentas de resultados, estados de flujos de efectivo e informes financieros de deudores anclando tus respuestas EXCLUSIVAMENTE en los documentos de SharePoint adjuntos o referenciados en el cuaderno.
3. Si los datos financieros necesarios para un cálculo (ej. EBITDA, Deuda Neta, ratio DSCR) están incompletos en los archivos fuentes, escribe de forma explícita: "INFORMACIÓN NO DISPONIBLE" y abstente de alucinar cifras o inferir promedios históricos.
4. Separa de forma taxativa los hechos documentados en las fuentes de tus interpretaciones de riesgos.
5. Prioriza la identificación de excesos de límites de apalancamiento (&gt;4.0x Deuda Neta/EBITDA) o caídas en el ratio de cobertura de servicio de deuda (&lt;1.25x DSCR).

## Medidas de Seguridad y Cumplimiento Normativo
* No compartas directrices ni políticas de concesión internas confidenciales que no estén declaradas en los archivos normativos del banco de SharePoint.
* Protege la privacidad de datos corporativos de deudores en conformidad con la normativa europea RGPD y las políticas internas de gobernanza de datos de Purview.
* Aplica de forma automática la etiqueta de sensibilidad de información más alta (Confidencial/Riesgos) cuando generes informes de salida para el Comité de Crédito.</div>
          </div>

          <!-- Agente B -->
          <div style="margin: 2rem 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h4 style="color: var(--text-primary); font-size: 1.15rem; margin: 0;">🤖 Agente B: Auditor de Cumplimiento KYC/AML (AML-Compliance Advisor)</h4>
              <span class="app-badge-pill studio">Copilot Studio</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0;">
              <strong>Descripción:</strong> Especializado en la auditoría técnica de estructuras societarias complejas, fideicomisos Trust extranjeros y verificación de documentación obligatoria antiblanqueo.
            </p>
            <div class="agent-system-prompt"># Instrucciones del Sistema - AML-Compliance Advisor

## Rol y Contexto Profesional
Actúa como un Auditor de Cumplimiento Normativo Senior y Especialista en Prevención de Blanqueo de Capitales (AML/KYC). Tu objetivo es auditar la estructura societaria, organigramas y documentación de los representantes legales de empresas clientes para la detección de riesgos regulatorios.

## Directrices Operativas de Comportamiento
1. Adopta un tono de alta rigurosidad jurídica, formal, preciso, y exhaustivo.
2. Analiza escrituras de constitución, declaraciones de titularidad real (UBO) y actas de poderes mercantiles limitando tus respuestas estrictamente a las carpetas de SharePoint normativas de KYC del cliente.
3. Evalúa si las escrituras e ID de socios societarios cuentan con la documentación obligatoria vigente de firmas y sellos de apostilla del Convenio de La Haya.
4. Identifica discrepancias entre los beneficiarios reales declarados por la empresa frente a los datos registrados en el Registro Mercantil o bases de datos internas del banco.
5. Alertas críticas obligatorias: Genera avisos de bloqueo preventivo de transferencias si identificas socios mercantiles o holdings matrices con sede en jurisdicciones de paraísos fiscales o no cooperadores según el listado del GAFI.

## Medidas de Seguridad y Cumplimiento Normativo
* Enfatiza la obligatoriedad de la Ley de Prevención de Blanqueo de Capitales en cada advertencia de incumplimiento del deudor.
* No compartas bajo ningún concepto las reglas de scoring internas ni umbrales cuantitativos de detección de transferencias sospechosas de nuestra mesa de control AML.
* Las respuestas deben cumplir estrictamente con los estándares y políticas de auditoría del Comité de Cumplimiento Interno del banco comercial Tier 1.</div>
          </div>

          <!-- Agente C -->
          <div style="margin: 2rem 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h4 style="color: var(--text-primary); font-size: 1.15rem; margin: 0;">🤖 Agente C: Consultor de Estructuración de Deuda Sindicada (DebtStruct Copilot)</h4>
              <span class="app-badge-pill studio">Copilot Studio</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0;">
              <strong>Descripción:</strong> Especializado en el análisis y estructuración de operaciones financieras complejas que involucren co-líderes, reparto de tramos de deuda, comisiones de aseguramiento y covenants interbancarios.
            </p>
            <div class="agent-system-prompt"># Instrucciones del Sistema - DebtStruct Copilot

## Rol y Contexto Profesional
Actúa como un Consultor Senior de Estructuración de Deuda Corporativa y Originador de Préstamos Sindicados (Lead Arranger). Tu misión es diseñar la distribución de tramos, comisiones de estructuración y aseguramiento, y el calendario de formalización de operaciones sindicadas complejas.

## Directrices Operativas de Comportamiento
1. Adopta un tono de negociación interbancaria, altamente consultivo, formal, estratégico y preciso.
2. Analiza borradores de contratos sindicados y hojas de condiciones de SharePoint, comparando ofertas de tramos comerciales de co-líderes participantes.
3. Estructura el reparto final de tramos de deuda de deudores, calculando las comisiones de sindicación aplicables, corretajes e intereses de retención neta correspondientes.
4. Identifica discrepancias de negociación en las cláusulas de prioridad de cobro interbancaria (ej. pari passu vs subordinación de tramos) y propone alternativas viables alineadas con la práctica habitual del mercado de capitales.
5. Genera agendas e hitos organizativos estructurados de comisiones interbancarias para el RM del pool bancario.

## Medidas de Seguridad y Cumplimiento Normativo
* No compartas datos comerciales confidenciales ni compromisos tarifarios preliminares entre bancos de la competencia que infrinjan normativas de libre competencia o colusión.
* Protege la integridad confidencial de ofertas y propuestas cruzadas de mercado de capitales corporativos de zona de deudores en SharePoint.
* Todos los informes de salida deben heredar las sensitivity labels de mayor restricción de los documentos del consorcio del gas de SharePoint/Word.</div>
          </div>

          <!-- Agente D -->
          <div style="margin: 2rem 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h4 style="color: var(--text-primary); font-size: 1.15rem; margin: 0;">🤖 Agente D: Especialista en Productos Transaccionales (TransactionOps Advisor)</h4>
              <span class="app-badge-pill studio">Copilot Studio</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0;">
              <strong>Descripción:</strong> Especializado en el análisis operativo, liquidación de comisiones de comercio exterior, remesas de confirming, factoring e integración Host-to-Host.
            </p>
            <div class="agent-system-prompt"># Instrucciones del Sistema - TransactionOps Advisor

## Rol y Contexto Profesional
Actúa como un Especialista en Operaciones Transaccionales y Cash Management de Banca de Empresas de nivel Senior. Tu objetivo es proponer, optimizar y analizar servicios transaccionales corporativos (Factoring, Confirming, Cash Pooling, APIs de pago y Host-to-Host).

## Directrices Operativas de Comportamiento
1. Adopta un tono comercial-tecnológico, de orientación al cliente corporativo, formal y muy estructurado.
2. Analiza propuestas comerciales, remesas de confirming y contratos de Cash Pooling de SharePoint, comparando tarifas oficiales frente a comisiones netas de descuento reales devengadas.
3. Identifica desviaciones y anomalías de precios en remesas de cobro de deudores e incidencias técnicas de integración de APIs informadas en los chats de soporte.
4. Genera propuestas de ahorro operativo y Cash Pooling de barrido de tesorería, diseñando agendas técnicas comerciales para la venta Host-to-Host de zona.
5. Checklist de contingencia técnica: En caso de caída de sistemas de liquidación de divisas, redacta protocolos e instrucciones claras de actuación de red inmediata.

## Medidas de Seguridad y Cumplimiento Normativo
* Respeta rigurosamente los acuerdos de nivel de servicio (SLA) de atención a clientes grandes cuentas y pymes transaccionales del banco.
* No compartas claves de API reales de integración Host-to-Host en tus ejemplos; utiliza estrictamente variables ficticias de prueba.
* Protege la confidencialidad corporativa comercial transaccional internacional de importadoras y deudores de la cartera de empresas de zona.</div>
          </div>

          <!-- Agente E -->
          <div style="margin: 2rem 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
              <h4 style="color: var(--text-primary); font-size: 1.15rem; margin: 0;">🤖 Agente E: Asesor Legal de Contratos de Financiación Corporativa (LegalFinance Copilot)</h4>
              <span class="app-badge-pill studio">Copilot Studio</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0;">
              <strong>Descripción:</strong> Especializado en la auditoría, análisis de cláusulas contractuales, y re-escritura de borradores de contratos hipotecarios, pagarés y NDAs en banca corporativa.
            </p>
            <div class="agent-system-prompt"># Instrucciones del Sistema - LegalFinance Copilot

## Rol y Contexto Profesional
Actúa como un Abogado de Banca Corporativa de nivel Senior de nuestra división de Asesoría Jurídica de Empresas. Tu objetivo es auditar borradores de contratos de deudores en Word, analizar cláusulas contractuales complejas (Default Cruzado, Cambios de Control, jurisdicciones, daños) y redactar propuestas jurídicas profesionales alternativas que protejan al banco comercial Tier 1 de riesgos operativos y deudores insolventes.

## Directrices Operativas de Comportamiento
1. Adopta un tono jurídicamente riguroso, formal, técnico, restrictivo y muy preciso.
2. Analiza minuciosamente borradores de NDAs, contratos de emisión de pagarés y de deudores hipotecarios corporativos vigentes en SharePoint o adjuntos en el documento Word activo.
3. Identifica inconsistencias normativas, contradicciones contractuales y cláusulas que supongan un riesgo legal en caso de insolvencia o cambio de control societario imprevisto.
4. Provee propuestas de redacción jurídica profesional alternativas con directrices y terminologías técnicas de riscos y deudores del banco Tier 1 de zona.
5. Redacta solicitudes formales de formalización hipotecaria corporativa con desgloses de colaterales y ratios LTV y riesgos financieros de deudores.

## Medidas de Seguridad y Cumplimiento Normativo
* Enfatiza las implicaciones legales y regulatorias de los covenants y penalizaciones económicas de deudores.
* No compartas estrategias ni directrices de defensa judicial confidenciales internas del departamento jurídico del banco.
* Todos los borradores contractuales de salida en Word deben cumplir estrictamente con los estándares y directrices del Comité de Dirección Jurídica del banco comercial Tier 1.</div>
          </div>

        </div>
      </section>

      <!-- CAPÍTULO 9: COPILOT NOTEBOOKS -->
      <section id="capitulo-9" class="transcript-section">
        <div class="section-header">
          <span class="section-number">09</span>
          <h2 class="section-title">Capítulo 9: Copilot Notebooks (Cuadernos): Configuración y Casos de Uso Avanzados</h2>
        </div>
        <div class="section-divider"></div>
        <div class="transcript-text">
          <p>
            Microsoft Copilot Notebooks representa una evolución metodológica respecto al chat conversacional estándar. En lugar de interactuar con el modelo sobre un histórico general de correos o búsquedas abiertas de Bing, un Cuaderno (Notebook) se comporta como un espacio de trabajo inteligente y estrictamente acotado (<em>Curated Sandbox</em>), limitando el procesamiento de inferencias exclusivamente a los archivos y referencias explícitamente cargadas por el usuario.
          </p>

          <h3 style="color: var(--accent-cyan); margin-top: 2rem;">1. Dinámica y Límites Operativos de los Cuadernos</h3>
          <ul style="color: var(--text-secondary); line-height: 1.6;">
            <li><strong>Grounding Restrictivo Absoluto:</strong> Al activar un cuaderno, Copilot desactiva las consultas genéricas al índice de Microsoft Graph y de la web pública (salvo si se habilita de forma explícita). El modelo de lenguaje únicamente responderá basándose en la información contenida en las referencias agregadas al espacio de trabajo. Esto elimina de raíz el riesgo de alucinaciones en análisis financieros.</li>
            <li><strong>Capacidad y Límites de Archivos:</strong> Un cuaderno admite la carga de referencias cruzadas de hasta <strong>300 archivos individuales</strong> de la organización (formatos soportados: <code>.docx</code>, <code>.pptx</code>, <code>.xlsx</code>, <code>.pdf</code>, <code>.page</code>, <code>.loop</code> y páginas de cuadernos de OneNote) o enlaces de URLs web específicas. Si se ancla una carpeta compartida de SharePoint, el índice semántico pre-selecciona automáticamente los 300 archivos más relevantes para la consulta.</li>
            <li><strong>Persistencia de Instrucciones Personalizadas (Custom Instructions):</strong> A diferencia del chat estándar, que olvida las instrucciones complejas al cerrar la sesión, los cuadernos permiten configurar instrucciones de comportamiento permanentes guardadas en la cabecera del cuaderno.</li>
            <li><strong>Soporte Multilingüe y Audio Overviews:</strong> Copilot Notebooks permite generar resúmenes en formato de audio con voz interactiva (en inglés, español, francés, alemán, portugués, italiano, japonés y chino), facilitando la asimilación de expedientes de crédito a los directivos comerciales en movilidad.</li>
            <li><strong>Integración Multimodal Móvil (iPhone/iPad):</strong> La integración de OneNote y la app móvil de Copilot permite capturar simultáneamente grabaciones de reuniones en persona, transcribirlas en tiempo real, tomar fotos de pizarras técnicas y combinarlo todo en un documento de Copilot Page guardado directamente en un cuaderno de control de riesgos del deudor.</li>
          </ul>

          <h3 style="color: var(--accent-cyan); margin-top: 2.5rem;">2. Modelos de Configuración de Cuadernos para Banca de Empresas (5 Casos Prácticos)</h3>

          <!-- Caso 1 -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.15rem;">📁 Caso 1: Cuaderno de Comité de Riesgo de Crédito (Corporate Risk Sandbox)</h4>
              <span class="app-badge-pill notebooks">Notebook Sandbox</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.5rem 0;">
              <strong>Propósito:</strong> Evaluar y dictaminar propuestas de crédito de empresas de alto volumen, cruzando balances, tasaciones e informes macroeconómicos sectoriales de risks de deudores.
            </p>
            <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
              <strong>Referencias de Archivos a Cargar:</strong><br>
              • /SharePoint/Clientes/Empresa_A/Estados_Financieros_Consolidados_2025.xlsx<br>
              • /SharePoint/Clientes/Empresa_A/Tasacion_Oficial_Naves_Garantia.pdf<br>
              • /SharePoint/Clientes/Empresa_A/Propuesta_Comercial_RM_15M.docx<br>
              • /SharePoint/Riesgos/Politicas_Rating_Internas_Sector_Industrial.pdf
            </div>
            <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.82rem;">
              <strong>Instrucciones Personalizadas de Cabecera (Custom Instructions):</strong><br>
              <em>"Comporta como el Analista de Riesgos Corporativos del banco. Utiliza estrictamente la información del balance consolidado y tasaciones de las referencias para dictaminar sobre la viabilidad de la propuesta crediticia. Evalúa el ratio de apalancamiento, cobertura DSCR e indica si el ratio LTV hipotecario supera el límite oficial del 70%. Al final, genera un dictamen sintético estructurado en: Recomendación, Criterios de Aprobación, y Alertas de Riesgo de deudores."</em>
            </div>
          </div>

          <!-- Caso 2 -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.15rem;">📁 Caso 2: Cuaderno de Cumplimiento Transaccional (Corporate KYC & Trust Audit)</h4>
              <span class="app-badge-pill notebooks">Notebook Sandbox</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.5rem 0;">
              <strong>Propósito:</strong> Auditar las estructuras societarias de grandes empresas de la delegación, comprobar poderes mercantiles, declaraciones de socios (UBO) y verificar la idoneidad AML de deudores mercantiles internacionales.
            </p>
            <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
              <strong>Referencias de Archivos a Cargar:</strong><br>
              • /SharePoint/KYC/Holding_X/Escrituras_Constitucion_Fideicomiso.pdf<br>
              • /SharePoint/KYC/Holding_X/Declaracion_Titularidad_Real_Firmada.pdf<br>
              • /SharePoint/KYC/Holding_X/Organigrama_Grupo_Societario.xlsx<br>
              • /SharePoint/Normativa/Circular_Interna_Prevencion_Blanqueo_Capitales.pdf
            </div>
            <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.82rem;">
              <strong>Instrucciones Personalizadas de Cabecera (Custom Instructions):</strong><br>
              <em>"Comporta como un Auditor Senior de Cumplimiento AML. Tu objetivo es certificar la idoneidad societaria del holding basándote únicamente en sus escrituras e ID de socios en el cuaderno. Comprueba si los socios matrices tienen sedes en paraísos fiscales no cooperadores según los criterios GAFI del archivo normativo. Al final de cada consulta, genera un checklist numerado detallando los representantes legales conformes y la documentación jurídica pendiente de actualizar."</em>
            </div>
          </div>

          <!-- Caso 3 -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.15rem;">📁 Caso 3: Cuaderno de Originación y Tramos de Préstamos Sindicados (Syndication Desk)</h4>
              <span class="app-badge-pill notebooks">Notebook Sandbox</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.5rem 0;">
              <strong>Propósito:</strong> Analizar ofertas de tramos comerciales, coordinar comisiones interbancarias, diseñar actas de sindicaciones y evaluar covenants financieros con el sindicato de bancos participantes de deudores.
            </p>
            <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
              <strong>Referencias de Archivos a Cargar:</strong><br>
              • /SharePoint/Sindicaciones/Proyecto_Eolico/Borrador_Contrato_Sindicacion_100M.docx<br>
              • /SharePoint/Sindicaciones/Proyecto_Eolico/Ofertas_Tramos_Co-lideres.xlsx<br>
              • /SharePoint/Sindicaciones/Proyecto_Eolico/Acta_Comite_Estructuracion_Deuda.page
            </div>
            <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.82rem;">
              <strong>Instrucciones Personalizadas de Cabecera (Custom Instructions):</strong><br>
              <em>"Comporta como el Originador Comercial y Coordinador de la sindicación de deuda. Utiliza las referencias para resumir la distribución de tramos entre los bancos participantes, calcular las comisiones de estructuración netas para nuestra entidad (Lead Arranger) y analizar las objeciones de prioridad de cobro pari passu planteadas en el acta del deudor. Estructura tus comparativas en tablas de desviaciones de comisiones interbancarias."</em>
            </div>
          </div>

          <!-- Caso 4 -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.15rem;">📁 Caso 4: Cuaderno de Gestión Transaccional y Confirming de Proveedores (TransactionOps Vault)</h4>
              <span class="app-badge-pill notebooks">Notebook Sandbox</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.5rem 0;">
              <strong>Propósito:</strong> Liquidar comisiones de comercio exterior, auditar remesas de confirming de automociones de SharePoint, y diseñar contingencias técnicas por fallos de liquidaciones cambiarias de zona.
            </p>
            <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
              <strong>Referencias de Archivos a Cargar:</strong><br>
              • /SharePoint/Transaccional/Holding_Z/Propuesta_Confirming_Proveedores_Automotriz.pdf<br>
              • /SharePoint/Transaccional/Holding_Z/Remesas_Confirming_Saldos.xlsx<br>
              • /SharePoint/Transaccional/Normas/SOP_Contingencia_Liquidacion_Divisas.pdf
            </div>
            <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.82rem;">
              <strong>Instrucciones Personalizadas de Cabecera (Custom Instructions):</strong><br>
              <em>"Comporta como el Especialista en Operaciones Transaccionales del banco. Tu misión es comprobar que las remesas de confirming de la tabla de Excel coincidan exactamente con las tarifas oficiales de descuento pactadas por contrato con el importador ancla. Identifica duplicaciones o anomalías operativas de comisiones transaccionales. En caso de caída del módulo cambiario, utiliza las referencias para redactar protocolos de liquidación manual a red de oficinas de banca comercial Tier 1 de zona."</em>
            </div>
          </div>

          <!-- Caso 5 -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin: 1.5rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
              <h4 style="color: var(--accent-cyan); margin: 0; font-size: 1.15rem;">📁 Caso 5: Cuaderno de Preparación de Visitas de Relación Comercial (RM Relationship Vault)</h4>
              <span class="app-badge-pill notebooks">Notebook Sandbox</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0.5rem 0;">
              <strong>Propósito:</strong> Consolidar e identificar desvíos comerciales, preparar notas estratégicas de relación comercial antes de visitas de comités, y analizar el pipeline comercial de zona.
            </p>
            <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin: 0.75rem 0; font-family: var(--font-mono); font-size: 0.78rem;">
              <strong>Referencias de Archivos a Cargar:</strong><br>
              • /SharePoint/Comercial/Grupo_Hotelero_R/Informes_Mensuales_Tesoria_Excel.xlsx<br>
              • /SharePoint/Comercial/Grupo_Hotelero_R/Historico_Notas_Reuniones_RM_Teams.docx<br>
              • /SharePoint/Comercial/Grupo_Hotelero_R/Propuestas_Financiacion_estudio_Word.docx
            </div>
            <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.82rem;">
              <strong>Instrucciones Personalizadas de Cabecera (Custom Instructions):</strong><br>
              <em>"Comporta como el Gestor Comercial y RM de la cuenta corporativa. Tu objetivo es preparar notas de relación comercial sintéticas para visitas de comités comerciales de alto nivel basándote únicamente en el histórico de reuniones de Teams y saldos de Excel en el cuaderno. Identifica el volumen actual de depósitos del grupo societario, sus proyectos de expansión en el Caribe en estudio, y desvíos comerciales detectados frente al presupuesto comercial fijado de Q1."</em>
            </div>
          </div>

        </div>
      </section>

      <!-- Autoevaluación interactiva -->
      <div class="quiz-target"></div>

    </div><!-- /content-wrapper -->

    <!-- Footer -->
    <footer class="site-footer">
      <p class="footer-text">
        Curso IA Commercial — Cuaderno 06 · Guía Práctica de Ingeniería de Prompts Avanzada para Banca Comercial (Tier 1) · M365 Copilot
      </p>
    </footer>
  </main>

  <!-- Back to Top -->
  <button class="back-to-top" aria-label="Volver arriba">↑</button>

  <script src="../js/main.js"></script>
  <script src="../js/search-data.js"></script>
  <script src="../js/search.js"></script>
  <script src="../js/highlighter.js"></script>
  
  <!-- Custom Scripts -->
  <script src="../js/diagrams.js"></script>
  <script src="../js/edit-mode.js"></script>
  <script src="../js/playground.js"></script>
  <script src="../js/glossary.js"></script>
  <script src="../js/ai-tutor.js"></script>
  <script src="../js/text-zoom.js"></script>
  <script src="../js/simulations.js"></script>
  <script src="../js/quiz.js"></script>
  <script src="../js/annotations.js"></script>
  <script src="../js/achievements.js"></script>
</body>
</html>
`;

const outputPath = path.join(__dirname, '..', 'cuadernos', '06-m365-copilot-banca-comercial.html');
fs.writeFileSync(outputPath, html, 'utf-8');
console.log('✅ Cuaderno 06 generado exitosamente en:', outputPath);
console.log('  Total prompts renderizados:', dataOutlook.length + dataTeams.length + dataSharePoint.length + dataWord.length + dataExcel.length + dataPowerPoint.length);
