/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActionType = 'tap' | 'swipe' | 'delay' | 'key' | 'launch';

export interface AutomationAction {
  id: string;
  type: ActionType;
  label: string;
  x?: number; // 0-100 relative to screen width
  y?: number; // 0-100 relative to screen height
  xEnd?: number;
  yEnd?: number;
  delayMs?: number;
  keyCode?: string;
  packageName?: string;
}

export type ProfileCategory = 'game' | 'utility' | 'vehicle' | 'custom';

export interface Profile {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ProfileCategory;
  actions: AutomationAction[];
  isActive?: boolean;
}

export type OverlayType = 'cursor' | 'crosshair' | 'speedometer' | 'macro_pad' | 'hud_gauges';

export interface OverlayTemplate {
  id: string;
  name: string;
  type: OverlayType;
  scale: number; // 0.5 - 2.0
  opacity: number; // 0.1 - 1.0
  color: string;
  x: number; // 0-100 relative X position
  y: number; // 0-100 relative Y position
  settings: {
    cursorSkin?: 'classic' | 'neon_spark' | 'cat_paw' | 'stealth_pointer';
    crosshairStyle?: 'dot' | 'circle_dot' | 'reflex' | 'bracket';
    crosshairSize?: number;
    speedometerMax?: number;
    speedometerUnit?: 'kmh' | 'mph';
    hudTheme?: 'cyber' | 'sport' | 'classic_car' | 'minimalist';
    macroPadButtonsCount?: number;
  };
}

export interface InputDevice {
  id: string;
  name: string;
  type: 'mouse' | 'keyboard' | 'gamepad' | 'wheel';
  status: 'connected' | 'disconnected';
  battery: number;
  pointerSpeed: number;
  acceleratorOn: boolean;
  activeProfileId?: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  source: 'Binder' | 'Shizuku' | 'Overlay' | 'ADB' | 'OBD' | 'Cloud';
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface PresetStoreItem {
  id: string;
  name: string;
  description: string;
  author: string;
  downloads: number;
  category: ProfileCategory;
  type: 'profile' | 'overlay';
  icon: string;
  rating: number;
  data: any;
}
