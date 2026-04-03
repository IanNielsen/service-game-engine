/**
 * Generates a random number for the game results.
 * 
 * Also allows us to pass frigs and force specific results.
 */
import { randomInt } from "crypto";

const forceCodes: number[] = [];

export function setFrig(frig: string | number[]) {
  if (typeof frig === "string") {
    frig = frig.split(",").map(i => Number(i));
  }

  frig.forEach(i => forceCodes.push(i));
}

export function clearFrigs() {
  forceCodes.length = 0;
}

export function getRng(length: number) {
  return forceCodes.shift() ?? randomInt(length);
}