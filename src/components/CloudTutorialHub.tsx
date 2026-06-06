/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cloud, Search, Download, Star, ExternalLink, HelpCircle, Swords, ScrollText, Car, Check, User
} from 'lucide-react';
import { PresetStoreItem, Profile, OverlayTemplate } from '../types';
import { PRESET_STORE } from '../constants';

interface CloudTutorialHubProps {
  onInstallPresetProfile: (preset: PresetStoreItem) => void;
  onInstallPresetOverlay: (overlay: any) => void;
  onAddLog: (source: 'Cloud' | 'Shizuku' | 'Overlay', level: 'info' | 'success' | 'warn', msg: string) => void;
}

export default function CloudTutorialHub({
  onInstallPresetProfile,
  onInstallPresetOverlay,
  onAddLog,
}: CloudTutorialHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  // Filter store items matching queries
  const filteredStore = PRESET_STORE.filter((item) => {
    const matchQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchQuery && matchCategory;
  });

  const handleInstallPreset = (item: PresetStoreItem) => {
    if (installedIds.includes(item.id)) return;
    
    setInstalledIds((prev) => [...prev, item.id]);
    
    if (item.type === 'profile') {
      onInstallPresetProfile(item);
    } else {
      // Create new template
      const templateData: Partial<OverlayTemplate> = {
        id: `ov-preset-${Date.now()}`,
        name: item.name,
        type: item.data.type,
        color: item.data.color,
        scale: item.data.scale || 1.1,
        opacity: item.data.opacity || 0.9,
        x: 50,
        y: 50,
        settings: item.data.settings || {}
      };
      onInstallPresetOverlay(templateData);
    }

    onAddLog(
      'Cloud', 
      'success', 
      `Cloud Synchronization Complete: Preset [${item.name}] by @${item.author} downloaded and successfully active!`
    );
  };

  const getPresetIcon = (category: string) => {
    switch (category) {
      case 'game': return <Swords className="w-4 h-4 text-rose-450 text-rose-400" />;
      case 'utility': return <ScrollText className="w-4 h-4 text-cyan-400" />;
      case 'vehicle': return <Car className="w-4 h-4 text-amber-400" />;
      default: return <Cloud className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Community Presets Cloud Store */}
      <div className="lg:col-span-8 flex flex-col gap-5 bg-[#111114] border border-white/5 rounded-2xl p-5.5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">Cat Mouse Pro Community Hub</h3>
            <p className="text-xs text-gray-500 leading-snug">
              Sync developer presets, custom cursor skins, speedometer models, and gaming macro layouts shared by global users.
            </p>
          </div>
        </div>

        {/* Search and Filters row */}
        <div className="flex flex-col md:flex-row gap-2.5">
          <div className="flex-1 bg-[#0a0a0b] border border-white/5 rounded-xl px-3.5 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-550 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crosshairs, macro configs, speed gauges..."
              className="bg-transparent border-none ring-0 outline-none text-xs w-full text-white placeholder-gray-650"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'game', 'utility', 'vehicle'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 border text-[11px] font-bold rounded-xl transition select-none uppercase tracking-wider ${
                  selectedCategory === cat 
                    ? 'bg-indigo-500/5 border-indigo-500/50 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                    : 'bg-[#0a0a0b] border-white/5 hover:bg-white/5 text-gray-550'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
          {filteredStore.length === 0 ? (
            <div className="col-span-2 py-10 opacity-60 text-center text-gray-500 font-medium text-xs flex flex-col items-center justify-center gap-1.5 border border-dashed border-white/5 rounded-xl">
              <Cloud className="w-8 h-8 text-gray-600" />
              <span>No community presets matches your criteria.</span>
            </div>
          ) : (
            filteredStore.map((item) => {
              const installed = installedIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="bg-[#0a0a0b] border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3.5 transition group"
                  id={`preset_item_${item.id}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-[#111114] border border-white/5 leading-none">
                          {getPresetIcon(item.category)}
                        </span>
                        <span className="text-xs font-bold text-gray-100 block truncate group-hover:text-indigo-400 transition leading-none">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[8px] bg-[#111114] border border-white/5 text-gray-555 font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer rating metadata and Action */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 font-semibold">
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-550" /> {item.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <User className="w-3 h-3 text-gray-500" /> @{item.author}
                      </span>
                    </div>

                    <button
                      onClick={() => handleInstallPreset(item)}
                      disabled={installed}
                      className={`p-1.5 px-3 text-[10px] rounded-lg border font-bold transition flex items-center justify-center gap-1.5 ${
                        installed 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-sm cursor-default' 
                          : 'bg-[#111114] hover:bg-white/5 hover:text-white border-white/10 text-gray-400'
                      }`}
                    >
                      {installed ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> INSTALLED
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" /> PULL PRESET
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: App Module Documentation guides */}
      <div className="lg:col-span-4 flex flex-col gap-5 bg-[#111114] border border-white/5 rounded-2xl p-5.5 shadow-xl">
        <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">Cat Mouse Pro architecture</h3>
        
        <div className="space-y-4 text-xs text-gray-400 leading-relaxed font-sans">
          <p>
            Cat Mouse Pro is structured as a modular Gradle project. Here is how the individual subsystems communicate over the sandbox partition boundaries:
          </p>

          <div className="space-y-3 pt-1">
            <div className="bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5 flex items-start gap-2.5 hover:border-white/10 transition">
              <span className="text-sky-400 font-mono text-[10px] font-black shrink-0 uppercase leading-none border border-sky-400/20 px-1 py-[1px] rounded bg-sky-400/5">
                :overlay
              </span>
              <div className="space-y-0.5 leading-normal">
                <span className="text-[11px] font-bold text-gray-205 block">System Window Injection</span>
                <span className="text-[10px] text-gray-500 block leading-snug">Uses system-level overlays to draw target sights, pointer indicators, and gauges directly over active apps.</span>
              </div>
            </div>

            <div className="bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5 flex items-start gap-2.5 hover:border-white/10 transition">
              <span className="text-purple-400 font-mono text-[10px] font-black shrink-0 uppercase leading-none border border-purple-400/20 px-1 py-[1px] rounded bg-purple-400/5">
                :shizuku
              </span>
              <div className="space-y-0.5 leading-normal">
                <span className="text-[11px] font-bold text-gray-205 block">Binder User Services</span>
                <span className="text-[10px] text-gray-500 block leading-snug">Exposes Shizuku client services targeting `/system/bin/app_process` to inject raw touches, clicks, and drag loops.</span>
              </div>
            </div>

            <div className="bg-[#0a0a0b] p-2.5 rounded-xl border border-white/5 flex items-start gap-2.5 hover:border-white/10 transition">
              <span className="text-indigo-400 font-mono text-[10px] font-black shrink-0 uppercase leading-none border border-indigo-400/20 px-1 py-[1px] rounded bg-indigo-400/5">
                :vehicles
              </span>
              <div className="space-y-0.5 leading-normal">
                <span className="text-[11px] font-bold text-gray-205 block">Car Companion HUD triggers</span>
                <span className="text-[10px] text-gray-500 block leading-snug">Subscribes to car system broadcasts or virtual bluetooth sockets to draw real-time digital speeds overlays.</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0b]/40 p-3 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-500 font-medium font-semibold">Read full GitHub API specs:</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-indigo-450 hover:text-indigo-400 flex items-center gap-1 font-bold">
              GITHUB REPO <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
