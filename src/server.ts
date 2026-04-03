import { app } from "./app.js";

const portArgIndex = process.argv.indexOf("--port");
const portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : undefined;
const PORT = portArg ?? process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
