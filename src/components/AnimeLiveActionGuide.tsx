/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Play, Pause, Square, SkipForward, SkipBack, Copy, Check, Sparkles,
  GraduationCap, Key, Info, HelpCircle, Layers, Image as ImageIcon, Video as VideoIcon,
  AlertTriangle, CheckSquare, ArrowRight, Download, Share2, Eye, ShieldAlert, BookOpen
} from 'lucide-react';
import {
  GUIDE_SECTIONS, IMAGE_PROMPTS, VIDEO_PROMPTS, MISTAKES_LIST, CHECKLIST_STEPS,
  ELEVENLABS_VOICE_ID, GuideSection, PromptItem
} from '../data/animeLiveActionGuide';
import { ttsService } from '../utils/elevenLabsService';

export default function AnimeLiveActionGuide() {
  // Navigation & Active Section
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const activeSection: GuideSection = GUIDE_SECTIONS[currentSectionIndex];

  // TTS & Subtitles State
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [subtitleProgress, setSubtitleProgress] = useState<number>(0);

  // Checklist State (10 items)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // Mistakes Accordion State
  const [openMistakeId, setOpenMistakeId] = useState<number | null>(1);

  // Copied prompt feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle Play Section Audio
  const handlePlayAudio = (textToSpeak?: string) => {
    const text = textToSpeak || activeSection.professorExplanation;

    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      return;
    }

    ttsService.speak({
      apiKey: elevenLabsApiKey,
      voiceId: ELEVENLABS_VOICE_ID,
      text,
      onStart: () => {
        setIsPlayingAudio(true);
        setSubtitleText(text);
        setSubtitleProgress(0);
      },
      onEnd: () => {
        setIsPlayingAudio(false);
        setSubtitleProgress(100);
      },
      onError: (err) => {
        console.error('TTS Error:', err);
        setIsPlayingAudio(false);
      },
      onSubtitleProgress: (subText, pct) => {
        setSubtitleText(subText);
        setSubtitleProgress(pct);
      }
    });
  };

  const handleStopAudio = () => {
    ttsService.stop();
    setIsPlayingAudio(false);
    setSubtitleProgress(0);
    setSubtitleText('');
  };

  // Auto stop audio when switching section
  useEffect(() => {
    handleStopAudio();
  }, [currentSectionIndex]);

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleChecklist = (id: number) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 text-gray-100 font-sans pb-16">

      {/* HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-zinc-950 border border-indigo-500/20 p-6 md:p-8 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase rounded-full">
                ALTER ANIME STUDIO • GUÍA COMPLETA
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded">
                ESPAÑOL LATINOAMERICANO
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase font-sans">
              DE ANIME A LIVE-ACTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">CON IA</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
              El método paso a paso para transformar cualquier escena de anime en una toma cinematográfica hiperrealista — sin equipo, actores ni presupuesto.
            </p>
          </div>

          {/* ElevenLabs Voice Badge & Key Trigger */}
          <div className="bg-[#0a0a0c]/80 backdrop-blur border border-white/10 p-4 rounded-2xl flex flex-col gap-2 shrink-0 max-w-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[11px] font-bold text-gray-200">ElevenLabs Voice ID</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {ELEVENLABS_VOICE_ID}
              </span>
            </div>

            <p className="text-[10px] text-gray-400 leading-snug">
              Voz en vivo del Profesor Virtual. {elevenLabsApiKey ? '✓ Clave API activa' : 'Usa la voz de ElevenLabs o el sintetizador nativo en español.'}
            </p>

            <button
              onClick={() => setShowKeyModal(!showKeyModal)}
              className="mt-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-indigo-300 font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              {elevenLabsApiKey ? 'Configurar Clave ElevenLabs' : 'Ingresar Clave API ElevenLabs'}
            </button>
          </div>
        </div>
      </div>

      {/* ELEVENLABS KEY MODAL / COLLAPSIBLE */}
      {showKeyModal && (
        <div className="bg-[#111115] border border-indigo-500/30 p-4 rounded-2xl space-y-3 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> Configuración de ElevenLabs Voice ID ({ELEVENLABS_VOICE_ID})
            </h4>
            <button
              onClick={() => setShowKeyModal(false)}
              className="text-gray-400 hover:text-white text-xs font-bold"
            >
              ✕ Cerrar
            </button>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Ingresa tu <strong className="text-gray-200">xi-api-key</strong> de ElevenLabs para generar la voz ultra-realista con la ID <code className="text-indigo-400">{ELEVENLABS_VOICE_ID}</code>. Si no dispones de una clave API, la aplicación usará automáticamente la voz en español latinoamericano mediante la Web Speech API del navegador.
          </p>

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Ej: 2a8f9d0c..."
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              className="flex-1 bg-[#09090b] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setShowKeyModal(false)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
            >
              Guardar Clave
            </button>
          </div>
        </div>
      )}

      {/* VIRTUAL PROFESSOR PLAYER & SUBTITLES BAR */}
      <div className="sticky top-2 z-20 bg-[#121216]/95 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Virtual Professor Avatar & Status */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              {isPlayingAudio && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121216] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Profesor Virtual AI <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2 py-0.5 rounded">Audio-Guía</span>
                </h3>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                {isPlayingAudio ? '🔊 Leyendo sección actual en voz alta...' : 'Pausa la lectura o presiona Reproducir para escuchar la explicación del profesor.'}
              </p>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-2 select-none">
            <button
              onClick={() => setCurrentSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSectionIndex === 0}
              className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-xl text-gray-300 transition"
              title="Sección Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePlayAudio()}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-650/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-650/20'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> Pausar Lectura
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Leer Sección con Voz
                </>
              )}
            </button>

            {isPlayingAudio && (
              <button
                onClick={handleStopAudio}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition"
                title="Detener Lectura"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              onClick={() => setCurrentSectionIndex((prev) => Math.min(GUIDE_SECTIONS.length - 1, prev + 1))}
              disabled={currentSectionIndex === GUIDE_SECTIONS.length - 1}
              className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 rounded-xl text-gray-300 transition"
              title="Siguiente Sección"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtitle Progress Ticker */}
        {isPlayingAudio && (
          <div className="space-y-1.5 pt-2 border-t border-white/5 animate-fade-in">
            <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" /> SUBTÍTULOS EN TIEMPO REAL:
              </span>
              <span>{subtitleProgress}%</span>
            </div>

            <div className="bg-[#08080a] border border-indigo-500/30 p-3 rounded-xl min-h-[48px] flex items-center justify-center text-center">
              <p className="text-xs md:text-sm font-medium text-amber-200 leading-snug tracking-wide">
                "{subtitleText || activeSection.professorExplanation}"
              </p>
            </div>

            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${subtitleProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION NAV TABS DECK */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1.5 bg-[#111114] border border-white/5 p-1 rounded-2xl">
        {GUIDE_SECTIONS.map((sec, idx) => {
          const active = currentSectionIndex === idx;
          return (
            <button
              key={sec.id}
              onClick={() => setCurrentSectionIndex(idx)}
              className={`py-2 px-2.5 rounded-xl text-left transition flex flex-col justify-between h-14 select-none ${
                active
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20 border border-indigo-400/30'
                  : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-[10px] font-mono font-bold tracking-wider opacity-70">
                {sec.number}
              </span>
              <span className="text-[11px] leading-tight font-medium truncate block">
                {sec.title.split('—')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* MAIN GUIDE CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAIN EXPLANATION & INTERACTIVE CARDS */}
        <div className="lg:col-span-8 space-y-6">

          {/* Active Section Card */}
          <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="space-y-1.5 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold">
                  SECCIÓN {activeSection.number} DE 07
                </span>
                <span className="text-xs text-gray-400 font-medium">• {activeSection.subtitle}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {activeSection.title}
              </h2>
            </div>

            {/* Professor Virtual Audio Quote Box */}
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono text-indigo-300 uppercase tracking-wider block">
                  Explicación del Profesor Virtual
                </span>
                <p className="text-xs md:text-sm text-indigo-100 italic leading-relaxed">
                  "{activeSection.professorExplanation}"
                </p>
              </div>
            </div>

            {/* Rendered Spanish Content */}
            <div className="prose prose-invert max-w-none text-xs md:text-sm leading-relaxed text-gray-300 space-y-4">
              {activeSection.contentSpanish.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base font-bold text-white uppercase tracking-wider pt-2 border-b border-white/5 pb-1">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={idx} className="text-sm font-bold text-indigo-300 pt-1">
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('---')) {
                  return <hr key={idx} className="border-white/5 my-4" />;
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {paragraph.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{chunk}</strong> : chunk)}
                  </p>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC VISUAL CARDS & DIAGRAMS ACCORDING TO SECTION */}

          {/* SECTION 01: 4-STEP DIAGRAM */}
          {activeSection.id === 'who-and-principle' && (
            <div className="bg-[#111114] border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> El flujo de trabajo en 4 pasos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { step: '01', title: 'ESCENA', sub: 'Eliges el anime', desc: 'Seleccionas la escena que te inspira.', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
                  { step: '02', title: 'KEYFRAME', sub: 'Extraes fotograma', desc: 'Captura estática sin borrosidad.', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
                  { step: '03', title: 'IMAGEN REAL', sub: 'IA lo hace real', desc: 'Parte 1: Convertir a live-action.', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300' },
                  { step: '04', title: 'VIDEO', sub: 'IA lo anima', desc: 'Parte 2: Movimiento de cámara y sujeto.', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' }
                ].map((item) => (
                  <div key={item.step} className={`p-4 rounded-2xl border ${item.color} space-y-2 flex flex-col justify-between`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold tracking-widest block opacity-70">PASO {item.step}</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{item.title}</h4>
                      <p className="text-[11px] font-medium text-gray-300">{item.sub}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug pt-2 border-t border-white/5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROMPTS FOR IMAGE SECTION */}
          {(activeSection.id === 'part1-image' || activeSection.id === 'prompt-rules') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" /> 3 Prompts de Imagen · Listos para copiar
                  </h3>
                  <p className="text-xs text-gray-400">Los prompts están en inglés exacto para la IA, acompañados de su explicación en español latinoamericano.</p>
                </div>
              </div>

              <div className="space-y-4">
                {IMAGE_PROMPTS.map((prompt) => (
                  <div key={prompt.id} className="bg-[#111114] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{prompt.titleEs}</h4>
                          <span className="text-[9px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            {prompt.tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block">{prompt.titleEn}</span>
                      </div>

                      <button
                        onClick={() => handleCopyPrompt(prompt.id, prompt.promptEnglish)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 ${
                          copiedId === prompt.id
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {copiedId === prompt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> ¡Prompt Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copiar Prompt en Inglés
                          </>
                        )}
                      </button>
                    </div>

                    {/* Exact English Prompt Box */}
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider">Prompt en Inglés (Copiar a Higgsfield / Seedance):</span>
                      <div className="bg-[#08080a] border border-white/10 rounded-xl p-3 font-mono text-xs text-indigo-200 leading-relaxed select-all">
                        {prompt.promptEnglish}
                      </div>
                    </div>

                    {/* Spanish Breakdown */}
                    <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed space-y-2">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Explicación en Español Latinoamericano:</span>
                      <div className="space-y-1.5">
                        {prompt.explanationSpanish.split('\n* ').map((item, i) => (
                          <div key={i} className="text-gray-300">
                            {item.replace('**Traducción y Explicación en Español:**\n', '')}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Element Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                      {prompt.elements.map((el, i) => (
                        <div key={i} className="bg-[#08080a] border border-white/5 p-2 rounded-lg">
                          <span className="text-[9px] font-mono text-gray-400 uppercase font-bold block">{el.label}</span>
                          <span className="text-[10px] text-gray-200 font-medium truncate block">{el.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROMPTS FOR VIDEO SECTION */}
          {activeSection.id === 'part2-video' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <VideoIcon className="w-5 h-5 text-purple-400" /> 3 Prompts de Video · Animación Cinematográfica
                  </h3>
                  <p className="text-xs text-gray-400">Pega estos prompts en el modo Image-to-Video de tu herramienta IA.</p>
                </div>
              </div>

              <div className="space-y-4">
                {VIDEO_PROMPTS.map((prompt) => (
                  <div key={prompt.id} className="bg-[#111114] border border-purple-500/20 rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{prompt.titleEs}</h4>
                          <span className="text-[9px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            {prompt.tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block">{prompt.titleEn}</span>
                      </div>

                      <button
                        onClick={() => handleCopyPrompt(prompt.id, prompt.promptEnglish)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 ${
                          copiedId === prompt.id
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        {copiedId === prompt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> ¡Prompt Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copiar Prompt de Video
                          </>
                        )}
                      </button>
                    </div>

                    {/* Exact English Prompt Box */}
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono font-bold text-gray-400 uppercase tracking-wider">Prompt de Movimiento (Image-to-Video):</span>
                      <div className="bg-[#08080a] border border-white/10 rounded-xl p-3 font-mono text-xs text-purple-200 leading-relaxed select-all">
                        {prompt.promptEnglish}
                      </div>
                    </div>

                    {/* Spanish Breakdown */}
                    <div className="bg-zinc-900/60 border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 leading-relaxed space-y-2">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Explicación en Español Latinoamericano:</span>
                      <div className="space-y-1.5">
                        {prompt.explanationSpanish.split('\n* ').map((item, i) => (
                          <div key={i} className="text-gray-300">
                            {item.replace('**Traducción y Explicación en Español:**\n', '')}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Element Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                      {prompt.elements.map((el, i) => (
                        <div key={i} className="bg-[#08080a] border border-white/5 p-2 rounded-lg">
                          <span className="text-[9px] font-mono text-gray-400 uppercase font-bold block">{el.label}</span>
                          <span className="text-[10px] text-gray-200 font-medium truncate block">{el.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MISTAKES ACCORDION SECTION */}
          {activeSection.id === 'checklist-and-mistakes' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Los 5 Errores Principales de Principiantes
                </h3>
                <p className="text-xs text-gray-400">Haz clic en cada error para ver la explicación del problema y la solución exacta.</p>
              </div>

              <div className="space-y-3">
                {MISTAKES_LIST.map((mistake) => {
                  const isOpen = openMistakeId === mistake.id;
                  return (
                    <div key={mistake.id} className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden transition shadow-lg">
                      <button
                        onClick={() => setOpenMistakeId(isOpen ? null : mistake.id)}
                        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            0{mistake.id}
                          </span>
                          <span className="text-xs md:text-sm font-bold text-gray-200">
                            {mistake.title}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs font-bold">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {isOpen && (
                        <div className="p-4 pt-0 border-t border-white/5 space-y-3 bg-[#0a0a0d] animate-fade-in text-xs">
                          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl space-y-1 text-rose-200">
                            <span className="font-mono text-[9.5px] font-bold text-rose-400 uppercase block">❌ El Problema:</span>
                            <p>{mistake.problem}</p>
                          </div>

                          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1 text-emerald-200">
                            <span className="font-mono text-[9.5px] font-bold text-emerald-400 uppercase block">✓ La Solución del Profesor:</span>
                            <p>{mistake.solution}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: INTERACTIVE CHECKLIST & QUICK NAV */}
        <div className="lg:col-span-4 space-y-6">

          {/* INTERACTIVE WORKFLOW CHECKLIST */}
          <div className="bg-[#111114] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" /> Lista de Verificación
                </h3>
                <p className="text-[10px] text-gray-400">Tu flujo de trabajo de la A a la Z</p>
              </div>

              <span className="text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                {completedSteps.length} / {CHECKLIST_STEPS.length}
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {CHECKLIST_STEPS.map((step) => {
                const checked = completedSteps.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => toggleChecklist(step.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition flex items-start gap-2.5 ${
                      checked
                        ? 'bg-emerald-500/5 border-emerald-500/30 text-gray-300'
                        : 'bg-[#09090b] border-white/5 text-gray-400 hover:border-white/10'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                      checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-600'
                    }`}>
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <span className={`leading-snug text-[11px] ${checked ? 'line-through text-gray-400' : ''}`}>
                      <strong className="font-mono text-[10px] text-gray-400 mr-1">{step.id}.</strong> {step.text}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(completedSteps.length / CHECKLIST_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* STUDIO SOCIAL & EXPORT FOOTER CARD */}
          <div className="bg-[#111114] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-400" /> Comparte tu Trabajo
            </h3>

            <p className="text-xs text-gray-400 leading-relaxed">
              Publica tu primera toma live-action y etiqueta a la comunidad del estudio:
            </p>

            <div className="bg-[#08080a] border border-white/10 p-3 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold text-indigo-300 font-mono">@alter.anime7</span>
              <p className="text-[10px] text-gray-500">Revisamos y destacamos las mejores creaciones de los estudiantes.</p>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Guardar como PDF / Imprimir Guía
            </button>

            <p className="text-[9px] text-gray-500 text-center font-mono">
              ALTER ANIME STUDIO • Guía Completa — Para uso personal.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
