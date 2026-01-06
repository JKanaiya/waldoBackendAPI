import { log } from "console";
import { prisma } from "./prisma.js";
// import Prisma from "@prisma/client";
import { type Request, type Response } from "express";

// to obtain the matching location in the array, to change this i would need to replace the dimensions in the schema to json, which is a tangent im not interested in rn
const dimensionMatches = {
  default: 0,
  "1800": 1,
  "1200": 2,
  "800": 3,
  "600": 4,
  "400": 5,
};

const createUser = async (req: Request, res: Response) => {
  const bla = await prisma.user.create({
    data: {
      name: req.body.user,
    },
  });
  res.json(bla);
};

const addPic = async (req: Request, res: Response) => {
  const picAdded = await prisma.picture.create({});

  res.json(picAdded);
};

const addChar = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  const charAdded = await prisma.character.create({
    data: {
      pictureId: id,
      name: name,
    },
  });

  res.json(charAdded);
};

const getCharDimData = async (req: Request, res: Response) => {
  const charData = await prisma.character.findFirst({
    where: {
      id: Number(req.query.id),
    },
    include: {
      dimensions: {},
    },
  });

  charData ? res.status(200).json(charData) : res.status(400).json(charData);
};

const makeGuess = async (req: Request, res: Response) => {
  const { x, y, user, dimensions, name } = req.body;

  try {
    const guess = await prisma.character.findFirst({
      where: {
        name: name,
      },
      include: {
        dimensions: {
          where: {
            name: dimensions,
          },
        },
      },
    });

    const guessDim = guess?.dimensions[dimensionMatches[dimensions]];

    if (
      x >= guessDim?.x - (guessDim?.range ? guessDim?.range : 0.03) &&
      x <= guessDim?.x + (guessDim?.range ? guessDim?.range : 0.03)
    ) {
      if (
        y >= guessDim?.y - (guessDim?.range ? guessDim?.range : 0.07) &&
        y <= guessDim?.y + (guessDim?.range ? guessDim?.range : 0.07)
      ) {
        console.log("Win");
        res.status(200).json({ hit: true });
      } else {
        console.log("Loss");
        res.status(200).json({ hit: false });
      }
    } else {
      console.log("Loss");
      res.status(200).json({ hit: false });
    }
  } catch (e) {
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (e.code === "P2001") {
    //     console.log(
    //       "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist",
    //     );
    //   }
    // }
    throw e;
  }

  res.status(200).json({ hit: false });

  // res.json(200).json();
};

export { addPic, addChar, getCharDimData, makeGuess };
