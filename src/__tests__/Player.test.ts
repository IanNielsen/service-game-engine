import { Player } from "../player/Player.js";

describe("Player", () => {
  describe("constructor", () => {
    it("sets initial balance", () => {
      const player = new Player(500);

      expect(player.getBalance()).toBe(500);
    });

    it("sets a playerId dynamically", () => {
      const player = new Player(100);

      expect(player.getPlayerId()).toBeTruthy();
    });

    it("playerId is unique per player", () => {
      const p1 = new Player(100);
      const p2 = new Player(100);

      expect(p1.getPlayerId()).not.toBe(p2.getPlayerId());
    });
  });

  describe("debit", () => {
    it("decreases balance", () => {
      const player = new Player(1000);

      player.debit(200);

      expect(player.getBalance()).toBe(800);
    });

    it("throws insufficient funds error", () => {
      const player = new Player(100);

      expect(() => player.debit(101)).toThrow("Insufficient funds");
    });
  });

  describe("credit", () => {
    it("increases balance", () => {
      const player = new Player(100);

      player.credit(50);

      expect(player.getBalance()).toBe(150);
    });
  });
});
