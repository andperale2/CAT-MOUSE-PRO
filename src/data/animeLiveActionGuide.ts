/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptItem {
  id: string;
  titleEs: string;
  titleEn: string;
  tag: string;
  promptEnglish: string; // The exact prompt to copy & paste into AI tools
  explanationSpanish: string; // Educational breakdown in Latin American Spanish
  elements: { label: string; value: string }[];
}

export interface MistakeItem {
  id: number;
  title: string;
  problem: string;
  solution: string;
}

export interface GuideSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  professorExplanation: string; // Audio script spoken by ElevenLabs / Virtual Professor
  contentSpanish: string;
  highlights?: string[];
}

export const ELEVENLABS_VOICE_ID = 'Nh2zY9kknu6z4pZy6FhD';

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'intro',
    number: '00',
    title: 'Bienvenida al Método Completo',
    subtitle: 'De Anime a Live-Action con Inteligencia Artificial',
    professorExplanation: '¡Hola! Bienvenido a Alter Anime Studio. Soy tu Profesor Virtual. En esta guía te enseñaré paso a paso el método exacto para transformar cualquier escena de anime en una toma cinematográfica hiperrealista, sin necesidad de cámaras, actores ni presupuesto de producción.',
    contentSpanish: `Esta guía te lleva desde cero hasta tu primera toma de acción real (*live-action*), generada y lista para publicar. Sin rodeos: analizaremos los dos únicos pasos que realmente importan, en orden.

**Parte 1 — Generar tu imagen.** Elige una escena, extrae una imagen de referencia (*keyframe*) y conviértela en una pieza visual realista.

**Parte 2 — Generar tu video.** Toma esa imagen y dale vida: movimiento de cámara, iluminación y actuación — sin que la IA colapse.

Este es el flujo de trabajo exacto que usamos a diario en el estudio. Nada teórico: copias, pegas y generas.`
  },
  {
    id: 'who-and-principle',
    number: '01',
    title: '¿Para quién es y cuál es el principio?',
    subtitle: 'El flujo fundamental en 30 segundos',
    professorExplanation: 'Esta guía está diseñada para principiantes absolutos. Si sabes descargar un video y copiar y pegar texto, tienes el nivel necesario. La clave está en entender que un video es una secuencia de imágenes: no convertimos la escena de un solo golpe, sino imagen por imagen.',
    contentSpanish: `### ¿Para quién es?
**Principiantes absolutos.**
Si puedes descargar un video y copiar-pegar texto, tienes el nivel. No se requieren habilidades de edición ni de 3D para este primer paso.

---

### El principio en 30 segundos: Anime → Live-action

Un video es una secuencia de imágenes. Por eso no "conviertes" una escena de golpe: trabajas imagen por imagen. El camino siempre es el mismo:

1. **01 · ESCENA (Anime)**: Eliges un clip de anime que te inspire.
2. **02 · KEYFRAME (Fotograma)**: Extraes una captura fija y nítida de la escena.
3. **03 · IMAGEN REAL**: La IA la transforma en imagen realista (*Parte 1 de esta guía*).
4. **04 · VIDEO**: La IA le da movimiento y animación (*Parte 2 de esta guía*).

Esta guía cubre los dos pasos más críticos — **03 (generar la imagen)** y **04 (generar el video)**. Ahí se decide el 90% del resultado.`
  },
  {
    id: 'stack',
    number: '02',
    title: 'Tu Herramental Mínimo',
    subtitle: 'Una sola herramienta para comenzar',
    professorExplanation: 'Olvídate de listas坑 interminables con 15 aplicaciones diferentes. Para empezar solo necesitas tres cosas simples: un generador Todo-en-Uno como Higgsfield o TapNow, una forma de hacer captura de pantalla y el editor básico de tu teléfono.',
    contentSpanish: `### Olvida la lista de 15 aplicaciones

Para esta primera guía, todo lo que necesitas es esto:

* **Una herramienta de generación IA Todo-en-Uno**: Recomendamos **Higgsfield** (modelo *Nano Banana* para la imagen + generación de video integrada). Alternativas: **TapNow** / **Seedance**. Al tener imagen y video en el mismo lugar, evitas saltar de app en app.
* **Un método para capturar fotogramas**: Un reproductor de video y la tecla de captura de pantalla son suficientes para empezar.
* **Un editor básico**: La app de edición de tu teléfono es más que suficiente para unir tus tomas.

#### ¿Por qué no usar DaVinci o Topaz de inmediato?
Porque la corrección de color (*color grading*), el reescalado (*upscaling*) y la conversión de FPS son lo que separa un video "bueno" de uno con "firma de autor". Eso lo reservamos para el curso avanzado. Aquí buscamos terminar y publicar tu primera toma, no la perfección prematura.`
  },
  {
    id: 'part1-image',
    number: '03',
    title: 'Parte 01 — Generar tu Imagen',
    subtitle: 'La base de todo el realismo',
    professorExplanation: 'Todo comienza con la imagen. Si tu fotograma realista es de alta calidad, tu video también lo será. Si la imagen queda mal, ningún prompt de video podrá salvarla. Tómate el tiempo necesario aquí.',
    contentSpanish: `### 1. Elige y extrae tu keyframe
Elige una escena con una composición fuerte: un personaje de frente o de perfil, un plano general impactante, una mirada. Por ahora, **evita tomas cargadas de acción o con muchos personajes**; cuanto más simple sea, más fiel será la IA.

* Pausa el video en el momento exacto que deseas recrear.
* Captura un fotograma nítido (evita el desenfoque de movimiento o *motion blur*). Ese es tu *keyframe*: la imagen de referencia.
* Mantén una buena resolución; una imagen muy pequeña dará un resultado borroso.

---

### 2. Convierte el keyframe en una imagen realista
En tu herramienta tendrás 3 formas de generar la imagen realista:

1. **A · Imagen → Live-action (Imagen a Realidad)**: Subes tu fotograma de anime y pides la versión realista. La IA conserva la composición y la pose, cambiando el estilo anime por foto real. Ideal para empezar.
2. **B · Imagen + Referencia de Personaje**: Subes la escena más una foto del rostro del actor o personaje real.
3. **C · Texto → Imagen (Desde Cero)**: Creas la toma únicamente describiendo la escena con texto.`
  },
  {
    id: 'prompt-rules',
    number: '04',
    title: 'Estructura del Prompt de Imagen',
    subtitle: 'La Regla de Oro y la Regla del Prompt Autosuficiente',
    professorExplanation: 'Un buen prompt no es una oración al azar. Es una estructura ordenada por bloques de mayor a menor importancia: Sujeto, Acción o Pose, Encuadre, Luz, Mood y lo que debes Evitar. Recuerda la Regla de Oro: si subes una foto de referencia, jamás describas el rostro o cabello en el prompt.',
    contentSpanish: `### Estructura por bloques de importancia

Un buen prompt se construye en este orden:

1. **SUJETO (SUBJECT)**: Quién / qué está en la imagen (salvo si usas imagen de referencia).
2. **ACCIÓN / POSE (ACTION/POSE)**: Qué hace el personaje, su actitud, hacia dónde mira.
3. **ENCUADRE (FRAMING)**: Plano general, primer plano, ángulo bajo (*low angle*), etc.
4. **ILUMINACIÓN (LIGHT)**: Fuente, dirección, ambiente (luz suave de atardecer, neón frío...).
5. **ESTILO Y AMBIENTE (MOOD)**: Sensación: fotográfico realista, cinematográfico, desaturado, grano fino de película.
6. **LO QUE DEBES EVITAR (AVOID)**: Dibujos, anime, caricatura, distorsiones de manos, texto en pantalla.

---

### 👑 Regla de Oro
**Imagen de referencia = NUNCA describas al personaje.**
Si subiste una imagen de referencia del rostro o personaje, **no lo describas en el prompt** (nada de color de pelo, ropa ni facciones). La referencia basta; describirlo genera conflictos que deforman el resultado. En ese caso, el prompt solo lleva la acción, encuadre, luz y ambiente.

---

### 💡 CONSEJO: Prompt autosuficiente
Cada prompt debe funcionar por sí solo. La IA empieza desde cero en cada generación: no entiende cosas como *"como en la toma anterior"*. Todo lo importante debe estar en ESTE prompt.`
  },
  {
    id: 'part2-video',
    number: '05',
    title: 'Parte 02 — Generar tu Video',
    subtitle: 'Animando la imagen realista',
    professorExplanation: 'Una vez validada tu imagen realista, es momento de animarla. En el modo Image-to-Video, subes tu imagen aprobada como primer fotograma y le das a la IA un prompt enfocado exclusivamente en el movimiento.',
    contentSpanish: `### 1. Sube tu keyframe validado
En el modo de video (**Image-to-Video**), cargas la imagen realista generada en la Parte 1. Esta se convierte en el primer fotograma (*first frame*) del video. La IA parte de esta imagen exacta y la pone en movimiento, manteniendo la coherencia visual.

---

### 2. Escribe el prompt de video
Misma lógica que con la imagen, pero aquí **todo gira en torno al movimiento**. Describe en este orden:

1. **Movimiento de cámara**: Avance suave (*push-in*), cámara en mano sutil (*gentle handheld*), panorámica lenta (*slow pan*). Mantenlo discreto.
2. **Movimiento del sujeto**: Pequeño: un parpadeo, un giro de cabeza lento, respiración, cabello con el viento. Sin gestos bruscos.
3. **Luz viva y atmósfera**: Humo flotando, lluvia cayendo, reflejos en movimiento.
4. **Qué evitar**: Movimientos abruptos, multitudes en acción, manos agitándose (ahí es donde la IA falla).

---

### ⚠️ Trampa #1: Mucho movimiento = La IA colapsa
El error típico de principiante es pedir una escena de acción espectacular. El resultado: rostros derretidos, extremidades extra y parpadeo visual.
**La solución**: cámara en mano discreta + microexpresiones + cuerpo casi estático. Una mirada que gira lentamente es diez veces más potente que una pelea defectuosa.

---

### 🎬 El secreto de una toma "cinematográfica"
El realismo proviene de los pequeños detalles vivos: un leve flote de la cámara (como si fuera sostenida a mano), motas de polvo cruzando la luz, una respiración casi invisible. Eso es lo que hace olvidar que fue generado por IA.`
  },
  {
    id: 'checklist-and-mistakes',
    number: '06',
    title: 'Errores Comunes y Lista de Verificación',
    subtitle: 'Lo que debes dominar para evitar fallos',
    professorExplanation: 'Repasemos los 5 errores clásicos de los principiantes. Evitar estos fallos acelerará tu aprendizaje y te ahorrará horas de pruebas fallidas.',
    contentSpanish: `Revisa estos 5 errores habituales antes de rendir tu primera generación:`
  },
  {
    id: 'whats-next',
    number: '07',
    title: '¿Qué Sigue Ahora?',
    subtitle: 'El mapa de ruta para elevar tu nivel',
    professorExplanation: '¡Felicidades! Acabas de desbloquear lo más difícil: comenzar. Con estos dos pasos —generar la imagen y luego el video— ya puedes producir y publicar tus primeras tomas reales. Repite el proceso con 3 o 4 escenas para agudizar tu ojo.',
    contentSpanish: `### Acabas de desbloquear lo más difícil: Empezar

Con estos dos movimientos —generar la imagen y luego el video— ya puedes producir y publicar tus primeras tomas hiperrealistas. Repite este flujo con 3 o 4 escenas: con la práctica tu ojo se agudizará y los prompts saldrán por reflejo.

---

### Hacia dónde avanzar ahora:
1. **Color grading (DaVinci Resolve)**: Consigue ese aspecto frío y cinematográfico de autor.
2. **Upscaling & FPS (Topaz Video AI)**: Pasa de un look "generado por IA" a calidad de emisión profesional.
3. **Consistencia multi-toma**: Mantén al mismo actor y estilo visual durante toda una secuencia.
4. **Sonido y edición rítmica**: Lo que convierte tomas sueltas en un video impactante.

Domina estos temas uno a la vez, de la misma forma que dominaste los dos primeros.

**Muestra lo que creas.**
Publica tu primera toma y etiqueta al estudio: **@alter.anime7** — ¡estamos atentos a tu trabajo!`
  }
];

