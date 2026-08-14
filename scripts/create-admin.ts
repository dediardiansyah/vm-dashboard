import pkg from 'bcryptjs';
const { hash } = pkg;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hash('HMNSPassword', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hmns.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        name: 'Admin User'
      }
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();