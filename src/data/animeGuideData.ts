/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  speechText: string; // Text to be read aloud by ElevenLabs / Virtual Teacher
  subtitles: { text: string; startMs: number; durationMs: number }[];
  contentHtml?: string;
}

export interface PromptExample {
  id: string;
  title: string;
  badge: string;
  category: 'image' | 'video';
  promptEnglish: string;
  promptSpanish: string;
  explanation: string;
  promptBlocks: {
    label: string;
    englishText: string;
    spanishText: string;
    description: string;
  }[];
  sampleImageBefore?: string;
  sampleImageAfter?: string;
  sampleVideoUrl?: string;
}

export interface MistakeItem {
  id: number;
  title: string;
  problem: string;
  fix: string;
}

export const ELEVENLABS_VOICE_ID = 'Nh2zY9kknu6z4pZy6FhD';

export const GUIDE_METADATA = {
  studio: 'Alter Anime Studio',
  methodName: 'El Método Completo: De Anime a Live-Action con Inteligencia Artificial',
  tagline: 'Guía paso a paso para convertir una escena de anime en una toma cinematográfica de rodaje real — sin cámaras, sin actores y sin equipo de producción.',
  author: '@alter.anime7',
  voiceId: ELEVENLABS_VOICE_ID,
  voiceName: 'Profesor Virtual Alter (ElevenLabs)',
};

