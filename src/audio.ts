let context: AudioContext | undefined;

export function playTone(kind: 'plant' | 'error' | 'win', enabled: boolean): void {
  if (!enabled) return;
  context ??= new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = kind === 'error' ? 'triangle' : 'sine';
  oscillator.frequency.value = kind === 'win' ? 660 : kind === 'error' ? 150 : 430;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + (kind === 'win' ? 0.38 : 0.16));
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + (kind === 'win' ? 0.4 : 0.18));
}
