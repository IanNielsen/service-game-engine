import { getSessionById } from "../../session/index.js";
import { getPlayer } from "../../player/index.js";
import { getGame } from "../../games";
import { ERRORS, getError } from "../../errors/index.js";

export function play(params: PlayParams): PlayResponse | ErrorResponse {

  const session = getSessionById(params.sessionId);

  if (!session) {
    return getError(ERRORS.INVALID_SESSION);
  }

  const player = getPlayer(session.playerId);

  if (!player) {
    return getError(ERRORS.PLAYER_NOT_FOUND);
  }

  const game = getGame(session.gameId);

  if (!game) {
    return getError(ERRORS.GAME_NOT_FOUND);
  }

  // debit the stake from the players wallet
  try {
    player.debit(params.stake);
  }
  catch (error) {
    return getError(ERRORS.INSUFFICIENT_FUNDS);
  }

  try {
    // play the round
    const roundDetails = game.play(params.stake)

    // credit any winnings
    if (roundDetails.payout.payout > 0) {
      player.credit(roundDetails.payout.payout);
    }

    // return the result
    return {
      sessionId: session.sessionId,
      balance: player.getBalance(),
      roundDetails: roundDetails
    }
  }
  catch (error) {
    return getError(ERRORS.INVALID_BET);
  }
}