export const GUIDE_SECTIONS = [
  {
    id: 'intro',
    title: '00 · BIENVENIDA Y VISIÓN GENERAL',
    subtitle: 'Lo que serás capaz de lograr al terminar esta guía',
    speechText: '¡Hola! Bienvenido a Alter Anime Studio. Soy tu Profesor Virtual y hoy te enseñaré el método paso a paso para transformar cualquier escena de anime en una toma fotorrealista de acción en vivo con Inteligencia Artificial. No necesitas conocimientos previos de edición o modelado 3D. Te guiaré paso a paso por los dos únicos movimientos que realmente importan.',
    subtitles: [
      { text: '¡Hola! Bienvenido a Alter Anime Studio.', startMs: 0, durationMs: 2500 },
      { text: 'Soy tu Profesor Virtual y hoy te enseñaré el método completo.', startMs: 2500, durationMs: 3500 },
      { text: 'Aprenderás a transformar cualquier escena de anime en cine fotorrealista.', startMs: 6000, durationMs: 4000 },
      { text: 'Sin equipos costosos, sin actores y sin complicaciones 3D.', startMs: 10000, durationMs: 3800 },
      { text: 'Nos enfocaremos únicamente en los dos movimientos clave: Imagen y Video.', startMs: 13800, durationMs: 4500 }
    ],
    overviewCards: [
      {
        num: '01',
        title: 'Genera tu Imagen (Keyframe)',
        desc: 'Eliges una escena, extraes el fotograma clave y la IA lo transforma en una fotografía cinematográfica ultra realista.'
      },
      {
        num: '02',
        title: 'Genera tu Video (Movimiento)',
        desc: 'Tomas esa imagen fotorrealista y le das vida: movimiento de cámara, iluminación dinámica y actuación sutil.'
      }
    ]
  },
  {
    id: 'principle',
    title: 'EL PRINCIPIO EN 30 SEGUNDOS',
    subtitle: 'De Anime a Acción Real: ¿Cómo funciona exactamente?',
    speechText: 'El gran secreto es entender que un video es solo una secuencia de imágenes. No intentamos convertir una escena completa de un solo golpe. Trabajamos imagen por imagen. El camino siempre es el mismo: Primero seleccionas el clip de anime, luego extraes un fotograma nítido o keyframe, después la IA genera la imagen realista en vivo, y finalmente animamos esa imagen con video IA.',
    subtitles: [
      { text: 'El gran secreto es entender que un video es una secuencia de imágenes.', startMs: 0, durationMs: 3500 },
      { text: 'No intentamos convertir una escena completa de un solo golpe.', startMs: 3500, durationMs: 3200 },
      { text: 'Trabajamos paso a paso, imagen por imagen.', startMs: 6700, durationMs: 3000 },
      { text: 'Paso 1: Seleccionas la escena de anime que te inspira.', startMs: 9700, durationMs: 3200 },
      { text: 'Paso 2: Extraes el fotograma clave o keyframe nítido.', startMs: 12900, durationMs: 3200 },
      { text: 'Paso 3: La IA crea la imagen realista en vivo.', startMs: 16100, durationMs: 3000 },
      { text: 'Paso 4: La IA le da movimiento cinematográfico en video.', startMs: 19100, durationMs: 3500 }
    ],
    steps: [
      { step: '01 · ESCENA', action: 'Seleccionas', desc: 'Un clip de anime que te inspire por su composición e iluminación.' },
      { step: '02 · KEYFRAME', action: 'Extraes', desc: 'Un fotograma estático y super nítido de la escena.' },
      { step: '03 · IMAGEN REAL', action: 'La IA lo hace real', desc: 'Parte 1 de esta guía. Transformación a fotorrealismo.' },
      { step: '04 · VIDEO', action: 'La IA lo anima', desc: 'Parte 2 de esta guía. Movimiento de cámara y micro-expresiones.' }
    ]
  },
  {
    id: 'stack',
    title: 'TU STACK MÍNIMO DE HERRAMIENTAS',
    subtitle: 'Una sola herramienta principal para empezar sin complicaciones',
    speechText: 'Olvídate de las listas interminables de quince aplicaciones distintas. Para empezar sólo necesitas tres cosas: Una herramienta All-In-One como Higgsfield con el modelo Nano Banana, una forma de capturar la pantalla en alta resolución, y un editor básico en tu teléfono como CapCut para unir los clips.',
    subtitles: [
      { text: 'Olvídate de listas de 15 aplicaciones complicadas.', startMs: 0, durationMs: 2800 },
      { text: 'Solo necesitas un generador IA All-in-One como Higgsfield o TapNow.', startMs: 2800, durationMs: 4000 },
      { text: 'Un reproductor para capturar el fotograma en alta definición.', startMs: 6800, durationMs: 3500 },
      { text: 'Y una app de edición básica en tu celular para unir tus tomas.', startMs: 10300, durationMs: 3800 },
      { text: 'Dejamos la corrección de color avanzada y escalado para el curso experto.', startMs: 14100, durationMs: 4200 }
    ],
    toolList: [
      {
        name: 'Higgsfield (Modelo Nano Banana)',
        role: 'Generador Todo en Uno',
        desc: 'Permite generar la imagen fotorrealista y animarla a video en la misma plataforma.',
        badge: 'Recomendado'
      },
      {
        name: 'Captura de pantalla HD',
        role: 'Extracción de Keyframe',
        desc: 'Usa el reproductor de video de tu sistema para pausar y guardar el fotograma sin desenfoque de movimiento.'
      },
      {
        name: 'Editor móvil (CapCut / InShot)',
        role: 'Ensamblaje final',
        desc: 'Suficiente para unir tus cortes, agregar música y exportar en formato vertical para TikTok o Instagram Reels.'
      }
    ]
  },
  {
    id: 'part1',
    title: 'PARTE 01 · GENERA TU IMAGEN',
    subtitle: 'La regla de oro y la estructura del prompt perfecto',
    speechText: 'Todo comienza con la imagen. Si tu keyframe de acción real es excelente, tu video también lo será. Si la imagen queda defectuosa, ningún prompt de video podrá salvarla. Aprende la Regla de Oro: Si subes una imagen de referencia del rostro del personaje, ¡JAMÁS describas su cara, ropa o cabello en el prompt! Deja que la IA use la referencia visual directamente.',
    subtitles: [
      { text: 'Todo comienza en la calidad de la imagen.', startMs: 0, durationMs: 2500 },
      { text: 'Si tu keyframe es bueno, tu video será espectacular.', startMs: 2500, durationMs: 3200 },
      { text: 'Aprende la Regla de Oro: Con imagen de referencia, NO describas al personaje.', startMs: 5700, durationMs: 4500 },
      { text: 'No menciones cabello, ropa ni rostro en el texto cuando ya diste la imagen.', startMs: 10200, durationMs: 4200 },
      { text: 'Tu prompt solo debe describir la acción, el encuadre, la luz y la atmósfera.', startMs: 14400, durationMs: 4500 }
    ],
    goldenRule: {
      title: 'REGLA DE ORO DE REFERENCIA',
      rule: 'Imagen de referencia = NUNCA describas al personaje en el prompt.',
      explanation: 'Si subes una imagen de referencia de la cara o personaje, no escribas detalles físicos en el prompt (nada de color de pelo, ropa o rasgos faciales). Describirlo genera conflictos internos en la IA que distorsionan el resultado final.'
    },
    promptStructure: [
      { block: 'SUJETO', desc: 'Quién o qué está en la imagen (a menos que uses referencia).' },
      { block: 'ACCIÓN / POSICIÓN', desc: 'Qué hace el personaje, su actitud, hacia dónde mira.' },
      { block: 'ENCUADRE', desc: 'Plano medio, primer plano, plano general y ángulo de cámara.' },
      { block: 'LUZ Y COLOR', desc: 'Fuente de luz, dirección, estado de ánimo (luz suave de atardecer, neón frío...).' },
      { block: 'ESTILO Y AMBIENTE', desc: 'Fotorrealismo, cinematográfico, desaturado, grano fino de película, profundidad de campo.' },
      { block: 'A EVITAR (Negative Prompt)', desc: 'Lo que NO deseas: dibujo, anime, cartoon, manos deformes, texto en pantalla.' }
    ]
  },
  {
    id: 'part2',
    title: 'PARTE 02 · GENERA TU VIDEO',
    subtitle: 'Dándole vida: cámara, luz y micro-expresiones',
    speechText: 'Ahora que tienes tu imagen fotorrealista validada, es hora de darle movimiento. El secreto del realismo cinematográfico está en los pequeños detalles: un ligero movimiento de cámara en mano, motas de polvo cruzando la luz y una respiración casi imperceptible. La trampa número uno de los principiantes es pedir mucha acción. ¡Demasiado movimiento rompe la IA!',
    subtitles: [
      { text: 'Ahora que tienes tu imagen lista, es momento de animarla.', startMs: 0, durationMs: 3200 },
      { text: 'Subes tu imagen en modo Image-to-Video como primer fotograma.', startMs: 3200, durationMs: 3800 },
      { text: 'El secreto del cine está en los micro-movimientos sutiles.', startMs: 7000, durationMs: 3600 },
      { text: 'Evita la trampa número 1: Demasiado movimiento destruye la coherencia de la IA.', startMs: 10600, durationMs: 4200 },
      { text: 'Una mirada girando lentamente transmite diez veces más impacto que una pelea fallida.', startMs: 14800, durationMs: 4800 }
    ],
    videoRules: [
      { rule: 'Movimiento de Cámara', detail: 'Sutil acercamiento (push-in), ligero paneo o cámara en mano (handheld).' },
      { rule: 'Movimiento del Sujeto', detail: 'Micro-movimientos: parpadeo, giro suave de cabeza, cabello al viento.' },
      { rule: 'Luz y Atmósfera Viva', detail: 'Humo flotando, lluvia cayendo, reflejos temblorosos en el piso.' },
      { rule: 'Evita la Catástrofe', detail: 'Cuerpos corriendo bruscamente, multitudes en acción o movimientos de manos exagerados.' }
    ]
  }
];

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: 'prompt-img-1',
    title: 'PROMPT A · Imagen a Live-Action (Sin Referencia previa)',
    badge: 'Imagen · El más sencillo',
    category: 'image',
    promptEnglish: `Live-action realistic version of this frame, photographic, true-to-life skin and textures. Keep the original composition and pose. A young person stands in the rain at night, looking off-frame, calm expression. Medium shot, slight low angle. Cold blue street light, wet reflective ground, soft fog in the background. Cinematic, lightly desaturated, fine film grain, shallow depth of field. Avoid: anime, cartoon, illustration, distorted hands, on-screen text.`,
    promptSpanish: `Versión fotorrealista en vivo de esta imagen, fotográfica, piel y texturas realistas. Mantiene la composición y pose original. Una persona joven parada bajo la lluvia de noche, mirando fuera de campo, expresión tranquila. Plano medio, ángulo ligeramente bajo. Luz callejera azul fría, suelo mojado reflectante, niebla suave de fondo. Cinematográfico, ligeramente desaturado, grano de película fino, profundidad de campo reducida. Evitar: anime, caricatura, ilustración, manos deformadas, texto en pantalla.`,
    explanation: 'Este prompt se utiliza cuando subes tu fotograma de anime directamente y quieres que la IA mantenga la pose pero reemplace todo el estilo de dibujo por fotorrealismo de película.',
    promptBlocks: [
      {
        label: 'ESTILO BASE',
        englishText: 'Live-action realistic version of this frame, photographic, true-to-life skin and textures.',
        spanishText: 'Versión fotorrealista de este fotograma, textura de piel y ropa real.',
        description: 'Define la transición directa de ilustración a fotografía real.'
      },
      {
        label: 'SUJETO Y POSE',
        englishText: 'A young person stands in the rain at night, looking off-frame, calm expression.',
        spanishText: 'Joven parado bajo la lluvia mirando fuera de campo, expresión serena.',
        description: 'Describe la escena sin exagerar movimientos.'
      },
      {
        label: 'ENCUADRE Y CÁMARA',
        englishText: 'Medium shot, slight low angle.',
        spanishText: 'Plano medio, ángulo sutilmente bajo.',
        description: 'Le indica a la lente virtual dónde posicionarse.'
      },
      {
        label: 'ILUMINACIÓN Y COLOR',
        englishText: 'Cold blue street light, wet reflective ground, soft fog in background. Cinematic, lightly desaturated, fine film grain.',
        spanishText: 'Luz de calle azul fría, piso mojado con reflejos, niebla suave, desaturado con grano de película.',
        description: 'Atmósfera cinematográfica estilo Hollywood.'
      },
      {
        label: 'NEGATIVOS (AVOID)',
        englishText: 'Avoid: anime, cartoon, illustration, distorted hands, on-screen text.',
        spanishText: 'Evitar: anime, caricaturas, ilustración, manos deformadas, textos.',
        description: 'Filtro de seguridad para eliminar rastros de dibujo.'
      }
    ],
    sampleImageBefore: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    sampleImageAfter: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prompt-img-2',
    title: 'PROMPT B · Con Referencia de Personaje (Golden Rule)',
    badge: 'Imagen · Para continuidad',
    category: 'image',
    promptEnglish: `Place the referenced character into this scene as a realistic live-action photograph. The character walks slowly down an empty corridor, head turned slightly toward camera. Tracking medium shot at eye level. Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors, fine grain, shallow depth of field. Avoid: anime, cartoon, extra fingers, text, logos.`,
    promptSpanish: `Coloca al personaje de referencia en esta escena como una fotografía realista de acción en vivo. El personaje camina lentamente por un pasillo vacío, la cabeza girada ligeramente hacia la cámara. Plano medio en seguimiento a la altura de los ojos. Luz tenue y cálida desde arriba, sombras largas, polvo en el aire. Cinematográfico, colores desaturados, grano fino, profundidad de campo reducida. Evitar: anime, caricatura, dedos de más, texto, logotipos.`,
    explanation: '¡Atención a la Regla de Oro! Fíjate cómo NO describimos el color de ojos, pelo o vestimenta, ya que la IA toma esos datos directamente de la imagen de referencia cargada.',
    promptBlocks: [
      {
        label: 'INSERCIÓN DE PERSONAJE',
        englishText: 'Place the referenced character into this scene as a realistic live-action photograph.',
        spanishText: 'Ubica al personaje referenciado en la escena en formato fotográfico realista.',
        description: 'Ancla al personaje subido a la toma.'
      },
      {
        label: 'ACCIÓN Y ENCUADRE',
        englishText: 'Walks slowly down an empty corridor, head turned toward camera. Tracking medium shot.',
        spanishText: 'Camina despacio por un pasillo, cabeza girada a cámara. Toma en seguimiento.',
        description: 'Composición dinámica y elegante.'
      },
      {
        label: 'ILUMINACIÓN AMBIENTAL',
        englishText: 'Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors.',
        spanishText: 'Luz superior cálida, sombras largas, partículas de polvo flotando.',
        description: 'Garantiza profundidad y realismo físico.'
      }
    ],
    sampleImageBefore: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    sampleImageAfter: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prompt-img-3',
    title: 'PROMPT C · Texto a Imagen (Generación desde Cero)',
    badge: 'Imagen · Generación libre',
    category: 'image',
    promptEnglish: `Cinematic live-action photograph. A lone figure in a dark trench coat stands on a rooftop at dusk, city skyline behind, wind moving the coat. Wide shot, low angle looking up. Last warm sunlight on one side, deep cold shadow on the other. Realistic skin and fabric, muted teal-and-amber grade, fine film grain, shallow depth of field, photorealistic. Avoid: anime, illustration, 3D render look, plastic skin, distorted anatomy, watermark, on-screen text.`,
    promptSpanish: `Fotografía cinematográfica de acción en vivo. Una figura solitaria con abrigo oscuro en la azotea al atardecer, horizonte de la ciudad al fondo, el viento moviendo el abrigo. Plano general, ángulo bajo mirando hacia arriba. Última luz cálida del sol en un lado, sombra fría y profunda en el otro. Piel y tela realistas, gradación teal y ámbar desaturada, grano fino, profundidad de campo reducida, fotorrealista. Evitar: anime, ilustración, aspecto 3D, piel de plástico, anatomía deformada, marca de agua, texto en pantalla.`,
    explanation: 'Utiliza este prompt cuando quieras crear una escena épica desde cero usando solo texto antes de animarla.',
    promptBlocks: [
      {
        label: 'ESTILO CINEMATOGRÁFICO',
        englishText: 'Cinematic live-action photograph. Photorealistic.',
        spanishText: 'Fotografía fotorrealista de cine de acción real.',
        description: 'Elimina el aspecto de render digital o videojuego.'
      },
      {
        label: 'ILUMINACIÓN DUAL',
        englishText: 'Last warm sunlight on one side, deep cold shadow on the other. Teal-and-amber grade.',
        spanishText: 'Luz cálida de atardecer en un lado, sombra azul fría en el otro. Corrección de color teal y ámbar.',
        description: 'Técnica de iluminación cinematográfica muy valorada.'
      }
    ],
    sampleImageBefore: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    sampleImageAfter: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prompt-vid-1',
    title: 'PROMPT VIDEO 1 · Retrato Intenso (Opción Recomendada)',
    badge: 'Video · 100% Seguro',
    category: 'video',
    promptEnglish: `The character stays almost still and slowly turns their head toward the camera, then blinks once. Subtle handheld camera with a very slow push-in. Hair and clothing move slightly in a light breeze. Soft fog drifts in the background. Cinematic, calm, realistic motion. Keep the body static, only micro-movements. Avoid: fast motion, distorted face, extra limbs, morphing.`,
    promptSpanish: `El personaje permanece casi inmóvil y gira lentamente la cabeza hacia la cámara, luego parpadea una vez. Cámara en mano sutil con un acercamiento (push-in) muy lento. El cabello y la ropa se mueven ligeramente con una brisa suave. Niebla suave flotando al fondo. Movimiento cinematográfico, tranquilo y realista. Mantener el cuerpo estático, solo micro-movimientos. Evitar: movimiento rápido, rostro deformado, extremidades extra, metamorfosis.`,
    explanation: 'El prompt más seguro para evitar distorsiones en la IA. Cero movimientos bruscos, alto impacto emocional.',
    promptBlocks: [
      {
        label: 'MOVIMIENTO SUJETO',
        englishText: 'Stays almost still and slowly turns head toward camera, blinks once.',
        spanishText: 'Permanece casi inmóvil, gira lentamente la cabeza a cámara y parpadea una vez.',
        description: 'Garantiza que la cara mantenga la misma estructura sin deformarse.'
      },
      {
        label: 'MOVIMIENTO CÁMARA',
        englishText: 'Subtle handheld camera with a very slow push-in.',
        spanishText: 'Cámara en mano sutil con acercamiento suave constante.',
        description: 'Simula a un camarógrafo profesional operando la cámara.'
      },
      {
        label: 'ELEMENTOS VIVOS',
        englishText: 'Hair and clothing move slightly in breeze, soft fog drifts in background.',
        spanishText: 'Cabello y ropa moviéndose suavemente con la brisa, niebla flotando de fondo.',
        description: 'El detalle que rompe la sensación de imagen estática.'
      }
    ],
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dramatic-close-up-of-a-woman-in-the-rain-41225-large.mp4'
  },
  {
    id: 'prompt-vid-2',
    title: 'PROMPT VIDEO 2 · Caminata Lenta y Atmósfera',
    badge: 'Video · Tracking Shot',
    category: 'video',
    promptEnglish: `The character walks slowly forward, calm and steady. Smooth tracking shot following from a short distance, gentle handheld feel. Rain falls softly, reflections shimmer on the wet ground, breath faintly visible. Slow, weighty, cinematic pace. Realistic motion, no sudden movement. Avoid: running, jitter, warping limbs, melting face, background people moving fast.`,
    promptSpanish: `El personaje camina lentamente hacia adelante, tranquilo y constante. Toma de seguimiento suave desde corta distancia, sensación sutil de cámara en mano. La lluvia cae suavemente, los reflejos brillan en el suelo mojado, el aliento es sutilmente visible. Ritmo lento, pesado y cinematográfico. Movimiento realista, sin movimientos bruscos. Evitar: correr, temblor, extremidades deformadas, cara derretida, personas al fondo moviéndose rápido.`,
    explanation: 'Perfecto para planos medios donde el personaje avanza hacia la cámara sin perder el enfoque.',
    promptBlocks: [
      {
        label: 'CAMINATA CONTROLADA',
        englishText: 'Walks slowly forward, calm and steady. Slow weighty pace.',
        spanishText: 'Camina despacio hacia adelante con paso firme y pesado.',
        description: 'Evita que la IA acelere los pasos o genere piernas flotantes.'
      },
      {
        label: 'ATMÓSFERA CLIMÁTICA',
        englishText: 'Rain falls softly, reflections shimmer on wet ground, breath faintly visible.',
        spanishText: 'Lluvia suave, reflejos en piso mojado, aliento helado visible.',
        description: 'Aumenta el nivel de realismo ambiental.'
      }
    ],
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-under-the-rain-41312-large.mp4'
  },
  {
    id: 'prompt-vid-3',
    title: 'PROMPT VIDEO 3 · Plano General Contemplativo',
    badge: 'Video · Plano Amplio',
    category: 'video',
    promptEnglish: `Very slow camera push-in on the figure standing still, coat moving gently in the wind. Clouds drift slowly behind. Light shifts subtly as if the sun is setting. Wide cinematic shot, steady with a faint handheld sway. Quiet, epic, atmospheric. Minimal subject movement. Avoid: fast pan, shaking, distortion, duplicated subject, on-screen text.`,
    promptSpanish: `Acercamiento muy lento de la cámara hacia la figura inmóvil, el abrigo se mueve suavemente con el viento. Las nubes se desplazan lentamente detrás. La luz cambia sutilmente como si se estuviera poniendo el sol. Plano cinematográfico amplio, estable con un leve balanceo de cámara en mano. Silencioso, épico, atmosférico. Movimiento mínimo del sujeto. Evitar: paneo rápido, sacudidas, distorsión, sujeto duplicado, texto en pantalla.`,
    explanation: 'Ideal para la toma de apertura de un video. Crea una atmósfera épica y cinematográfica.',
    promptBlocks: [
      {
        label: 'COMPOSICIÓN ÉPICA',
        englishText: 'Wide cinematic shot, steady with faint handheld sway.',
        spanishText: 'Plano general amplio cinematográfico con leve movimiento de mano.',
        description: 'Otorga escala y majestuosidad a la escena.'
      },
      {
        label: 'TIEMPO DINÁMICO',
        englishText: 'Clouds drift slowly behind, light shifts subtly as sun sets.',
        spanishText: 'Nubes desplazándose y luz cambiando lentamente al atardecer.',
        description: 'Crea una evolución temporal en pocos segundos.'
      }
    ],
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-person-standing-on-a-rock-looking-at-the-ocean-41381-large.mp4'
  }
];

