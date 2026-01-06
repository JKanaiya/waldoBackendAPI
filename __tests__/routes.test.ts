import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "../routes/indexRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/", indexRouter);

describe("api calls for waldo game", () => {
  it("get char details", async () => {
    const res = await request(app)
      .get("/charData")
      .expect("Content-Type", /json/)
      .query({ id: 2 })
      .expect(200);

    expect(res.body).toEqual(expect.objectContaining({ name: "waldo" }));
  });

  it("Accurate guesses return a valid hit", async () => {
    const res = await request(app)
      .post("/guess")
      .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "waldo",
        dimensions: "default",
        x: 0.8,
        y: 0.5,
        user: "user",
      })
      .expect(200);

    expect(res.body.hit).toBe(true);
  });

  it("Inccurate guesses return a miss", async () => {
    const res = await request(app)
      .post("/guess")
      .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "waldo",
        dimensions: "default",
        x: 0.5,
        y: 0.8,
        user: "user",
      })
      .expect(200);

    expect(res.body.hit).toBe(false);
  });
});
