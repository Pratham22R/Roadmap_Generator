
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Connecting to database...')
    await prisma.$connect()
    console.log('Successfully connected to database!')
    
    // Optional: Try a simple query if you want
    // const count = await prisma.user.count()
    // console.log(`User count: ${count}`)
    
  } catch (e) {
    console.error('Error connecting to database:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