export const MISTAKES_LIST: MistakeItem[] = [
  {
    id: 1,
    title: 'Querer una escena de acción compleja en tu primera toma',
    problem: 'Pedir peleas, saltos acrobáticos o explosiones dinámicas en la primera generación.',
    fix: 'Comienza siempre con micro-movimientos (mirada lenta, parpadeo, viento en la ropa). El 90% del éxito en IA radica en la sutileza.'
  },
  {
    id: 2,
    title: 'Describir al personaje cuando usas una imagen de referencia',
    problem: 'Escribir "chico de cabello castaño y chaqueta negra" teniendo cargada la foto del personaje.',
    fix: 'Si cargaste la imagen de referencia, NUNCA la describas en el prompt. Tu prompt debe enfocarse 100% en el entorno, luz, cámara y clima.'
  },
  {
    id: 3,
    title: 'Sobrecargar el prompt de video con demasiada indicación',
    problem: 'Pedir que el personaje camine, mire al cielo, salude, sonría y corra en un mismo prompt de 4 segundos.',
    fix: 'Elige un solo movimiento principal por toma. Para acciones complejas, genera múltiples tomas breves y únelas en tu editor de video.'
  },
  {
    id: 4,
    title: 'Partir de un Keyframe borroso o de baja resolución',
    problem: 'Hacer una captura de pantalla durante un desenfoque de movimiento (motion blur) o con baja resolución.',
    fix: 'Pausa el video exactamente en un cuadro estático y nítido. Si el fotograma de origen es borroso, la IA generará rostros deformes.'
  },
  {
    id: 5,
    title: 'Quedarte con el primer resultado que genera la IA',
    problem: 'Aceptar la primera imagen o video generado sin probar variaciones.',
    fix: 'Genera de 3 a 5 variaciones con el mismo prompt. La IA es estocástica; seleccionar la mejor variación entre varias marca la diferencia profesional.'
  }
];

