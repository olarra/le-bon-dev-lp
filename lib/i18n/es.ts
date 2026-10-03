import type { Dictionary } from "./types"

const es: Dictionary = {
  seo: {
    title: "Le bon dev — Desarrollo de sitios web y aplicaciones móviles",
    description: "Sitios web y aplicaciones móviles con un desarrollador sénior a tu lado, de la idea al lanzamiento. Presupuesto definido, seguimiento y entrega del código.",
  },
  skip: "Ir al contenido",
  header: {
    home: "Le bon dev — inicio", navigation: "Navegación principal", menu: "Menú", close: "Cerrar", contact: "Hablemos de tu proyecto", language: "Idioma del sitio",
    links: [{ label: "Garantías", href: "#garanties-timeline" }, { label: "Servicios", href: "#offres" }, { label: "Proyectos", href: "#realisations" }, { label: "Método", href: "#la-methode" }, { label: "Estudio", href: "#le-studio" }],
  },
  topbar: { availability: "Proyectos puntuales o acompañamiento continuo", response: "Respuesta en 24 h" },
  hero: {
    eyebrow: "Estudio de desarrollo web y móvil", titleLines: ["Tu visión.", "Nuestro talento."], subtitle: "Una idea por concretar o un producto que retomar: te acompañamos desde el diseño hasta el lanzamiento.", cta: "Estimar mi proyecto", hint: "Cuéntanos tu proyecto en 3 minutos.",
    highlightBefore: "Un ", highlightWord: "desarrollador", highlightAfter: " como interlocutor, a tu lado en cada etapa.",
  },
  guarantees: {
    eyebrow: "Nuestras garantías", titleBefore: "Un ", titleHighlight: "marco claro", titleAfter: ",", titleEnd: "de principio a fin.", subtitle: "Tres principios que aplicamos a cada proyecto.",
    steps: [
      { phase: "Antes de empezar", title: "Un presupuesto que se respeta", description: "Cada funcionalidad se presupuesta antes de empezar. El importe no cambia sin tu acuerdo." },
      { phase: "Durante el proyecto", title: "Un seguimiento constante", description: "Acordamos juntos los hitos al definir el proyecto. Cada uno termina con una versión para probar y un informe de avance." },
      { phase: "En la entrega", title: "Todo en tus manos", description: "Código, accesos y documentación, entregados al finalizar el proyecto." },
    ],
  },
  offers: {
    eyebrow: "Los servicios", title: "Tu proyecto toma forma.", audience: "Para ti si", included: "Qué incluye", from: "Desde",
    items: [
      {
        id: "sites-vitrines", kind: "website", title: "Sitios web", promise: "Un sitio que explica lo que haces y te ayuda a recibir consultas.",
        audience: "todavía no tienes sitio web, el actual ya no te representa o no te genera consultas.",
        features: ["Diseño a medida, adaptado a móviles", "Páginas y textos definidos contigo", "Citas, pagos, presupuestos y contacto en línea", "SEO local y Perfil de Empresa en Google", "Dominio, alojamiento, publicación y orientación de uso"],
        aftercare: { title: "Después del lanzamiento", description: "Un mes de correcciones incluido. Después, mejoras con presupuesto individual o mediante acompañamiento continuo." },
        price: { amount: "2.500 € sin IVA", detail: "cinco páginas, contenido proporcionado" }, cta: "Estimar mi sitio web", href: "#contact",
      },
      {
        id: "saas-mobile", kind: "applications", title: "Aplicaciones", detail: "Web o móvil", promise: "Una aplicación que hace exactamente lo que tu actividad necesita.",
        audience: "vas a lanzar un servicio en línea, necesitas herramientas para tu equipo o quieres terminar o retomar una aplicación existente.",
        features: ["Flujos de uso y funcionalidades adaptados a tu negocio, definidos al inicio", "Decisiones técnicas explicadas con claridad", "Desarrollo, pruebas y despliegue", "Pagos, agenda y notificaciones, según el proyecto", "Entrega de documentación y código fuente"],
        aftercare: { title: "Después del despliegue", description: "Corrección de errores durante la garantía fijada en el presupuesto. Después, mantenimiento mensual opcional: compatibilidad con iOS y Android, tiendas de aplicaciones y mejoras." },
        cta: "Estimar mi aplicación", href: "#contact",
      },
    ],
  },
  showcase: {
    eyebrow: "Los proyectos", titleLines: ["Ideas", "hechas realidad."], subtitle: "Dos proyectos, dos necesidades. Descubre lo que hemos creado.", context: "Contexto", offer: "Servicio",
    projects: {
      miau: { name: "Miau", hook: ["Viaja con tranquilidad.", "Mantén el vínculo."], description: "Un servicio para encontrar el cuidado adecuado para tu gato.", context: "Cuidado de gatos", offer: "App", icon: "applications", cta: "Descubrir Miau", href: "https://miau-app.com/" },
      studio: { name: "French Pixel Studio", hook: ["Las creaciones", "en primer plano."], description: "Una galería web para descubrir obras de arte, tanto en computadora como en móvil.", context: "Galería de arte digital", offer: "Sitio web", icon: "website", cta: "Visitar el sitio", href: "https://www.frenchpixelstudio.fr/" },
    },
    phones: ["Miau: mapa de París y gatos cercanos, con marco verde salvia.", "Pantalla de inicio de sesión de Miau, en primer plano con marco verde bosque.", "Miau: perfil del gato Orion y contacto de su dueño, con marco lima."],
    artworks: ["Dos grullas entre flores de loto azules", "Un gato dormido sobre telas estampadas", "Una luna naranja sobre olas turquesas"], gallery: "Vista previa de la galería French Pixel Studio", newTab: "nueva pestaña",
  },
  method: {
    eyebrow: "El método", title: "Siempre sabes en qué punto está tu proyecto.",
    steps: [
      { title: "Definición", description: "Una conversación y un documento breve: alcance, hitos y estimación." },
      { title: "Entregas por hitos", description: "En cada hito, una versión para probar y un informe de avance. Los ajustes se acuerdan sobre la marcha." },
      { title: "Lanzamiento", description: "Despliegue, accesos y orientación. Tienes autonomía para gestionar lo que necesitas." },
      { title: "Y después", description: "Correcciones, mejoras y seguimiento: puntuales o continuos, según lo que necesites." },
    ],
  },
  studio: {
    eyebrow: "El estudio", titleLines: ["El fondo y la forma.", "El mismo cuidado."],
    paragraphs: [
      { text: "Un alcance poco claro. Un seguimiento escaso. Un diseño desconectado del uso real." },
      { text: "Le bon dev nació de esta observación: un proyecto merece tanto cuidado en su diseño como en su desarrollo.", emphasis: "Le bon dev" },
      { text: "Un desarrollador sénior lleva tu proyecto, plenamente involucrado desde la primera conversación hasta el lanzamiento. Cuando hace falta, diseñadores y desarrolladores especializados aportan su experiencia, con la misma atención al detalle y a la calidad del producto." },
    ],
    cta: "Hablemos de tu proyecto", factsLabel: "El estudio en cifras", facts: [{ value: "10", label: "años de desarrollo" }, { value: "+10", label: "proyectos entregados" }, { value: "24 h", label: "para responderte" }],
    principlesLabel: "Los principios del estudio", principles: [["Comprender antes", "de construir."], ["Código en el que", "puedes confiar."], ["Diseño que", "mejora el uso."]],
    scene: "Un espacio de trabajo bajo el tejado con el letrero Le bon dev, de la luz del día a la noche.", replay: "Repetir la transición del día a la noche",
    ecosystem: {
      eyebrow: "Nuestras tecnologías", title: "Las herramientas adecuadas para tu proyecto.", list: "Las tecnologías y herramientas del estudio", cta: "Hablemos", ctaLabel: "Hablemos de las tecnologías adecuadas para tu proyecto",
      description: "Sitio web, aplicación móvil o herramienta de negocio: elegimos las tecnologías que se ajustan a tus necesidades y presupuesto, para crear un producto fiable y fácil de hacer evolucionar.", pause: "Pausar", resume: "Reanudar", pauseLabel: "Pausar el carrusel de tecnologías", resumeLabel: "Reanudar el carrusel de tecnologías",
    },
  },
  estimate: {
    title: "Hablemos de tu aplicación.", description: "Algunas preguntas sobre tus usuarios y lo que necesitan poder hacer.", response: "Una primera estimación en 24 h.", cta: "Estimar mi aplicación", whatsapp: "Contactar por WhatsApp", whatsappLabel: "Contactar por WhatsApp (nueva pestaña)", eyebrow: "Una primera estimación", criteriaTitle: "Qué puede influir en la estimación",
    factors: [
      { title: "El número de pantallas y roles", description: "Una interfaz compartida o espacios distintos para clientes, tu equipo y administradores." },
      { title: "El número y la complejidad de las funcionalidades", description: "Mostrar información, gestionar reservas o integrar IA requieren distintos niveles de desarrollo." },
      { title: "El diseño y las animaciones", description: "Interfaces sencillas o interacciones más elaboradas: el nivel de detalle influye en el tiempo necesario." },
      { title: "Las herramientas que hay que conectar", description: "Agenda, pagos, software de gestión… el trabajo depende de los servicios que se conectan y de las integraciones disponibles." },
      { title: "El punto de partida del proyecto", description: "Empezar desde cero, contar con diseños o retomar código existente cambia el trabajo que hay que prever." },
    ],
  },
  contact: {
    eyebrow: "El contacto", titleBefore: "¿Lo ", titleHighlight: "hablamos?", description: "¿Un sitio que lanzar, una aplicación que crear o un producto que mejorar? Cuéntanos qué tienes en mente.", detailsLabel: "Datos de contacto del estudio", email: "Por correo electrónico", whatsapp: "Por WhatsApp", response: "Una respuesta en 24 h", developer: "Una conversación con el desarrollador.",
    form: {
      label: "Cuéntanos tu proyecto", name: "Nombre y apellidos", namePlaceholder: "Tu nombre", email: "Correo electrónico", emailPlaceholder: "tu@empresa.com", company: "Empresa", companyPlaceholder: "Tu empresa", phone: "Teléfono", phonePlaceholder: "Incluye el prefijo de tu país", optional: "opcional", project: "Tu proyecto",
      projectTypes: { website: "Sitio web", application: "Aplicación", evolution: "Mejoras", unsure: "Por definir" }, message: "Unas palabras sobre tu proyecto", messagePlaceholder: "Tu idea, tus usuarios, lo que te gustaría crear o mejorar…",
      hint: "* Campos obligatorios. Tus datos de contacto solo se usan para hablar de tu proyecto.", submit: "Enviar mi mensaje", pending: "Enviando…", success: "Tu mensaje se ha enviado. Te responderemos en un plazo de 24 h.", error: "No se ha podido enviar el mensaje. Inténtalo de nuevo o escribe a hello@lebondev.fr.", unavailable: "El envío no está disponible temporalmente. Escribe a hello@lebondev.fr.", invalid: "Revisa los campos del formulario antes de volver a intentarlo.", nameRequired: "Indica tu nombre.", messageRequired: "Describe tu proyecto en unas palabras.", honeypot: "Deja este campo vacío",
    },
    confirmation: { subject: "Hemos recibido tu mensaje — Le bon dev", greeting: "Hola", body: "Gracias por contarnos tu proyecto. Hemos recibido tu mensaje y te responderemos en un plazo de 24 h.", closing: "Hasta pronto,\nLe bon dev\nhello@lebondev.fr" },
  },
  footer: {
    tagline: ["Tu visión.", "Nuestro talento."], description: ["Estudio de desarrollo", "web y móvil."], navigationSuffix: "pie de página", invitation: "¿Una idea por concretar?", cta: "Hablemos de tu proyecto", home: "Le bon dev — volver al inicio", top: "Volver arriba",
    groups: [
      { label: "Los servicios", links: [{ label: "Sitios web", href: "#sites-vitrines" }, { label: "Aplicaciones", href: "#saas-mobile" }, { label: "Los proyectos", href: "#realisations" }] },
      { label: "El estudio", links: [{ label: "Nuestras garantías", href: "#garanties-timeline" }, { label: "El método", href: "#la-methode" }, { label: "Quiénes somos", href: "#le-studio" }] },
    ],
  },
}

export default es
