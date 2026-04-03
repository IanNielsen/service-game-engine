/**
 * Simple session management - the server is intended for dev purposes so I've not gone overboard here
 */
import { createPlayer } from "../player";
import { getGame } from "../games";
import { Session } from "./Session";

const tokenToSessionMap = new Map<string, Session>();
const sessionIdToSessionMap = new Map<string, Session>();

function isValidToken(token: string): boolean {
  // assume we validate the token against operator API
  return true;
}

function createNewSession(token: string, gameId: string, currency: string): Session {
  const player = createPlayer(1000);    // assume we get the player profile from the operator API when validating the token 
  const session = new Session({ playerId: player.getPlayerId(), gameId, currency });
  const roundDetails = getGame(gameId)?.getDefaultRoundDetails();

  if (roundDetails) {
    session.setRoundDetails(roundDetails);
  }

  tokenToSessionMap.set(token, session);
  sessionIdToSessionMap.set(session.sessionId, session);

  return session;
}

function getSessionByToken(token: string): Session | undefined {
  let session = tokenToSessionMap.get(token);

  return sessionIdToSessionMap.get(session?.sessionId || "");
}

export function createSession(token: string, gameId: string, currency: string): Session {

  if (!isValidToken(token)) {
    throw new Error("Invalid token");
  }

  return getSessionByToken(token) || createNewSession(token, gameId, currency);
}

export function getSessionById(sessionId: string): Session | undefined {
  return sessionIdToSessionMap.get(sessionId);
}

// Store the round details against the session so we can reset the game to the player's last bet
export function setRoundDetailsForSession(sessionId: string, roundDetails: RoundDetails) {
  const session = sessionIdToSessionMap.get(sessionId);

  if (session) {
    session.setRoundDetails(roundDetails);
  }
}

export function clearSessions() {
  sessionIdToSessionMap.clear();
  tokenToSessionMap.clear();
}