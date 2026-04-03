import config from "./config";
import AbstractSlotGame from "./models/AbstractSlotGame";

const gameInstances = new Map<string, any>();

export function initialiseGameModels() {

  config.games.forEach(({ id, gameClass, gameProfile }) => {

    const gameInstance = new gameClass(gameProfile);

    gameInstances.set(id, gameInstance);
  });
}

export function getGame(gameId: string): AbstractSlotGame | undefined {
  return gameInstances.get(gameId);   // assume handling if the models are not yet initialised
}
