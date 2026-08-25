/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, Copy, Check, Sparkles, BookOpen, Video, Image as ImageIcon,
  Layers, Bot, CheckCircle, ChevronRight, RefreshCw, MessageSquare
} from 'lucide-react';

interface SubtitleSection {
  id: string;
  title: string;
  teacherNote: string;
  textEs: string;
  prompts?: {
    title: string;
    desc: string;
    en: string;
    es: string;
  }[];
  exampleData?: {
    beforeLabel: string;
    afterLabel: string;
    desc: string;
  };
}

export default function AnimeToLiveActionGuide() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [voiceId] = useState<string>('Nh2zY9kknu6z4pZy6FhD');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Guide structured in sections with teacher commentary, subtitles, and prompts in both languages
  const sections: SubtitleSection[] = [
    {
      id: 'intro',
      title: 'Bienvenida e Introducción',
      teacherNote: '¡Hola! Soy tu Profesor Virtual. En este tutorial transformaremos escenas de anime en tomas hiperrealistas de Live-Action usando Inteligencia Artificial sin cámaras ni equipos costosos.',
      textEs: `Bienvenido a Alter Anime Studio. El método completo: de Anime a Live-Action con Inteligencia Artificial.
Este método paso a paso te enseñará a convertir una escena de anime en un plano realista de estilo cinematográfico, sin necesidad de equipo de grabación ni equipo técnico.

Al finalizar esta guía pasarás de cero a tu primera toma realista lista para publicar. Sin rodeos ni rodeos: nos enfocamos únicamente en los dos pasos cruciales, en orden.

Parte 1 — Genera tu imagen: Elige una escena, extrae la imagen de referencia (el fotograma clave o keyframe) y conviértela en una imagen realista.
Parte 2 — Genera tu video: Toma esa imagen y dale vida con movimiento de cámara, iluminación y actuación de manera estable.`,
    },
    {
      id: 'principio',
      title: 'El Principio en 30 Segundos',
      teacherNote: 'Recuerda: Un video es una secuencia de imágenes. No intentamos "convertir" un video completo de golpe. Trabajamos fotograma por fotograma para mantener el control y la máxima calidad.',
      textEs: `¿Cómo funciona pasar de Anime a Live-Action?
Un video es una secuencia de imágenes. Por lo tanto, no convertimos una escena completa en un solo clic: trabajamos imagen por imagen. El camino siempre es el mismo:

1. ESCENA: Eliges un clip de anime que te inspire.
2. FOTOGRAMA CLAVE (Keyframe): Extraes una captura estática y nítida.
3. IMAGEN REALISTA: La IA genera la versión en imagen real (Parte 1).
4. VIDEO REALISTA: La IA le da movimiento cinematográfico (Parte 2).

Aquí se decide el 90% del resultado profesional.`,
      exampleData: {
        beforeLabel: 'Escena de Anime (Keyframe)',
        afterLabel: 'Resultado Live-Action con IA',
        desc: 'La IA mantiene la pose y composición original mientras convierte la ilustración en piel y luz fotorealistas.'
      }
    },
    {
      id: 'herramientas',
      title: 'Tu Kit de Herramientas Mínimo',
      teacherNote: 'No te abrumes con 15 aplicaciones diferentes. Para tu primer resultado profesional sólo necesitas una herramienta todo-en-uno de IA como Higgsfield o Seedance, un capturador de pantalla y un editor básico en tu teléfono.',
      textEs: `Olvídate de listas complejas de 15 aplicaciones. Para iniciar sólo necesitas:
- Una herramienta todo-en-uno de generación por IA (ejemplo: Higgsfield modelo Nano Banana para imagen + generador de video integrado, o TapNow / Seedance).
- Una forma de capturar un fotograma: el reproductor de video y la tecla de captura de pantalla son suficientes.
- Un editor básico: la aplicación de edición de tu teléfono basta para unir los planos.

¿Por qué no DaVinci Resolve o Topaz al principio? Porque la corrección de color y el reescalado son para perfeccionar un estilo. Aquí buscamos terminar y publicar tu primer clip.`,
    },
    {
      id: 'parte1_imagen',
      title: 'Parte 1: Genera tu Imagen Realista',
      teacherNote: 'Atención a la Regla de Oro: Si subes una imagen de referencia del personaje, ¡NUNCA describas su rostro, cabello ni ropa en el prompt! Describirlo crea conflictos que deforman el resultado.',
      textEs: `Todo comienza con la imagen. Si tu fotograma realista inicial es bueno, tu video también lo será. Si la imagen sale mal, ningún prompt de video podrá salvarla.

Paso 1: Elige y extrae tu fotograma clave. Selecciona una escena con buena composición (personaje de frente o perfil, plano general impactante). Evita por ahora escenas sobrecargadas de acción. Pausa el video en el momento exacto y toma una captura bien nítida.

Paso 2: Transforma la imagen en tu herramienta. Tienes tres métodos:
A) Imagen a Live-Action (El más sencillo).
B) Imagen + Referencia de personaje.
C) Texto a Imagen (Desde cero).

Regla de Oro: Si usas imagen de referencia del personaje, JAMÁS describas sus rasgos en el prompt (ni pelo, ni cara, ni ropa). La referencia es suficiente. Tu prompt sólo debe contener la acción, encuadre, luz y atmósfera.`,
      prompts: [
        {
          title: 'PROMPT A — Sin referencia (Imagen → Live-Action)',
          desc: 'Para subir la captura del anime y convertirla manteniendo pose y composición exacta.',
          en: `Live-action realistic version of this frame, photographic, true-to-life skin and textures. Keep the original composition and pose. A young person stands in the rain at night, looking off-frame, calm expression. Medium shot, slight low angle. Cold blue street light, wet reflective ground, soft fog in the background. Cinematic, lightly desaturated, fine film grain, shallow depth of field. Avoid: anime, cartoon, illustration, distorted hands, on-screen text.`,
          es: `Versión realista en imagen real de este fotograma, fotográfica, piel y texturas fieles a la realidad. Mantiene la composición y pose originales. Una persona joven de pie bajo la lluvia por la noche, mirando fuera de campo, expresión tranquila. Plano medio, ángulo ligeramente bajo. Luz de calle azul fría, suelo mojado reflectante, niebla suave de fondo. Cinematográfico, ligeramente desaturado, grano fino de película, profundidad de campo reducida. Evitar: anime, dibujo animado, ilustración, manos distorsionadas, texto en pantalla.`
        },
        {
          title: 'PROMPT B — Con referencia de personaje (Image + Character Ref)',
          desc: 'Inserta a tu personaje de referencia manteniendo concordancia facial sin describir la cara en el texto.',
          en: `Place the referenced character into this scene as a realistic live-action photograph. The character walks slowly down an empty corridor, head turned slightly toward camera. Tracking medium shot at eye level. Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors, fine grain, shallow depth of field. Avoid: anime, cartoon, extra fingers, text, logos.`,
          es: `Coloca al personaje de referencia en esta escena como una fotografía realista en imagen real. El personaje camina lentamente por un pasillo vacío, con la cabeza girada ligeramente hacia la cámara. Plano medio en seguimiento a la altura de los ojos. Luz tenue y cálida en el techo, sombras largas, polvo en el aire. Cinematográfico, colores desaturados, grano fino, profundidad de campo reducida. Evitar: anime, dibujo animado, dedos extra, texto, logotipos.`
        },
        {
          title: 'PROMPT C — Texto a Imagen (Text → Image)',
          desc: 'Para generar una escena cinemática desde cero utilizando únicamente descripción textual.',
          en: `Cinematic live-action photograph. A lone figure in a dark trench coat stands on a rooftop at dusk, city skyline behind, wind moving the coat. Wide shot, low angle looking up. Last warm sunlight on one side, deep cold shadow on the other. Realistic skin and fabric, muted teal-and-amber grade, fine film grain, shallow depth of field, photorealistic. Avoid: anime, illustration, 3D render look, plastic skin, distorted anatomy, watermark, on-screen text.`,
          es: `Fotografía cinematográfica en vivo. Una figura solitaria con una gabardina oscura está de pie en una azotea al atardecer, el horizonte de la ciudad al fondo, el viento moviendo la gabardina. Plano general, ángulo bajo mirando hacia arriba. Última luz cálida del sol a un lado, sombra profunda y fría al otro. Piel y tela realistas, gradación de color verde azulado y ámbar suave, grano fino de película, profundidad de campo reducida, fotorrealista. Evitar: anime, ilustración, aspecto de render 3D, piel de plástico, anatomía distorsionada, marca de agua, texto en pantalla.`
        }
      ]
    },
    {
      id: 'parte2_video',
      title: 'Parte 2: Anima tu Video Realista',
      teacherNote: 'El error número 1 de los principiantes es pedir mucha acción. Pedir peleas veloces derrite los rostros y crea extremidades extras. El secreto está en los micro-movimientos: pestañeos, parpadeo, brisa ligera y movimiento de cámara sutil.',
      textEs: `Ya tienes tu imagen realista aprobada. Ahora le damos vida.
Sube la imagen generada en la Parte 1 en el modo "Imagen a Video" (Image-to-Video). Esta imagen será el primer fotograma de tu video.

Escribe el prompt de video describiendo en orden:
1. Movimiento de cámara: Empuje suave (push-in), movimiento ligero de mano (handheld), o panorámica lenta.
2. Movimiento del sujeto: Micro-movimientos: un parpadeo, un giro lento de cabeza, respiración, cabello con el viento.
3. Luz y atmósfera viva: Humo flotando, lluvia cayendo, reflejos dinámicos.

Secreto Cinematográfico: El realismo proviene de los pequeños detalles vivos. El bamboleo sutil de la cámara y partículas de polvo cruzando la luz hacen que olvides que fue generado con IA.`,
      prompts: [
        {
          title: 'PROMPT 1 — Retrato Intenso (El más seguro y estable)',
          desc: 'Ideal para personajes mirando a la cámara con micro-expresiones perfeccionadas.',
          en: `The character stays almost still and slowly turns their head toward the camera, then blinks once. Subtle handheld camera with a very slow push-in. Hair and clothing move slightly in a light breeze. Soft fog drifts in the background. Cinematic, calm, realistic motion. Keep the body static, only micro-movements. Avoid: fast motion, distorted face, extra limbs, morphing.`,
          es: `El personaje permanece casi inmóvil y gira lentamente la cabeza hacia la cámara, luego parpadea una vez. Cámara en mano sutil con un empuje hacia adelante muy lento. El cabello y la ropa se mueven ligeramente con una brisa suave. Niebla suave flota de fondo. Movimiento cinematográfico, tranquilo y realista. Mantener el cuerpo estático, sólo micro-movimientos. Evitar: movimiento rápido, rostro distorsionado, extremidades extra, deformación.`
        },
        {
          title: 'PROMPT 2 — Caminata Lenta / Atmósfera',
          desc: 'Crea una toma fluida de seguimiento con atmósfera lluviosa y textura cinematográfica.',
          en: `The character walks slowly forward, calm and steady. Smooth tracking shot following from a short distance, gentle handheld feel. Rain falls softly, reflections shimmer on the wet ground, breath faintly visible. Slow, weighty, cinematic pace. Realistic motion, no sudden movement. Avoid: running, jitter, warping limbs, melting face, background people moving fast.`,
          es: `El personaje avanza lentamente, tranquilo y firme. Toma de seguimiento suave desde una distancia corta, sensación ligera de cámara en mano. La lluvia cae suavemente, los reflejos brillan en el suelo húmedo, el aliento se ve levemente. Ritmo lento, pesado y cinematográfico. Movimiento realista, sin movimientos bruscos. Evitar: correr, temblores, extremidades deformadas, cara derretida, personas de fondo moviéndose rápido.`
        },
        {
          title: 'PROMPT 3 — Plano General Contemplativo',
          desc: 'Excelente para paisajes urbanos o azoteas con viento y cambios de iluminación natural.',
          en: `Very slow camera push-in on the figure standing still, coat moving gently in the wind. Clouds drift slowly behind. Light shifts subtly as if the sun is setting. Wide cinematic shot, steady with a faint handheld sway. Quiet, epic, atmospheric. Minimal subject movement. Avoid: fast pan, shaking, distortion, duplicated subject, on-screen text.`,
          es: `Empuje de cámara muy lento sobre la figura inmóvil, el abrigo se mueve suavemente con el viento. Las nubes avanzan lentamente detrás. La luz cambia sutilmente como si el sol se estuviera poniendo. Plano general cinematográfico, estable con un tenue balanceo de cámara en mano. Tranquilo, épico, atmosférico. Movimiento mínimo del sujeto. Evitar: panorámica rápida, sacudidas, distorsión, sujeto duplicado, texto en pantalla.`
        }
      ]
    },
    {
      id: 'errores',
      title: 'Los 5 Errores Frecuentes de Principiantes',
      teacherNote: 'Repasa este listado antes de presionar Generar. ¡Te ahorrará créditos de IA y horas de intento y error!',
      textEs: `Lista de verificación y corrección de errores comunes:
1. Querer una escena de acción espectacular en tu primer intento: Solución -> Empieza con micro-movimientos y mirada fija.
2. Describir al personaje cuando ya proporcionaste una imagen de referencia: Solución -> Borra la descripción física del prompt.
3. Sobrecargar el prompt con demasiado movimiento: Solución -> Mantén el cuerpo inmóvil y mueve la cámara.
4. Empezar con un fotograma borroso o de muy baja resolución: Solución -> Captura en 1080p o superior sin desenfoque de movimiento.
5. Generar una sola vez y quedarse con el primer resultado: Solución -> Corre el prompt de 3 a 5 veces y escoge la mejor variación.`,
    }
  ];

  const currentSection = sections[activeSectionIndex];

  // TTS implementation using Web Speech API with fallback / optional ElevenLabs synthesis
  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    // Try Web Speech API (Latin American Spanish synthesis)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${currentSection.teacherNote} ... ${currentSection.textEs}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-MX'; // Latin American Spanish (Mexico / LATAM)
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      synthRef.current = window.speechSynthesis;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      alert('Tu navegador no soporta síntesis de voz Web Speech API.');
    }
  };

  const handleCopyPrompt = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">

      {/* GUIDE HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-900/30 to-[#111114] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center justify-center pr-10">
          <Sparkles className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-black uppercase tracking-widest font-mono">
              Alter Anime Studio • Guía Completa LATAM
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1">
              <Bot className="w-3 h-3" /> Voice ID: {voiceId}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
            DE ANIME A LIVE-ACTION CON IA
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            El método paso a paso para transformar cualquier toma de anime en una escena realista de cine — sin cámaras, sin actores y sin presupuesto. Adaptado al español latinoamericano para lectura con sintetizador de voz ElevenLabs.
          </p>

          {/* PLAYER STRIP & VOICE CONTROLS */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Detener Lectura en Voz Alta
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Escuchar Sección Actual (Voz Latina ElevenLabs)
                </>
              )}
            </button>

            <div className="flex items-center gap-2 bg-[#0a0a0b]/80 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-gray-400 font-mono">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span>Sintetizador: <strong className="text-white">ElevenLabs / LATAM Voice</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {sections.map((sec, idx) => {
          const active = idx === activeSectionIndex;
          return (
            <button
              key={sec.id}
              onClick={() => {
                if (isPlaying && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
                setActiveSectionIndex(idx);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border select-none ${
                active
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-650/20'
                  : 'bg-[#111114] border-white/5 hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono font-bold ${active ? 'bg-white text-indigo-900' : 'bg-white/10 text-gray-300'}`}>
                0{idx + 1}
              </span>
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION CONTENT MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: VIRTUAL TEACHER & SUBTITLES DISPLAY */}
        <div className="lg:col-span-7 space-y-5">

          {/* VIRTUAL TEACHER COMMENTARY CARD */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-[#111114] border border-indigo-500/30 rounded-2xl p-5 space-y-3 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-indigo-300 tracking-wider font-mono flex items-center gap-1.5">
                    PROFESOR VIRTUAL IA <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">Explicación guiada y comentarios clave</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                ElevenLabs Voice ID: {voiceId.slice(0, 8)}...
              </span>
            </div>

            <p className="text-xs text-indigo-100/90 leading-relaxed font-sans italic bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-500/15">
              "{currentSection.teacherNote}"
            </p>
          </div>

          {/* LIVE SUBTITLE CAPTION CONTAINER */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono">
                  Subtítulos en Pantalla (Lectura Narrada en Español)
                </h3>
              </div>
              {isPlaying && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Volume2 className="w-3 h-3 animate-pulse" /> LEYENDO SUBTÍTULOS...
                </span>
              )}
            </div>

            {/* Subtitle text body with active highlight line styling */}
            <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4 space-y-3 max-h-[380px] overflow-y-auto">
              {currentSection.textEs.split('\n\n').map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={`text-xs leading-relaxed transition-all p-2 rounded-lg ${
                    isPlaying
                      ? 'text-gray-100 bg-indigo-500/10 border-l-2 border-indigo-500 font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* VISUAL EXAMPLE PLACEHOLDER IF AVAILABLE */}
          {currentSection.exampleData && (
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" /> Ejemplo Visual Comparativo (Antes vs Después)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-[#0a0a0b] border border-white/10 p-4 rounded-xl space-y-2 text-center">
                  <div className="h-32 rounded-lg bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-700 text-zinc-500 text-xs font-mono">
                    [ 02 · Keyframe Anime ]
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 block">{currentSection.exampleData.beforeLabel}</span>
                </div>

                <div className="bg-[#0a0a0b] border border-indigo-500/30 p-4 rounded-xl space-y-2 text-center">
                  <div className="h-32 rounded-lg bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs font-mono font-bold">
                    [ 03 · Live-Action Realista ]
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400 block">{currentSection.exampleData.afterLabel}</span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 leading-normal">{currentSection.exampleData.desc}</p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DUAL LANGUAGE PROMPTS & QUICK COPY CARDS */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Prompts Listos para Copiar
              </h3>
              <span className="text-[10px] text-gray-500 font-mono font-semibold">Español e Inglés</span>
            </div>

            {currentSection.prompts && currentSection.prompts.length > 0 ? (
              <div className="space-y-4">
                {currentSection.prompts.map((p, pIdx) => {
                  const keyEn = `${currentSection.id}_prompt_${pIdx}_en`;
                  const keyEs = `${currentSection.id}_prompt_${pIdx}_es`;

                  return (
                    <div key={pIdx} className="bg-[#0a0a0b] border border-white/5 hover:border-white/10 rounded-xl p-4 space-y-3 transition">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-indigo-400">{p.title}</h4>
                        <p className="text-[10px] text-gray-400 leading-snug">{p.desc}</p>
                      </div>

                      {/* ENGLISH PROMPT BOX (FOR AI GENERATOR) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 font-bold">
                          <span>PROMPT EN INGLÉS (Copiar a Higgsfield / Seedance):</span>
                          <button
                            onClick={() => handleCopyPrompt(p.en, keyEn)}
                            className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition text-[9px]"
                          >
                            {copiedKey === keyEn ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === keyEn ? '¡COPIADO!' : 'COPIAR EN'}
                          </button>
                        </div>
                        <pre className="bg-[#060608] border border-white/5 rounded-lg p-2.5 text-[10.5px] font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
                          {p.en}
                        </pre>
                      </div>

                      {/* SPANISH TRANSLATION BOX (FOR READABILITY) */}
                      <div className="space-y-1.5 pt-1 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 font-bold">
                          <span>TRADUCCIÓN AL ESPAÑOL LATINO:</span>
                          <button
                            onClick={() => handleCopyPrompt(p.es, keyEs)}
                            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300 flex items-center gap-1 transition text-[9px]"
                          >
                            {copiedKey === keyEs ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                            {copiedKey === keyEs ? '¡COPIADO!' : 'COPIAR ES'}
                          </button>
                        </div>
                        <p className="bg-[#060608] border border-white/5 rounded-lg p-2.5 text-[10.5px] text-gray-300 leading-relaxed font-sans">
                          {p.es}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-500 space-y-2 border border-dashed border-white/5 rounded-xl">
                <BookOpen className="w-6 h-6 mx-auto opacity-50 text-indigo-400" />
                <p>Navega a la <strong>Parte 1</strong> o <strong>Parte 2</strong> para acceder a la biblioteca de prompts listos para copiar.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
