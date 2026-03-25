const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const username = 'Admin2';
  try {
    console.log(`Checking for user: ${username}`);
    const user = await prisma.users.findUnique({
      where: { username }
    });
    
    if (user) {
      console.log('User found!');
      console.log('User ID:', user.user_id);
      console.log('Role:', user.role);
      console.log('Is Active:', user.is_active);
      console.log('Password Hash:', user.password_hash);
      
      // Test a known password if we want, but let's just see if it exists
    } else {
      console.log('User not found.');
      const allUsers = await prisma.users.findMany({ select: { username: true } });
      console.log('Available users:', allUsers.map(u => u.username));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
