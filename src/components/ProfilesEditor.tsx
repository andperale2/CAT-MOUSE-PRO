/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Play, Square, Plus, Trash2, Sliders, Smartphone, Clock, 
  MapPin, RefreshCw, Key, AppWindow, Swords, ScrollText, Car, Check, ChevronDown
} from 'lucide-react';
import { Profile, AutomationAction, ActionType } from '../types';

interface ProfilesEditorProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onProfileSelect: (id: string) => void;
  onProfileUpdate: (profile: Profile) => void;
  onProfileDelete: (id: string) => void;
  onProfileCreate: (category: 'game' | 'utility' | 'vehicle') => void;
  onRunMacro: () => void;
  onStopMacro: () => void;
  isRunningMacro: boolean;
  currentMacroStep: number;
}

export default function ProfilesEditor({
  profiles,
  selectedProfileId,
  onProfileSelect,
  onProfileUpdate,
  onProfileDelete,
  onProfileCreate,
  onRunMacro,
  onStopMacro,
  isRunningMacro,
  currentMacroStep,
}: ProfilesEditorProps) {
  const currentProfile = profiles.find((p) => p.id === selectedProfileId) || null;
  const [addingActionType, setAddingActionType] = useState<ActionType>('tap');
  const [quickX, setQuickX] = useState<number>(50);
  const [quickY, setQuickY] = useState<number>(50);
  const [quickLabel, setQuickLabel] = useState<string>('New Touch Action');
  const [quickDelay, setQuickDelay] = useState<number>(200);

  const handleActionUpdate = (actionId: string, updatedFields: Partial<AutomationAction>) => {
    if (!currentProfile) return;
    const updatedActions = currentProfile.actions.map((act) => 
      act.id === actionId ? { ...act, ...updatedFields } : act
    );
    onProfileUpdate({ ...currentProfile, actions: updatedActions });
  };

  const handleAddField = (actionId: string, field: 'x' | 'y' | 'xEnd' | 'yEnd', value: number) => {
    handleActionUpdate(actionId, { [field]: Math.max(0, Math.min(100, value)) });
  };

  const handleActionDelete = (actionId: string) => {
    if (!currentProfile) return;
    const updatedActions = currentProfile.actions.filter((act) => act.id !== actionId);
    onProfileUpdate({ ...currentProfile, actions: updatedActions });
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;

    let newAction: AutomationAction = {
      id: `act-new-${Date.now()}`,
      type: addingActionType,
      label: quickLabel || `${addingActionType.toUpperCase()} Step`,
      delayMs: quickDelay || 200,
    };

    if (addingActionType === 'tap') {
      newAction.x = quickX;
      newAction.y = quickY;
    } else if (addingActionType === 'swipe') {
      newAction.x = quickX;
      newAction.y = quickY;
      newAction.xEnd = Math.max(0, Math.min(100, quickX + 15));
      newAction.yEnd = Math.max(0, Math.min(100, quickY - 20));
    } else if (addingActionType === 'key') {
      newAction.keyCode = 'Back';
    } else if (addingActionType === 'launch') {
      newAction.packageName = 'com.android.settings';
    }

    onProfileUpdate({
      ...currentProfile,
      actions: [...currentProfile.actions, newAction],
    });

    // Reset quick fields
    setQuickLabel('New Touch Action');
    setQuickDelay(200);
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!currentProfile) return;
    onProfileUpdate({ ...currentProfile, category: e.target.value as any });
  };

  const getProfileIcon = (iconName: string) => {
    switch (iconName) {
      case 'Swords': return <Swords className="w-4 h-4 text-rose-400" />;
      case 'ScrollText': return <ScrollText className="w-4 h-4 text-cyan-400" />;
      case 'Car': return <Car className="w-4 h-4 text-amber-400" />;
      default: return <Smartphone className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT: Profiles Navigation rail */}
      <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4.5 flex flex-col gap-4.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black font-sans uppercase tracking-wider text-zinc-300">Automated Profiles</h2>
          <div className="flex gap-1">
            <button
              onClick={() => onProfileCreate('game')}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700/80 hover:text-white border border-zinc-700 text-[10px] font-bold rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3 text-emerald-400" /> Game
            </button>
            <button
              onClick={() => onProfileCreate('utility')}
              className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700/80 hover:text-white border border-zinc-700 text-[10px] font-bold rounded-lg transition"
            >
              Utility
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[280px] lg:max-h-[380px] overflow-y-auto pr-1">
          {profiles.map((p) => {
            const isSelected = p.id === selectedProfileId;
            return (
              <div
                key={p.id}
                id={`profile_item_${p.id}`}
                onClick={() => onProfileSelect(p.id)}
                className={`relative p-3 rounded-xl border transition cursor-pointer select-none group flex flex-col gap-1.5 ${
                  isSelected 
                    ? 'bg-indigo-500/5 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.06)]' 
                    : 'bg-[#09090b]/45 border-white/5 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#0a0a0b] border border-white/5">
                      {getProfileIcon(p.icon)}
                    </span>
                    <span className={`text-xs font-bold leading-none ${isSelected ? 'text-indigo-405' : 'text-gray-150'}`}>
                      {p.name}
                    </span>
                  </div>
                  {p.isActive && (
                    <span className="text-[8px] bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded uppercase leading-none tracking-wider">
                      BIND ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-1 opacity-60 group-hover:opacity-100 transition">
                  <span className="text-[9px] font-mono font-semibold text-gray-500 uppercase">
                    {p.actions.length} ACTIONS • {p.category}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProfileDelete(p.id);
                    }}
                    className="p-1 text-gray-500 hover:text-rose-450 hover:bg-[#0a0a0b] border border-transparent hover:border-white/5 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Actions Composer dashboard */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {currentProfile ? (
          <>
            {/* Action Meta Settings */}
            <div className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shadow-xl animate-fade-in">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => onProfileUpdate({ ...currentProfile, name: e.target.value })}
                    className="bg-transparent border border-transparent hover:border-white/5 focus:border-indigo-500 text-sm font-bold text-white px-1.5 py-0.5 rounded font-sans w-full md:w-auto outline-none"
                  />
                  <select
                    value={currentProfile.category}
                    onChange={handleCategorySelect}
                    className="bg-[#0a0a0b] border border-white/10 rounded px-2 py-0.5 text-[10px] font-mono text-gray-400"
                  >
                    <option value="game">Game Preset</option>
                    <option value="utility">Utility Macro</option>
                    <option value="vehicle">Vehicle Hook</option>
                  </select>
                </div>
                <textarea
                  value={currentProfile.description}
                  onChange={(e) => onProfileUpdate({ ...currentProfile, description: e.target.value })}
                  className="bg-transparent border border-transparent hover:border-white/5 focus:border-indigo-500 text-xs text-gray-400 px-1.5 py-0.5 rounded font-sans w-full resize-none h-12 outline-none"
                  placeholder="Insert profile description here..."
                />
              </div>

              {/* Execution action console */}
              <div className="flex gap-2.5 w-full md:w-auto self-end md:self-center">
                {isRunningMacro ? (
                  <button
                    onClick={onStopMacro}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-rose-500 hover:bg-rose-650 border border-rose-400/20 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-955/20"
                  >
                    <Square className="w-x h-x fill-white text-white" /> STOP RUNNER
                  </button>
                ) : (
                  <button
                    onClick={onRunMacro}
                    disabled={currentProfile.actions.length === 0}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 border border-indigo-400/20 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/20"
                  >
                    <Play className="w-4 h-4 fill-white text-white" /> PLAY PLAYBOOK
                  </button>
                )}
                
                <button
                  onClick={() => onProfileUpdate({ ...currentProfile, isActive: !currentProfile.isActive })}
                  className={`px-3 py-2.5 border text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                    currentProfile.isActive 
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' 
                      : 'bg-[#0a0a0b] border-white/5 hover:bg-white/5 text-gray-400 hover:text-white_200'
                  }`}
                >
                  <Check className="w-4 h-4" /> BIND TO ADB
                </button>
              </div>
            </div>

            {/* Quick action add bar */}
            <form onSubmit={handleAddAction} className="bg-[#111114] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-end shadow-xl">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black tracking-wider text-gray-500 uppercase font-mono">Action Type</label>
                  <select
                    value={addingActionType}
                    onChange={(e) => setAddingActionType(e.target.value as ActionType)}
                    className="bg-[#0a0a0b] border border-white/10 rounded-lg p-2 text-xs text-gray-300 w-full outline-none focus:border-indigo-500"
                  >
                    <option value="tap">Tap Coordinates</option>
                    <option value="swipe">Swipe Path gesture</option>
                    <option value="delay">Wait Delay</option>
                    <option value="key">Keycode trigger</option>
                    <option value="launch">Launch App Package</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black tracking-wider text-zinc-500 uppercase font-mono">Step Label</label>
                  <input
                    type="text"
                    required
                    value={quickLabel}
                    onChange={(e) => setQuickLabel(e.target.value)}
                    placeholder="Aim Trigger"
                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder-zinc-600 focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black tracking-wider text-zinc-500 uppercase font-mono">Delay (ms)</label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={quickDelay}
                    onChange={(e) => setQuickDelay(parseInt(e.target.value) || 100)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                  {(addingActionType === 'tap' || addingActionType === 'swipe') ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-black tracking-wider text-zinc-500 uppercase font-mono">X coordinate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={quickX}
                          onChange={(e) => setQuickX(parseInt(e.target.value) || 0)}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black tracking-wider text-zinc-500 uppercase font-mono">Y coordinate (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={quickY}
                          onChange={(e) => setQuickY(parseInt(e.target.value) || 0)}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-2 text-center text-[10px] text-zinc-500 h-9 bg-zinc-950/40 rounded-lg border border-zinc-850 border-dashed">
                      Specific Fields Below
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-black rounded-lg transition shrink-0"
              >
                ADD COMPONENT
              </button>
            </form>

            {/* Actions list */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="bg-zinc-950/50 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>SEQUENCE STEPS</span>
                <span>{currentProfile.actions.length} COMMANDS TOTAL</span>
              </div>

              <div className="divide-y divide-zinc-850 max-h-[300px] overflow-y-auto">
                {currentProfile.actions.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-1.5">
                    <Smartphone className="w-8 h-8 text-zinc-600 opacity-40" />
                    <p className="text-xs font-medium">No actions configured in this sequence yet.</p>
                    <p className="text-[10px] text-zinc-600">Add tap coordinates, swipes or key triggers above to design a macro layout!</p>
                  </div>
                ) : (
                  currentProfile.actions.map((act, index) => {
                    const isStepExecuting = isRunningMacro && currentMacroStep === index;
                    return (
                      <div
                        key={act.id}
                        className={`p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                          isStepExecuting 
                            ? 'bg-amber-500/10 border-l-4 border-l-amber-500' 
                            : 'hover:bg-zinc-850/60'
                        }`}
                      >
                        {/* Left Info Column */}
                        <div className="flex items-start gap-3">
                          <span className={`w-5.5 h-5.5 text-[10px] font-black font-mono rounded-full flex items-center justify-center shrink-0 border ${
                            isStepExecuting 
                              ? 'bg-amber-400 border-amber-300 text-black animate-pulse' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                          }`}>
                            {index + 1}
                          </span>
                          
                          <div className="space-y-1 flex-1">
                            {/* Editable Label */}
                            <input
                              type="text"
                              value={act.label}
                              onChange={(e) => handleActionUpdate(act.id, { label: e.target.value })}
                              className="bg-transparent border border-transparent hover:border-zinc-850 focus:border-amber-500 text-xs font-bold text-zinc-100 px-1 py-0.5 rounded leading-none"
                            />
                            
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono uppercase text-zinc-500">
                              <span className="flex items-center gap-1 text-slate-400 bg-zinc-950/80 px-1.5 py-0.5 rounded-md text-[9px] border border-zinc-850">
                                {act.type === 'tap' && <MapPin className="w-2.5 h-2.5 text-rose-400" />}
                                {act.type === 'swipe' && <Sliders className="w-2.5 h-2.5 text-cyan-400" />}
                                {act.type === 'delay' && <Clock className="w-2.5 h-2.5 text-yellow-400" />}
                                {act.type === 'key' && <Key className="w-2.5 h-2.5 text-purple-400" />}
                                {act.type === 'launch' && <AppWindow className="w-2.5 h-2.5 text-emerald-400" />}
                                {act.type}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-zinc-400">
                                <Clock className="w-3 h-3" /> {act.delayMs}ms delay
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mid Inputs for positions / keys */}
                        <div className="flex items-center gap-2 max-w-full md:max-w-xs shrink-0 bg-transparent">
                          {act.type === 'tap' && act.x !== undefined && act.y !== undefined && (
                            <div className="flex gap-1.5 text-[11px] font-mono">
                              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg">
                                <span className="text-zinc-600 font-bold">X</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={act.x}
                                  onChange={(e) => handleAddField(act.id, 'x', parseInt(e.target.value) || 0)}
                                  className="w-8 text-center text-white bg-transparent outline-none border-b border-zinc-800 focus:border-amber-400"
                                />
                                <span className="text-zinc-600 text-[9px]">%</span>
                              </div>
                              <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg">
                                <span className="text-zinc-600 font-bold">Y</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={act.y}
                                  onChange={(e) => handleAddField(act.id, 'y', parseInt(e.target.value) || 0)}
                                  className="w-8 text-center text-white bg-transparent outline-none border-b border-zinc-800 focus:border-amber-400"
                                />
                                <span className="text-zinc-600 text-[9px]">%</span>
                              </div>
                            </div>
                          )}

                          {act.type === 'swipe' && act.x !== undefined && act.y !== undefined && act.xEnd !== undefined && act.yEnd !== undefined && (
                            <div className="flex flex-col gap-1 text-[10px] font-mono">
                              <div className="flex gap-1">
                                <span className="text-zinc-600 select-none">START</span>
                                <span className="text-zinc-300">({act.x}%, {act.y}%)</span>
                              </div>
                              <div className="flex gap-1">
                                <span className="text-zinc-600 select-none">END</span>
                                <span className="text-zinc-300">({act.xEnd}%, {act.yEnd}%)</span>
                              </div>
                            </div>
                          )}

                          {act.type === 'key' && (
                            <select
                              value={act.keyCode || 'Back'}
                              onChange={(e) => handleActionUpdate(act.id, { keyCode: e.target.value })}
                              className="bg-zinc-950 border border-zinc-850 rounded-lg p-1 text-[11px] font-mono text-amber-400 px-2 py-1"
                            >
                              <option value="Back">KEY_BACK</option>
                              <option value="Home">KEY_HOME</option>
                              <option value="VolumeUp">KEY_VOL_UP</option>
                              <option value="VolumeDown">KEY_VOL_DOWN</option>
                              <option value="MediaPlay">KEY_MEDIA_PLAY</option>
                              <option value="MediaNext">KEY_MEDIA_NEXT</option>
                            </select>
                          )}

                          {act.type === 'launch' && (
                            <input
                              type="text"
                              value={act.packageName || ''}
                              onChange={(e) => handleActionUpdate(act.id, { packageName: e.target.value })}
                              className="bg-zinc-950 border border-zinc-850 rounded-lg p-1 px-2 text-[11px] font-mono text-zinc-300 w-36 outline-none focus:border-amber-500"
                              placeholder="com.android.settings"
                            />
                          )}

                          {act.type === 'delay' && (
                            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[11px] font-mono">
                              <input
                                type="number"
                                min="50"
                                value={act.delayMs || 100}
                                onChange={(e) => handleActionUpdate(act.id, { delayMs: Math.max(50, parseInt(e.target.value) || 50) })}
                                className="w-14 text-center text-white bg-transparent outline-none"
                              />
                              <span className="text-zinc-600 text-[10px]">ms</span>
                            </div>
                          )}

                          {/* Delete Item button */}
                          <button
                            onClick={() => handleActionDelete(act.id)}
                            className="p-1 px-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-950 rounded border border-transparent hover:border-zinc-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 max-w-lg mx-auto flex flex-col items-center gap-2">
            <Smartphone className="w-12 h-12 text-zinc-700 opacity-40 animate-pulse" />
            <h3 className="text-base font-bold text-zinc-300">No Profile Selected</h3>
            <p className="text-xs">
              Select or create an automated touch/gesture macro profile in the list on the left to start editing components!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
