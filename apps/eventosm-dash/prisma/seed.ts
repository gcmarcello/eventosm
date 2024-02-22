import { userSeed } from "./seed/user.seed";
import { orgSeed } from "./seed/org.seed";
import { geoSeed } from "./seed/geo.seed";
import { colorSeed } from "./seed/colors.seed";
import { prisma } from "./prisma";

async function main() {
  const colors = await colorSeed();

  const geo = await geoSeed();

  const user = await userSeed();

  const org = await orgSeed(user.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
