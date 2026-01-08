import express from "express";
import {
  addPic,
  addChar,
  getCharDimData,
  makeGuess,
} from "../controllers/gameController.js";

const indexRouter = express.Router();

indexRouter.get("/charData", getCharDimData);
indexRouter.post("/picture", addPic);
indexRouter.post("/char", addChar);
indexRouter.post("/guess", makeGuess);

export default indexRouter;
