import { log } from "console";
import { prisma } from "./prisma.js";
import { type Request, type Response } from "express";

const createUser = async (req: Request, res: Response) => {
  const bla = await prisma.user.create({
    data: {
      name: req.body.user,
    }
  })
  res.json(bla);
}

const addPic = async (req: Request, res: Response) => {
  const picAdded = await prisma.picture.create({
  })

  res.json(picAdded)
}

const addChar = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  const charAdded = await prisma.character.create({
    data: {
      pictureId: id,
      name: name
    }
  })

  res.json(charAdded)
}

const getCharDimData = async (req: Request, res: Response) => {
  const charData = await prisma.character.findFirst({
    where: {
      id: Number(req.query.id)
    },
    include: {
      dimensions: {
      }
    }
  })

  charData ? res.status(200).json(charData) : res.status(400).json(charData);
}


export {
  addPic,
  addChar,
  getCharDimData
}

