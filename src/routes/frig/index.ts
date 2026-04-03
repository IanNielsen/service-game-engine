import { setFrig, clearFrigs } from "../../rng";

export function add(frig: string) {
  setFrig(frig);
}

export function clear() {
  clearFrigs();
}