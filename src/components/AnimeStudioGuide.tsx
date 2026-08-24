/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, FastForward, RotateCcw, Copy, Check,
  Sparkles, Video, Image as ImageIcon, HelpCircle, ChevronDown, ChevronUp,
  Layers, Settings, Sliders, ExternalLink, Award, CheckCircle2, AlertTriangle,
  Lightbulb, Film, User, Bot, BookOpen, Key, Radio
} from 'lucide-react';
import {
  GUIDE_METADATA, GUIDE_SECTIONS, PROMPT_EXAMPLES, MISTAKES_LIST,
  CHECKLIST_ITEMS, NEXT_STEPS, ELEVENLABS_VOICE_ID, PromptExample
} from '../data/animeGuideData';

interface AnimeStudioGuideProps {
  onAddLog?: (source: 'Cloud' | 'Shizuku' | 'Overlay', level: 'info' | 'success' | 'warn', msg: string) => void;
}

export default function AnimeStudioGuide({ onAddLog }: AnimeStudioGuideProps) {
  // Voice and Audio Reader state
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [useElevenLabs, setUseElevenLabs] = useState<boolean>(false);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);

  // Copy state tracker
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded mistake cards
  const [expandedMistakes, setExpandedMistakes] = useState<Record<number, boolean>>({ 1: true });

  // Interactive visual demo step tab
  const [demoStep, setDemoStep] = useState<number>(1);
  const [demoFilter, setDemoFilter] = useState<'all' | 'image' | 'video'>('all');

  // Ref for speech synthesis or audio element
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSection = GUIDE_SECTIONS[activeSectionIdx] || GUIDE_SECTIONS[0];

  // Sync checklist state with local storage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alter_anime_checklist');
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore local storage errors
    }
  }, []);

  const toggleChecklistItem = (id: string) => {
    const next = checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setChecklist(next);
    try {
      localStorage.setItem('alter_anime_checklist', JSON.stringify(next));
    } catch (e) {}
  };

  const toggleMistake = (id: number) => {
    setExpandedMistakes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle Speech Reader Playback
  const startReading = (sectionIdx: number = activeSectionIdx) => {
    stopReading();
    setActiveSectionIdx(sectionIdx);
    setIsPlaying(true);

    const section = GUIDE_SECTIONS[sectionIdx];
    if (!section) return;

    if (onAddLog) {
      onAddLog('Cloud', 'info', `Profesor Virtual leyendo: ${section.title} (Voz: ${ELEVENLABS_VOICE_ID})`);
    }

    // Try Web Speech API with Spanish voice selection
    if ('speechSynthesis' in window && !useElevenLabs) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(section.speechText);
      utterance.rate = playbackSpeed;
      utterance.lang = 'es-MX';

      // Pick Spanish voice if available
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find((v) =>
        v.lang.startsWith('es') || v.lang.includes('MX') || v.lang.includes('US')
      );
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIdx = event.charIndex;
          const textUpToChar = section.speechText.substring(0, charIdx);
          const wordsCount = textUpToChar.split(/\s+/).filter(Boolean).length;
          setActiveWordIndex(wordsCount);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentSubtitle('');
        if (sectionIdx < GUIDE_SECTIONS.length - 1) {
          // Auto advance to next section
          setTimeout(() => startReading(sectionIdx + 1), 1000);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        runFallbackSimulatedSubtitles(sectionIdx);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Run timed subtitle animation sync
    runTimedSubtitles(section);
  };

  const stopReading = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCurrentSubtitle('');
  };

  const runTimedSubtitles = (section: typeof GUIDE_SECTIONS[0]) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let currentSubIdx = 0;
    const subs = section.subtitles;
    if (!subs || subs.length === 0) return;

    setCurrentSubtitle(subs[0].text);

    timerRef.current = setInterval(() => {
      currentSubIdx++;
      if (currentSubIdx < subs.length) {
        setCurrentSubtitle(subs[currentSubIdx].text);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, (subs[0]?.durationMs || 3000) / playbackSpeed);
  };

  const runFallbackSimulatedSubtitles = (sectionIdx: number) => {
    setIsPlaying(true);
    const section = GUIDE_SECTIONS[sectionIdx];
    let subIdx = 0;
    const subs = section.subtitles;

    const interval = setInterval(() => {
      if (subIdx < subs.length) {
        setCurrentSubtitle(subs[subIdx].text);
        subIdx++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentSubtitle('');
      }
    }, 3500 / playbackSpeed);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const filteredPrompts = PROMPT_EXAMPLES.filter((p) =>
    demoFilter === 'all' || p.category === demoFilter
  );

  return (
    <div className="space-y-8 text-gray-100 font-sans pb-16">

      {/* 1. HERO HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-[#0d0d12] to-zinc-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                {GUIDE_METADATA.studio}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ESPAÑOL LATINOAMERICANO
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                ELEVENLABS VOICE ID: {ELEVENLABS_VOICE_ID}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
              {GUIDE_METADATA.methodName}
            </h1>

            <p className="text-xs md:text-sm text-gray-300 font-medium leading-relaxed">
              {GUIDE_METADATA.tagline}
            </p>
          </div>

          {/* Quick stats pill */}
          <div className="bg-[#111116]/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex md:flex-col gap-4 md:gap-2 shrink-0">
            <div className="text-center md:text-left">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Progreso Guía</div>
              <div className="text-lg font-black text-emerald-400 font-mono">{progressPercent}%</div>
            </div>
            <div className="h-8 md:h-px w-px md:w-full bg-white/10" />
            <div className="text-center md:text-left">
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase">Prompts Incluidos</div>
              <div className="text-lg font-black text-indigo-400 font-mono">{PROMPT_EXAMPLES.length} Listo para Copiar</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROFESOR VIRTUAL & AUDIO PLAYER CONTROL BAR */}
      <div className="sticky top-2 z-30 bg-[#121217]/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* Avatar and Professor details */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg border border-indigo-400/40 transition-all ${isPlaying ? 'ring-4 ring-indigo-500/30 scale-105' : ''}`}>
                <Bot className="w-6 h-6" />
              </div>
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121217] animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase text-white tracking-wider">Profesor Virtual AI</h3>
                <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">
                  {useElevenLabs ? 'ElevenLabs Audio' : 'Voz Interactiva'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium truncate max-w-xs">
                Leyendo: <span className="text-indigo-400 font-bold">{activeSection.title}</span>
              </p>
            </div>
          </div>

          {/* Central Playback Controls */}
          <div className="flex items-center gap-2 bg-[#09090c] border border-white/10 px-3 py-1.5 rounded-xl w-full lg:w-auto justify-center">
            {/* Prev Section */}
            <button
              onClick={() => {
                const prev = Math.max(0, activeSectionIdx - 1);
                startReading(prev);
              }}
              disabled={activeSectionIdx === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Sección Anterior"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Play / Pause Button */}
            <button
              onClick={() => {
                if (isPlaying) {
                  stopReading();
                } else {
                  startReading(activeSectionIdx);
                }
              }}
              className={`px-5 py-2 rounded-xl text-xs font-black font-sans uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                isPlaying
                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> PAUSAR PROFESOR
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> ESCUCHAR PROFESOR
                </>
              )}
            </button>

            {/* Next Section */}
            <button
              onClick={() => {
                const next = Math.min(GUIDE_SECTIONS.length - 1, activeSectionIdx + 1);
                startReading(next);
              }}
              disabled={activeSectionIdx === GUIDE_SECTIONS.length - 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition"
              title="Siguiente Sección"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="border-l border-white/10 pl-2 ml-1 flex items-center gap-1">
              {[0.8, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    if (isPlaying) startReading(activeSectionIdx);
                  }}
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded transition ${
                    playbackSpeed === speed
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Settings Modal Toggle */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-2 bg-[#09090c] hover:bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline text-[11px]">Voz ElevenLabs</span>
            </button>
          </div>

        </div>

        {/* ElevenLabs API / Voice Settings Drawer */}
        {showVoiceSettings && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3 bg-[#0a0a0d] p-4 rounded-xl border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Configuración de Voz ElevenLabs
              </span>
              <span className="text-[10px] font-mono text-gray-400">Voice ID: <code className="text-indigo-400 font-bold">{ELEVENLABS_VOICE_ID}</code></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">Modo de Generación</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseElevenLabs(false)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-bold transition ${
                      !useElevenLabs ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#111116] border-white/10 text-gray-400'
                    }`}
                  >
                    Voz Sintética Web (Sin API Key)
                  </button>
                  <button
                    onClick={() => setUseElevenLabs(true)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-[11px] font-bold transition ${
                      useElevenLabs ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-[#111116] border-white/10 text-gray-400'
                    }`}
                  >
                    ElevenLabs Stream Directo
                  </button>
                </div>
              </div>

              {useElevenLabs && (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase font-mono">ElevenLabs API Key (Opcional)</label>
                  <input
                    type="password"
                    value={elevenLabsApiKey}
                    onChange={(e) => setElevenLabsApiKey(e.target.value)}
                    placeholder="Ingresa tu XI-API-KEY..."
                    className="w-full bg-[#111116] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. LIVE SYNCHRONIZED SUBTITLES SCREEN / TELEPROMPTER */}
        {isPlaying && currentSubtitle && (
          <div className="mt-3 bg-gradient-to-r from-zinc-950 via-indigo-950 to-zinc-950 border border-indigo-500/50 p-3.5 rounded-xl text-center shadow-inner animate-fade-in">
            <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1 flex items-center justify-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> SUBTÍTULOS EN VIVO EN ESPAÑOL LATINO
            </div>
            <p className="text-sm md:text-base font-bold text-white tracking-wide leading-snug drop-shadow-md">
              "{currentSubtitle}"
            </p>
          </div>
        )}
      </div>

      {/* 4. SECTION NAVIGATOR TABS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 select-none">
        {GUIDE_SECTIONS.map((sec, idx) => {
          const active = idx === activeSectionIdx;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionIdx(idx);
                if (isPlaying) startReading(idx);
              }}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                active
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-650/10'
                  : 'bg-[#111116] border-white/5 hover:bg-white/5 text-gray-400'
              }`}
            >
              <span className={`text-[9px] font-mono font-bold uppercase ${active ? 'text-indigo-400' : 'text-gray-500'}`}>
                {sec.id.toUpperCase()}
              </span>
              <span className="text-xs font-black truncate leading-snug">
                {sec.title.split('·')[1] || sec.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. ACTIVE SECTION CONTENT BODY */}
      <div className="bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-white/5 pb-4 space-y-1">
          <div className="text-xs font-mono font-bold uppercase text-indigo-400">
            {activeSection.title}
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">
            {activeSection.subtitle}
          </h2>
        </div>

        {/* Section 1 Overview cards */}
        {activeSection.id === 'intro' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {activeSection.overviewCards?.map((card) => (
              <div key={card.num} className="bg-[#09090c] border border-white/5 p-5 rounded-2xl space-y-2 hover:border-indigo-500/40 transition">
                <span className="text-2xl font-black text-indigo-400 font-mono">{card.num}</span>
                <h3 className="text-sm font-bold text-gray-100">{card.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Section 2 Principle 30s diagram */}
        {activeSection.id === 'principle' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {activeSection.steps?.map((st) => (
              <div key={st.step} className="bg-[#09090c] border border-white/5 p-4 rounded-2xl space-y-2 relative overflow-hidden group hover:border-indigo-500/50 transition">
                <div className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded w-fit">
                  {st.step}
                </div>
                <div className="text-sm font-black text-white">{st.action}</div>
                <p className="text-xs text-gray-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Section 3 Minimal Stack */}
        {activeSection.id === 'stack' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeSection.toolList?.map((tool) => (
                <div key={tool.name} className="bg-[#09090c] border border-white/5 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    {tool.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        {tool.badge}
                      </span>
                    )}
                    <h3 className="text-sm font-black text-white">{tool.name}</h3>
                    <div className="text-[11px] font-mono font-bold text-indigo-400">{tool.role}</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <strong className="text-white block mb-0.5">¿Por qué no DaVinci Resolve o Topaz AI de entrada?</strong>
                Porque la corrección de color avanzada, escalado a 4K e interpolación de FPS son lo que separa un video "bueno" de uno "firmado". Eso lo dejamos para el curso avanzado. Aquí buscamos terminar y publicar tu primer corte real, no la perfección teórica.
              </div>
            </div>
          </div>
        )}

        {/* Section 4 Golden Rule */}
        {activeSection.id === 'part1' && (
          <div className="space-y-6 pt-2">
            {/* Golden rule banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/40 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-black text-sm uppercase font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                {activeSection.goldenRule?.title}
              </div>
              <p className="text-sm font-bold text-white">
                "{activeSection.goldenRule?.rule}"
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeSection.goldenRule?.explanation}
              </p>
            </div>

            {/* Prompt Structure Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-gray-400">Estructura del Prompt Perfecto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeSection.promptStructure?.map((block) => (
                  <div key={block.block} className="bg-[#09090c] border border-white/5 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {block.block}
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed pt-1">{block.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 5 Video Rules */}
        {activeSection.id === 'part2' && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSection.videoRules?.map((vr) => (
                <div key={vr.rule} className="bg-[#09090c] border border-white/5 p-4 rounded-2xl space-y-1.5">
                  <span className="text-xs font-black text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-indigo-400" /> {vr.rule}
                  </span>
                  <p className="text-xs text-gray-400 leading-relaxed">{vr.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-rose-500/10 border border-rose-500/30 p-4.5 rounded-2xl space-y-2">
              <span className="text-xs font-black text-rose-300 uppercase font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> TRAMPA #1: Demasiado movimiento = La IA se rompe
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                El error del principiante es pedir una escena de acción espectacular. Resultado: rostros derretidos, extremidades extra y parpadeos molestos. La solución: cámara en mano discreta + micro-expresiones + cuerpo casi estático.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 6. PROMPT EXAMPLES SECTION (IN ENGLISH AND SPANISH WITH BREAKDOWN) */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> PROMPTS LISTOS PARA COPIAR Y USAR
            </h2>
            <p className="text-xs text-gray-400">
              Copia directamente en Inglés para las herramientas IA (Higgsfield, TapNow, Midjourney) y lee la explicación en Español Latino.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 bg-[#111116] border border-white/5 p-1 rounded-xl">
            {(['all', 'image', 'video'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDemoFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition ${
                  demoFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'image' ? 'Imágenes' : 'Videos'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPrompts.map((example) => {
            const copiedEn = copiedId === `${example.id}-en`;
            const copiedEs = copiedId === `${example.id}-es`;

            return (
              <div
                key={example.id}
                id={`prompt_card_${example.id}`}
                className="bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl hover:border-indigo-500/30 transition"
              >
                {/* Header title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">
                      {example.badge}
                    </span>
                    <h3 className="text-lg font-black text-white pt-1">{example.title}</h3>
                  </div>

                  <div className="flex gap-2">
                    {/* Copy English */}
                    <button
                      onClick={() => handleCopyText(example.promptEnglish, `${example.id}-en`)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        copiedEn
                          ? 'bg-emerald-500 text-black'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      }`}
                    >
                      {copiedEn ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedEn ? '¡Copiado en Inglés!' : 'Copiar Prompt en Inglés (IA)'}
                    </button>

                    {/* Copy Spanish */}
                    <button
                      onClick={() => handleCopyText(example.promptSpanish, `${example.id}-es`)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        copiedEs
                          ? 'bg-emerald-500 text-black'
                          : 'bg-[#181820] hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {copiedEs ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedEs ? '¡Copiado!' : 'Copiar en Español'}
                    </button>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-xs text-gray-300 leading-relaxed bg-[#09090c] p-3.5 rounded-xl border border-white/5">
                  <strong className="text-indigo-400">Explicación del Profesor:</strong> {example.explanation}
                </p>

                {/* DUAL PROMPT DISPLAY BOXES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {/* English Box */}
                  <div className="bg-[#09090c] border border-indigo-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-indigo-400 uppercase">
                      <span>PROMPT EN INGLÉS (Para pegar en la IA)</span>
                      <span>100% Optimizado</span>
                    </div>
                    <p className="text-xs font-mono text-gray-200 leading-relaxed bg-[#111116] p-3 rounded-xl select-all border border-white/5">
                      {example.promptEnglish}
                    </p>
                  </div>

                  {/* Spanish Box */}
                  <div className="bg-[#09090c] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase">
                      <span>TRADUCCIÓN EN ESPAÑOL LATINOAMERICANO</span>
                      <span>Comprensión</span>
                    </div>
                    <p className="text-xs font-sans text-gray-300 leading-relaxed bg-[#111116] p-3 rounded-xl border border-white/5">
                      {example.promptSpanish}
                    </p>
                  </div>

                </div>

                {/* PARAMETER BREAKDOWN BLOCKS */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase text-gray-400">
                    Desglose de Bloques del Prompt
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {example.promptBlocks.map((b, bIdx) => (
                      <div key={bIdx} className="bg-[#09090c] border border-white/5 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded uppercase">
                          {b.label}
                        </span>
                        <div className="text-xs font-mono text-gray-200 pt-1">{b.englishText}</div>
                        <div className="text-[11px] text-gray-400 italic">{b.spanishText}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SAMPLE VISUAL MEDIA PREVIEWS */}
                {example.sampleImageBefore && example.sampleImageAfter && (
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="text-xs font-mono font-bold text-gray-400 uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-400" /> Muestra Visual: Anime vs Live-Action Generado
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-gray-400">01 · Anime Original (Keyframe)</span>
                        <img
                          src={example.sampleImageBefore}
                          alt="Anime sample"
                          className="w-full h-48 object-cover rounded-2xl border border-white/10"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">02 · Live-Action Fotorrealista (IA)</span>
                        <img
                          src={example.sampleImageAfter}
                          alt="Live action sample"
                          className="w-full h-48 object-cover rounded-2xl border border-emerald-500/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {example.sampleVideoUrl && (
                  <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="text-xs font-mono font-bold text-gray-400 uppercase flex items-center gap-2">
                      <Film className="w-4 h-4 text-indigo-400" /> Ejemplo en Video Animado por IA
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-indigo-500/30 bg-black">
                      <video
                        src={example.sampleVideoUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        className="w-full max-h-72 object-cover"
                      />
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* 7. INTERACTIVE CHECKLIST SECTION */}
      <div className="bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> LISTA DE VERIFICACIÓN INTERACTIVA (WORKFLOW DE LA A A LA Z)
            </h2>
            <p className="text-xs text-gray-400">
              Marca tus avances a medida que ejecutas tu proyecto. Tu progreso se guarda automáticamente en este dispositivo.
            </p>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-gray-400">Completado: </span>
            <span className="text-base font-black text-emerald-400">{completedCount} / {checklist.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#09090c] rounded-full h-2.5 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-4 rounded-2xl border transition select-none cursor-pointer flex items-center gap-3.5 ${
                item.done
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#09090c] border-white/5 hover:border-white/10 text-gray-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
                item.done ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-gray-600'
              }`}>
                {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-xs font-medium ${item.done ? 'line-through opacity-80' : ''}`}>
                <strong className="font-mono text-gray-500 mr-1.5">{idx + 1}.</strong> {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. LOS 5 ERRORES DE PRINCIPIANTE */}
      <div className="bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> LOS 5 ERRORES DE PRINCIPIANTE (Y CÓMO SOLUCIONARLOS)
          </h2>
          <p className="text-xs text-gray-400">
            Haz clic en cada error para desplegar la solución exacta explicada por el Profesor.
          </p>
        </div>

        <div className="space-y-3">
          {MISTAKES_LIST.map((m) => {
            const isExpanded = !!expandedMistakes[m.id];
            return (
              <div
                key={m.id}
                className="bg-[#09090c] border border-white/5 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleMistake(m.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
                      0{m.id}
                    </span>
                    <span className="text-xs font-bold text-gray-200">{m.title}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3 border-t border-white/5 mt-1 animate-fade-in text-xs">
                    <div className="bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl text-rose-300">
                      <strong className="block text-[10px] font-mono font-bold uppercase text-rose-400 mb-0.5">El Problema:</strong>
                      {m.problem}
                    </div>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl text-emerald-300">
                      <strong className="block text-[10px] font-mono font-bold uppercase text-emerald-400 mb-0.5">La Solución del Profesor:</strong>
                      {m.fix}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. ¿QUÉ SIGUE? Siguiente Nivel */}
      <div className="bg-[#111116] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" /> ¿QUÉ SIGUE? LLEVA TUS VIDEOS AL NIVEL PROFESIONAL
          </h2>
          <p className="text-xs text-gray-400">
            Ya dominaste los dos movimientos principales. Aquí están los siguientes pasos para dar el salto de calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEXT_STEPS.map((ns, idx) => (
            <div key={idx} className="bg-[#09090c] border border-white/5 p-5 rounded-2xl space-y-1.5 hover:border-indigo-500/30 transition">
              <span className="text-xs font-black text-indigo-400 uppercase font-mono">0{idx + 1} · {ns.title}</span>
              <p className="text-xs text-gray-400 leading-relaxed">{ns.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/30 p-6 rounded-2xl text-center space-y-3">
          <h3 className="text-base font-black text-white uppercase">Muéstrame lo que creaste</h3>
          <p className="text-xs text-gray-300 max-w-lg mx-auto leading-relaxed">
            Publica tu primer video live-action y etiqueta al estudio en TikTok e Instagram. ¡El Profesor Virtual revisa todas las publicaciones!
          </p>
          <div className="inline-block px-4 py-2 bg-white/10 rounded-xl text-sm font-black font-mono text-indigo-300 border border-white/10">
            {GUIDE_METADATA.author}
          </div>
        </div>
      </div>

    </div>
  );
}
