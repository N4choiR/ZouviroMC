import Fastify from "fastify";

const app = Fastify({
  logger: true,
  bodyLimit: 2 * 1024 * 1024
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "MiniCode API",
    version: "1.0.0"
  };
});

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 3001,
      host: "127.0.0.1"
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
