import AbstractWinAnalysis from "./AbstractWinAnalysis";
import WinlineReelAnalysis from "./WinlineReelAnalysis";

function analyseWin (profile: GameProfile, resultWindow: GameResultWindow, stake: number): AnalysisRunResult {

    const winlineAnalyser = new WinlineReelAnalysis();
    const winlinesResult = winlineAnalyser.run(profile, resultWindow, stake);
    const awards = winlinesResult.awards;

    let winlinePayout = winlinesResult.win ?? 0;
    let win = winlinePayout;

    const winlineAward = awards.find((award): award is WinlineAward => award.name === "winlines");

    if(winlinePayout > 0 && winlineAward && winlineAward.lines.length === profile.winlines.length) {
      win += winlinePayout;

      awards.push({name: "fullHouseDouble" as const, payout: winlinePayout});
    }

    return {win, awards};
}

export default class FullHouseDoubleAnalysis extends AbstractWinAnalysis {
  run(profile: GameProfile, resultWindow: GameResultWindow, stake: number): AnalysisRunResult {
    return analyseWin(profile, resultWindow, stake);
  }
}
