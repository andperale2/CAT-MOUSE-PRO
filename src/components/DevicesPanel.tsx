/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Gamepad2, Sliders, Battery, MousePointer, Info, Cpu, RefreshCw, Layers 
} from 'lucide-react';
import { InputDevice } from '../types';

interface DevicesPanelProps {
  devices: InputDevice[];
  onDeviceUpdate: (device: InputDevice) => void;
  onAddLog: (source: 'Binder' | 'Shizuku' | 'Overlay', level: 'info' | 'success' | 'warn', msg: string) => void;
}

export default function DevicesPanel({
  devices,
  onDeviceUpdate,
  onAddLog,
}: DevicesPanelProps) {

  const handlePointerSpeedChange = (device: InputDevice, speed: number) => {
    onDeviceUpdate({ ...device, pointerSpeed: speed });
  };

  const handleToggleAccelerator = (device: InputDevice) => {
    const nextVal = !device.acceleratorOn;
    onDeviceUpdate({ ...device, acceleratorOn: nextVal });
    onAddLog(
      'Binder', 
      'info', 
      `Pointer tracking configuration updated on [${device.name}]. Precision acceleration: ${nextVal ? 'ON (Quadratic cubic filter)' : 'OFF (Linear direct standard)'}`
    );
  };

  const handleSkinSelect = (device: InputDevice, skin: 'classic' | 'neon_spark' | 'cat_paw' | 'stealth_pointer') => {
    // Report log representation of ADB shell binder changes
    onAddLog('Overlay', 'success', `Binder transaction overlay skin successfully applied: ${skin}`);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      {/* 1. PHYSICAL/VIRTUAL CONNECTED DEVICES RAILS */}
      <div className="xl:col-span-5 flex flex-col gap-4 bg-[#111114] border border-white/5 rounded-2xl p-5.5 shadow-xl">
        <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">Target input devices</h3>
        
        <div className="space-y-3">
          {devices.map((dev) => {
            const isConnected = dev.status === 'connected';
            return (
              <div 
                key={dev.id}
                className={`p-4 rounded-xl border flex gap-3.5 items-start justify-between relative overflow-hidden transition ${
                  isConnected 
                    ? 'bg-[#0a0a0b] border-white/5' 
                    : 'bg-[#0a0a0b]/45 border-white/5 opacity-60'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-[#111114] border border-white/5 text-gray-400 shrink-0">
                  <Gamepad2 className="w-5 h-5 text-indigo-400" />
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-xs font-bold leading-tight block truncate text-gray-150">{dev.name}</span>
                    <span className="text-[8px] border border-white/5 px-1.5 py-0.5 rounded uppercase font-semibold font-mono tracking-widest text-gray-500 bg-[#111114] shrink-0">
                      {dev.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[10px] font-mono text-gray-500">
                    <span className="flex items-center gap-1 font-bold">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                      {isConnected ? 'LIVE BIND' : 'REMOVED'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Battery className="w-3 h-3" /> {dev.battery}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DEVICE CALIBRATION AND POINTER SPEED CONTROLS */}
      <div className="xl:col-span-7 flex flex-col gap-5 bg-[#111114] border border-white/5 rounded-2xl p-5.5 shadow-xl">
        <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">ADB Input Precision Tuning</h3>
        
        {devices.filter(d => d.status === 'connected').slice(0, 1).map((activeDev) => (
          <div key={`tuning-${activeDev.id}`} className="space-y-4">
            {/* Pointer sensitivity sliders */}
            <div className="bg-[#0a0a0b] border border-white/5 p-4 rounded-xl space-y-3.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-gray-400 font-bold uppercase">Pointing Multiplier sensitivity</span>
                <span className="text-indigo-400 font-bold">x{activeDev.pointerSpeed.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={activeDev.pointerSpeed}
                onChange={(e) => handlePointerSpeedChange(activeDev, parseFloat(e.target.value) || 1.0)}
                className="w-full h-1.5 accent-indigo-500 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] uppercase font-mono text-gray-550 font-semibold">
                <span>0.5 FPS Sniper</span>
                <span>1.0 Standard</span>
                <span>2.5 Hyper Swipe</span>
              </div>
            </div>

            {/* Pointer hardware acceleration toggle */}
            <div className="bg-[#0a0a0b] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-205 block">Pointer Precision Accelerator</span>
                <span className="text-[10px] text-gray-500 block leading-tight">
                  Enables exponential speed curves relative to hand swiping velocity. Ideal for high speed competitive shooter layouts.
                </span>
              </div>
              <button
                onClick={() => handleToggleAccelerator(activeDev)}
                className={`px-3 py-1.5 border text-xs font-bold rounded-xl shrink-0 transition-all ${
                  activeDev.acceleratorOn 
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-405' 
                    : 'bg-[#111114] border-white/5 hover:bg-white/5 text-gray-500'
                }`}
              >
                {activeDev.acceleratorOn ? 'ACCELERATION ON' : 'LINEAR TRACKING'}
              </button>
            </div>

            {/* Simulated pointer calibrations info and firmware versions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-[#0a0a0b]/40 border border-white/5 p-4 rounded-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-black font-mono tracking-widest text-[#6366f1]/80 block">INTERSECTION LATENCY</span>
                <span className="text-sm font-mono font-bold text-emerald-400">1.8 ms</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black font-mono tracking-widest text-[#6366f1]/80 block">BINDER POLLING FORCE</span>
                <span className="text-sm font-mono font-bold text-gray-200">1000 HZ POLLING</span>
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}