export const IMAGE_PROMPTS: PromptItem[] = [
  {
    id: 'prompt-a-no-ref',
    titleEs: 'PROMPT A — Sin referencia (Imagen → Live)',
    titleEn: 'PROMPT A — no ref (image -> live)',
    tag: 'Recomendado para empezar',
    promptEnglish: `Live-action realistic version of this frame, photographic, true-to-life skin and textures. Keep the original composition and pose. A young person stands in the rain at night, looking off-frame, calm expression. Medium shot, slight low angle. Cold blue street light, wet reflective ground, soft fog in the background. Cinematic, lightly desaturated, fine film grain, shallow depth of field. Avoid: anime, cartoon, illustration, distorted hands, on-screen text.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Estilo visual**: Versión realista en live-action de este fotograma, fotográfico, piel y texturas fieles a la realidad. Mantén la composición y pose original.
* **Sujeto y Pose**: Una persona joven de pie bajo la lluvia por la noche, mirando fuera de cuadro, expresión tranquila.
* **Encuadre**: Plano medio, ángulo ligeramente bajo (*slight low angle*).
* **Iluminación**: Luz de calle azul fría, suelo húmedo y reflectante, niebla suave en el fondo.
* **Mood Cinematográfico**: Cinematográfico, ligeramente desaturado, grano fino de película, profundidad de campo reducida (*shallow depth of field*).
* **Evitar (Avoid)**: Anime, dibujo animado, ilustración, manos distorsionadas, texto en pantalla.`,
    elements: [
      { label: 'Sujeto', value: 'Persona joven mirando fuera de cuadro' },
      { label: 'Encuadre', value: 'Plano medio, ángulo bajo sutil' },
      { label: 'Iluminación', value: 'Luz callejera azul fría y suelo mojado' },
      { label: 'Mood', value: 'Cinematográfico desaturado con grano de película' }
    ]
  },
  {
    id: 'prompt-b-with-ref',
    titleEs: 'PROMPT B — Con referencia de personaje',
    titleEn: 'PROMPT B — with character reference',
    tag: 'Usa imagen facial / actor',
    promptEnglish: `Place the referenced character into this scene as a realistic live-action photograph. The character walks slowly down an empty corridor, head turned slightly toward camera. Tracking medium shot at eye level. Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors, fine grain, shallow depth of field. Avoid: anime, cartoon, extra fingers, text, logos.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Instrucción de Referencia**: Coloca al personaje referenciado en esta escena como una fotografía realista en live-action.
* **Acción (Sin describir la cara)**: El personaje camina lentamente por un pasillo vacío, con la cabeza ligeramente girada hacia la cámara.
* **Encuadre**: Plano medio de seguimiento a la altura de los ojos (*tracking medium shot at eye level*).
* **Luz**: Luz cenital cálida y tenue, sombras largas, polvo flotando en el aire.
* **Estilo**: Cinematográfico, colores apagados, grano fino, profundidad de campo reducida.
* **Regla estricta**: ¡No se describe rostro, cabello ni atuendo! La imagen de referencia se encarga de eso.`,
    elements: [
      { label: 'Sujeto', value: 'Personaje de la referencia (sin descripción facial)' },
      { label: 'Acción', value: 'Caminata lenta por pasillo con mirada a cámara' },
      { label: 'Luz', value: 'Luz cálida de techo con polvo ambiental' },
      { label: 'Evitar', value: 'Anime, dedos extra, logos, texto' }
    ]
  },
  {
    id: 'prompt-c-text-to-image',
    titleEs: 'PROMPT C — Texto a Imagen (Desde Cero)',
    titleEn: 'PROMPT C — text -> image (from scratch)',
    tag: 'Generación pura por texto',
    promptEnglish: `Cinematic live-action photograph. A lone figure in a dark trench coat stands on a rooftop at dusk, city skyline behind, wind moving the coat. Wide shot, low angle looking up. Last warm sunlight on one side, deep cold shadow on the other. Realistic skin and fabric, muted teal-and-amber grade, fine film grain, shallow depth of field, photorealistic. Avoid: anime, illustration, 3D render look, plastic skin, distorted anatomy, watermark, on-screen text.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Tipo**: Fotografía cinematográfica en live-action.
* **Sujeto y Pose**: Una figura solitaria con abrigo oscuro en la azotea al atardecer, horizonte de la ciudad al fondo, el viento moviendo el abrigo.
* **Encuadre**: Plano general, ángulo bajo mirando hacia arriba.
* **Luz de Contraste**: Última luz cálida del sol en un lado, sombra fría profunda en el otro (contraste teal-and-amber).
* **Textura**: Piel y telas realistas, grano de película fino, fotorrealista.
* **Evitar**: Look de render 3D, piel de plástico, anatomía distorsionada, marcas de agua.`,
    elements: [
      { label: 'Sujeto', value: 'Figura solitaria con abrigo en azotea urbana' },
      { label: 'Luz', value: 'Bicolor atardecer (Teal & Amber cálido/frío)' },
      { label: 'Encuadre', value: 'Plano general desde ángulo contrapicado' },
      { label: 'Calidad', value: 'Fotorrealista con texturas reales de tela' }
    ]
  }
];

