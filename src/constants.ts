/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Profile, OverlayTemplate, InputDevice, PresetStoreItem } from './types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p-1',
    name: 'FPS Fast Trigger Mode',
    description: 'Binds secondary actions to screen hotspots. Rapid double tap simulation for weapon switching and crouch-sliding.',
    icon: 'Swords',
    category: 'game',
    isActive: true,
    actions: [
      { id: 'act-1', type: 'tap', label: 'Aim Button Hotspot', x: 82, y: 35, delayMs: 100 },
      { id: 'act-2', type: 'delay', label: 'Stabilization Wait', delayMs: 150 },
      { id: 'act-3', type: 'tap', label: 'Rapid Crouch Fire', x: 90, y: 72, delayMs: 50 },
      { id: 'act-4', type: 'swipe', label: 'Slide Retreat Gesture', x: 25, y: 75, xEnd: 15, yEnd: 75, delayMs: 200 }
    ]
  },
  {
    id: 'p-2',
    name: 'TikTok Auto Scroller',
    description: 'Provides hands-free browsing. Simulates upward swipes periodically with a standard pause for video duration.',
    icon: 'ScrollText',
    category: 'utility',
    isActive: false,
    actions: [
      { id: 'act-5', type: 'swipe', label: 'Next Video Swipe', x: 50, y: 80, xEnd: 50, yEnd: 20, delayMs: 400 },
      { id: 'act-6', type: 'delay', label: 'Post-Scroll Wait (12s)', delayMs: 12000 }
    ]
  },
  {
    id: 'p-3',
    name: 'Tesla HUD Cruise companion',
    description: 'Auto-activates on vehicle OBD adapter bind. Launches navigation and places a transparent speed widget overlay.',
    icon: 'Car',
    category: 'vehicle',
    isActive: false,
    actions: [
      { id: 'act-7', type: 'launch', label: 'Open Google Maps App', packageName: 'com.google.android.apps.maps', delayMs: 1500 },
      { id: 'act-8', type: 'delay', label: 'Await Map Stabilization', delayMs: 2000 },
      { id: 'act-9', type: 'key', label: 'Press Media Play Key', keyCode: 'MediaPlay', delayMs: 300 }
    ]
  }
];

export const INITIAL_OVERLAYS: OverlayTemplate[] = [
  {
    id: 'ov-1',
    name: 'Stealth Spark pointer',
    type: 'cursor',
    scale: 1.2,
    opacity: 0.9,
    color: '#38bdf8', // Light blue
    x: 48,
    y: 35,
    settings: {
      cursorSkin: 'neon_spark'
    }
  },
  {
    id: 'ov-2',
    name: 'Valorant Bracket Crosshair',
    type: 'crosshair',
    scale: 1.0,
    opacity: 0.85,
    color: '#4ade80', // Green
    x: 50,
    y: 50,
    settings: {
      crosshairStyle: 'bracket',
      crosshairSize: 42
    }
  },
  {
    id: 'ov-3',
    name: 'Chrono Sport speed HUD',
    type: 'speedometer',
    scale: 1.1,
    opacity: 0.95,
    color: '#f43f5e', // Rose / Red
    x: 50,
    y: 12,
    settings: {
      speedometerMax: 160,
      speedometerUnit: 'kmh',
      hudTheme: 'sport'
    }
  },
  {
    id: 'ov-4',
    name: 'Macro Quick Actions Pad',
    type: 'macro_pad',
    scale: 0.9,
    opacity: 0.8,
    color: '#eab308', // Amber
    x: 10,
    y: 40,
    settings: {
      macroPadButtonsCount: 4
    }
  }
];

export const INITIAL_DEVICES: InputDevice[] = [
  {
    id: 'dev-1',
    name: 'Razer Orochi V2 (ADB virtual)',
    type: 'mouse',
    status: 'connected',
    battery: 88,
    pointerSpeed: 1.4,
    acceleratorOn: true,
    activeProfileId: 'p-1'
  },
  {
    id: 'dev-2',
    name: 'DualSense Wireless Gamepad',
    type: 'gamepad',
    status: 'connected',
    battery: 65,
    pointerSpeed: 1.0,
    acceleratorOn: false
  },
  {
    id: 'dev-3',
    name: 'Vehicle Bluetooth OBD Adaptor',
    type: 'wheel',
    status: 'disconnected',
    battery: 100,
    pointerSpeed: 0.8,
    acceleratorOn: false,
    activeProfileId: 'p-3'
  }
];

