import type { FaqCopy } from "@/components/sections/faq/faq.content"

export const FAQ_ES = {
  eyebrow: "Preguntas frecuentes",
  title: "Las preguntas que nos hacen antes de empezar.",
  description: "Y las que a veces cuesta hacer.",
  topicsLabel: "Temas de las preguntas frecuentes",
  estimate: "Estimar mi proyecto",
  contact: "Contactar",
  closing: "¿Tienes una pregunta que no está aquí? Cuéntanos tu proyecto y la responderemos en la estimación.",
  groups: [
    {
      id: "avant",
      title: "Antes de empezar",
      items: [
        {
          id: "prix",
          question: "¿Cuánto cuesta un sitio web o una aplicación?",
          answer: "Un sitio web de presentación de cinco páginas, con tus contenidos: desde 2.500 € sin IVA, en un pago único. Las reservas, los pagos, una tienda o varios idiomas aumentan el precio, y sabes cuánto antes de firmar. Una aplicación se presupuesta al definir el alcance, hito a hito, y no se compromete ningún importe sin tu acuerdo. Para tener una cifra para tu proyecto: unas preguntas y una respuesta en 24 h.",
          estimate: true,
        },
        {
          id: "delai",
          question: "¿Cuánto tiempo hay que prever?",
          answer: "Un sitio web se entrega en unas semanas. Lo que marca el ritmo es sobre todo el diseño: si ya tienes una identidad, avanzamos rápido; si primero hay que construir tu marca —logotipo, colores, tipografías, forma de hablar con tus clientes—, es un trabajo en sí mismo, previo al sitio. Después, cuanto antes lleguen tus contenidos, más avanza el sitio. Una aplicación se entrega por hitos: primero una versión utilizable y luego versiones periódicas que puedes probar. Nunca esperas al final para descubrir el resultado.",
        },
        {
          id: "sur-mesure",
          question: "¿Por qué no hacer mi sitio yo mismo con Wix o WordPress?",
          answer: "Puedes hacerlo y, para probar una idea o salir del paso unos meses, es una buena opción. Los límites llegan después. En Google: páginas pesadas y ajustes restringidos, difíciles de posicionar en tu ciudad. Con tus herramientas —agenda, pagos, software de gestión— dependes de los módulos disponibles, cada uno con su suscripción, y cuando el que necesitas no existe, te quedas bloqueado. Además, el sitio se queda en su plataforma: una suscripción permanente y, el día que necesitas algo concreto —un área de clientes, un presupuesto en línea—, vuelves a empezar de cero. Un sitio a medida cuesta más al principio y menos cuando tiene que trabajar para ti.",
        },
        {
          id: "interlocuteur",
          question: "¿Un desarrollador independiente o una agencia: qué diferencia hay para mí?",
          answer: "Aquí, la persona que te responde es quien diseña y programa. Sin un jefe de proyecto entre tú y el trabajo, sin instrucciones que se pierdan, con decisiones tomadas directamente. Cuando un proyecto necesita otros perfiles —un diseñador, un segundo desarrollador—, se incorporan al equipo sin que cambie tu interlocutor.",
        },
      ],
    },
    {
      id: "pendant",
      title: "Durante el proyecto",
      items: [
        {
          id: "preparation",
          question: "¿Qué tengo que preparar antes de empezar?",
          answer: "Menos de lo que piensas y siempre a tu nombre. Para un sitio: lo que ya cuentas a tus clientes, tus fotos y tu logotipo si tienes uno; los textos se redactan contigo al definir el proyecto. Para una aplicación: quién la usará y qué debe poder hacer; basta con un boceto o dos aplicaciones que te gusten para empezar. Después vienen las cuentas que creamos juntos, a tu nombre: el dominio, las cuentas de desarrollador de Apple y Google para publicar en las tiendas y los accesos a las herramientas que hay que conectar. En todos los casos, te indicamos exactamente qué falta, en el orden en que lo necesitamos.",
        },
        {
          id: "changements",
          question: "¿Y si cambio de idea durante el proyecto?",
          answer: "Definir el alcance sirve precisamente para evitarlo: antes de empezar, escribimos juntos lo que debe hacer el proyecto. Un ajuste dentro de ese marco —un texto, una pantalla, una regla que cambia— se incorpora a lo largo de los hitos sin coste adicional. Una petición que queda fuera se presupuesta antes de desarrollarla y tú decides: añadirla, dejarla para más adelante o intercambiarla por otra cosa. Nada aparece en la factura sin que lo hayas aprobado.",
        },
        {
          id: "reprise",
          question: "¿Podéis retomar un sitio o una aplicación hechos por otra persona?",
          answer: "Sí. Empezamos por revisar el estado del código y los accesos y luego te decimos con franqueza si conviene terminar, corregir o empezar de nuevo. No pedimos ninguna credencial ni archivo antes de esa conversación.",
        },
      ],
    },
    {
      id: "apres",
      title: "Después del lanzamiento",
      items: [
        {
          id: "propriete",
          question: "¿A quién pertenecen el código, el dominio y los accesos?",
          answer: "A ti, desde el primer día. El código, el alojamiento, el dominio, las cuentas de las tiendas y la documentación están a tu nombre y se entregan al finalizar el proyecto. Si mañana cambias de proveedor —o el estudio deja de estar disponible—, otro desarrollador puede retomar el proyecto sin empezar de cero.",
        },
        {
          id: "autonomie",
          question: "¿Podré modificar mi sitio web por mi cuenta?",
          answer: "Sí, si lo prevés. Para cambios habituales —horarios, noticias, fotos, tarifas—, coméntalo al definir el proyecto: construimos el sitio con un área de administración y queda incluida en el presupuesto. Si no, el sitio se entrega tal cual y nos encargamos de las modificaciones que nos solicites.",
        },
        {
          id: "maintenance",
          question: "¿Hay una suscripción? ¿Qué pasa después de la entrega?",
          answer: "La creación no tiene suscripción. El alojamiento, el dominio y, si los usas, los servicios de reservas o de pago son gastos que pagas directamente, a tu nombre. Durante un mes, las correcciones están incluidas. Después, para un sitio: mejoras con presupuesto individual o acompañamiento continuo. Para una aplicación: un plan mensual de mantenimiento opcional que la mantiene compatible con iOS y Android, disponible en las tiendas y en evolución.",
        },
      ],
    },
  ],
} as const satisfies FaqCopy
