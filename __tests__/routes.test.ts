import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import "dotenv/config.js";
import cors from "cors";
import indexRouter from "../routes/indexRouter.ts";

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
      // .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "waldo",
        dimension: "default",
        x: 0.8,
        y: 0.5,
        user: "user1",
        pictureId: 1,
      })
      .expect(200);

    expect(res.body.hit).toBe(true);
  });

  it("Inccurate guesses do not increment score for the user", async () => {
    const res = await request(app)
      .post("/guess")
      .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "waldo",
        dimension: "default",
        x: 0.5,
        y: 0.8,
        user: "user1",
        pictureId: 1,
      })
      .expect(200);

    expect(res.body.hit).toBe(false);
  });

  it("Correct hit increases score for the user", async () => {
    const res = await request(app)
      .post("/guess")
      .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "waldo",
        dimension: "default",
        x: 0.8,
        y: 0.5,
        user: "user1",
        pictureId: 1,
      })
      .expect(200);

    expect(res.body.hit).toBe(true);
  });

  it("3 hits returns a finished game ", async () => {
    let res;
    for (let i = 1; i <= 3; i++) {
      res = await request(app)
        .post("/guess")
        .expect("Content-Type", /json/)
        .set("Accept", "application/json")
        .send({
          name: "waldo",
          dimension: "default",
          x: 0.8,
          y: 0.5,
          user: "user",
          pictureId: 1,
        })
        .expect(200);
    }

    console.log(res?.body.timeTaken);

    expect(res?.body.gameComplete).toBe(true);
  });

  it("Changing name from initial to desired", async () => {
    let res;
    res = await request(app)
      .patch("/name")
      .expect("Content-Type", /json/)
      .set("Accept", "application/json")
      .send({
        name: "Desired",
        initName: "user",
      })
      .expect(200);

    expect(res?.body.nameChanged).toBe(true);
  });
});
