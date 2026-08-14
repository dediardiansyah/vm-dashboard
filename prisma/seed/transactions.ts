import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { addHours, subDays } from 'date-fns'
import { PAYMENT_STATUS } from '@/lib/midtrans'

const prisma = new PrismaClient()

const paymentMethods = ['QRIS', 'VIRTUAL_ACCOUNT', 'GOPAY', 'SHOPEEPAY']

async function generateTransactions() {
  // First, get all machines and parfumes to reference in transactions
  const machines = await prisma.machine.findMany()
  const parfumes = await prisma.parfume.findMany()

  if (!machines.length || !parfumes.length) {
    console.error('Please seed machines and parfumes first')
    return
  }

  const transactions = []

  // Generate 100 transactions
  for (let i = 0; i < 100; i++) {
    const machine = faker.helpers.arrayElement(machines)
    const parfume = faker.helpers.arrayElement(parfumes)
    const amount = faker.number.int({ min: 10000, max: 50000 })
    const paymentMethod = faker.helpers.arrayElement(paymentMethods)
    const createdAt = faker.date.between({
      from: subDays(new Date(), 30),
      to: new Date(),
    })
    
    const status = faker.helpers.arrayElement([
      PAYMENT_STATUS.SUCCESS,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.FAILED,
      PAYMENT_STATUS.EXPIRED,
    ])

    const paidAt = status === PAYMENT_STATUS.SUCCESS 
      ? addHours(createdAt, faker.number.int({ min: 0, max: 2 }))
      : null

    const transaction = {
      transactionId: faker.string.alphanumeric({ length: 16, casing: 'upper' }),
      machineId: machine.id,
      parfumeId: parfume.id,
      amount,
      paymentMethod,
      paymentStatus: status,
      paymentDetails: {
        transaction_id: faker.string.alphanumeric({ length: 16, casing: 'upper' }),
        order_id: faker.string.alphanumeric({ length: 16, casing: 'upper' }),
        gross_amount: amount.toString(),
        payment_type: paymentMethod.toLowerCase(),
        transaction_status: status.toLowerCase(),
      },
      vaNumber: paymentMethod === 'VIRTUAL_ACCOUNT' ? faker.string.numeric(16) : null,
      qrCode: paymentMethod === 'QRIS' ? faker.image.url() : null,
      deepLinkUrl: ['GOPAY', 'SHOPEEPAY'].includes(paymentMethod) ? faker.internet.url() : null,
      expiryTime: addHours(createdAt, 24),
      paidAt,
      createdAt,
      updatedAt: paidAt || createdAt,
    }

    transactions.push(transaction)
  }

  // Insert all transactions
  await prisma.transaction.createMany({
    data: transactions,
    skipDuplicates: true,
  })

  console.log(`✅ Successfully seeded ${transactions.length} transactions`)
}

export async function seedTransactions() {
  try {
    await generateTransactions()
  } catch (error) {
    console.error('Error seeding transactions:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
} 