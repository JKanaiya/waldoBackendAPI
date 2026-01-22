import { beforeAll, afterAll } from "vitest";
import "dotenv/config";
import supertest, { type SuperTest, Test } from "supertest";
import { prisma } from "../controllers/prisma.js";

let request: SuperTest<Test>;

beforeAll(async () => {
  await prisma.picture.create({
    data: {
      id: 1,
    },
  });
  await prisma.character.create({
    data: {
      id: 2,
      pictureId: 1,
      name: "waldo",
    },
  });
  await prisma.dimension.create({
    data: {
      id: 3,
      characterId: 2,
      name: "default",
      x: 0.8,
      y: 0.5,
      range: 0.03,
    },
  });
});

afterAll(async () => {
  await prisma.dimension.deleteMany({});
  await prisma.score.deleteMany({});
  await prisma.character.deleteMany({});
  await prisma.picture.deleteMany({});
});

// afterAll(async () => {});

export { request };
