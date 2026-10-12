import { redis } from "./leaderboard.js";

async function seed() {
  await redis.del("trending:posts");

  const pipeline = redis.pipeline();

  for (let i = 1; i <= 100; i++) {
    const postId = `post:${i}`;
    const score = Math.floor(Math.random() * 50);

    // Redis 3.x requires HMSET to write multiple fields in one command.
    pipeline.hmset(
      `post:${i}:meta`,
      "title",
      `Post number ${i}`,
      "author",
      `@user${i}`
    );

    pipeline.zadd("trending:posts", score, postId);
  }

  const results = await pipeline.exec();
  for (const [error] of results) {
    if (error) {
      throw error;
    }
  }

  console.log("Seeded 100 posts.");
  redis.disconnect();
}

seed();