export const VIDEO_PROMPTS: PromptItem[] = [
  {
    id: 'video-prompt-1',
    titleEs: 'PROMPT 1 — Retrato Intenso (El más seguro)',
    titleEn: 'PROMPT 1 — intense portrait (the safest)',
    tag: 'Riesgo Mínimo de Glitch',
    promptEnglish: `The character stays almost still and slowly turns their head toward the camera, then blinks once. Subtle handheld camera with a very slow push-in. Hair and clothing move slightly in a light breeze. Soft fog drifts in the background. Cinematic, calm, realistic motion. Keep the body static, only micro-movements. Avoid: fast motion, distorted face, extra limbs, morphing.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Movimiento del Sujeto**: El personaje permanece casi inmóvil y gira lentamente la cabeza hacia la cámara, luego parpadea una vez.
* **Cámara**: Cámara en mano sutil con un acercamiento muy lento (*slow push-in*).
* **Atmósfera**: El cabello y la ropa se mueven ligeramente con una brisa suave. Niebla ligera flotando al fondo.
* **Control**: Movimiento calmado y realista. Mantén el cuerpo estático, solo micro-movimientos.
* **Evitar**: Movimientos rápidos, rostro deformado, extremidades extra, deformación de forma (*morphing*).`,
    elements: [
      { label: 'Cámara', value: 'Acercamiento muy lento con pulso natural' },
      { label: 'Sujeto', value: 'Giro de cabeza lento + 1 parpadeo' },
      { label: 'Detalles', value: 'Brisa ligera en cabello + niebla sutil' }
    ]
  },
  {
    id: 'video-prompt-2',
    titleEs: 'PROMPT 2 — Caminata Lenta / Atmósfera',
    titleEn: 'PROMPT 2 — slow walk / atmosphere',
    tag: 'Toma Cinematográfica',
    promptEnglish: `The character walks slowly forward, calm and steady. Smooth tracking shot following from a short distance, gentle handheld feel. Rain falls softly, reflections shimmer on the wet ground, breath faintly visible. Slow, weighty, cinematic pace. Realistic motion, no sudden movement. Avoid: running, jitter, warping limbs, melting face, background people moving fast.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Sujeto**: El personaje avanza lentamente hacia adelante, con paso firme y calmado.
* **Cámara**: Plano de seguimiento fluido (*tracking shot*) desde corta distancia con sensación de cámara en mano sutil.
* **Entorno**: La lluvia cae suavemente, los reflejos destellan en el suelo mojado, el aliento es sutilmente visible por el frío.
* **Ritmo**: Ritmo lento, con peso visual cinematográfico. Sin movimientos repentinos.
* **Evitar**: Correr, vibración brusca, deformación de brazos o piernas, cara derretida.`,
    elements: [
      { label: 'Cámara', value: 'Seguimiento frontal constante' },
      { label: 'Sujeto', value: 'Paso lento y pausado' },
      { label: 'Atmósfera', value: 'Lluvia, suelo brillante y aliento helado' }
    ]
  },
  {
    id: 'video-prompt-3',
    titleEs: 'PROMPT 3 — Plano General Contemplativo',
    titleEn: 'PROMPT 3 — contemplative wide shot',
    tag: 'Gran Escena Epic / Calm',
    promptEnglish: `Very slow camera push-in on the figure standing still, coat moving gently in the wind. Clouds drift slowly behind. Light shifts subtly as if the sun is setting. Wide cinematic shot, steady with a faint handheld sway. Quiet, epic, atmospheric. Minimal subject movement. Avoid: fast pan, shaking, distortion, duplicated subject, on-screen text.`,
    explanationSpanish: `**Traducción y Explicación en Español:**
* **Cámara**: Acercamiento de cámara extremadamente lento (*very slow push-in*) hacia la figura inmóvil.
* **Sujeto**: Figura estática con abrigo moviéndose suavemente con la brisa del viento.
* **Fondo**: Las nubes se desplazan lentamente atrás. La luz cambia sutilmente como en un atardecer en tiempo real.
* **Tono**: Plano general cinematográfico, silencioso, épico y atmosférico.
* **Evitar**: Panorámicas rápidas, temblor de cámara, duplicación de personajes.`,
    elements: [
      { label: 'Cámara', value: 'Zoom in lento e imperceptible' },
      { label: 'Sujeto', value: 'Cuerpo inmóvil + ropa al viento' },
      { label: 'Entorno', value: 'Nubes en movimiento y cambio de luz solar' }
    ]
  }
];

