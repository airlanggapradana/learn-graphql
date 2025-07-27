import prisma from "./prisma";
import {faker} from "@faker-js/faker";

const dataUsers = Array.from({length: 100}).map((_, _i) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
}))

const dataPosts = Array.from({length: 100}).map((_, i) => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  published: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  authorId: dataUsers[i].id
}))

async function main() {
  console.log("Seeding database...");
  await prisma.user.createMany({
    data: dataUsers,
    skipDuplicates: true, // Skip duplicates if any
  })
  console.log("Users seeded successfully.");
  await prisma.post.createMany({
    data: dataPosts,
    skipDuplicates: true, // Skip duplicates if any
  })
  console.log("Posts seeded successfully.");
}

main().catch(e => {
  console.error("Error seeding database:", e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
  console.log("Database seeding completed.");
})