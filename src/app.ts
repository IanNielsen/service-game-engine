import express from "express";
import { router } from "./routes/index.js";
import { initialiseGameModels } from "./games/index.js";
import cors from "cors";

// initialise the game models at startup
initialiseGameModels();

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export { app };
