import { prisma } from "./prisma.js";
import pictures from "../assets/gameData.json";



async function main() {
  // TODO: In the case that other pictures are added, this would need to be changed to be dynamic, and the json will need to change
  await prisma.picture.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
    },
  });

  pictures.pictures[0].characters.map(async (char: { id: number, name: string, pictureId: number }) => {
    await prisma.character.upsert({
      where: { id: char.id },
      update: {},
      create: {
        id: char.id,
        pictureId: pictures.pictures[0].id,
        name: char.name,
      },
    });
  })

  pictures.pictures[0].dimensions.map(async (dim: {
    id: number,
    characterId: number,
    name: string,
    x: number,
    y: number,
    range: number,
  }) => {
    await prisma.dimension.upsert({
      where: { id: dim.id },
      update: {},
      create: {
        id: dim.id,
        characterId: dim.characterId,
        name: dim.name,
        x: dim.x,
        y: dim.y,
        range: dim.range,
      },
    });
  })
}
main()
  .then(async () => {
    // await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    // await prisma.$disconnect()
    // process.exit(1)
  })
