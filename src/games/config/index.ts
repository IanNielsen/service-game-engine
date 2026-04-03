/**
 * Game config mapping of profiles to models to allow models to be reused across games
 */
import models from "../models";
import profiles from "../profiles";

export default {
  games: [{
    id: "classic-fruity",
    gameClass: models.AbstractSlotGame,
    gameProfile: profiles.ClassicFruity
  }, {
    id: "classic-fruity-frenzy",
    gameClass: models.AbstractSlotGame,
    gameProfile: profiles.ClassicFruityWinFrenzy
  }, {
    id: "sunset-reels",
    gameClass: models.AbstractSlotGame,
    gameProfile: profiles.SunsetReels96
  }]
}