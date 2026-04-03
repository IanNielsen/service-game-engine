import request from "supertest";
import { app } from "../app.js";

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

// ---------------------------------------------------------------------------
// POST /api/init
// ---------------------------------------------------------------------------

describe("POST /api/init", () => {
  it("returns valid init response for mapped game name", async () => {
    const res = await request(app)
      .post("/api/init")
      .send({ token: "djflksdjflksd", gameId: "classic-fruity", currency: "GBP" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sessionId");
    expect(res.body).toHaveProperty("balance");
    expect(res.body).toHaveProperty("stakes");
    expect(res.body).toHaveProperty("gameConfig");
    expect(res.body.gameConfig).toHaveProperty("reels");
    expect(res.body.gameConfig).toHaveProperty("symbols");
    expect(Array.isArray(res.body.gameConfig.symbols)).toBe(true);
    expect(typeof res.body.sessionId).toBe("string");
    expect(Array.isArray(res.body.stakes)).toBe(true);
  });

  it("retrieves the previous session if the same token is used", async () => {
    const payload = { token: "kfldsjflkdsjflksdjflkdj", gameId: "classic-fruity", currency: "GBP" };

    const res1 = await request(app).post("/api/init").send(payload);
    const res2 = await request(app).post("/api/init").send(payload);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res1.body.sessionId).toBe(res2.body.sessionId);
  });

  it("returns an error response for an unknown gameId", async () => {
    const res = await request(app)
      .post("/api/init")
      .send({ token: "dsaifjwviojoaja", gameId: "not-classic-fruity", currency: "GBP" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body).toHaveProperty("message");
  });
});

// ---------------------------------------------------------------------------
// POST /api/play
// ---------------------------------------------------------------------------

describe("POST /api/play", () => {
  it("returns an error for a if the sessionId is invalid", async () => {
    const res = await request(app)
      .post("/api/play")
      .send({ sessionId: "riewpiripwirpoidss", stake: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ error: "004", message: "Invalid session" });
  });

  it("returns a valid play response once a session has been initialised", async () => {
    // First create a session via /init
    const initRes = await request(app)
      .post("/api/init")
      .send({ token: "fkldsjflldsjflskdjflsj", gameId: "classic-fruity", currency: "GBP" });

    expect(initRes.status).toBe(200);

    const { sessionId, stakes } = initRes.body;

    expect(sessionId).toBeTruthy();

    const playRes = await request(app)
      .post("/api/play")
      .send({ sessionId, stake: stakes[0] });

    expect(playRes.status).toBe(200);
    expect(playRes.body).toHaveProperty("sessionId", sessionId);
    expect(playRes.body).toHaveProperty("balance");
    expect(playRes.body).toHaveProperty("roundDetails");
    expect(playRes.body.roundDetails.resolved).toBe(true);
  });

  it("updates the player balance correctly", async () => {
    const initRes = await request(app)
      .post("/api/init")
      .send({ token: "iowqirpowldsfldjj", gameId: "classic-fruity", currency: "GBP" });

    const { sessionId, balance: balanceBefore, stakes } = initRes.body;
    const stake = stakes[0];

    const playRes = await request(app)
      .post("/api/play")
      .send({ sessionId, stake });

    const balanceAfter = playRes.body.balance;
    const payout = playRes.body.roundDetails?.payout?.payout ?? 0;

    expect(balanceAfter).toBe(balanceBefore - stake + payout);
  });

  it("returns an error when an invalid stake is used", async () => {
    const initRes = await request(app)
      .post("/api/init")
      .send({ token: "diprwqriofslkfdzj", gameId: "classic-fruity", currency: "GBP" });

    const { sessionId } = initRes.body;

    const playRes = await request(app)
      .post("/api/play")
      .send({ sessionId, stake: 999 });

    expect(playRes.status).toBe(200);
    expect(playRes.body).toHaveProperty("error");
  });
});
