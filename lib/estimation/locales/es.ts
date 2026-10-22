import type { EstimationCopy } from "../copy"

const es: EstimationCopy = {
  title: "Estimar mi proyecto",
  seo: { title: "Estimar el precio de tu sitio web o aplicación", description: "Cuéntanos tu proyecto de sitio web, aplicación web o móvil. Le bon dev te responde en 24 horas laborables con una primera estimación personalizada." },
  page: {
    eyebrow: "Una primera estimación", title: "Tu proyecto empieza aquí.",
    description: "Unas preguntas para estimar el precio de tu sitio web o aplicación. El estudio lee tus respuestas y te contesta en 24 horas laborables.",
    pricing: "Sitios web desde 2.500 € sin IVA: cinco páginas, contenido proporcionado. Las aplicaciones se estiman según su alcance.",
    explanationTitle: "Qué influye en la estimación",
    explanation: [
      "El precio depende del número de pantallas, los roles de los usuarios y las funcionalidades que haya que desarrollar. Presentar una actividad, gestionar reservas o conectar una herramienta de negocio requieren trabajos distintos. También cuentan las integraciones, el diseño y las animaciones, así como el punto de partida: una idea, unas maquetas o un producto existente que retomar.",
      "Este recorrido ayuda al estudio a entender tu actividad, quién utilizará tu producto y cuáles son tus prioridades. Puedes dejar las preguntas opcionales en blanco y cambiar tus respuestas antes de enviar. El plazo y el presupuesto orientan una propuesta realista.",
      "El estudio te responde por correo con una primera estimación o las preguntas necesarias para concretarla. Después definimos contigo el alcance, los hitos y el presupuesto antes de empezar el trabajo.",
    ],
  },
  steps: [
    { label: "Proyecto", title: "¿Qué tipo de proyecto tienes?", help: "Elige una o varias opciones." },
    { label: "Sector", title: "¿En qué sector trabajas?", help: "Para proponerte funcionalidades y ejemplos adecuados." },
    { label: "Funciones", title: "¿Qué necesita tu proyecto?", help: "Marca lo que te interese, sin preocuparte por el orden: lo organizaremos al definir el proyecto. Opcional." },
    { label: "Diseño", title: "¿En qué punto estás con el diseño?", help: "Elige una opción." },
    { label: "Plazo", title: "¿Cuándo quieres lanzar?", help: "Para organizar una respuesta realista, no para prometer una fecha." },
    { label: "Detalles", title: "Háblanos de tu proyecto.", help: "Todo es opcional, pero cuanto más sepamos, más precisa será la estimación." },
    { label: "Contacto", title: "¿Dónde te enviamos la estimación?", help: "El estudio lee tus respuestas y te contesta por correo en 24 horas laborables. Sin boletines." },
  ],
  types: {
    site: { title: "Sitio web", description: "Presentar tu actividad y recibir consultas" },
    webapp: { title: "Aplicación web", description: "Un servicio en línea o una herramienta para tu equipo" },
    mobile: { title: "Aplicación móvil", description: "iOS y Android" },
    shop: { title: "Tienda en línea", description: "Catálogo, carrito y pago" },
    redo: { title: "Rediseño o recuperación", description: "Un sitio web o una aplicación ya existentes" },
    unknown: { title: "Todavía no lo sé", description: "Describe tu idea a continuación" },
  },
  sectors: { health: "Salud y bienestar", property: "Inmobiliario", finance: "Finanzas y seguros", trades: "Oficios y construcción", retail: "Comercio y restauración", education: "Formación y enseñanza", sports: "Deporte y ocio", business: "Servicios a empresas", public: "Asociaciones y sector público", media: "Medios y comunicación", other: "Otro" },
  audiences: { public: "El público, tus clientes", team: "Tu equipo, internamente", both: "Ambos" },
  features: { booking: "Reserva de citas", payment: "Pago en línea", accounts: "Cuentas de usuario", admin: "Área de clientes o administración", notifications: "Notificaciones", messaging: "Mensajería entre usuarios", documents: "Documentos: presupuestos, facturas PDF", catalog: "Catálogo o tienda", languages: "Varios idiomas", maps: "Mapas y geolocalización", analytics: "Paneles de control", integrations: "Conexión con tus herramientas", ai: "Funciones de IA", other: "Otra" },
  designs: {
    zero: { title: "Parto de cero", description: "Sin logotipo ni guía de marca" },
    brand: { title: "Tengo una identidad visual", description: "Logotipo, colores y tipografías" },
    mockups: { title: "Tengo maquetas", description: "Figma, PDF u otro formato" },
    rebrand: { title: "Quiero renovar mi identidad", description: "Replantear el logotipo y la marca junto con el proyecto" },
  },
  delays: { month: "En un mes", "three-months": "En 3 meses", "six-months": "En 6 meses", unknown: "Sin fecha todavía" },
  budgets: { "under-5": "Menos de 5.000 €", "5-15": "5.000–15.000 €", "15-40": "15.000–40.000 €", "over-40": "Más de 40.000 €", unknown: "Todavía no" },
  constraints: { sensitive: "Datos sensibles: de salud, personales", accessibility: "Accesibilidad", france: "Alojamiento en Francia obligatorio" },
  fields: {
    typeOther: "¿No encuentras tu caso? Cuéntalo en una frase (opcional)", sectorNote: "Añade detalles si lo necesitas (opcional)",
    featureIA: "¿Cuáles? Por ejemplo, un asistente que responde a tus clientes o la lectura automática de documentos", featureOther: "Otra: descríbela en unas palabras",
    deadline: "¿Una fecha que respetar? Apertura, feria, temporada… (opcional)", name: "Nombre del proyecto", desc: "Tu proyecto en unas líneas: el contexto, qué te ha decidido y qué esperas", link: "Enlace a un sitio web o una aplicación existentes",
    firstName: "Nombre", email: "Correo electrónico", company: "Empresa (opcional)", phone: "Teléfono (opcional)",
  },
  groups: { audience: "¿Para quién?", features: "Funcionalidades", budget: "¿Tienes un presupuesto en mente? (opcional)", constraints: "¿Algún requisito particular? (opcional)", recap: "Resumen", contact: "Tus datos de contacto" },
  actions: { back: "Atrás", next: "Siguiente", submit: "Recibir mi estimación", sending: "Enviando…", retry: "Reintentar", edit: "Modificar", close: "Cerrar", restart: "Volver a empezar", home: "Volver al sitio" },
  status: { steps: "Pasos", step: "Paso", of: "de", saved: "Tus respuestas se guardan en este dispositivo hasta el envío.", notStored: "Tus respuestas siguen disponibles mientras este formulario esté abierto.", unspecified: "sin indicar", descriptionProvided: "Descripción incluida", deadline: "fecha que respetar: ", language: "Idioma", noScript: "Activa JavaScript para completar el recorrido o cuéntanos tu proyecto por correo." },
  errors: { project: "Elige al menos un tipo de proyecto o describe tu idea.", firstName: "Indica tu nombre.", email: "Indica un correo válido para recibir la estimación.", link: "Indica una dirección web válida o deja este campo vacío.", invalid: "Revisa tus respuestas antes de volver a intentarlo.", send: "No se ha podido enviar la solicitud. Tus respuestas se conservan: vuelve a intentarlo o escríbenos a" },
  success: { title: "Hemos recibido tu solicitud.", beforeEmail: "Se envía una copia a ", afterEmail: ". El estudio te responde en 24 horas laborables con una primera estimación o las preguntas que falten.", withoutCopy: "No se ha podido enviar la copia por correo, pero el estudio ha recibido tu solicitud. Recibirás una respuesta en 24 horas laborables.", followup: "Puedes responder a ese correo para corregir o completar la información.", details: "Ver los datos enviados" },
  email: { subject: "Solicitud de estimación", confirmation: "Hemos recibido tu solicitud de estimación — Le bon dev", greeting: "Hola", body: "Hemos recibido tu solicitud. El estudio te responde en 24 horas laborables con una primera estimación o las preguntas que falten. Aquí tienes una copia de tus respuestas. Puedes responder a este correo para corregir o completar la información.", closing: "Hasta pronto,\nLe bon dev\nhello@lebondev.fr", sentAt: "Solicitud recibida el" },
}

export default es
