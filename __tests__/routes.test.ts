import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import "dotenv/config.js";
import indexRouter from "../routes/indexRouter.js";
import { log } from "console";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

it("get char details works", async () => {
  const res = await request(app)
    .get('/charData')
    .expect("Content-Type", /json/)
    .query({ id: 2 })
    .expect(200);

  expect(res.body).toEqual(expect.objectContaining({ name: "waldo" }));
})

