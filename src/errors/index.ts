/**
 * Constants for error messages etc
 */
const errorMessages = {
  INVALID_TOKEN: { error: "001", message: "Invalid token" },
  PLAYER_NOT_FOUND: { error: "002", message: "Player not found" },
  GAME_NOT_FOUND: { error: "003", message: "Game not found" },
  INVALID_SESSION: { error: "004", message: "Invalid session" },
  INVALID_BET: { error: "005", message: "Invalid bet" },
  INSUFFICIENT_FUNDS: { error: "006", message: "Insufficient funds" }
}

export const ERRORS = {
  INVALID_TOKEN: "INVALID_TOKEN",
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
  GAME_NOT_FOUND: "GAME_NOT_FOUND",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_BET: "INVALID_BET",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS"
}

export function getError(error: string) {
  return errorMessages[error as keyof typeof errorMessages] || { error: "000", message: "Unknown error" };
}