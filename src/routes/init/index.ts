import { getPlayer } from "../../player";
import { getGame } from "../../games";
import { createSession } from "../../session";
import { ERRORS, getError } from "../../errors";

export function init(params: InitParams): InitResponse | ErrorResponse {

  const token = params.token;

  try {
    const session = createSession(token, params.gameId, params.currency);

    const player = getPlayer(session.playerId);
    const game = getGame(session.gameId);

    if (!player) {
      return getError(ERRORS.PLAYER_NOT_FOUND);
    }

    if (!game) {
      return getError(ERRORS.GAME_NOT_FOUND);
    }

    return {
      sessionId: session.sessionId,
      currency: params.currency,
      balance: player.getBalance() || 0,
      stakes: game.getStakes(),
      gameConfig: game.getGameConfig(),
      roundDetails: session.getRoundDetails()
    }
  }
  catch (error) {
    return getError(ERRORS.INVALID_SESSION);
  }
}