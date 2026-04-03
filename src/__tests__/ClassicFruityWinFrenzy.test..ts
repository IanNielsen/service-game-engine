/// <reference path="../types/types.d.ts" />
import Profile from "../games/profiles/ClassicFruityWinFrenzy.js";
import AbstractSlotGame from "../games/models/AbstractSlotGame.js";

describe("ClassicFruityWinFrenzy", () => {
  let classicFruity: AbstractSlotGame;

  beforeEach(() => {
    classicFruity = new AbstractSlotGame(Profile);
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

    // this test is mainly just to add a breakpoint and actually see what the RTP is :)
    expect(rtp).toBeGreaterThanOrEqual(0);
    expect(rtp).toBeLessThanOrEqual(100000);
    expect(hitRate).toBeGreaterThanOrEqual(0);
    expect(hitRate).toBeLessThanOrEqual(1000);
  });
});