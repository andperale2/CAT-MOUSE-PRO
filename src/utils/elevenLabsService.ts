/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ELEVENLABS_VOICE_ID } from '../data/animeLiveActionGuide';

export interface TTSOptions {
  apiKey?: string;
  voiceId?: string;
  text: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onSubtitleProgress?: (currentText: string, percentage: number) => void;
}

class ElevenLabsTTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private progressInterval: any = null;

  public async speak({
    apiKey,
    voiceId = ELEVENLABS_VOICE_ID,
    text,
    onStart,
    onEnd,
    onError,
    onSubtitleProgress,
  }: TTSOptions): Promise<void> {
    this.stop();

    this.isPlaying = true;
    if (onStart) onStart();

    // If API key is available, try ElevenLabs TTS API
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': apiKey.trim(),
            },
            body: JSON.stringify({
              text,
              model_id: 'eleven_multilingual_v2',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`ElevenLabs API Error: status ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.startProgressTracker(text, audio.duration || 10, onSubtitleProgress);
        };

        audio.onended = () => {
          this.cleanup();
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          this.cleanup();
          if (onError) onError(e);
          // Fallback to browser Web Speech API
          this.speakWebSpeech(text, onEnd, onError, onSubtitleProgress);
        };

        await audio.play();
        return;
      } catch (error) {
        console.warn('ElevenLabs API call failed, falling back to Web Speech API', error);
      }
    }

    // Fallback: Web Speech API (speechSynthesis)
    this.speakWebSpeech(text, onEnd, onError, onSubtitleProgress);
  }

  private speakWebSpeech(
    text: string,
    onEnd?: () => void,
    onError?: (err: any) => void,
    onSubtitleProgress?: (currentText: string, percentage: number) => void
  ) {
    if (!('speechSynthesis' in window)) {
      if (onError) onError(new Error('Speech Synthesis not supported in this browser.'));
      if (onEnd) onEnd();
      this.isPlaying = false;
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.lang = 'es-MX'; // Latin American Spanish preference
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang.startsWith('es-MX') || v.lang.startsWith('es'));
    if (esVoice) {
      utterance.voice = esVoice;
    }

    let charLength = text.length;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const progress = Math.min(100, Math.round((charIndex / charLength) * 100));
        const sub = text.substring(0, Math.min(text.length, charIndex + 25));
        if (onSubtitleProgress) onSubtitleProgress(sub, progress);
      }
    };

    utterance.onend = () => {
      this.cleanup();
      if (onSubtitleProgress) onSubtitleProgress(text, 100);
      if (onEnd) onEnd();
    };

    utterance.onerror = (err) => {
      this.cleanup();
      if (onError) onError(err);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);

    // Fallback progress simulation for browsers without boundary events
    const estimatedSecs = Math.max(3, text.length * 0.06);
    this.startProgressTracker(text, estimatedSecs, onSubtitleProgress);
  }

  private startProgressTracker(
    fullText: string,
    durationSecs: number,
    onSubtitleProgress?: (currentText: string, percentage: number) => void
  ) {
    if (this.progressInterval) clearInterval(this.progressInterval);

    let elapsed = 0;
    const intervalMs = 200;
    const totalMs = durationSecs * 1000;

    this.progressInterval = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      const charCount = Math.round((fullText.length * pct) / 100);
      const sub = fullText.substring(0, charCount);

      if (onSubtitleProgress) onSubtitleProgress(sub, pct);

      if (pct >= 100) {
        clearInterval(this.progressInterval);
      }
    }, intervalMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.cleanup();
  }

  private cleanup() {
    this.isPlaying = false;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const ttsService = new ElevenLabsTTSService();
