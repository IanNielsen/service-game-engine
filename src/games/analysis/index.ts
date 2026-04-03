import WinlineAnalysis from "./WinlineReelAnalysis";
import FullHouseDoubleAnalysis from "./FullHouseDoubleAnalysis";

const analyserMap: Record<string, WinAnalysisConstructor> = {
  "winline": WinlineAnalysis,
  "full-house-double": FullHouseDoubleAnalysis
}

export function createWinAnalyser(analyserName: string) {
  return new analyserMap[analyserName];
}