export const CHECKLIST_ITEMS = [
  { id: 'c1', text: 'Elegir un clip de anime con composición limpia y bien enfocada', done: false },
  { id: 'c2', text: 'Pausar en fotograma estático sin desenfoque de movimiento', done: false },
  { id: 'c3', text: 'Guardar la captura (Keyframe) en máxima resolución posible', done: false },
  { id: 'c4', text: 'Subir el Keyframe a Higgsfield / TapNow / Seedance', done: false },
  { id: 'c5', text: 'Escribir el Prompt de Imagen (aplicando la Regla de Oro de referencias)', done: false },
  { id: 'c6', text: 'Generar de 3 a 5 opciones y seleccionar la mejor imagen fotorrealista', done: false },
  { id: 'c7', text: 'Pasar al modo Image-to-Video cargando la imagen validada', done: false },
  { id: 'c8', text: 'Redactar el Prompt de Video enfocando en cámara y micro-movimientos', done: false },
  { id: 'c9', text: 'Verificar que no haya deformaciones en rostro ni extremidades', done: false },
  { id: 'c10', text: 'Exportar la toma lista para montaje o publicar en tus redes (@alter.anime7)', done: false }
];

export const NEXT_STEPS = [
  {
    title: 'Etalonaje de Color (DaVinci Resolve)',
    desc: 'Logra la firma cinematográfica aplicando tonos fríos, contraste de curvas y lut cinemáticos.'
  },
  {
    title: 'Escalado y Conversión de FPS (Topaz Video AI)',
    desc: 'Pasa de una generación estándar a 4K 60FPS fluidos con nitidez de transmisión de televisión.'
  },
  {
    title: 'Consistencia de Personajes Múltiples',
    desc: 'Mantén el mismo actor y estética a lo largo de toda una secuencia o cortometraje de varios minutos.'
  },
  {
    title: 'Edición de Sonido y Ritmo Creador',
    desc: 'Combina efectos de sonido foley (pasos, lluvia) con música dramática para envolver al espectador.'
  }
];
