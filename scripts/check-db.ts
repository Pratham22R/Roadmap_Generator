
import { getPrisma } from "../src/lib/prisma"

async function main() {
    try {
        console.log("Checking DB connection...")
        const prisma = getPrisma()
        await prisma.$connect()
        console.log("✅ Connected successfully!")
        await prisma.$disconnect()
    } catch (e) {
        console.error("❌ Connection failed:", e)
        process.exit(1)
    }
}

main()
