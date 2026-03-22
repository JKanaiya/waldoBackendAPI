import { log } from "node:console";
import { prisma } from "./prisma.ts";
import { type Request, type Response, type NextFunction } from "express";

// to obtain the matching location in the array, to change this i would need to replace the dimensions in the schema to json, which is a tangent im not interested in rn
const dimensionMatches = {
  default: 0,
  "1800": 1,
  "1200": 2,
  "800": 3,
  "600": 4,
  "400": 5,

};

const addPic = async (req: Request, res: Response) => {
  const picAdded = await prisma.picture.create({


  });


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

const changeName = async (req: Request, res: Response) => {
  const { name, initName } = req.body;

  const userExists = await prisma.user.findFirst({
    where: {
      name: initName,
    },
  });



  if (userExists) {
    try {
      const scoreExists = await prisma.score.findFirst({
        where: {
          userId: userExists.id,
        },
      });

      if (scoreExists?.timeCompleted) throw new Error('UserName already exists')

      await prisma.user.update({
        where: {
          id: userExists.id,
          name: initName,
        },
        data: {
          desiredName: name,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
    res.status(200).json({ nameChanged: true });
  } else {
    res.status(400).json("Invalid name input");
  }
};

// TODO: figure out whether this should be a middleware or not
const scoreInit = async (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const { user, pictureId } = req.body;

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        name: user,
      },
    });

    if (userExists) {
      res.locals.user = userExists;
    } else {
      const initUser = await prisma.user.create({
        data: {
          name: user,
        },
      });
      res.locals.user = initUser;
    }
  } catch (e) {
    console.log(`Error: ${e}`);
  }

  try {
    const scoreExists = await prisma.score.findFirst({
      where: {
        pictureId: Number(pictureId),
        userId: res.locals.user.id,
      },
    });

    if (!scoreExists) {
      await prisma.score.create({
        data: {
          pictureId: Number(pictureId),
          hits: 0,
          userId: res.locals.user.id,
          timeStarted: now.toISOString(),
        },
      });
    }
    next();
  } catch (e) {
    console.log(e);

    res
      .status(500)
      .json("Unable to set a starting score. Try checking the userName given.");
  }
};

const tryHit = async (req: Request, res: Response, next: NextFunction) => {
  const { x, y, user, dimension, name, pictureId } = req.body;
  // TODO: check to see if the user has guessed all the characters in the picture, if so, ping add to the score, add the final time, and send the amount of time taken.
  // ideally the frontend asks the user if they want to assign a name to their score, which should call setName
  //
  try {
    const guess = await prisma.character.findFirst({
      where: {
        name: name,
        pictureId: Number(pictureId),
      },
      include: {
        dimensions: {
          where: {
            name: dimension == 'default' ? dimension : `max${dimension}`,
          },
        },
      },
    });

    const guessDim = guess?.dimensions[0];

    console.log(`y: ${y}, other y: ${guessDim?.y}`)
    console.log(`x: ${x}, other x: ${guessDim?.x}`)

    if (
      x >= guessDim?.x - (guessDim?.range ? guessDim?.range : 0.03) &&
      x <= guessDim?.x + (guessDim?.range ? guessDim?.range : 0.03)
    ) {
      if (
        y >= guessDim?.y - (guessDim?.range ? guessDim?.range : 0.07) &&
        y <= guessDim?.y + (guessDim?.range ? guessDim?.range : 0.07)
      ) {
        console.log("Win");
        next();
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
};

const makeGuess = [
  scoreInit,
  tryHit,
  async (req: Request, res: Response) => {
    let user = res.locals.user;
    try {
      let score = await prisma.score.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (score) {
        const picture = await prisma.picture.findFirst({
          where: {
            id: score?.pictureId,
          },
          include: {
            Characters: {},
          },
        });

        await prisma.score.update({
          where: {
            userId: user.id,
          },
          data: {
            hits: score.hits + 1,
          },
        });

        const totalHits = await prisma.score.findFirst({
          where: {
            pictureId: score.pictureId,
            userId: user.id,
          },
        });

        if (totalHits) {
          // TODO: replace 3 below with picture?.Characters.length
          if (totalHits?.hits >= 3) {
            const now = new Date();
            const tCompleted = now.toISOString();
            await prisma.score.update({
              where: {
                pictureId: score.pictureId,
                userId: user.id
              },
              data: {
                timeCompleted: tCompleted
              }
            })
            const tStarted = new Date(totalHits.timeStarted)
            res.status(200).json({ hit: true, gameComplete: true, timeTaken: (now.getTime() - tStarted.getTime()) / 1000 });
          } else {
            res.status(200).json({ hit: true });
          }
        }
      }
    } catch (e) {
      console.log("Could not increase score");
    }
  },
];

export { addPic, addChar, getCharDimData, makeGuess, changeName };
