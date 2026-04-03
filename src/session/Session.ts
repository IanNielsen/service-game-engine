/**
 * Class allowing encapsulation of session data
 */
export class Session {
  sessionId: string;
  playerId: string;
  gameId: string;
  currency: string;
  sessionStart: number;
  roundDetails?: RoundDetails;

  constructor(params: { playerId: string, gameId: string, currency: string }) {

    if (!params || !params.playerId || !params.gameId || !params.currency) {
      throw new Error("Invalid session parameters");
    }

    this.sessionId = crypto.randomUUID();
    this.playerId = params.playerId;
    this.gameId = params.gameId;
    this.currency = params.currency;
    this.sessionStart = Date.now();
  }

  setRoundDetails(roundDetails: RoundDetails) {
    this.roundDetails = roundDetails;
  }

  getRoundDetails(): RoundDetails | undefined {
    return this.roundDetails;
  }
}