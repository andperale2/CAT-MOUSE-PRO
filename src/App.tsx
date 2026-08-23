/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, Smartphone, Terminal, Cpu, Play, HelpCircle, 
  Layers, Car, Heart, SlidersHorizontal, RefreshCw, Zap, Check, Plus, Trash2, Globe,
  ChevronDown, ChevronUp, Shield
} from 'lucide-react';
import { 
  Profile, OverlayTemplate, InputDevice, LogMessage, PresetStoreItem 
} from './types';
import { 
  INITIAL_PROFILES, INITIAL_OVERLAYS, INITIAL_DEVICES 
} from './constants';

import AndroidSimulator from './components/AndroidSimulator';
import ProfilesEditor from './components/ProfilesEditor';
import ShizukuConsole from './components/ShizukuConsole';
import VehicleDashboard from './components/VehicleDashboard';
import DevicesPanel from './components/DevicesPanel';
import CloudTutorialHub from './components/CloudTutorialHub';

export default function App() {
  // Navigation active modules
  type TabType = 'overlays' | 'profiles' | 'shizuku' | 'vehicles' | 'devices' | 'presets';
  const [activeTab, setActiveTab] = useState<TabType>('overlays');
  const [isSubsystemsExpanded, setIsSubsystemsExpanded] = useState<boolean>(true);

  // Core global State Management
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>('p-1');
  const [overlays, setOverlays] = useState<OverlayTemplate[]>(INITIAL_OVERLAYS);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>('ov-1');
  const [devices, setDevices] = useState<InputDevice[]>(INITIAL_DEVICES);
  
  // Simulated telemetry speeds and rpm
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(85);
  const [vehicleRpm, setVehicleRpm] = useState<number>(2400);
  const [selectedGaugeTheme, setSelectedGaugeTheme] = useState<'cyber' | 'sport' | 'classic_car' | 'minimalist'>('sport');
  const [obdConnected, setObdConnected] = useState<boolean>(true);

  // Micro macro playing simulator sequencer state
  const [isRunningMacro, setIsRunningMacro] = useState<boolean>(false);
  const [currentMacroStep, setCurrentMacroStep] = useState<number>(-1);
  const [pointerProgressX, setPointerProgressX] = useState<number>(50);
  const [pointerProgressY, setPointerProgressY] = useState<number>(50);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Shell & Binder stream log state
  const [logs, setLogs] = useState<LogMessage[]>([]);

  // Function to push logs to our simulated terminal logger
  const handleAddLog = (
    source: LogMessage['source'], 
    level: LogMessage['level'], 
    message: string
  ) => {
    const newLog: LogMessage = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
      source,
      level,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Seed initial telemetry log messages
  useEffect(() => {
    handleAddLog('Shizuku', 'success', 'Shizuku binder interface service fully bound (API code 34)');
    handleAddLog('Binder', 'info', 'Awaiting IPC transactions from com.catmouse.pro user application.');
    handleAddLog('Overlay', 'info', 'Screen Overlay service bound successfully. Window controller active.');
    handleAddLog('OBD', 'success', 'Vehicle OBD adapter registered speed broadcast event channel.');
  }, []);

  // Sync Speedometer theme change to current color
  useEffect(() => {
    const themeColors = {
      cyber: '#38bdf8', // Light blue
      sport: '#f43f5e', // Rose Red
      classic_car: '#eab308', // Amber Gold
      minimalist: '#10b981', // Emerald Green
    };
    
    // Update speedometer overlay color to match theme
    setOverlays((prev) => 
      prev.map((ov) => {
        if (ov.type === 'speedometer') {
          return {
            ...ov,
            color: themeColors[selectedGaugeTheme],
            settings: {
              ...ov.settings,
              hudTheme: selectedGaugeTheme
            }
          };
        }
        return ov;
      })
    );
  }, [selectedGaugeTheme]);

  // Macro playback sequencer runner core loop
  const handleRunMacro = () => {
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (!profile || profile.actions.length === 0) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunningMacro(true);
    setCurrentMacroStep(0);
    handleAddLog('Shizuku', 'info', `BOOTING PROFILE: Starting sequence [${profile.name}] with ${profile.actions.length} coordinates...`);

    const runStep = (idx: number) => {
      if (idx >= profile.actions.length) {
        setIsRunningMacro(false);
        setCurrentMacroStep(-1);
        handleAddLog('Shizuku', 'success', 'PROFILE COMPLETE: All ipc macro inputs successfully simulated.');
        return;
      }

      const action = profile.actions[idx];
      setCurrentMacroStep(idx);

      // Log step transition representation
      let msg = '';
      if (action.type === 'tap') {
        msg = `INJECT INPUT TouchEvent TAP: coords(${action.x}%, ${action.y}%) label: "${action.label}"`;
        // Move finger pointer
        if (action.x !== undefined && action.y !== undefined) {
          setPointerProgressX(action.x);
          setPointerProgressY(action.y);
        }
      } else if (action.type === 'swipe') {
        msg = `INJECT INPUT TouchEvent SWIPE: path(${action.x}%, ${action.y}% -> ${action.xEnd}%, ${action.yEnd}%)`;
        if (action.x !== undefined && action.y !== undefined) {
          setPointerProgressX(action.x);
          setPointerProgressY(action.y);
        }
      } else if (action.type === 'key') {
        msg = `INJECT KEYCODE Event: keycode(${action.keyCode})`;
      } else if (action.type === 'launch') {
        msg = `IPC AM START: packageName(${action.packageName})`;
      } else {
        msg = `WAITING DELAY: duration(${action.delayMs}ms)`;
      }

      handleAddLog('Binder', 'success', `[Step ${idx + 1}/${profile.actions.length}] ${msg}`);

      timeoutRef.current = setTimeout(() => {
        runStep(idx + 1);
      }, action.delayMs || 300);
    };

    runStep(0);
  };

  const handleStopMacro = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRunningMacro(false);
    setCurrentMacroStep(-1);
    handleAddLog('Shizuku', 'warn', 'MACRO ABORTED: Sequencer manually halted.');
  };

  // Profile updating
  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfiles((prev) => 
      prev.map((p) => p.id === updatedProfile.id ? updatedProfile : p)
    );
  };

  const handleProfileDelete = (id: string) => {
    if (profiles.length <= 1) {
      handleAddLog('Shizuku', 'warn', 'Profile delete blocked: Minimum of one binder profile configuration required.');
      return;
    }
    const currentToDelete = profiles.find(p => p.id === id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (selectedProfileId === id) {
      setSelectedProfileId(profiles.find(p => p.id !== id)?.id || null);
    }
    handleAddLog('Shizuku', 'info', `Profile Deleted: ${currentToDelete?.name || id}`);
  };

  const handleProfileCreate = (category: 'game' | 'utility' | 'vehicle') => {
    const icons = { game: 'Swords', utility: 'ScrollText', vehicle: 'Car' };
    const names = { game: 'Game Trigger Map', utility: 'Utility Clicker Loop', vehicle: 'Vehicle OBD Hook' };
    
    const newProfile: Profile = {
      id: `p-${Date.now()}`,
      name: `${names[category]} #${profiles.length + 1}`,
      description: 'Custom micro macro layout binded over rikka shizuku inputs injection daemon.',
      icon: icons[category],
      category,
      actions: [],
      isActive: false
    };

    setProfiles((prev) => [...prev, newProfile]);
    setSelectedProfileId(newProfile.id);
    handleAddLog('Shizuku', 'success', `New Profile registered: ${newProfile.name}`);
  };

  // Overlay operations
  const handleOverlayPositionChange = (id: string, x: number, y: number) => {
    setOverlays((prev) => 
      prev.map((ov) => ov.id === id ? { ...ov, x, y } : ov)
    );
  };

  const handleCreateOverlay = (type: OverlayTemplate['type']) => {
    const defaultData = {
      cursor: { name: 'User Spark Cursor', color: '#38bdf8', skin: 'classic' },
      crosshair: { name: 'Compact Custom Crosshair', color: '#4ade80', style: 'dot' },
      speedometer: { name: 'OBD Digital Tachometer', color: '#f43f5e', theme: 'sport' },
      macro_pad: { name: 'Macro Touch Pad Overlay', color: '#eab308' },
      hud_gauges: { name: 'Dual Speed Circular HUD', color: '#a855f7' }
    };

    const d = defaultData[type] || defaultData['cursor'];

    const newOverlay: OverlayTemplate = {
      id: `ov-${Date.now()}`,
      name: `${d.name} #${overlays.length + 1}`,
      type,
      scale: 1.0,
      opacity: 0.9,
      color: d.color,
      x: 50,
      y: 50,
      settings: {
        cursorSkin: (d as any).skin || 'classic',
        crosshairStyle: (d as any).style || 'circle_dot',
        crosshairSize: 32,
        speedometerMax: 180,
        speedometerUnit: 'kmh',
        hudTheme: (d as any).theme || 'sport',
        macroPadButtonsCount: 4
      }
    };

    setOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
    handleAddLog('Overlay', 'success', `Overlay Window Registered: ${newOverlay.name}`);
  };

  const handleDeleteOverlay = (id: string) => {
    if (overlays.length <= 1) {
      handleAddLog('Overlay', 'warn', 'Overlay delete blocked: Minimum of one screen overlay layer required.');
      return;
    }
    const currentToDelete = overlays.find(o => o.id === id);
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    if (selectedOverlayId === id) {
      setSelectedOverlayId(overlays.find(o => o.id !== id)?.id || null);
    }
    handleAddLog('Overlay', 'info', `Overlay Layer Terminated: ${currentToDelete?.name || id}`);
  };

  // Device operations 
  const handleDeviceUpdate = (device: InputDevice) => {
    setDevices((prev) => 
      prev.map((d) => d.id === device.id ? device : d)
    );
  };

  // Community preset integration handlers
  const handleInstallPresetProfile = (preset: PresetStoreItem) => {
    const newProfile: Profile = {
      id: `p-preset-${Date.now()}`,
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
      category: preset.category,
      actions: preset.data.actions || [],
      isActive: false
    };

    setProfiles((prev) => [...prev, newProfile]);
    setSelectedProfileId(newProfile.id);
    setActiveTab('profiles');
  };

  const handleInstallPresetOverlay = (overlayData: any) => {
    const newOverlay: OverlayTemplate = {
      id: overlayData.id,
      name: overlayData.name,
      type: overlayData.type,
      scale: overlayData.scale,
      opacity: overlayData.opacity,
      color: overlayData.color,
      x: overlayData.x,
      y: overlayData.y,
      settings: overlayData.settings
    };

    setOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlayId(newOverlay.id);
    setActiveTab('overlays');
  };

  // Fetching the currently selected overlay for inline sliders
  const currentOverlay = overlays.find((ov) => ov.id === selectedOverlayId) || null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="border-b border-white/10 bg-[#0a0a0b] px-6 py-4.5 shrink-0 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          {/* Logo brand */}
          <div className="p-2.5 rounded-2xl bg-indigo-650 text-white shadow-lg border border-indigo-500/50">
            <Smartphone className="w-5.5 h-5.5 stroke-[2.5]" />
          </div>
          <div className="space-y-[1px]">
            <h1 className="text-sm font-bold tracking-tight font-sans uppercase text-white flex items-center gap-2">
              CAT MOUSE PRO <span className="text-[10px] bg-white/5 text-indigo-400 border border-white/10 font-bold px-2 py-0.5 rounded leading-none">STUDIO</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">Companion Setup & ADB Overlay Customizer sandbox</p>
          </div>
        </div>

        {/* Global Connection status strip */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <a
            href="/De_Anime_a_Live_Action_Curso_IA.pdf"
            download="De_Anime_a_Live_Action_Curso_IA.pdf"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold px-3.5 py-1.5 rounded-xl transition shadow-lg shadow-indigo-600/20 text-xs border border-indigo-400/30"
          >
            <span>📄</span>
            <span>Descargar PDF del Curso</span>
          </a>
          <div className="flex items-center gap-1.5 bg-[#111114] border border-white/5 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-gray-400 font-semibold uppercase">ADB HOST: 127.0.0.1:5555</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#111114] border border-white/5 px-3 py-1.5 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
            <span className="text-gray-400 font-semibold uppercase">SERVICE: SHIZUKU BINDER</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT MULTI-MODULE WORKSPACE */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative bg-[#09090b]">
        
        {/* LEFT COLUMN: Controls rail and active tab modules workspace */}
        <div className="lg:col-span-8 flex flex-col overflow-y-auto p-5 md:p-6 pb-20 space-y-6">
          
          {/* MULTI MODULE SELECTOR TAB DECK */}
          <div className="bg-[#111114] border border-white/5 p-1 rounded-2xl grid grid-cols-3 md:grid-cols-6 gap-1 select-none shadow-xl">
            {(['overlays', 'profiles', 'shizuku', 'vehicles', 'devices', 'presets'] as const).map((tab) => {
              const labels = {
                overlays: 'Overlays',
                profiles: 'Playbook',
                shizuku: 'Shizuku',
                vehicles: 'Vehicle',
                devices: 'Input Binds',
                presets: 'Presets Store'
              };
              const icons = {
                overlays: <Layers className="w-4 h-4" />,
                profiles: <Play className="w-4 h-4" />,
                shizuku: <Terminal className="w-4 h-4" />,
                vehicles: <Car className="w-4 h-4" />,
                devices: <Sliders className="w-4 h-4" />,
                presets: <Globe className="w-4 h-4" />
              };
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  id={`tab_nav_${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2.5 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 ${
                    active 
                      ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-650/15 border border-indigo-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {icons[tab]}
                  <span className="hidden leading-none md:inline">{labels[tab]}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TAB PANEL VIEWS */}
          <div className="relative flex-1">
            
            {/* VIEW 1: OVERLAY CUSTOMIZER LAYER */}
            {activeTab === 'overlays' && (
              <div id="panel_overlays" className="space-y-6">
                <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-2xl p-4.5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-black uppercase tracking-wider text-zinc-300">Active overlay windows layout</h2>
                      <p className="text-xs text-zinc-500 leading-snug">
                        Draw floating transparent crosshair reticles, mouse speed skins, or speed dashboards over running apps.
                      </p>
                    </div>
                    {/* Add templates triggers */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCreateOverlay('crosshair')}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 hover:text-white border border-zinc-700 text-[10.5px] font-bold rounded-lg transition"
                      >
                        + Crosshair
                      </button>
                      <button
                        onClick={() => handleCreateOverlay('cursor')}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 hover:text-white border border-zinc-700 text-[10.5px] font-bold rounded-lg transition"
                      >
                        + Cursor Skin
                      </button>
                    </div>
                  </div>

                  {/* Template grid select cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    {overlays.map((ov) => {
                      const active = ov.id === selectedOverlayId;
                      return (
                        <div
                          key={ov.id}
                          id={`overlay_card_${ov.id}`}
                          onClick={() => {
                            setSelectedOverlayId(ov.id);
                            handleAddLog('Overlay', 'info', `Focus screen overlay target changed: [${ov.name}]`);
                          }}
                          className={`p-3 rounded-xl border transition flex flex-col justify-between gap-3 h-24 select-none cursor-pointer ${
                            active 
                              ? 'bg-indigo-500/5 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                              : 'bg-[#09090b]/40 border-white/5 hover:bg-white/5'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className={`text-[11px] font-bold block truncate leading-none ${active ? 'text-indigo-400' : 'text-gray-355'}`}>
                              {ov.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-zinc-800" style={{ backgroundColor: ov.color }} />
                              {ov.type} • ({ov.x}%, {ov.y}%)
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-500 font-semibold">Scale: {ov.scale.toFixed(1)}x</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOverlay(ov.id);
                              }}
                              className="p-1 text-gray-500 hover:text-rose-400 hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition"
                              id={`btn_delete_overlay_${ov.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Focus Tweak panel details */}
                {currentOverlay ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    {/* Size and Opacity tweak sliders */}
                    <div className="md:col-span-7 bg-[#111114] border border-white/5 rounded-2xl p-5.5 space-y-4 shadow-xl">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Window Dimension Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-[#0a0a0b] border border-white/5 p-4 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-gray-400 font-bold uppercase">Scaling Multiplier</span>
                            <span className="text-indigo-400 font-bold">{currentOverlay.scale}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={currentOverlay.scale}
                            onChange={(e) => {
                              const nextVal = parseFloat(e.target.value) || 1.0;
                              setOverlays((oList) => oList.map(o => o.id === currentOverlay.id ? { ...o, scale: nextVal } : o));
                            }}
                            className="w-full accent-indigo-500 h-1 bg-zinc-800"
                          />
                        </div>

                        <div className="bg-[#0a0a0b] border border-white/5 p-4 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-gray-400 font-bold uppercase">Transparency alpha opacity</span>
                            <span className="text-indigo-400 font-bold">{Math.round(currentOverlay.opacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={currentOverlay.opacity}
                            onChange={(e) => {
                              const nextVal = parseFloat(e.target.value) || 1.0;
                              setOverlays((oList) => oList.map(o => o.id === currentOverlay.id ? { ...o, opacity: nextVal } : o));
                            }}
                            className="w-full accent-indigo-500 h-1 bg-zinc-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skin Specific selections */}
                    <div className="md:col-span-5 bg-[#111114] border border-white/5 rounded-2xl p-5.5 space-y-4.5 flex flex-col justify-between shadow-xl">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">Visual Assets skins</h3>
                        
                        {/* Selector based on overlay type */}
                        {currentOverlay.type === 'cursor' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Select Pointer Asset Style</label>
                            <select
                              value={currentOverlay.settings.cursorSkin || 'classic'}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setOverlays((oList) => oList.map(o => o.id === currentOverlay.id ? { ...o, settings: { ...o.settings, cursorSkin: val } } : o));
                                handleAddLog('Overlay', 'success', `Binder pointer asset switched style to "${val}"`);
                              }}
                              className="bg-[#0a0a0b] border border-white/10 text-gray-300 rounded-xl p-2.5 text-xs w-full outline-none focus:border-indigo-500"
                            >
                              <option value="classic">Standard Stealth Gray</option>
                              <option value="neon_spark">Neon Spark pointer</option>
                              <option value="cat_paw">Pixel Cat Paw Style</option>
                              <option value="stealth_pointer">Aerodynamic Stealth Arrow</option>
                            </select>
                          </div>
                        )}

                        {currentOverlay.type === 'crosshair' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider font-semibold">Select Reticle Grid Style</label>
                            <select
                              value={currentOverlay.settings.crosshairStyle || 'dot'}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setOverlays((oList) => oList.map(o => o.id === currentOverlay.id ? { ...o, settings: { ...o.settings, crosshairStyle: val } } : o));
                                handleAddLog('Overlay', 'success', `Fitted crosshair element switched style to "${val}"`);
                              }}
                              className="bg-[#0a0a0b] border border-white/10 text-gray-300 rounded-xl p-2.5 text-xs w-full outline-none focus:border-indigo-500"
                            >
                              <option value="dot">Micro Dot Target</option>
                              <option value="circle_dot">Targeting Circle Dot</option>
                              <option value="reflex">Concentric reflex sight</option>
                              <option value="bracket">Valorant Bracket Square</option>
                            </select>
                          </div>
                        )}

                        {currentOverlay.type === 'speedometer' && (
                          <div className="space-y-2 bg-[#0a0a0b] p-3.5 rounded-xl border border-white/5">
                            <div className="text-[10px] uppercase font-mono text-gray-400 font-bold mb-1">Theme calibrator shortcut</div>
                            <p className="text-zinc-400 text-xs leading-normal">
                              To configure different speed dials RPM shapes or circular dashboard mounts, select the **HUD Demo** background or navigate to the **Vehicle** tab.
                            </p>
                          </div>
                        )}

                        {/* Colors pick */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Accent Overlay Color</label>
                          <div className="flex gap-2">
                            {['#38bdf8', '#4ade80', '#f43f5e', '#eab308', '#a855f7'].map((hex) => (
                              <button
                                key={hex}
                                onClick={() => {
                                  setOverlays((oList) => oList.map(o => o.id === currentOverlay.id ? { ...o, color: hex } : o));
                                }}
                                className={`w-7 h-7 rounded-full border-2 transition ${currentOverlay.color === hex ? 'border-white scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* VIEW 2: PROFILES MACRO SEQUENCER */}
            {activeTab === 'profiles' && (
              <ProfilesEditor
                profiles={profiles}
                selectedProfileId={selectedProfileId}
                onProfileSelect={setSelectedProfileId}
                onProfileUpdate={handleProfileUpdate}
                onProfileDelete={handleProfileDelete}
                onProfileCreate={handleProfileCreate}
                onRunMacro={handleRunMacro}
                onStopMacro={handleStopMacro}
                isRunningMacro={isRunningMacro}
                currentMacroStep={currentMacroStep}
              />
            )}

            {/* VIEW 3: SHIZUKU BINDER CONSOLE */}
            {activeTab === 'shizuku' && (
              <ShizukuConsole
                logs={logs}
                onClearLogs={() => setLogs([])}
                onAddLog={handleAddLog}
              />
            )}

            {/* VIEW 4: VEHICLE TELEMETRY CONSOLE */}
            {activeTab === 'vehicles' && (
              <VehicleDashboard
                vehicleSpeed={vehicleSpeed}
                setVehicleSpeed={setVehicleSpeed}
                vehicleRpm={vehicleRpm}
                setVehicleRpm={setVehicleRpm}
                selectedGaugeTheme={selectedGaugeTheme}
                onGaugeThemeChange={setSelectedGaugeTheme}
                obdConnected={obdConnected}
                onToggleObd={() => setObdConnected(!obdConnected)}
                onAddLog={handleAddLog}
              />
            )}

            {/* VIEW 5: DEVICES MULTIPLIERS */}
            {activeTab === 'devices' && (
              <DevicesPanel
                devices={devices}
                onDeviceUpdate={handleDeviceUpdate}
                onAddLog={handleAddLog}
              />
            )}

            {/* VIEW 6: CLOUD SYNC & COMMUNITY PRESETS */}
            {activeTab === 'presets' && (
              <CloudTutorialHub
                onInstallPresetProfile={handleInstallPresetProfile}
                onInstallPresetOverlay={handleInstallPresetOverlay}
                onAddLog={handleAddLog}
              />
            )}

          </div>

          {/* 3. SUBSYSTEM MODULE DIAGNOSTICS DECK */}
          <div className="bg-[#111114] border border-white/5 rounded-2xl p-5 shadow-xl transition-all">
            <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setIsSubsystemsExpanded(!isSubsystemsExpanded)}>
              <div className="flex items-center gap-2">
                <Shield className="w-4.5 h-4.5 text-indigo-400" />
                <div className="space-y-[1px]">
                  <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">
                    Android Subsystem Registry
                  </h3>
                  <p className="text-[10px] text-gray-500 font-medium">Active running state coordinates for core system layers</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">
                  12/12 BOUND
                </span>
                {isSubsystemsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {isSubsystemsExpanded && (
              <div className="mt-5 pt-4 border-t border-white/5 space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { name: 'InputBridgeService', state: 'ACTIVE', desc: 'Pre-loaded high velocity input injection pipeline server', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405' },
                    { name: 'Shizuku Manager', state: 'BOUND', desc: 'Binder node execution sandbox provider and authenticator', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405' },
                    { name: 'AIDL', state: 'CONNECTED', desc: 'Android Interface Definition Language cross-process binder client', badgeColor: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-405' },
                    { name: 'Accessibility Service', state: 'GRANTED', desc: 'Secure system-level gesture dispatcher background listener', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405' },
                    { name: 'Overlay HUD', state: 'ACTIVE', desc: 'Draws floating reticle, cursor skin or speed dial window overlays', badgeColor: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-405' },
                    { name: 'Key Mapper', state: 'READY', desc: 'Maps bluetooth keyboard key events to customized coordinate taps', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405' },
                    { name: 'Mouse Engine', state: 'ENABLED', desc: 'Advanced DPI calibrator, multiplier curves and precision scaling', badgeColor: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-405' },
                    { name: 'Gamepad Engine', state: 'READY', desc: 'Polls physical triggers / analogue sticks events to joystick nodes', badgeColor: 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-405' },
                    { name: 'Profile Manager', state: 'LOADED', desc: 'Caches user script macros lists and binds them to Active key maps', badgeColor: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-405' },
                    { name: 'Vehicle Manager', state: obdConnected ? 'OBD ACTIVE' : 'DISCONNECTED', desc: 'Subscribes to OBD-II adapters sockets to translate vehicle speeds', badgeColor: obdConnected ? 'bg-amber-500/10 border border-amber-500/20 text-amber-405' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500' },
                    { name: 'Cloud Sync', state: 'ONLINE', desc: 'Syncs dynamic pointer settings and game macros coordinates maps', badgeColor: 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-405' },
                    { name: 'HUD Scanner', state: 'IDLE', desc: 'Computes active UI frame borders to snap floating reticles to scale', badgeColor: 'bg-gray-500/10 border border-white/5 text-gray-400' }
                  ].map((sub) => (
                    <div key={sub.name} className="p-3 rounded-xl bg-[#0a0a0b] border border-white/5 flex flex-col justify-between gap-2.5 group hover:border-white/10 transition">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-bold text-gray-200 group-hover:text-indigo-400 transition leading-none">
                            {sub.name}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded leading-none ${sub.badgeColor}`}>
                            {sub.state}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-450 leading-relaxed font-normal">
                          {sub.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[9px] font-bold">
                        <span className="text-gray-500 font-mono">com.catmouse.pro:{sub.name.replace(/\s+/g, '')}</span>
                        <button
                          onClick={() => {
                            handleAddLog('Shizuku', 'info', `[PING IPC] Querying diagnostics for com.catmouse.pro:${sub.name.replace(/\s+/g, '')}...`);
                            setTimeout(() => {
                              handleAddLog('Binder', 'success', `[DIAGNOSTICS] Service ${sub.name} answered immediately (RTT: 0.8ms). Status level: ${sub.state}.`);
                            }, 200);
                          }}
                          className="px-2 py-0.5 bg-[#111114] border border-white/10 hover:border-indigo-500 hover:text-white rounded text-[8px] font-mono uppercase text-gray-400 tracking-wider transition"
                        >
                          Ping IPC
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Persistent Simulated SmartPhone Frame */}
        <div className="lg:col-span-4 bg-[#0d0d10] border-t lg:border-t-0 lg:border-l border-white/10 p-5 md:p-6 flex flex-col items-center justify-center shrink-0">
          <div className="sticky top-6 flex flex-col items-center">
            <h3 className="text-[10px] font-bold font-sans uppercase tracking-widest text-indigo-400 mb-4 flex items-center justify-center gap-1.5 leading-none">
              <Smartphone className="w-4 h-4 text-indigo-400" /> LIVE BINDER DEVICE PREVIEW
            </h3>
            
            <AndroidSimulator
              overlays={overlays}
              selectedOverlayId={selectedOverlayId}
              onOverlaySelect={setSelectedOverlayId}
              onOverlayPositionChange={handleOverlayPositionChange}
              activeProfile={profiles.find((p) => p.id === selectedProfileId) || null}
              isRunningMacro={isRunningMacro}
              currentMacroStep={currentMacroStep}
              macroProgressX={pointerProgressX}
              macroProgressY={pointerProgressY}
              vehicleSpeed={vehicleSpeed}
              vehicleRpm={vehicleRpm}
            />
          </div>
        </div>

      </main>

    </div>
  );
}
