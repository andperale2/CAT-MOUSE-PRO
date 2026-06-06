/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, Signal, Battery, Compass, Map, Swords, Play, Sparkles, 
  ChevronUp, GripHorizontal, Radio, Locate, Gauge, RefreshCw, Zap
} from 'lucide-react';
import { OverlayTemplate, Profile, AutomationAction } from '../types';

interface AndroidSimulatorProps {
  overlays: OverlayTemplate[];
  selectedOverlayId: string | null;
  onOverlaySelect: (id: string) => void;
  onOverlayPositionChange: (id: string, x: number, y: number) => void;
  activeProfile: Profile | null;
  isRunningMacro: boolean;
  currentMacroStep: number;
  macroProgressX?: number; // visual pointer X
  macroProgressY?: number; // visual pointer Y
  vehicleSpeed: number; // mock speed
  vehicleRpm: number; // mock RPM
}

export default function AndroidSimulator({
  overlays,
  selectedOverlayId,
  onOverlaySelect,
  onOverlayPositionChange,
  activeProfile,
  isRunningMacro,
  currentMacroStep,
  macroProgressX,
  macroProgressY,
  vehicleSpeed,
  vehicleRpm,
}: AndroidSimulatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'app' | 'game' | 'car'>('game');
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [draggedOverlayId, setDraggedOverlayId] = useState<string | null>(null);

  // Sync simulator screens to match the profiles category or overlay type
  useEffect(() => {
    if (activeProfile) {
      if (activeProfile.category === 'game') setActiveTab('game');
      else if (activeProfile.category === 'vehicle') setActiveTab('car');
      else setActiveTab('app');
    } else {
      const activeOverlay = overlays.find(o => o.id === selectedOverlayId);
      if (activeOverlay) {
        if (activeOverlay.type === 'speedometer' || activeOverlay.type === 'hud_gauges') {
          setActiveTab('car');
        } else if (activeOverlay.name.toLowerCase().includes('valorant') || activeOverlay.type === 'crosshair') {
          setActiveTab('game');
        } else {
          setActiveTab('app');
        }
      }
    }
  }, [activeProfile, selectedOverlayId, overlays]);

  // Handle Dragging of overlays on the virtual screen container
  const handleMouseDown = (e: React.MouseEvent, overlayId: string) => {
    if (!containerRef.current) return;
    e.stopPropagation();
    e.preventDefault();
    setDraggedOverlayId(overlayId);
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    setDragStartPos({ x: clickX, y: clickY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedOverlayId || !containerRef.current || !dragStartPos) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const mouseY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    
    // Convert to percentage
    const xPct = Math.round((mouseX / rect.width) * 100);
    const yPct = Math.round((mouseY / rect.height) * 100);
    
    onOverlayPositionChange(draggedOverlayId, xPct, yPct);
  };

  const handleMouseUp = () => {
    if (draggedOverlayId) {
      setDraggedOverlayId(null);
      setDragStartPos(null);
    }
  };

  useEffect(() => {
    if (draggedOverlayId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedOverlayId, dragStartPos]);

  // Render individual custom cursor styles
  const renderCursorSkin = (skin: string, color: string, scale: number) => {
    const s = scale || 1.0;
    switch (skin) {
      case 'neon_spark':
        return (
          <div className="relative pointer-events-none" style={{ transform: `scale(${s})` }}>
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full filter blur-sm opacity-60" style={{ backgroundColor: color }} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4.5 3L18.5 12L12.5 13.5L18.5 19.5L15.5 21.5L9.5 15.5L4.5 21V3Z" fill={color} stroke="white" strokeWidth="1.5" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }}></span>
            </span>
          </div>
        );
      case 'cat_paw':
        return (
          <div className="relative pointer-events-none flex flex-col items-center justify-center" style={{ transform: `scale(${s})` }}>
            <div className="absolute top-0 w-8 h-8 rounded-full filter blur-md opacity-40" style={{ backgroundColor: color }} />
            {/* Paw Outline */}
            <div className="bg-zinc-900 border-2 rounded-2xl p-1 shadow-lg border-white" style={{ borderColor: color }}>
              <div className="flex gap-[2px] justify-center mb-[2px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-2 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-2 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              </div>
              <div className="w-5 h-4 rounded-xl mx-auto" style={{ backgroundColor: color }} />
            </div>
          </div>
        );
      case 'stealth_pointer':
        return (
          <div className="relative pointer-events-none" style={{ transform: `scale(${s})` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3V21L9 15L15 21L19 19L13 13L21 11L3 3Z" fill="white" stroke={color} strokeWidth="2" />
            </svg>
          </div>
        );
      default: // classic
        return (
          <div className="relative pointer-events-none" style={{ transform: `scale(${s})` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L14.5 14.5L9.5 15.5L14 20L11.5 21.5L7 17L4 20V4Z" fill={color} stroke="black" strokeWidth="1" />
            </svg>
          </div>
        );
    }
  };

  // Render individual custom crosshair styles
  const renderCrosshair = (style: string, color: string, scale: number, size: number) => {
    const s = (size || 32) * scale;
    switch (style) {
      case 'bracket':
        return (
          <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
            <div className="absolute inset-0 border-2 rounded-lg" style={{ borderColor: color, transform: 'scale(0.85)' }} />
            <div className="absolute w-[4px] h-[4px] rounded-full" style={{ backgroundColor: color }} />
            <div className="absolute left-[30%] right-[30%] top-[30%] bottom-[30%] flex items-center justify-center">
              <div className="w-full h-[1.5px] opacity-40" style={{ backgroundColor: color }} />
              <div className="h-full w-[1.5px] absolute opacity-40" style={{ backgroundColor: color }} />
            </div>
          </div>
        );
      case 'circle_dot':
        return (
          <div className="relative flex items-center justify-center p-2" style={{ width: s, height: s }}>
            <div className="absolute inset-1 border-[1.5px] border-dashed rounded-full animate-spin [animation-duration:8s]" style={{ borderColor: color }} />
            <div className="absolute w-[6px] h-[6px] rounded-full" style={{ backgroundColor: color }} />
          </div>
        );
      case 'reflex':
        return (
          <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
            <div className="absolute w-[1px] h-full" style={{ backgroundColor: color, opacity: 0.7 }} />
            <div className="absolute h-[1px] w-full" style={{ backgroundColor: color, opacity: 0.7 }} />
            <div className="absolute border rounded-full" style={{ borderColor: color, width: s * 0.4, height: s * 0.4 }} />
            <div className="absolute w-[3px] h-[3px] rounded-full" style={{ backgroundColor: color }} />
          </div>
        );
      default: // dot
        return (
          <div className="rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: color, width: s * 0.4, height: s * 0.4 }}>
            <div className="w-[4px] h-[4px] rounded-full bg-white" />
          </div>
        );
    }
  };

  // Speedometer helper calculations for dashboard graphics
  const maxMetersValue = 180;
  const strokeDash = 230;
  const speedPercentage = Math.min(1, vehicleSpeed / 160);
  const currentDashOffset = strokeDash - speedPercentage * strokeDash;

  return (
    <div className="flex flex-col items-center">
      {/* Device Frame Wrapper */}
      <div className="relative bg-zinc-950 p-4.5 pb-6 rounded-[44px] shadow-2xl border-4 border-zinc-900 ring-1 ring-zinc-800 w-[310px] sm:w-[325px]">
        {/* Notch Speaker and Camera */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-30 flex items-center justify-end px-3 gap-1.5 ring-1 ring-zinc-800/50">
          <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full" />
          <div className="w-2.5 h-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Outer Phone Display Glass */}
        <div 
          id="phone_display"
          ref={containerRef}
          className="relative bg-zinc-900 rounded-[34px] overflow-hidden aspect-[9/19.5] w-full border border-zinc-800 flex flex-col select-none"
        >
          {/* Android Status Bar */}
          <div className="bg-transparent h-9 px-6 pt-2 flex items-center justify-between text-[11px] font-medium text-zinc-400 z-20">
            <span className="font-semibold text-white tracking-tight">08:42</span>
            <div className="flex items-center gap-1.5">
              {/* Shizuku Active Indicator */}
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full text-[9px] text-emerald-400 font-bold scale-90">
                <Zap className="w-2.5 h-2.5 fill-emerald-500" /> SHIZUKU
              </div>
              <Signal className="w-3 h-3 text-zinc-400" />
              <Wifi className="w-3 h-3 text-zinc-400" />
              <Battery className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          {/* BACKGROUND BACKGROUND CHANGER TAB BAR */}
          <div className="absolute top-10 left-0 right-0 p-1 mx-3 bg-zinc-950/60 backdrop-blur-md rounded-xl flex border border-zinc-800/50 z-20">
            {(['game', 'app', 'car'] as const).map((tab) => (
              <button
                key={tab}
                id={`sim_tab_${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                  activeTab === tab 
                    ? 'bg-zinc-800 text-indigo-400 shadow-sm border border-zinc-700/50' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'game' ? 'Shooter' : tab === 'app' ? 'Feed App' : 'HUD Demo'}
              </button>
            ))}
          </div>

          {/* VIRTUAL SCREEN CANVAS */}
          <div className="relative flex-1 bg-zinc-950 flex flex-col justify-end text-white overflow-hidden">
            
            {/* SCREEN 1: GAME BACKGROUND */}
            {activeTab === 'game' && (
              <div className="absolute inset-0 bg-neutral-900 bg-cover bg-center flex flex-col justify-between" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=600&auto=format&fit=crop)' }}>
                <div className="pt-24 px-4 flex justify-between text-zinc-300">
                  <div className="bg-black/60 backdrop-blur-md border border-neutral-700/40 px-2 py-1 rounded text-[10px] font-mono leading-none">
                    <span className="text-indigo-400">LVL</span> 140
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-neutral-700/40 px-2 py-1 rounded text-[10px] font-mono leading-none">
                    <span className="text-rose-500">FPS</span> 120
                  </div>
                </div>

                {/* Simulated Game Control Areas */}
                <div className="p-4 flex justify-between items-end mb-12">
                  <div className="w-14 h-14 bg-white/10 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                    <Compass className="w-6 h-6 text-white/50" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-10 h-10 bg-red-600/30 rounded-full border border-red-500/40 flex items-center justify-center text-xs font-black text-rose-300 scale-90 shadow-md">
                      FIRE
                    </div>
                    <div className="w-11 h-11 bg-white/15 rounded-full border border-white/25 flex items-center justify-center text-[10px] font-semibold text-zinc-200 shadow-md">
                      CROUCH
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: FEED APP BACKGROUND */}
            {activeTab === 'app' && (
              <div className="absolute inset-0 bg-zinc-950 flex flex-col">
                <div className="pt-24 px-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-tight text-white/80">Social Feed</span>
                  <Radio className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
                </div>
                {/* Scrolling Mock Feed */}
                <div className="flex-1 overflow-hidden p-3 space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-cyan-600" />
                      <div className="h-2 w-16 bg-zinc-700 rounded-sm" />
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-sm" />
                    <div className="h-1.5 w-[80%] bg-zinc-800 rounded-sm" />
                    <div className="h-24 w-full bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500">
                      Productivity Photo Feed
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl space-y-2 opacity-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-amber-500" />
                      <div className="h-2 w-14 bg-zinc-700 rounded-sm" />
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: CAR SCREEN SIMULATION */}
            {activeTab === 'car' && (
              <div className="absolute inset-0 bg-slate-950 flex flex-col">
                {/* Night-driving Horizon Grid Background */}
                <div className="absolute inset-x-0 top-20 h-44 bg-gradient-to-t from-slate-900/60 to-transparent flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)', backgroundSize: '16px 16px', transform: 'perspective(50px) rotateX(60deg) translateY(-20px)' }} />
                  <div className="h-1.5 w-full bg-sky-500/20 blur-sm absolute bottom-0" />
                </div>

                <div className="pt-24 px-4 z-10 flex flex-col items-center flex-1 justify-between pb-12">
                  <div className="text-center w-full bg-zinc-900/80 backdrop-blur-md border border-slate-800/60 p-2.5 rounded-2xl">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-0.5">
                      <Map className="w-3.5 h-3.5 text-sky-400" /> Active GPS Target
                    </div>
                    <div className="text-xs font-bold truncate text-white">F1 Circuit Road, Ste. 200</div>
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-6">
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">VEHICLE SPEED</span>
                    <span className="text-3xl font-black font-mono tracking-tighter text-sky-400">{vehicleSpeed} km/h</span>
                    <span className="text-[9px] text-zinc-500 font-bold">{vehicleRpm} RPM • GEAR 3</span>
                  </div>

                  <div className="flex gap-2 w-full max-w-[180px] justify-center scale-90">
                    <div className="bg-zinc-900/90 border border-slate-800 rounded-xl px-2 py-1 text-center font-mono text-[9px] text-zinc-400 flex-1">
                      <div className="text-zinc-500">BOOST</div>
                      <div className="text-sky-400 font-bold">12.5 psi</div>
                    </div>
                    <div className="bg-zinc-900/90 border border-slate-800 rounded-xl px-2 py-1 text-center font-mono text-[9px] text-zinc-400 flex-1">
                      <div className="text-zinc-500">OBD</div>
                      <div className="text-emerald-400 font-bold">ACTIVE</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE ACTION SEQUENCE RIPPLES */}
            <AnimatePresence>
              {isRunningMacro && activeProfile?.actions.map((act, index) => {
                if (index === currentMacroStep && act.x !== undefined && act.y !== undefined) {
                  return (
                    <div 
                      key={`rip-${act.id}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                      style={{ left: `${act.x}%`, top: `${act.y}%` }}
                    >
                      {/* Pulse Circle */}
                      <motion.div 
                        initial={{ scale: 0.1, opacity: 1 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 rounded-full border-2 border-indigo-500 bg-indigo-500/20"
                      />
                      {/* Hotspot Target Point */}
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md border border-white" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow whitespace-nowrap uppercase tracking-wider">
                        {act.type} #{index + 1}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </AnimatePresence>

            {/* FLOATING ACTION SEQUENCE HOTSPOTS (When not running, to assist design) */}
            {!isRunningMacro && activeProfile?.actions.map((act, index) => {
              if (act.x !== undefined && act.y !== undefined) {
                return (
                  <div
                    key={`pin-${act.id}`}
                    id={`hotspot_${act.id}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                    style={{ left: `${act.x}%`, top: `${act.y}%` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border-2 border-indigo-500 shadow-md flex items-center justify-center text-[9px] font-black text-indigo-400 active:scale-95 cursor-help">
                      {index + 1}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[8px] px-1.5 py-0.5 rounded shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none uppercase font-semibold">
                      {act.label} ({act.x}%, {act.y}%)
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {/* ACTIVE OVERLAY OVER SYSTEM WINDOW RENDERS */}
            {overlays.map((ov) => {
              // Only render overlays matching visual configurations
              const isSelected = selectedOverlayId === ov.id;
              
              return (
                <div
                  key={`ov-sim-${ov.id}`}
                  style={{
                    position: 'absolute',
                    left: `${ov.x}%`,
                    top: `${ov.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: ov.opacity,
                    zIndex: isSelected ? 35 : 30,
                  }}
                  className={`cursor-grab active:cursor-grabbing select-none group`}
                  onMouseDown={(e) => handleMouseDown(e, ov.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOverlaySelect(ov.id);
                  }}
                >
                  {/* Hover visual bounding frame */}
                  {isSelected && (
                    <div className="absolute -inset-4 border border-indigo-500/50 rounded-lg pointer-events-none">
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-indigo-500" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-indigo-500" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-indigo-500" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-indigo-500" />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-650 text-white font-mono font-bold text-[7px] tracking-widest px-1 py-0.5 rounded whitespace-nowrap uppercase">
                        DRAG TO MOVE
                      </div>
                    </div>
                  )}

                  {/* OVERLAY: CURSOR SKIN */}
                  {ov.type === 'cursor' && renderCursorSkin(ov.settings.cursorSkin || 'classic', ov.color, ov.scale)}

                  {/* OVERLAY: CROSSHAIR COMPONENT */}
                  {ov.type === 'crosshair' && renderCrosshair(ov.settings.crosshairStyle || 'dot', ov.color, ov.scale, ov.settings.crosshairSize || 32)}

                  {/* OVERLAY: HUD GAUGES / SPEEDOMETER ENGINE */}
                  {ov.type === 'speedometer' && (
                    <div 
                      className="bg-zinc-950/90 border border-slate-800 flex flex-col items-center justify-center p-2 rounded-2xl shadow-xl font-mono text-center relative overflow-hidden"
                      style={{ 
                        transform: `scale(${ov.scale})`,
                        width: '85px',
                        height: '85px',
                        borderColor: ov.color 
                      }}
                    >
                      {/* Gauge circular shape */}
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="36" className="stroke-slate-900 fill-none" strokeWidth="4.5" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="36" 
                          className="fill-none transition-all duration-300" 
                          strokeWidth="4.5" 
                          stroke={ov.color} 
                          strokeDasharray={strokeDash}
                          strokeDashoffset={currentDashOffset}
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col justify-center items-center">
                        <span className="text-[14px] font-black tracking-tight" style={{ color: ov.color }}>{vehicleSpeed}</span>
                        <span className="text-[7px] text-zinc-500 font-bold uppercase">{ov.settings.speedometerUnit === 'mph' ? 'MPH' : 'KMH'}</span>
                      </div>
                    </div>
                  )}

                  {/* OVERLAY: MACRO PAD BUTTONS */}
                  {ov.type === 'macro_pad' && (
                    <div 
                      className="bg-zinc-950/80 backdrop-blur-md p-1.5 rounded-xl border flex flex-col gap-1 shadow-lg pointer-events-none"
                      style={{ transform: `scale(${ov.scale})`, borderColor: ov.color }}
                    >
                      <div className="text-[6px] font-bold text-zinc-500 uppercase tracking-widest text-center">MACROS</div>
                      <div className="grid grid-cols-2 gap-1">
                        {Array.from({ length: ov.settings.macroPadButtonsCount || 4 }).map((_, idx) => (
                          <div 
                            key={`btn-${idx}`}
                            className="w-5.5 h-5.5 rounded-md flex items-center justify-center text-[9px] font-bold border"
                            style={{ 
                              color: ov.color, 
                              borderColor: `${ov.color}25`,
                              backgroundColor: `${ov.color}05`
                            }}
                          >
                            M{idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* SIMULATED MACRO RUNNING POINTER ACTION */}
            {isRunningMacro && macroProgressX !== undefined && macroProgressY !== undefined && (
              <motion.div
                className="absolute z-50 pointer-events-none w-5 h-5 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                animate={{ left: `${macroProgressX}%`, top: `${macroProgressY}%` }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.15 }}
              >
                {/* Finger touch circle */}
                <div className="absolute w-6 h-6 border-2 border-white bg-white/40 rounded-full animate-ping [animation-duration:1s]" />
                <div className="absolute w-3.5 h-3.5 bg-white border border-indigo-500 rounded-full shadow" />
              </motion.div>
            )}

            {/* Virtual Android Navigation Bar */}
            <div className="h-11 bg-zinc-950/80 backdrop-blur-md w-full flex items-center justify-around px-8 border-t border-zinc-900 z-10">
              <ChevronUp className="w-4 h-4 text-zinc-500 opacity-60" />
              <div className="w-3.5 h-3.5 border-2 border-zinc-500/60 rounded-sm" />
              <div className="w-1.5 h-3 bg-zinc-500/60 rounded-full" />
            </div>

          </div>
        </div>
      </div>

      {/* Simulator Quick Legend / ADB Link status */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-zinc-500 font-mono flex items-center justify-center gap-1">
          <Locate className="w-3.5 h-3.5 text-emerald-400" />
          Virtual phone simulated on local loopback.
        </p>
      </div>
    </div>
  );
}
