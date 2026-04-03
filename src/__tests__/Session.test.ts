/// <reference path="../types/types.d.ts" />
import { Session } from "../session/Session.js";

const validParams = { playerId: "player123", gameId: "classic-fruity", currency: "GBP" };

describe("Session", () => {
  describe("constructor", () => {
    it("stores playerId, gameId and currency", () => {
      const session = new Session(validParams);

      expect(session.playerId).toBe("player123");
      expect(session.gameId).toBe("classic-fruity");
      expect(session.currency).toBe("GBP");
    });

    it("creates a sessionId", () => {
      const session = new Session(validParams);

      expect(session.sessionId).toBeTruthy();
    });

    it("creates a unique sessionId per instance", () => {
      const s1 = new Session(validParams);
      const s2 = new Session(validParams);

      expect(s1.sessionId).not.toBe(s2.sessionId);
    });

    it("creates sessionStart timestamp", () => {
      const now = Date.now();
      const session = new Session(validParams);

      // should be the same time as now or shortly after
      expect(session.sessionStart).toBeGreaterThanOrEqual(now);
      expect(session.sessionStart).toBeLessThanOrEqual(Date.now());
    });

    it("throws if no playerId supplied", () => {
      expect(() => new Session({ ...validParams, playerId: "" })).toThrow();
    });

    it("throws if no gameId supplied", () => {
      expect(() => new Session({ ...validParams, gameId: "" })).toThrow();
    });

    it("throws if no currency supplied", () => {
      expect(() => new Session({ ...validParams, currency: "" })).toThrow();
    });

    it("throws if no params supplied", () => {
      expect(() => new Session(null as any)).toThrow();
    });
  });

  describe("setRoundDetails / getRoundDetails", () => {
    const roundDetails: RoundDetails = {
      resolved: true,
      gameState: {
        reelPositions: [0, 0, 0],
        reelWindow: [["A", "B", "C"], ["A", "B", "C"], ["A", "B", "C"]],
        winningLines: [],
        totalWin: 0,
      },
      payout: { stake: 1, payout: 0 },
    };

    it("sets and gets round details", () => {
      const session = new Session(validParams);

      session.setRoundDetails(roundDetails);

      expect(session.getRoundDetails()).toEqual(roundDetails);
    });

    it("overwrites previous round details", () => {
      const session = new Session(validParams);

      session.setRoundDetails(roundDetails);

      const updated: RoundDetails = { ...roundDetails, payout: { stake: 2, payout: 40 } };

      session.setRoundDetails(updated);

      expect(session.getRoundDetails()?.payout.stake).toBe(2);
      expect(session.getRoundDetails()?.payout.payout).toBe(40);
    });
  });
});
