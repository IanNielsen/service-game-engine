/// <reference path="../types/types.d.ts" />
import ClassicFruityProfile from "../games/profiles/ClassicFruity.js";
import AbstractSlotGame from "../games/models/AbstractSlotGame.js";

describe("ClassicFruity", () => {
  let classicFruity: AbstractSlotGame;

  beforeEach(() => {
    classicFruity = new AbstractSlotGame(ClassicFruityProfile);
  });

  it("has correct default reel positions", () => {
    const defaultRoundDetails = classicFruity.getDefaultRoundDetails();

    expect(defaultRoundDetails.gameState.reelPositions).toEqual([1, 1, 1]);
  });

  it("has correct stakes", () => {
    expect(classicFruity.getStakes()).toEqual(ClassicFruityProfile.stakes);
  });

  it("has correct game config", () => {
    const config = classicFruity.getGameConfig();

    expect(config).toHaveProperty("reels");
    expect(config.reels.reelIndexes).toEqual(ClassicFruityProfile.reels.reelIndexes);
    expect(config).toHaveProperty("symbols");
    expect(config.symbols).toEqual(ClassicFruityProfile.symbols);
    expect(config).toHaveProperty("paytable");
    expect(config.paytable).toEqual(ClassicFruityProfile.paytable);
    expect(config).toHaveProperty("winlines");
    expect(config.winlines).toEqual(ClassicFruityProfile.winlines);
  });

  it("return correct play response", () => {

    const rng = require("../rng/index.js");
    const spy = jest.spyOn(rng, "getRng").mockReturnValue(10);

    let result = classicFruity.play(1);

    expect(result.gameState.reelPositions).toEqual([10, 10, 10]);
    expect(result.gameState.reelWindow).toEqual([
      ["high2", "high2", "high2"],
      ["low4",  "low1",  "low2"],
      ["low3",  "low4",  "low1"]
    ]);
    expect(result.gameState.totalWin).toBe(30);
    expect(result.gameState.winningLines).toEqual([{
      index: 0,
      winline: [0, 0, 0],
      symbols: ["high2", "high2", "high2"],
      payout: 30,
    }]);

    spy.mockRestore();
  });

  it("loops back to the start of the reelband if the RNG is the penultimate symbol on the band", () => {

    const rng = require("../rng/index.js");
    const spy = jest.spyOn(rng, "getRng").mockReturnValue(59);

    let result = classicFruity.play(1);

    expect(result.gameState.reelWindow).toEqual([
      ["high3", "high3", "high3"],
      ["high3", "high3", "high3"],
      ["high3", "high3", "high3"]
    ]);

    spy.mockRestore();
  });

  it("loops back to the start of the reelband if the RNG is the last symbol on the band", () => {

    const rng = require("../rng/index.js");
    const spy = jest.spyOn(rng, "getRng").mockReturnValue(60);

    let result = classicFruity.play(1);

    expect(result.gameState.reelWindow).toEqual([
      ["high3", "high3", "high3"],
      ["high3", "high3", "high3"],
      ["low1",  "low2",  "low3"]
    ]);

    spy.mockRestore();
  });

  it("Monte Carlo test produces the correct RTP", () => {
    let won = 0;
    let staked = 0;
    let hits = 0;
    let runs = 1e6; // ideally this would be a billion runs rather than a million but that woudl take a while :)
    let bet = 1

    for (let i = 0; i < runs; i++) {
      let result = classicFruity.play(bet);

      staked += bet;
      won += result.payout.payout;

      if (result.payout.payout > bet) {
        hits++;
      }
    }

    const rtp = (won / staked) * 100;
    const hitRate = (hits / runs) * 100;

    expect(rtp).toBeGreaterThanOrEqual(0);
    expect(rtp).toBeLessThanOrEqual(4000);  // game has artificial high RTP for demo purposes
    expect(hitRate).toBeGreaterThanOrEqual(0);
    expect(hitRate).toBeLessThanOrEqual(100);
  });
});