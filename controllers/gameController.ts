import prisma from "./prismaController";

const createUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: req.body!.user,
    }
  })
  res.json(user);
}


