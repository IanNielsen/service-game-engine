import AbstractWinAnalysis from "./AbstractWinAnalysis";

/**
 * Analyses the result window to validate if there are any winning lines (3OAK)
 */
function analyseWin (profile: GameProfile, resultWindow: GameResultWindow, stake: number) {
    const winningLines: WinlineResult[] = [];
    const winlineCount = profile.winlines;
    const paytable = profile.paytable;

    let total = 0;
    let awards = [];

    winlineCount.forEach((winline: number[], index: number) => {

      const winlineSymbols = winline.map((position: number, reel: number) => resultWindow[reel][position]);

      if (winlineSymbols.every((symbol: string) => symbol === winlineSymbols[0])) {

        const payout = paytable[winlineSymbols[0]] * stake;

        winningLines.push({
          index: index,
          winline: winline,
          symbols: winlineSymbols,
          payout: payout
        });

        total += payout;
      }
    });

    if(winningLines.length > 0) {
      awards.push({name: "winlines" as const, payout: total, lines: winningLines});
    }

    return {win: total, awards};
}

export default class WinlineReelAnalysis extends AbstractWinAnalysis {
  run(profile: GameProfile, resultWindow: GameResultWindow, stake: number): AnalysisRunResult {
    return analyseWin(profile, resultWindow, stake);
  }
}