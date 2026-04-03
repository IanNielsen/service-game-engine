import AbstractSlotGame from "../games/models/AbstractSlotGame.js";

const mockProfile = {
  stakes: [1, 2, 5],
  reels: {
    lengths: [3, 3, 3],
    reelIndexes: [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ],
  },
  symbols: ["A", "B", "C"],
  paytable: { A: 10, B: 20, C: 30 },
  winlines: [
    [0, 0, 0],
    [1, 1, 1],
    [2, 2, 2],
  ],
  defaultReelPositions: [0, 0, 0],
  defaultStakeIndex: 0,
};

describe("AbstractSlotGame", () => {
  let game: AbstractSlotGame;

  beforeEach(() => {
    game = new AbstractSlotGame(mockProfile);
  });

  describe("getStakes", () => {
    it("returns the stakes array from the profile", () => {
      expect(game.getStakes()).toEqual([1, 2, 5]);
    });
  });

  describe("getGameConfig", () => {
    it("returns reels, symbols, paytable and winlines", () => {
      const config = game.getGameConfig();

      expect(config.reels).toEqual(mockProfile.reels);
      expect(config.symbols).toEqual(mockProfile.symbols);
      expect(config.paytable).toEqual(mockProfile.paytable);
      expect(config.winlines).toEqual(mockProfile.winlines);
    });
  });

  describe("play", () => {
    it("throws error if the stake is not in the stake range", () => {
      expect(() => game.play(3)).toThrow("Invalid stake amount");
    });

    it("bet resolves with a valid stake", () => {
      const result = game.play(1);

      expect(result.resolved).toBe(true);
    });

    it("has the correct stake in the payout context", () => {
      const result = game.play(2);

      expect(result.payout.stake).toBe(2);
    });

    it("returns a valid payout", () => {
      const result = game.play(1);

      expect(result.payout.payout).toBeGreaterThanOrEqual(0);
    });

    it("returns correct number of reel positions", () => {
      const result = game.play(1);

      expect(result.gameState.reelPositions).toHaveLength(3);
    });

    it("returns a reel window with one column per reel", () => {
      const result = game.play(1);

      expect(result.gameState.reelWindow).toHaveLength(3);
    });

    it("returns a reel window with the correct length reel bands", () => {
      const result = game.play(1);

      result.gameState.reelWindow.forEach((reel: string[]) => {
        expect(reel).toHaveLength(3);
      });
    });

    it("totalWin matches the winline payouts values", () => {
      const result = game.play(1);
      const summedWin = result.gameState.winningLines.reduce(
        (total: number, winline: { payout: number }) => total + winline.payout,
        0
      );
      expect(result.gameState.totalWin).toBe(summedWin);
    });

    it("returns the correct reel window and reports the correct wins for the window", () => {
      jest.spyOn(global.crypto, "randomUUID");

      const rng = require("../rng/index.js");
      const spy = jest.spyOn(rng, "getRng").mockReturnValue(0);

      try {
        const result = game.play(1);
        const winline = result.gameState.reelWindow[0];

        expect(result.gameState.reelWindow).toEqual([
          ["A","A", "A"],
          ["B","B", "B"],
          ["C","C", "C"]
        ])
        expect(result.gameState.winningLines.length).toBeGreaterThan(0);
        expect(result.payout.payout).toBeGreaterThan(0);

        expect(result.gameState.winningLines.length).toBe(3);
        expect(result.payout.payout).toBe(60);
      } finally {
        spy.mockRestore();
      }
    });
  });
});