export const MISTAKES_LIST: MistakeItem[] = [
  {
    id: 1,
    title: 'Querer una escena de acción compleja en la primerísima toma',
    problem: 'Pedir peleas, saltos acrobáticos o persecuciones en tu primer prompt.',
    solution: 'Empieza SIEMPRE con un personaje inmóvil o en caminata lenta. El 90% del éxito en IA radica en controlar el movimiento en tomas estables antes de intentar acción.'
  },
  {
    id: 2,
    title: 'Describir el rostro o vestimenta cuando usas imagen de referencia',
    problem: 'Escribir "cabello negro, ojos azules y chaqueta de cuero" teniendo cargada la foto de referencia.',
    solution: 'Si subes referencia, omite toda descripción física en el prompt. El prompt solo debe guiar la luz, el ángulo de cámara y el ambiente para no confundir al modelo.'
  },
  {
    id: 3,
    title: 'Sobrecargar el prompt de video con demasiados movimientos a la vez',
    problem: 'Escribir: "Corre, mira atrás, saca una espada, la cámara gira 360 grados y llueve".',
    solution: 'Aplica la regla de un solo micro-movimiento principal por toma (ejemplo: solo un parpadeo o solo un giro sutil de mirada).'
  },
  {
    id: 4,
    title: 'Partir de un keyframe borroso o de baja resolución',
    problem: 'Usar capturas de pantalla de baja calidad o tomadas durante un desenfoque de movimiento (motion blur).',
    solution: 'Pausa el anime en un fotograma completamente estático y nítido. Si la imagen base es de mala calidad, la versión live-action será inconsistente y borrosa.'
  },
  {
    id: 5,
    title: 'Generar una sola vez y quedarse con el primer resultado que salga',
    problem: 'Esperar perfección al primer intento sin explorar las variaciones de la IA.',
    solution: 'Ejecuta el mismo prompt de 3 a 5 veces. La IA ofrece semillas numéricas diferentes; selecciona únicamente la versión con mejores texturas y manos anatómicas correctas.'
  }
];

export const CHECKLIST_STEPS = [
  { id: 1, text: 'Elegir una escena de anime con sujeto claro y composición definida.' },
  { id: 2, text: 'Pausar en un fotograma nítido (sin motion blur) y capturar la imagen de referencia (Keyframe).' },
  { id: 3, text: 'Abrir Higgsfield, TapNow o Seedance en modo Image-to-Image.' },
  { id: 4, text: 'Seleccionar la modalidad adecuada (Sin referencia, Con referencia de personaje o Texto a imagen).' },
  { id: 5, text: 'Escribir el Prompt de Imagen respetando la regla de NO describir el rostro si usas imagen de referencia.' },
  { id: 6, text: 'Generar de 3 a 5 variaciones de la imagen y guardar la mejor versión realista.' },
  { id: 7, text: 'Pasar al modo Image-to-Video y cargar la imagen realista validada como primer fotograma.' },
  { id: 8, text: 'Redactar el Prompt de Video enfocándote únicamente en micro-movimientos de cámara y sujeto.' },
  { id: 9, text: 'Generar la toma en video y verificar que no existan distorsiones en rostro ni extremidades.' },
  { id: 10, text: 'Exportar tu clip de video y unir tus tomas en el editor de tu preferencia.' }
];