export const PRESET_STORE: PresetStoreItem[] = [
  {
    id: 'store-1',
    name: 'Apex Super Slide-Jump',
    description: 'Perfect tactical move sequence for apex gaming. Swipes crouch and taps jump with exact frames spacing.',
    author: 'WraithMain_99',
    downloads: 4105,
    category: 'game',
    type: 'profile',
    icon: 'Swords',
    rating: 4.8,
    data: {
      actions: [
        { id: 's1-a1', type: 'tap', label: 'Crouch Hold', x: 88, y: 80, delayMs: 80 },
        { id: 's1-a2', type: 'swipe', label: 'Sprint Forward', x: 18, y: 70, xEnd: 18, yEnd: 45, delayMs: 120 },
        { id: 's1-a3', type: 'tap', label: 'Immediate Jump', x: 92, y: 55, delayMs: 50 }
      ]
    }
  },
  {
    id: 'store-2',
    name: 'Retro 8-Bit Cat Paw Cursor',
    description: 'A beautiful pixelated orange cat paw cursor overlay that sparkles when clicking.',
    author: 'NekoDev',
    downloads: 1284,
    category: 'custom',
    type: 'overlay',
    icon: 'Pointer',
    rating: 4.9,
    data: {
      type: 'cursor',
      scale: 1.3,
      opacity: 0.95,
      color: '#f97316',
      settings: {
        cursorSkin: 'cat_paw'
      }
    }
  },
  {
    id: 'store-3',
    name: 'Minimal HUD Speed Dial',
    description: 'An elegant dashboard overlay featuring a circular speedometer widget and track details, great for night driving.',
    author: 'AutoGeek_EU',
    downloads: 940,
    category: 'vehicle',
    type: 'overlay',
    icon: 'Gauge',
    rating: 4.6,
    data: {
      type: 'speedometer',
      scale: 1.15,
      opacity: 0.9,
      color: '#10b981',
      settings: {
        speedometerMax: 120,
        speedometerUnit: 'mph',
        hudTheme: 'minimalist'
      }
    }
  },
  {
    id: 'store-4',
    name: 'Instagram Auto-Heart Spammer',
    description: 'Double taps the center screen with custom organic delay variations to avoid trigger blocklists.',
    author: 'GrowthHacker',
    downloads: 3200,
    category: 'utility',
    type: 'profile',
    icon: 'Heart',
    rating: 4.2,
    data: {
      actions: [
        { id: 's4-a1', type: 'tap', label: 'Like Hotspot A', x: 50, y: 45, delayMs: 70 },
        { id: 's4-a2', type: 'delay', label: 'Fast Interlude', delayMs: 95 },
        { id: 's4-a3', type: 'tap', label: 'Like Hotspot B', x: 50, y: 45, delayMs: 300 }
      ]
    }
  }
];

export const SHIZUKU_ADB_GUIDE = [
  {
    title: 'Enable Developer Options',
    steps: [
      'Go to Android Settings > About Phone.',
      'Tap on "Build Number" 7 times until you see the notification "You are now a developer!".'
    ]
  },
  {
    title: 'Wireless Debugging Authorization',
    steps: [
      'Go to Settings > System > Developer Options.',
      'Turn on "Wireless Debugging" (requires Wi-Fi connection).',
      'Select "Pair device with pairing code". Note the port and 6-digit numeric secure code.'
    ]
  },
  {
    title: 'Acknowledge Shizuku Binder Service',
    steps: [
      'Open the Shizuku App on your phone.',
      'Tap "Pairing" and enter the pairing code from developer options.',
      'Go back to Shizuku main screen and tap "Start" to boot the service via ADB.'
    ]
  },
  {
    title: 'Grant Cat Mouse Pro Permission',
    steps: [
      'Launch the Cat Mouse Pro app on your device.',
      'You will receive an overlay permission request prompting: "Allow Cat Mouse Pro to access Shizuku?".',
      'Select "Allow - Always" to authorize system level input injection and screen overlay services.'
    ]
  }
];

export const ADB_TERMINAL_COMMANDS = [
  {
    label: 'Start Shizuku Service via Standard ADB',
    command: 'adb shell sh /sdcard/Android/data/rikka.shizuku/files/start.sh'
  },
  {
    label: 'Manually Bind Cat Mouse Core Server',
    command: 'adb shell CLASSPATH=/data/local/tmp/catmouse.jar app_process /data/local/tmp com.catmouse.core.Server'
  },
  {
    label: 'Force Terminate All Background Overlays',
    command: 'adb shell am force-stop com.catmouse.pro.overlay'
  },
  {
    label: 'Fetch Binder Diagnostic Details',
    command: 'adb shell dumpsys activity service com.catmouse.pro'
  }
];
