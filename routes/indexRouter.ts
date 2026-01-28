import express from "express";
import {
  addPic,
  addChar,
  getCharDimData,
  makeGuess,
  changeName,
} from "../controllers/gameController.ts";

const indexRouter = express.Router();

indexRouter.get("/charData", getCharDimData);
indexRouter.post("/picture", addPic);
indexRouter.post("/char", addChar);
indexRouter.post("/guess", makeGuess);
indexRouter.patch("/name", changeName);

export default indexRouter;
