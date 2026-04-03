/**
 * Basic game model for a simple slot game
 */
import { getRng } from "../../rng";
import { createWinAnalyser } from "../analysis";
import AbstractWinAnalysis from "../analysis/AbstractWinAnalysis";

export default class AbstractSlotGame {
  protected profile: any;

  constructor(profile: any) {
    this.profile = profile;
  }

  /**
   * Generates play repsonse
   */
  play(stake: number): RoundDetails {

    if (!this.profile.stakes.includes(stake)) {
      throw new Error("Invalid stake amount");
    }

    const result = this.generateResult(stake);

    return {
      resolved: true,
      gameState: {
        reelPositions: result.reelPositions,
        reelWindow: result.reelWindow,
        awards: result.awards,
        totalWin: result.win
      },
      payout: {
        stake: stake,
        payout: result.win
      }
    };
  }

  getStakes(): number[] {
    return this.profile.stakes || [];
  }

  getGameConfig() {
    return {
      reels: this.profile.reels,
      symbols: this.profile.symbols,
      paytable: this.profile.paytable,
      winlines: this.profile.winlines
    }
  }

  /**
   * Gets a default round details object when initialising with a fresh player
   */
  getDefaultRoundDetails(): RoundDetails {
    const reelWindowIndexes = this.getReelWindowIndexes(this.profile.defaultReelPositions);

    return {
      resolved: true,
      gameState: {
        reelPositions: this.profile.defaultReelPositions.slice(),
        reelWindow: this.getReelWindow(reelWindowIndexes),
        awards: [],
        totalWin: 0,
      },
      payout: {
        stake: this.profile.stakes[this.profile.defaultStakeIndex],
        payout: 0
      }
    }
  }

  private getReelWindowIndexes(reelPositions: number[]): number[][] {
    const reels = this.profile.reels;

    return reelPositions.map((position: number, reel: number) =>
      this.getReelWindowSymbolIndexes(reels.reelIndexes[reel], position, reels.lengths[reel]));
  }

  private getReelWindowSymbolIndexes(reelBand: number[], index: number, length: number): number[] {
    let symbols = reelBand.slice(index, index + length);

    if (symbols.length < length) {
      symbols = symbols.concat(this.getReelWindowSymbolIndexes(reelBand, 0, length - symbols.length));
    }

    return symbols;
  }

  private getReelWindow(reelWindowSymbolIndexes: number[][]): string[][] {
    const symbols = this.profile.symbols;

    return reelWindowSymbolIndexes.map((symbolIndexes: number[], reel: number) =>
      symbolIndexes.map((symbolIndex: number) => symbols[symbolIndex])
    );
  }

  private generateResult(stake: number): any {
    const reels = this.profile.reels;

    let totalWin = 0;

    // generate random reel positions for each reel
    const reelPositions = reels.reelIndexes.map((reel: number[]) => getRng(reel.length));

    // get the reel symbol indexes for each reel
    const reelWindowSymbolIndexes = this.getReelWindowIndexes(reelPositions);

    // convert from indexes to symbols (we could shortcut some of these steps to decrease the number of
    // loops but this gives a clearer explaination of what's happeneing
    const reelWindow = this.getReelWindow(reelWindowSymbolIndexes);

    // run the win analysis to see if we have a win on any of the winlines
    const result = this.runWinAnalysis(reelWindow, stake);

    return {
      reelPositions: reelPositions,
      reelWindow: this.transposeReelWindow(reelWindow),   // reel window should be per line
      awards: result.awards,
      win: result.win
    }
  }

  // swaps a reel by reel array to a line by line array
  private transposeReelWindow(reelPositions: string[][]): string[][] {
    const maxLen = Math.max(...reelPositions.map(reel => reel.length)); // in case we get a reel window with unequal legnth reels

    return Array.from({ length: maxLen }, (_, symbol) =>
      reelPositions.flatMap(reel => reel[symbol] !== undefined ? [reel[symbol]] : [])
    );
  }

  private runWinAnalysis(reelWindow: string[][], stake: number): WinAnalysisResult {
    const analyser = createWinAnalyser(this.profile.winAnalysis);
    const result = analyser.run(this.profile, reelWindow, stake);

    return {
      awards: result.awards,
      win: result.win
    }
  }
}
