const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const username = 'Admin2';
  const newHash = '$2b$10$iNdSTD63BCfq41oMwigBjec58S7y5o5AY5mVbWFe5it/uOQsez6iq';
  
  try {
    console.log(`Updating user: ${username}`);
    const updatedUser = await prisma.users.update({
      where: { username },
      data: { password_hash: newHash }
    });
    console.log('Update successful!');
    console.log('New hash set for Admin2');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
