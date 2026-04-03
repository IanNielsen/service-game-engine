/**
 * Route handler for our API requests
 */
import { Router, type Request, type Response } from "express";
import { init } from "./init/index.js";
import { play } from "./play/index.js";
import { prune } from "./prune/index.js";
import { add, clear } from "./frig/index.js";

const router = Router();

router.get("/health", (_request: Request, response: Response) => {
  response.json({ status: "ok" });
});

// initialises a session and returns game config
router.post("/init", (request: Request, response: Response) => {
  const initResponse = init(request.body);

  response.json(initResponse);
});

// returns a play response
router.post("/play", (request: Request, response: Response) => {
  const playResponse = play(request.body);

  response.json(playResponse);
});

// prunes all sessions from the engine
router.get("/prune", (_request: Request, response: Response) => {
  prune();

  response.json({ status: "ok" });
});

router.post("/frig/add", (request: Request, response: Response) => {
  try {
    add(request.body.frig);

    response.json({ status: "ok" });
  } catch (err) {
    response.json({ status: "fail" });
  }
});

router.get("/frig/clear", (_request: Request, response: Response) => {
  try {
    clear();
    
    response.json({ status: "ok" });
  } catch (err) {
    response.json({ status: "fail" });
  }
});

export { router };
