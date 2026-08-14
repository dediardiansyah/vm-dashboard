import { PrismaClient } from '@prisma/client'
import { seedTransactions } from './transactions'

const prisma = new PrismaClient()

async function main() {
  try {
    // Add other seeders here if they exist
    await seedTransactions()
  } catch (error) {
    console.error('Error in main seed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 