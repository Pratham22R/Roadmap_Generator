import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const careerRoleSkills = {
    frontendDeveloper: {
        title: "Frontend Developer",
        description:
            "Builds interactive, responsive, and user-friendly web interfaces focusing on performance and user experience.",
        skillFlow: [
            {
                phase: "Web Fundamentals",
                skills: [
                    "HTML",
                    "Semantic HTML",
                    "CSS",
                    "Responsive Design",
                    "Web Accessibility",
                    "Browser Rendering Basics"
                ]
            },
            {
                phase: "Core JavaScript",
                skills: [
                    "JavaScript",
                    "ES6+ Features",
                    "DOM Manipulation",
                    "Asynchronous JavaScript",
                    "Event Handling"
                ]
            },
            {
                phase: "Frontend Framework",
                skills: [
                    "React",
                    "Component Architecture",
                    "Hooks",
                    "Routing",
                    "API Integration"
                ]
            },
            {
                phase: "Styling & UI Systems",
                skills: [
                    "Tailwind CSS",
                    "CSS Modules",
                    "Radix UI",
                    "Shadcn UI",
                    "Framer Motion"
                ]
            },
            {
                phase: "State & Data Management",
                skills: [
                    "React Context API",
                    "Zustand",
                    "Redux Toolkit",
                    "Server State Management"
                ]
            },
            {
                phase: "Type Safety",
                skills: [
                    "TypeScript",
                    "Typing React Components",
                    "Generics",
                    "Advanced Type Patterns"
                ]
            },
            {
                phase: "Modern Frontend Tools",
                skills: [
                    "Vite",
                    "Next.js",
                    "Server Components",
                    "API Routes",
                    "SEO Optimization"
                ]
            },
            {
                phase: "Testing & Optimization",
                skills: [
                    "Jest",
                    "React Testing Library",
                    "Performance Optimization",
                    "Code Splitting",
                    "Lazy Loading"
                ]
            },
            {
                phase: "Version Control & Deployment",
                skills: [
                    "Git",
                    "GitHub",
                    "Environment Variables",
                    "Deployment (Vercel, Netlify)",
                    "CI/CD Basics"
                ]
            }
        ]
    },

    backendDeveloper: {
        title: "Backend Developer",
        description:
            "Designs and develops scalable server-side systems, APIs, databases, and application logic.",
        skillFlow: [
            {
                phase: "Programming Foundations",
                skills: [
                    "JavaScript",
                    "TypeScript",
                    "Node.js Fundamentals",
                    "Asynchronous Programming"
                ]
            },
            {
                phase: "Backend Core Concepts",
                skills: [
                    "Node.js Runtime",
                    "Event Loop",
                    "File System",
                    "Streams",
                    "Process Management"
                ]
            },
            {
                phase: "API Development",
                skills: [
                    "REST APIs",
                    "Express.js",
                    "Request Validation",
                    "Error Handling",
                    "API Documentation"
                ]
            },
            {
                phase: "Databases",
                skills: [
                    "SQL Fundamentals",
                    "PostgreSQL",
                    "MongoDB",
                    "Indexes",
                    "Database Design"
                ]
            },
            {
                phase: "ORM & Data Layer",
                skills: [
                    "Prisma ORM",
                    "Drizzle ORM",
                    "Migrations",
                    "Transactions",
                    "Query Optimization"
                ]
            },
            {
                phase: "Authentication & Security",
                skills: [
                    "JWT",
                    "OAuth 2.0",
                    "Session Management",
                    "Role-Based Access Control",
                    "Security Best Practices"
                ]
            },
            {
                phase: "Advanced Backend",
                skills: [
                    "Caching (Redis)",
                    "Message Queues",
                    "Background Jobs",
                    "WebSockets"
                ]
            },
            {
                phase: "System Design",
                skills: [
                    "Scalability",
                    "Load Balancing",
                    "Rate Limiting",
                    "Microservices Basics"
                ]
            },
            {
                phase: "DevOps & Deployment",
                skills: [
                    "Docker",
                    "Environment Configuration",
                    "Logging",
                    "Monitoring",
                    "Deployment (Railway, Render, AWS)"
                ]
            }
        ]
    },

    aiEngineer: {
        title: "AI Engineer",
        description:
            "Builds AI-powered applications using machine learning models, deep learning, and large language models.",
        skillFlow: [
            {
                phase: "Programming Foundations",
                skills: [
                    "Python",
                    "OOP",
                    "Data Structures",
                    "Algorithms"
                ]
            },
            {
                phase: "Mathematics for AI",
                skills: [
                    "Linear Algebra",
                    "Probability",
                    "Statistics",
                    "Optimization Techniques"
                ]
            },
            {
                phase: "Data Handling",
                skills: [
                    "NumPy",
                    "Pandas",
                    "Data Cleaning",
                    "Feature Engineering"
                ]
            },
            {
                phase: "Machine Learning Core",
                skills: [
                    "Supervised Learning",
                    "Unsupervised Learning",
                    "Scikit-learn",
                    "Model Evaluation"
                ]
            },
            {
                phase: "Deep Learning",
                skills: [
                    "Neural Networks",
                    "TensorFlow",
                    "PyTorch",
                    "CNN",
                    "RNN",
                    "Transformers"
                ]
            },
            {
                phase: "Natural Language Processing",
                skills: [
                    "Tokenization",
                    "Embeddings",
                    "Text Classification",
                    "Large Language Models"
                ]
            },
            {
                phase: "Generative AI",
                skills: [
                    "Prompt Engineering",
                    "RAG Pipelines",
                    "Vector Databases",
                    "LangChain",
                    "Embeddings Optimization"
                ]
            },
            {
                phase: "AI Deployment",
                skills: [
                    "FastAPI",
                    "Model Serving",
                    "Docker",
                    "Inference Optimization"
                ]
            },
            {
                phase: "MLOps",
                skills: [
                    "MLflow",
                    "Model Monitoring",
                    "Experiment Tracking",
                    "CI/CD for ML"
                ]
            }
        ]
    }
};

async function main() {
    console.log("🌱 Seeding Career Roles from updated design...")

    for (const roleData of Object.values(careerRoleSkills)) {
        console.log(`Processing Role: ${roleData.title}`)

        // 1. Upsert Career Role (Update if exists, Create if not)
        const roleRecord = await prisma.careerRole.upsert({
            where: { title: roleData.title },
            update: { description: roleData.description },
            create: {
                title: roleData.title,
                description: roleData.description,
            }
        })

        // 2. Wipe existing skills for this role (replace logic)
        await prisma.roleSkill.deleteMany({
            where: { roleId: roleRecord.id }
        })
        console.log(`  - Cleared existing skills for ${roleData.title}`)

        // 3. Add new skills from skillFlow
        for (const phaseObj of roleData.skillFlow) {
            const category = phaseObj.phase
            for (const skillName of phaseObj.skills) {
                // Ensure Skill exists globally
                const skillRecord = await prisma.skill.upsert({
                    where: { title: skillName },
                    update: {},
                    create: { title: skillName }
                })

                // Link Skill to Role with Category
                await prisma.roleSkill.create({
                    data: {
                        roleId: roleRecord.id,
                        skillId: skillRecord.id,
                        category: category
                    }
                })
            }
        }
        console.log(`  - Added skills from ${roleData.skillFlow.length} phases`)
    }

    console.log("✅ Seeding completed.")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
