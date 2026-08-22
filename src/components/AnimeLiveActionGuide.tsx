/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Copy, Check, Sparkles, GraduationCap,
  Film, Image as ImageIcon, Video, AlertTriangle, CheckCircle2, ChevronRight,
  HelpCircle, Layers, Sliders, RefreshCw, Wand2, MessageSquare, Download, Share2
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  professorSpeech: string;
  content: React.ReactNode;
}

interface AnimeLiveActionGuideProps {
  onAddLog?: (source: 'Shizuku' | 'Overlay' | 'Binder' | 'OBD' | 'Cloud', level: 'info' | 'success' | 'warn', msg: string) => void;
}

export default function AnimeLiveActionGuide({ onAddLog }: AnimeLiveActionGuideProps) {
  // TTS & Subtitle state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [useFallbackSpeech, setUseFallbackSpeech] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('anime_guide_checklist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      step1: true,
      step2: true,
      step3: true,
      step4: true,
      step5: true,
      step6: true,
      step7: false,
      step8: false,
      step9: false,
      step10: false,
    };
  });

  // Expanded mistake cards
  const [expandedMistake, setExpandedMistake] = useState<number | null>(null);

  // Speech synthesis ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    localStorage.setItem('anime_guide_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const VOICE_ID = 'Nh2zY9kknu6z4pZy6FhD'; // User requested ElevenLabs voice ID

  // Speech controller
  const handleTogglePlay = async (textToSpeak?: string) => {
    const text = textToSpeak || sections[currentSectionIndex].professorSpeech;

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentSubtitle(text);

    if (onAddLog) {
      onAddLog('Cloud', 'info', `Profesor Virtual leyendo sección [${sections[currentSectionIndex].title}] con voz ElevenLabs (${VOICE_ID})`);
    }

    // Try ElevenLabs if key present, else Web Speech API fallback
    if (elevenLabsApiKey && !useFallbackSpeech) {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsApiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
            audioRef.current.onended = () => {
              setIsPlaying(false);
              setCurrentSubtitle('');
            };
            return;
          }
        } else {
          console.warn('ElevenLabs API error, falling back to Web Speech API');
        }
      } catch (err) {
        console.warn('ElevenLabs fetch error:', err);
      }
    }

    // Web Speech API Fallback (Spanish Latin America)
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find Spanish voice (es-MX, es-US, es-ES, es-419)
      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(v =>
        v.lang.includes('es-MX') || v.lang.includes('es-US') || v.lang.includes('es-419') || v.lang.includes('es')
      );
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      utterance.lang = 'es-MX';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentSubtitle('');
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentSubtitle('');
      };

      synthRef.current.speak(utterance);
    } else {
      // Simulate reading with timer if TTS unavailable
      const words = text.split(' ').length;
      const durationMs = (words / 3) * 1000;
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentSubtitle('');
      }, durationMs);
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setCurrentSubtitle('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onAddLog) {
      onAddLog('Cloud', 'success', `Prompt copiado al portapapeles: [${id}]`);
    }
  };

  const toggleChecklist = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalCount = Object.keys(checklist).length;

  // Sections definitions for virtual professor and guide content
  const sections: GuideSection[] = [
    {
      id: 'welcome',
      title: '00 · BIENVENIDA Y CONCEPTOS CLAVE',
      subtitle: 'De Anime a Live-Action con Inteligencia Artificial',
      professorSpeech: '¡Hola! Bienvenido a la guía completa de Alter Anime Studio. En este tutorial te enseñaré paso a paso cómo transformar cualquier escena de anime en una toma cinematográfica de acción real súper hiperrealista sin necesidad de equipos de grabación ni actores. Cubriremos dos fases fundamentales: generar la imagen fotorrealista y luego animar el video manteniendo consistencia.',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900/40 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-mono uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> ALTER ANIME STUDIO · MÉTODO COMPLETO
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                DE ANIME A ACCIÓN REAL CON IA
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                El método paso a paso para convertir una escena de anime en una toma filmada realista: sin cámaras, sin equipo de producción y sin costo de estudio.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#0a0a0b]/80 border border-white/10 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Parte 1 — Genera tu imagen
                  </div>
                  <p className="text-xs text-gray-400 leading-normal">
                    Elige una escena, extrae un fotograma clave (keyframe) y transfórmalo en una toma fotorrealista con la composición exacta.
                  </p>
                </div>

                <div className="bg-[#0a0a0b]/80 border border-white/10 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4" /> Parte 2 — Genera tu video
                  </div>
                  <p className="text-xs text-gray-400 leading-normal">
                    Toma la imagen fotorrealista y dale vida: movimientos de cámara, iluminación activa y microexpresiones sin que la IA distorsione la anatomía.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* El principio en 30 segundos */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Film className="w-4 h-4" /> El principio fundamental en 30 segundos
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed">
              Un video no es más que una secuencia de imágenes. Por lo tanto, no "convertimos" una escena completa de un solo golpe: trabajamos imagen por imagen. El flujo de trabajo siempre sigue este camino estructurado:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {[
                { step: '01', name: 'ESCENA ANIME', desc: 'Eliges un clip de anime que te inspire.', highlight: false },
                { step: '02', name: 'KEYFRAME', desc: 'Extraes un fotograma nítido congelado.', highlight: false },
                { step: '03', name: 'IMAGEN REAL', desc: 'La IA genera la versión fotorrealista (Parte 1).', highlight: true },
                { step: '04', name: 'VIDEO FINAL', desc: 'La IA anima los micro-movimientos (Parte 2).', highlight: true },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                    item.highlight
                      ? 'bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                      : 'bg-[#0a0a0b] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-indigo-400">{item.step}</span>
                    {item.highlight && <span className="text-[8px] font-mono bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded">PASO CLAVE</span>}
                  </div>
                  <div className="text-xs font-bold text-white uppercase">{item.name}</div>
                  <div className="text-[11px] text-gray-400 leading-snug">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal Stack */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Tu Stack Mínimo de Herramientas
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Olvídate de listas complicadas con 15 aplicaciones. Para empezar solo necesitas:
            </p>
            <ul className="space-y-2 text-xs text-gray-300 font-mono">
              <li className="flex items-start gap-2 bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">1. Herramienta IA Todo-en-Uno:</span> Higgsfield (modelo Nano Banana para imagen + generador de video integrado) o alternativas como TapNow / Seedance.
              </li>
              <li className="flex items-start gap-2 bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">2. Capturador de fotogramas:</span> Cualquier reproductor de video y la tecla de captura de pantalla de tu computadora o teléfono.
              </li>
              <li className="flex items-start gap-2 bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5">
                <span className="text-indigo-400 font-bold">3. Editor básico:</span> CapCut o el editor nativo de tu teléfono para unir las tomas generadas.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'part1_image',
      title: '01 · PARTE 1: GENERA TU IMAGEN',
      subtitle: 'Captura y transformación fotorrealista del Keyframe',
      professorSpeech: 'Pasemos a la Parte 1. Todo comienza con la imagen fotorrealista. Si tu keyframe de acción real es excelente, tu video final también lo será. Pero si la imagen inicial está deformada o mal iluminada, ningún prompt de video podrá salvarla. El secreto aquí está en extraer una imagen súper nítida y usar la estructura de prompt correcta.',
      content: (
        <div className="space-y-6">
          {/* Paso 1: Seleccionar y extraer */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold uppercase text-white">Selecciona y extrae tu fotograma clave (Keyframe)</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Elige una escena con una composición fuerte: un personaje de frente o de perfil, un plano general impactante o una mirada intensa. Por ahora, evita tomas recargadas con demasiada acción o muchos personajes secundarios; mientras más simple sea la toma, más fiel será el resultado de la IA.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Paso A</span>
                <p className="text-xs text-gray-300 font-semibold">Pausa el video</p>
                <p className="text-[11px] text-gray-500">Justo en el instante exacto que deseas recrear.</p>
              </div>

              <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Paso B</span>
                <p className="text-xs text-gray-300 font-semibold">Captura una toma nítida</p>
                <p className="text-[11px] text-gray-500">Evita momentos con desenfoque de movimiento (motion blur).</p>
              </div>

              <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">Paso C</span>
                <p className="text-xs text-gray-300 font-semibold">Conserva alta resolución</p>
                <p className="text-[11px] text-gray-500">Una imagen muy pequeña o pixelada genera un resultado borroso.</p>
              </div>
            </div>

            {/* Visual Example Placeholder */}
            <div className="bg-[#0a0a0b] border border-dashed border-indigo-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-mono text-gray-400 border border-white/10">
                  ANIME
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-400" />
                <div className="w-16 h-16 rounded-lg bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xs font-mono text-indigo-300 font-bold">
                  LIVE
                </div>
              </div>
              <div className="text-xs text-gray-400 font-sans space-y-0.5">
                <span className="text-white font-bold block">Ejemplo de conversión de Keyframe</span>
                <span>Captura limpia del personaje en primer plano → Convertida a fotografía fotorrealista 35mm.</span>
              </div>
            </div>
          </div>

          {/* Anatomiía del Prompt de Imagen */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" /> Estructura y Anatomía del Prompt Perfecto
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed">
              Un buen prompt no es una frase genérica al azar. Es una lista ordenada de bloques claros de información, desde lo más importante hasta lo secundario:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { title: '1. SUJETO', desc: 'Quién o qué está en la imagen (a menos que uses una imagen de referencia).', color: 'text-sky-400' },
                { title: '2. ACCIÓN / POSA', desc: 'Qué hace el personaje, su actitud corporal y hacia dónde mira.', color: 'text-indigo-400' },
                { title: '3. ENCUADRE', desc: 'Plano medio, primer plano, plano general, ángulo de cámara (picado, contrapicado).', color: 'text-purple-400' },
                { title: '4. ILUMINACIÓN', desc: 'Fuente de luz, dirección y atmósfera (luz suave de atardecer, neón frío de noche).', color: 'text-amber-400' },
                { title: '5. MOOD / ESTILO', desc: 'Sensación cinematográfica, realista, desaturada, grano fino de película cinematográfica.', color: 'text-emerald-400' },
                { title: '6. EVITAR (Negative Prompt)', desc: 'Lo que NO quieres: dibujo, caricatura, manos deformadas, texto en pantalla.', color: 'text-rose-400' },
              ].map((block) => (
                <div key={block.title} className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 flex items-start gap-3">
                  <span className={`font-mono font-bold shrink-0 ${block.color}`}>{block.title}:</span>
                  <span className="text-gray-300">{block.desc}</span>
                </div>
              ))}
            </div>

            {/* Regla de Oro */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1">
              <div className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> REGLA DE ORO DE REFERENCIA DE PERSONAJE
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Si subes una imagen de referencia del rostro o personaje al sistema de IA, <strong>NUNCA describas los detalles físicos del personaje en el texto del prompt</strong> (nada de color de pelo, ropa ni rasgos faciales). La imagen de referencia ya lo proporciona; volver a describirlo en texto crea conflictos en la red neuronal y arruina la fidelidad.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prompts_image',
      title: '02 · PROMPTS DE IMAGEN LISTOS PARA COPIAR',
      subtitle: '3 Plantillas optimizadas en Inglés con Explicación en Español',
      professorSpeech: 'Aquí tienes los 3 prompts de imagen definitivos que utilizo en el estudio. Recuerda que la Inteligencia Artificial entiende mejor las instrucciones en inglés técnico de fotografía. Te dejo el prompt exacto en inglés listo para copiar con un clic, seguido de la explicación detallada en español de cada elemento.',
      content: (
        <div className="space-y-6">
          {/* PROMPT A */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">OPCIÓN A · IMAGE TO LIVE</span>
                <h4 className="text-xs font-bold text-white uppercase">Prompt sin referencia de personaje (Transformación directa)</h4>
              </div>
              <button
                onClick={() => handleCopy(`Live-action realistic version of this frame, photographic, true-to-life skin and textures. Keep the original composition and pose. A young person stands in the rain at night, looking off-frame, calm expression. Medium shot, slight low angle. Cold blue street light, wet reflective ground, soft fog in the background. Cinematic, lightly desaturated, fine film grain, shallow depth of field. Avoid: anime, cartoon, illustration, distorted hands, on-screen text.`, 'prompt_img_a')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_img_a' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_img_a' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            {/* Code Box EN */}
            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-indigo-300 leading-relaxed select-all">
              Live-action realistic version of this frame, photographic, true-to-life skin and textures. Keep the original composition and pose. A young person stands in the rain at night, looking off-frame, calm expression. Medium shot, slight low angle. Cold blue street light, wet reflective ground, soft fog in the background. Cinematic, lightly desaturated, fine film grain, shallow depth of field. Avoid: anime, cartoon, illustration, distorted hands, on-screen text.
            </div>

            {/* Explanation ES */}
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Versión realista de acción real de este fotograma, textura de piel fotorrealista. Mantiene la composición y pose original. Una persona joven bajo la lluvia nocturna mirando fuera de encuadre con expresión tranquila. Plano medio con leve ángulo contrapicado. Luz azul de calle fría, suelo húmedo con reflejos y niebla suave. Estilo cinematográfico desaturado con grano de película fino."
              </p>
            </div>
          </div>

          {/* PROMPT B */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">OPCIÓN B · CON REFERENCIA</span>
                <h4 className="text-xs font-bold text-white uppercase">Prompt con imagen de referencia de personaje (Aplicando Regla de Oro)</h4>
              </div>
              <button
                onClick={() => handleCopy(`Place the referenced character into this scene as a realistic live-action photograph. The character walks slowly down an empty corridor, head turned slightly toward camera. Tracking medium shot at eye level. Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors, fine grain, shallow depth of field. Avoid: anime, cartoon, extra fingers, text, logos.`, 'prompt_img_b')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_img_b' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_img_b' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            {/* Code Box EN */}
            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-purple-300 leading-relaxed select-all">
              Place the referenced character into this scene as a realistic live-action photograph. The character walks slowly down an empty corridor, head turned slightly toward camera. Tracking medium shot at eye level. Dim warm overhead light, long shadows, dust in the air. Cinematic, muted colors, fine grain, shallow depth of field. Avoid: anime, cartoon, extra fingers, text, logos.
            </div>

            {/* Explanation ES */}
            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-purple-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Coloca al personaje referenciado en esta escena como una fotografía realista. El personaje camina lentamente por un pasillo vacío con la cabeza girada hacia la cámara. Plano medio a la altura de los ojos. Luz cálida tenue desde arriba, sombras largas y motas de polvo flotando. Fíjate que NO describimos ni cabello ni ropa para no sobreescribir la imagen de referencia."
              </p>
            </div>
          </div>

          {/* PROMPT C */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">OPCIÓN C · TEXT TO IMAGE</span>
                <h4 className="text-xs font-bold text-white uppercase">Prompt de texto a imagen (Generación fotorrealista desde cero)</h4>
              </div>
              <button
                onClick={() => handleCopy(`Cinematic live-action photograph. A lone figure in a dark trench coat stands on a rooftop at dusk, city skyline behind, wind moving the coat. Wide shot, low angle looking up. Last warm sunlight on one side, deep cold shadow on the other. Realistic skin and fabric, muted teal-and-amber grade, fine film grain, shallow depth of field, photorealistic. Avoid: anime, illustration, 3D render look, plastic skin, distorted anatomy, watermark, on-screen text.`, 'prompt_img_c')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_img_c' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_img_c' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            {/* Code Box EN */}
            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-emerald-300 leading-relaxed select-all">
              Cinematic live-action photograph. A lone figure in a dark trench coat stands on a rooftop at dusk, city skyline behind, wind moving the coat. Wide shot, low angle looking up. Last warm sunlight on one side, deep cold shadow on the other. Realistic skin and fabric, muted teal-and-amber grade, fine film grain, shallow depth of field, photorealistic. Avoid: anime, illustration, 3D render look, plastic skin, distorted anatomy, watermark, on-screen text.
            </div>

            {/* Explanation ES */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Fotografía realista cinematográfica. Una figura solitaria con abrigo oscuro en una azotea al atardecer con el horizonte de la ciudad detrás y el viento moviendo la prenda. Plano general en contrapicado. Última luz cálida del sol de un lado y sombras frías del otro. Piel y telas realistas con etalonaje turquesa y ámbar."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'part2_video',
      title: '03 · PARTE 2: GENERA TU VIDEO',
      subtitle: 'Animación de movimiento, cámara y atmósfera',
      professorSpeech: '¡Excelente! Ahora que ya tienes tu imagen fotorrealista validada, entramos a la Parte 2: la generación de video. El principio aquí es usar el modo Image-to-Video. Le entregas la imagen a la IA como primer fotograma y le das un prompt enfocado exclusivamente en el movimiento de la cámara y micro-gestos del personaje.',
      content: (
        <div className="space-y-6">
          {/* Cargar keyframe */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-mono text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold uppercase text-white">Sube tu imagen fotorrealista validada</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              En el modo de video (Image-to-Video de Higgsfield, TapNow o Seedance), carga la imagen que validaste en la Parte 1. Ésta se convierte en el fotograma 0 de tu video. La IA partirá exactamente de esta toma para generar la animación, manteniendo el 100% de la consistencia visual.
            </p>

            {/* Estructura del prompt de video */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono">Estructura del Prompt de Video (Orden de Prioridad):</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">1. Movimiento de Cámara</span>
                  <p className="text-xs text-gray-300">Push-in sutil, cámara en mano muy suave o pan lento. Siempre sutil.</p>
                </div>

                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">2. Movimiento del Sujeto</span>
                  <p className="text-xs text-gray-300">Sutileza: un parpadeo, giro lento de cabeza, respiración, cabello con viento.</p>
                </div>

                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">3. Atmósfera Viviente</span>
                  <p className="text-xs text-gray-300">Humo flotando, lluvia cayendo, luces parpadeando o sombras en movimiento.</p>
                </div>

                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">4. Qué Evitar</span>
                  <p className="text-xs text-gray-300">Movimientos bruscos, carreras, peleas rápidas, manotazos (deforman la IA).</p>
                </div>
              </div>
            </div>

            {/* Trampa #1 */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-1">
              <div className="text-xs font-bold text-rose-400 font-mono uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> TRAMPA #1: DEMASIADO MOVIMIENTO
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                El error número uno de los principiantes es pedir una escena de acción espectacular en su primer intento. Resultado: rostros que se derriten, extremidades extra y parpadeos molestos. <strong>La solución:</strong> usa movimientos sutiles de cámara + microexpresiones faciales + cuerpo casi estático. Una mirada girando lentamente transmite 10 veces más profesionalismo que una pelea fallida.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'prompts_video',
      title: '04 · PROMPTS DE VIDEO LISTOS PARA COPIAR',
      subtitle: '3 Plantillas de animación en Inglés con Explicación en Español',
      professorSpeech: 'Aquí tienes las 3 plantillas de video más efectivas para el modo Image-to-Video. Recuerda pegarlos en el campo de descripción de movimiento de tu herramienta IA.',
      content: (
        <div className="space-y-6">
          {/* PROMPT VIDEO 1 */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">PROMPT VIDEO 1 · MÁS SEGURO</span>
                <h4 className="text-xs font-bold text-white uppercase">Retrato Intenso y Microexpresiones</h4>
              </div>
              <button
                onClick={() => handleCopy(`The character stays almost still and slowly turns their head toward the camera, then blinks once. Subtle handheld camera with a very slow push-in. Hair and clothing move slightly in a light breeze. Soft fog drifts in the background. Cinematic, calm, realistic motion. Keep the body static, only micro-movements. Avoid: fast motion, distorted face, extra limbs, morphing.`, 'prompt_vid_1')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_vid_1' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_vid_1' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-emerald-300 leading-relaxed select-all">
              The character stays almost still and slowly turns their head toward the camera, then blinks once. Subtle handheld camera with a very slow push-in. Hair and clothing move slightly in a light breeze. Soft fog drifts in the background. Cinematic, calm, realistic motion. Keep the body static, only micro-movements. Avoid: fast motion, distorted face, extra limbs, morphing.
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "El personaje permanece casi inmóvil y gira lentamente la cabeza hacia la cámara, parpadeando una vez. Cámara en mano muy sutil con acercamiento suave. Cabello y ropa se mueven ligeramente con una brisa tenue. Niebla en el fondo. Mantén el cuerpo estático, solo micro-movimientos."
              </p>
            </div>
          </div>

          {/* PROMPT VIDEO 2 */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">PROMPT VIDEO 2 · CAMINATA Y ATMÓSFERA</span>
                <h4 className="text-xs font-bold text-white uppercase">Caminata Lenta en Entornos Lluviosos / Neón</h4>
              </div>
              <button
                onClick={() => handleCopy(`The character walks slowly forward, calm and steady. Smooth tracking shot following from a short distance, gentle handheld feel. Rain falls softly, reflections shimmer on the wet ground, breath faintly visible. Slow, weighty, cinematic pace. Realistic motion, no sudden movement. Avoid: running, jitter, warping limbs, melting face, background people moving fast.`, 'prompt_vid_2')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_vid_2' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_vid_2' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-indigo-300 leading-relaxed select-all">
              The character walks slowly forward, calm and steady. Smooth tracking shot following from a short distance, gentle handheld feel. Rain falls softly, reflections shimmer on the wet ground, breath faintly visible. Slow, weighty, cinematic pace. Realistic motion, no sudden movement. Avoid: running, jitter, warping limbs, melting face, background people moving fast.
            </div>

            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-indigo-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "El personaje avanza caminando lentamente, de forma constante. Toma de seguimiento (tracking shot) suave a corta distancia. Lluvia cayendo suavemente con reflejos en el piso mojado y aliento sutil visible. Ritmo pesado y cinematográfico."
              </p>
            </div>
          </div>

          {/* PROMPT VIDEO 3 */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">PROMPT VIDEO 3 · PLANO GENERAL CONTEMPLATIVO</span>
                <h4 className="text-xs font-bold text-white uppercase">Plano General Épico de Paisaje con Viento</h4>
              </div>
              <button
                onClick={() => handleCopy(`Very slow camera push-in on the figure standing still, coat moving gently in the wind. Clouds drift slowly behind. Light shifts subtly as if the sun is setting. Wide cinematic shot, steady with a faint handheld sway. Quiet, epic, atmospheric. Minimal subject movement. Avoid: fast pan, shaking, distortion, duplicated subject, on-screen text.`, 'prompt_vid_3')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                {copiedId === 'prompt_vid_3' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'prompt_vid_3' ? 'COPIADO!' : 'COPIAR EN INGLÉS'}
              </button>
            </div>

            <div className="bg-[#0a0a0b] p-3.5 rounded-xl border border-white/10 font-mono text-xs text-purple-300 leading-relaxed select-all">
              Very slow camera push-in on the figure standing still, coat moving gently in the wind. Clouds drift slowly behind. Light shifts subtly as if the sun is setting. Wide cinematic shot, steady with a faint handheld sway. Quiet, epic, atmospheric. Minimal subject movement. Avoid: fast pan, shaking, distortion, duplicated subject, on-screen text.
            </div>

            <div className="bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-purple-300 uppercase block font-mono">Explicación en Español (Virtual Professor):</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                "Acercamiento muy lento de la cámara hacia la figura de pie, el abrigo ondea suavemente al viento. Las nubes se desplazan lentamente al fondo. La luz cambia de forma sutil simulando un atardecer. Plano general épico y pacífico."
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mistakes_checklist',
      title: '05 · LOS 5 ERRORES DE PRINCIPIANTE Y CHECKLIST INTERACTIVO',
      subtitle: 'Soluciones inmediatas y lista de comprobación de tu proyecto',
      professorSpeech: 'Para cerrar la lección, repasemos los 5 errores clásicos que comete todo principiante al intentar convertir anime a Live-Action y cómo solucionarlos en segundos. Además, tienes una lista interactiva de verificación para marcar tu avance.',
      content: (
        <div className="space-y-6">
          {/* Los 5 errores */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Los 5 Errores Comunes de Principiante
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 1, err: '01 · Querer una escena de acción compleja en la primera toma', fix: 'Empieza siempre con un primer plano o toma de personaje estático mirando a la cámara. Domina primero los micro-movimientos.' },
                { id: 2, err: '02 · Describir al personaje cuando ya proporcionaste una foto de referencia', fix: 'Si subes una foto de referencia, borra del prompt todas las palabras como "pelo rubio", "ojos azules" o "chaqueta roja". Deja que la foto haga su trabajo.' },
                { id: 3, err: '03 · Sobrecargar el prompt de video con demasiadas acciones', fix: 'Usa una sola acción principal por toma: un parpadeo O un giro de cabeza, pero nunca todo junto en un video de 4 segundos.' },
                { id: 4, err: '04 · Comenzar desde un Keyframe borroso o de baja resolución', fix: 'Toma la captura de pantalla en la máxima resolución posible del reproductor. Si el anime tiene desenfoque de movimiento en ese fotograma, avanza un segundo hasta encontrar un cuadro congelado perfecto.' },
                { id: 5, err: '05 · Generar una sola vez y quedarse con lo primero que sale', fix: 'La IA es estocástica. Ejecuta el mismo prompt exactamente 3 a 5 veces y selecciona únicamente la versión con mejores texturas e iluminación.' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setExpandedMistake(expandedMistake === m.id ? null : m.id)}
                  className="bg-[#0a0a0b] border border-white/5 hover:border-indigo-500/30 p-3.5 rounded-xl cursor-pointer transition select-none space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-200">
                    <span className="text-rose-300">{m.err}</span>
                    <span className="text-indigo-400 font-mono text-[10px]">{expandedMistake === m.id ? 'VER MENOS ▲' : 'VER SOLUCIÓN ▼'}</span>
                  </div>

                  {expandedMistake === m.id && (
                    <div className="pt-2 border-t border-white/5 text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg">
                      <strong className="text-emerald-400 uppercase font-mono text-[10px] block">Solución del Profesor:</strong>
                      {m.fix}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checklist interactivo */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Lista Interactiva de Verificación (A a Z)
                </h3>
                <p className="text-[11px] text-gray-400">Progreso completado: {completedCount} de {totalCount} pasos</p>
              </div>
              <div className="w-24 bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'step1', text: 'Elegir un clip de anime inspirador de alta calidad' },
                { id: 'step2', text: 'Extraer un Keyframe estático nítido sin motion blur' },
                { id: 'step3', text: 'Seleccionar modelo de generación (Higgsfield / TapNow)' },
                { id: 'step4', text: 'Escribir Prompt de Imagen ordenado (Sujeto, Encuadre, Luz)' },
                { id: 'step5', text: 'Verificar Regla de Oro (no describir rostro si hay referencia)' },
                { id: 'step6', text: 'Generar 3 variaciones de Imagen y elegir la mejor' },
                { id: 'step7', text: 'Cargar la imagen fotorrealista validada en Image-to-Video' },
                { id: 'step8', text: 'Aplicar Prompt de Video enfocado en movimiento de cámara' },
                { id: 'step9', text: 'Verificar que no haya distorsión anatómica en los párpados' },
                { id: 'step10', text: 'Exportar clip listo para editar o publicar en redes' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none ${
                    checklist[item.id]
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200 line-through opacity-80'
                      : 'bg-[#0a0a0b] border-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={() => toggleChecklist(item.id)}
                    className="accent-indigo-500 w-4 h-4 rounded"
                  />
                  <span>{item.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cierre Studio Tag */}
          <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-zinc-900/40 border border-purple-500/30 rounded-2xl p-5 text-center space-y-3">
            <GraduationCap className="w-8 h-8 text-purple-400 mx-auto" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">¡Has desbloqueado la parte más difícil: Empezar!</h3>
            <p className="text-xs text-gray-300 max-w-lg mx-auto">
              Publica tu primer shot y etiqueta al estudio para recibir feedback directo: <span className="text-purple-300 font-mono font-bold">@alter.anime7</span>
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <audio ref={audioRef} className="hidden" />

      {/* PROFESSOR VIRTUAL CONTROL HEADER BAR */}
      <div className="bg-[#111114] border border-indigo-500/30 rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Avatar y Datos del Profesor */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-[#0a0a0b] rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              {isPlaying && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#111114] rounded-full animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white uppercase tracking-wider font-sans">
                  PROFESOR VIRTUAL DE IA
                </h2>
                <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-bold uppercase">
                  VOZ ELEVENLABS: {VOICE_ID.slice(0, 8)}...
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Lectura guiada explicada en Español Latinoamericano
              </p>
            </div>
          </div>

          {/* Action buttons player */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleTogglePlay()}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
                isPlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSAR LECTURA' : 'ESCUCHAR PROFESOR'}</span>
            </button>

            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="px-3 py-2.5 bg-[#0a0a0b] hover:bg-white/5 border border-white/10 text-gray-300 rounded-xl text-xs font-mono transition"
              title="Configurar ElevenLabs API Key opcional"
            >
              {elevenLabsApiKey ? '🔑 API LISTA' : '⚙️ ELEVENLABS'}
            </button>
          </div>

        </div>

        {/* ElevenLabs API key drop input if clicked */}
        {showApiKeyInput && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col md:flex-row items-center gap-3 bg-[#0a0a0b] p-3 rounded-xl">
            <span className="text-xs font-mono text-gray-400">API Key ElevenLabs (Opcional):</span>
            <input
              type="password"
              placeholder="xi-api-key..."
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              className="bg-[#111114] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono flex-1 outline-none focus:border-indigo-500"
            />
            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer font-mono select-none">
              <input
                type="checkbox"
                checked={useFallbackSpeech}
                onChange={(e) => setUseFallbackSpeech(e.target.checked)}
                className="accent-indigo-500"
              />
              Usar voz nativa del navegador si no hay API
            </label>
          </div>
        )}

        {/* SUBTITLES REALTIME OVERLAY BAR */}
        {currentSubtitle && (
          <div className="mt-4 bg-black/90 border border-indigo-500/50 rounded-xl p-3.5 text-center backdrop-blur-md animate-fade-in shadow-2xl space-y-1">
            <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest block">
              [ SUBTÍTULOS EN VIVO EN ESPAÑOL ]
            </span>
            <p className="text-sm text-yellow-300 font-semibold tracking-wide leading-relaxed font-sans">
              "{currentSubtitle}"
            </p>
          </div>
        )}
      </div>

      {/* LESSON NAVIGATION TABS */}
      <div className="bg-[#111114] border border-white/5 p-1.5 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-1.5 select-none shadow-xl">
        {sections.map((sec, idx) => {
          const active = currentSectionIndex === idx;
          return (
            <button
              key={sec.id}
              onClick={() => {
                stopSpeech();
                setCurrentSectionIndex(idx);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all flex items-center justify-center text-center gap-1.5 ${
                active
                  ? 'bg-indigo-600 text-white font-black shadow-lg border border-indigo-400/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="truncate">{sec.title.split('·')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE SECTION CONTENT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
              {sections[currentSectionIndex].title}
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              {sections[currentSectionIndex].subtitle}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentSectionIndex === 0}
              onClick={() => {
                stopSpeech();
                setCurrentSectionIndex(prev => prev - 1);
              }}
              className="p-2 bg-[#111114] hover:bg-white/5 disabled:opacity-40 border border-white/10 rounded-xl text-xs font-mono font-bold text-gray-300"
            >
              ◀ ANTERIOR
            </button>
            <button
              disabled={currentSectionIndex === sections.length - 1}
              onClick={() => {
                stopSpeech();
                setCurrentSectionIndex(prev => prev + 1);
              }}
              className="p-2 bg-[#111114] hover:bg-white/5 disabled:opacity-40 border border-white/10 rounded-xl text-xs font-mono font-bold text-gray-300"
            >
              SIGUIENTE ▶
            </button>
          </div>
        </div>

        {/* Section Body */}
        {sections[currentSectionIndex].content}
      </div>

    </div>
  );
}
