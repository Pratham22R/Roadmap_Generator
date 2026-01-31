import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const email = "sambhavraghuvanshi17@gmail.com"
    console.log(`Checking user: ${email}...`)

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        console.error(`User with email ${email} not found!`)
        return
    }

    console.log(`Found user ${user.id}. Current role: ${user.role}`)
    console.log(`Updating role to ADMIN...`)

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
    })

    console.log(`✅ Success! User ${updatedUser.email} is now an ADMIN.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
