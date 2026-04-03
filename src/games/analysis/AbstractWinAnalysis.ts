/**
 * Abstract win analysis class - mainly serves to provide the class API but
 * we may want to add additional processing potentially.
 */

export default class AbstractWinAnalysis {
  run(profile: GameProfile, resultWindow: GameResultWindow, stake: number): AnalysisRunResult {
    return {win: 0, awards: []};
  }
}