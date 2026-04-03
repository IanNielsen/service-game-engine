import { Player } from "./Player";

const players = new Map<string, Player>();

export function createPlayer(initialBalance: number): Player {
  const player = new Player(initialBalance);

  players.set(player.getPlayerId(), player);

  return player;
}

export function getPlayer(playerId: string): Player | undefined {
  return players.get(playerId);
}