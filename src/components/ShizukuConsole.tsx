/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Check, Copy, Server, ShieldCheck, 
  Trash2, Play, ChevronRight, HelpCircle, HardDrive, RefreshCcw 
} from 'lucide-react';
import { LogMessage } from '../types';
import { SHIZUKU_ADB_GUIDE, ADB_TERMINAL_COMMANDS } from '../constants';

interface ShizukuConsoleProps {
  logs: LogMessage[];
  onClearLogs: () => void;
  onAddLog: (source: LogMessage['source'], level: LogMessage['level'], msg: string) => void;
}

export default function ShizukuConsole({ logs, onClearLogs, onAddLog }: ShizukuConsoleProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cliInput, setCliInput] = useState<string>('');
  const [shizukuState, setShizukuState] = useState<'running' | 'terminated'>('running');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onAddLog('ADB', 'success', `Copied command shell snippet to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim().toLowerCase();
    onAddLog('ADB', 'info', `adb shell: ~$ ${cliInput}`);
    
    setTimeout(() => {
      if (cmd.includes('shizuku') && cmd.includes('start')) {
        setShizukuState('running');
        onAddLog('Shizuku', 'success', 'Successfully established Shizuku user binder daemon (v13.5.0).');
      } else if (cmd.includes('stop') || cmd.includes('terminate')) {
        setShizukuState('terminated');
        onAddLog('Shizuku', 'warn', 'Shizuku daemon received SIGTERM. Connection binding interrupted.');
      } else if (cmd.includes('dumpsys') || cmd.includes('diag')) {
        onAddLog('Binder', 'success', 'Dumpsys diagnostics: binder services=1 active, package=com.catmouse.pro PID=12401');
      } else if (cmd.includes('help')) {
        onAddLog('ADB', 'info', 'Supported CMD simulator: "shizuku start", "shizuku stop", "dumpsys", "clear".');
      } else {
        onAddLog('ADB', 'error', `Command output: "/system/bin/sh: ${cliInput}: not found". Try entering "help" for a list of simulated commands.`);
      }
    }, 400);

    setCliInput('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Setup Companion Guide & Interactive ADB Cheatsheet */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        
        {/* Connection Diagnostics Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5.5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black font-sans uppercase tracking-wider text-zinc-300">Shizuku diagnostics</h3>
            <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              shizukuState === 'running' 
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${shizukuState === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {shizukuState === 'running' ? 'BOUND - REGISTERED' : 'SERVICE OFFLINE'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl flex flex-col gap-1 items-center text-center">
              <Server className="w-4 h-4 text-zinc-500" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">BINDER SERVICE</span>
              <span className="text-xs font-black text-zinc-200">com.catmouse</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl flex flex-col gap-1 items-center text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">SANDBOX STATUS</span>
              <span className="text-xs font-black text-emerald-400">ISOLATED SECURE</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-850 p-3 rounded-xl flex flex-col gap-1 items-center text-center">
              <HardDrive className="w-4 h-4 text-zinc-500" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase font-mono tracking-wider">API SECTOR</span>
              <span className="text-xs font-black text-zinc-200">API LEVEL 34</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
            Shizuku utilizes Android Binder callbacks to trigger secure inputs and draw screen overlays directly. This is fully secure as all actions are processed on-device and run without rooting the host hardware.
          </div>
        </div>

        {/* STEP BY STEP WIRELESS SETUP GUIDE */}
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-5.5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">Wireless debugging & Shizuku activation GUIDE</h3>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {SHIZUKU_ADB_GUIDE.map((g, index) => (
              <div key={`guide-${index}`} className="flex gap-3 bg-[#0a0a0b]/30 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition">
                <span className="w-6 h-6 rounded-full bg-[#0a0a0b] border border-white/10 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 text-indigo-400 shadow-sm">
                  0{index + 1}
                </span>
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-xs font-bold text-gray-200 leading-tight">{g.title}</h4>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-400">
                    {g.steps.map((s, sIdx) => (
                      <li key={`step-${sIdx}`} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ADB commands cheat sheet and REALTIME BINDER LOGS TERMINAL */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        
        {/* Command Cheatsheet Quick copy board */}
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-5.5 space-y-3.5 shadow-xl">
          <h3 className="text-sm font-semibold font-sans uppercase tracking-wider text-gray-200">ADB shell helper CHEATSHEET</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {ADB_TERMINAL_COMMANDS.map((tc, index) => (
              <div key={`sh-${index}`} className="bg-[#0a0a0b] border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3 group">
                <div className="space-y-1 overflow-hidden">
                  <div className="text-[10px] text-gray-400 font-semibold truncate uppercase tracking-tight">{tc.label}</div>
                  <code className="text-[11px] text-indigo-300 block font-mono truncate">{tc.command}</code>
                </div>
                <button
                  onClick={() => handleCopy(`cmd-${index}`, tc.command)}
                  className="p-2 shrink-0 bg-[#111114] hover:bg-white/5 hover:text-white border border-white/10 rounded-xl transition flex items-center justify-center text-gray-400"
                  id={`btn_copy_cmd_${index}`}
                >
                  {copiedId === `cmd-${index}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE BINDER CALL LOGS TERMINAL */}
        <div id="shizuku_logs_panel" className="bg-[#0a0a0b] rounded-2xl border border-white/5 flex flex-col overflow-hidden h-[340px] shadow-2xl">
          {/* Header */}
          <div className="bg-[#111114] px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs font-mono text-gray-400 select-none">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-gray-350 uppercase tracking-wider">shizuku binder stream logger</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onClearLogs}
                className="p-1 text-gray-500 hover:text-rose-400 hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Logs View Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] leading-relaxed select-text tracking-tight custom-scrollbar bg-black/60">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-1 opacity-70">
                <ShieldCheck className="w-8 h-8 opacity-40 animate-pulse text-gray-500" />
                <p>No Binder transaction history logs stream yet.</p>
                <p className="text-[10px]">Interact with the phone simulator or trigger profiles to bind traces!</p>
              </div>
            ) : (
              logs.map((log) => {
                const colors = {
                  info: 'text-gray-400',
                  warn: 'text-yellow-400/90',
                  error: 'text-rose-450 font-bold',
                  success: 'text-emerald-400',
                };
                
                return (
                  <div key={log.id} className="flex gap-2 items-start shrink-0 hover:bg-white/5 px-1 py-0.5 rounded transition">
                    <span className="text-gray-600 tracking-tighter shrink-0">[{log.timestamp}]</span>
                    <span className="text-gray-500 font-semibold tracking-tighter uppercase shrink-0 border border-white/5 px-1 py-[1px] rounded leading-none text-[8.5px]">
                      {log.source}
                    </span>
                    <span className={`${colors[log.level]} flex-1 break-all`}>
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* CLI input command row */}
          <form onSubmit={handleCliSubmit} className="border-t border-white/5 bg-[#111114] px-3 py-2 flex items-center gap-2">
            <span className="text-gray-550 font-mono text-xs select-none pl-1 font-bold">~$</span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="Enter helper commands: 'help', 'shizuku start', 'dumpsys'..."
              className="flex-1 bg-transparent border-0 ring-0 outline-none text-xs text-white placeholder-gray-600 font-mono py-1"
            />
            <button
              type="submit"
              className="p-1 px-2.5 bg-[#0a0a0b] hover:bg-white/5 border border-white/10 hover:border-white/20 text-[10px] font-bold text-gray-300 rounded-md transition select-none flex items-center justify-center"
            >
              <ChevronRight className="w-3 h-3 text-indigo-400" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
