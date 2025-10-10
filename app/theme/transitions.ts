/**
 * Transition timing configuration for theme transformations
 * Different durations for standard and reduced motion users
 */

export const TRANSITION_DURATION_STANDARD = 700; // ms
export const TRANSITION_DURATION_REDUCED = 2500; // ms

export const TRANSITION_EASING = 'ease-in-out';

export const TRANSITION_PROPERTIES = [
  'background-color',
  'color',
  'border-color',
  'box-shadow',
  'font-family',
  'font-weight',
  'text-shadow',
].join(', ');

