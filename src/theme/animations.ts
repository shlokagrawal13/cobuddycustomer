export const Durations = {instant: 0, fast: 150, normal: 250, slow: 400, slower: 600} as const;
export const Easings = {
  linear: [0, 0, 1, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  spring: {damping: 20, stiffness: 200, mass: 1},
  springBouncy: {damping: 14, stiffness: 180, mass: 1},
} as const;
export const AnimationConfig = {
  tabSwitch: {duration: 150},
  screenTransition: {duration: 250},
  modalPresent: {duration: 400},
  fadeIn: {duration: 250},
  microInteraction: {duration: 150},
} as const;
