import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Food', icon: 'restaurant' },
  { name: 'Transport', icon: 'directions-car' },
  { name: 'Entertainment', icon: 'movie' },
  { name: 'Shopping', icon: 'shopping-cart' },
  { name: 'Health', icon: 'local-hospital' },
  { name: 'Education', icon: 'school' },
  { name: 'Utilities', icon: 'bolt' },
  { name: 'Other', icon: 'more-horiz' },
];

async function main() {
  console.log('Seeding categories...');

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
