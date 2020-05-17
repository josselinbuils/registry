import { Registry } from './Registry';

declare global {
  interface Window {
    registry?: Registry;
  }
}
