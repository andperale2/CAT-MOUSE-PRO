/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Car, Sliders, Gauge, Radio, Sparkles, Navigation, Music, HelpCircle
} from 'lucide-react';

interface VehicleDashboardProps {
  vehicleSpeed: number;
  setVehicleSpeed: (speed: number) => void;
  vehicleRpm: number;
  setVehicleRpm: (rpm: number) => void;
  selectedGaugeTheme: 'cyber' | 'sport' | 'classic_car' | 'minimalist';
  onGaugeThemeChange: (theme: 'cyber' | 'sport' | 'classic_car' | 'minimalist') => void;
  obdConnected: boolean;
  onToggleObd: () => void;
  onAddLog: (source: 'OBD' | 'Binder' | 'Overlay', level: 'info' | 'success' | 'warn', msg: string) => void;
}

export default function VehicleDashboard({
  vehicleSpeed,
  setVehicleSpeed,
  vehicleRpm,
  setVehicleRpm,
  selectedGaugeTheme,
  onGaugeThemeChange,
  obdConnected,
  onToggleObd,
  onAddLog,
}: VehicleDashboardProps) {

  const handleToggleConnection = () => {
    onToggleObd();
    if (!obdConnected) {
      onAddLog('OBD', 'success', 'OBD Bluetooth Receiver successfully connected: Car VIN verified.');
      onAddLog('OBD', 'info', 'OBD stream initialized (CAN protocol). Monitoring vehicle telemetry.');
    } else {
      onAddLog('OBD', 'warn', 'OBD receiver binding disconnected. Safe fallback triggers restored.');
    }
  };

  const handleSpeedSlider = (val: number) => {
    setVehicleSpeed(val);
    if (val > 120 && val % 20 === 0) {
      onAddLog('OBD', 'warn', `Telemetry ALERT: Speed boundary limit threshold exceeded (${val} km/h). Overlay colored red.`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* LEFT: Live Simulation sliders */}
      <div className="md:col-span-7 bg-[#111114] border border-white/5 rounded-2xl p-5.5 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">Vehicle telemetry simulator</h3>
          </div>
          
          <button
            onClick={handleToggleConnection}
            className={`px-3 py-1.5 border text-[11px] font-bold rounded-xl transition-all ${
              obdConnected 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-inner' 
                : 'bg-[#0a0a0b] border-white/5 hover:bg-white/5 text-gray-550 hover:text-gray-300'
            }`}
          >
            {obdConnected ? '● OBD BOUND MATCH' : '○ DISCONNECTED'}
          </button>
        </div>

        {/* Telemetry Slider speed controls */}
        <div className="space-y-4">
          <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4 space-y-3.5">
            <div className="flex justify-between items-center select-none font-mono">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Simulated Vehicle Speed</span>
              <span className="text-sm font-black text-indigo-400">{vehicleSpeed} KM/H</span>
            </div>
            <input
              type="range"
              min="0"
              max="160"
              value={vehicleSpeed}
              onChange={(e) => handleSpeedSlider(parseInt(e.target.value) || 0)}
              className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-550 font-semibold uppercase font-mono">
              <span>0 KMH</span>
              <span>80 CRUISE</span>
              <span>160 MAX</span>
            </div>
          </div>

          <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-4 space-y-3.5">
            <div className="flex justify-between items-center select-none font-mono">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Simulated RPM Engine load</span>
              <span className="text-sm font-black text-rose-450">{vehicleRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="7500"
              step="100"
              value={vehicleRpm}
              onChange={(e) => setVehicleRpm(parseInt(e.target.value) || 1200)}
              className="w-full accent-rose-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-550 font-semibold uppercase font-mono">
              <span>800 Idle</span>
              <span>4200 BOOST</span>
              <span>7500 REDLINE</span>
            </div>
          </div>
        </div>

        {/* Auto action boots on car entry */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase font-mono">CAR CONNECT TRIGGER LOGIC</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0a0a0b] border border-white/5 p-3.5 rounded-xl flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 accent-indigo-500" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-200 block">Auto Open Maps App</span>
                <span className="text-[10px] text-gray-500 leading-tight block">Automatically switches default app layout to Google Maps / navigation on connect.</span>
              </div>
            </div>

            <div className="bg-[#0a0a0b] border border-white/5 p-3.5 rounded-xl flex items-start gap-3">
              <input type="checkbox" defaultChecked className="mt-1 accent-indigo-500" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-200 block">Force Landscape Overlay</span>
                <span className="text-[10px] text-gray-500 leading-tight block">Translates screen overlay sizes appropriately for tablet interfaces or widescreen dashboard mount modes.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT: Layout & Theme config */}
      <div className="md:col-span-5 bg-[#111114] border border-white/5 rounded-2xl p-5.5 flex flex-col gap-5 shadow-xl">
        <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">HUD gauge Customizer</h3>
        
        {/* Speedometer Gauge themes selectable */}
        <div className="space-y-3">
          <label className="text-[10px] font-black tracking-widest text-[#6366f1]/80 uppercase font-mono block">SELECT ENGINE HUD THEME</label>
          <div className="grid grid-cols-2 gap-2.5">
            {(['cyber', 'sport', 'classic_car', 'minimalist'] as const).map((theme) => {
              const labels = {
                cyber: 'Cyberpunk Neon',
                sport: 'Red Carbon Sport',
                classic_car: 'Classic Amber Dial',
                minimalist: 'Minimal Digital LCD'
              };
              const active = selectedGaugeTheme === theme;
              return (
                <button
                  key={theme}
                  onClick={() => {
                    onGaugeThemeChange(theme);
                    onAddLog('Overlay', 'success', `Dashboard overlay theme configured: ${labels[theme]}. Updates rendered in simulator.`);
                  }}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center select-none ${
                    active 
                      ? 'bg-indigo-500/5 border-indigo-500/50 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                      : 'bg-[#0a0a0b] border-white/5 hover:border-white/10 text-gray-400'
                  }`}
                  id={`btn_theme_${theme}`}
                >
                  <Gauge className={`w-5 h-5 ${active ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className="text-[11px] font-semibold leading-tight">{labels[theme]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed limits controls config */}
        <div className="space-y-3 bg-[#0a0a0b] border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[10px] font-semibold font-mono tracking-widest text-gray-400 uppercase">SPEED LIMIT THRESHOLD COGNITION</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="text-xs text-gray-450 leading-snug">Warn visual overlay alert if speed exceeds limit:</span>
            <div className="flex items-center gap-1.5 shrink-0 bg-[#111114] border border-white/5 px-2 py-1 rounded-lg">
              <input type="number" defaultValue={110} className="w-12 text-center text-xs font-mono font-bold bg-transparent text-indigo-400 border-0 outline-none" />
              <span className="text-[9px] text-[#6366f1]/80 font-bold uppercase font-mono">KMH</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed font-semibold italic select-none">
          *Note: To fetch live speedometer stats from the car's engine CAN BUS system, ensure wireless setup on OBD Adaptor bluetooth configurations are in sync with ADB binders!
        </p>
      </div>
    </div>
  );
}
