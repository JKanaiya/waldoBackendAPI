import express from "express";
import { addPic, addChar, getCharDimData } from "../controllers/gameController.js";

const indexRouter = express.Router();

indexRouter.post("/picture", addPic)
indexRouter.post("/char", addChar)
indexRouter.get("/charData", getCharDimData)

export default indexRouter;

