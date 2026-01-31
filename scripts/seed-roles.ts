import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const careerRoleSkills = {
    fullStackWebDeveloper: {
        title: "Full Stack Web Developer",
        description:
            "Develops complete web applications including frontend, backend, database, and deployment.",
        skillFlow: [
            {
                phase: "Web Fundamentals",
                skills: [
                    "HTML",
                    "CSS",
                    "Responsive Design",
                    "Web Accessibility",
                    "Browser & Internet Basics"
                ]
            },
            {
                phase: "Programming Fundamentals",
                skills: [
                    "JavaScript",
                    "ES6+ Features",
                    "Asynchronous JavaScript",
                    "DOM Manipulation"
                ]
            },
            {
                phase: "Frontend Frameworks",
                skills: [
                    "React",
                    "Component Architecture",
                    "Hooks",
                    "Routing",
                    "API Integration"
                ]
            },
            {
                phase: "UI & Styling Tools",
                skills: [
                    "Tailwind CSS",
                    "Radix UI",
                    "Shadcn UI",
                    "CSS Animations"
                ]
            },
            {
                phase: "State Management",
                skills: [
                    "React Context API",
                    "Zustand",
                    "Redux Toolkit"
                ]
            },
            {
                phase: "Type Safety",
                skills: [
                    "TypeScript",
                    "Generics",
                    "Type Inference",
                    "Frontend Typing Patterns"
                ]
            },
            {
                phase: "Databases",
                skills: [
                    "SQL Fundamentals",
                    "PostgreSQL",
                    "MongoDB",
                    "Database Design",
                    "Indexes & Relations"
                ]
            },
            {
                phase: "ORM & Data Layer",
                skills: [
                    "Drizzle ORM",
                    "Prisma ORM",
                    "Schema Design",
                    "Migrations"
                ]
            },
            {
                phase: "Backend Development",
                skills: [
                    "Node.js",
                    "Express.js",
                    "REST APIs",
                    "Authentication",
                    "Authorization"
                ]
            },
            {
                phase: "Dev Tools & Deployment",
                skills: [
                    "Git",
                    "GitHub",
                    "Environment Variables",
                    "Docker Basics",
                    "Deployment (Vercel, Railway, Render)",
                    "CI/CD Basics"
                ]
            }
        ]
    },

    dataScientist: {
        title: "Data Scientist",
        description:
            "Analyzes data to extract insights using statistics, machine learning, and visualization.",
        skillFlow: [
            {
                phase: "Programming Foundations",
                skills: [
                    "Python",
                    "Jupyter Notebook",
                    "Python Data Types",
                    "Functions",
                    "OOP Basics"
                ]
            },
            {
                phase: "Mathematics & Statistics",
                skills: [
                    "Statistics",
                    "Probability",
                    "Linear Algebra",
                    "Descriptive Analysis",
                    "Hypothesis Testing"
                ]
            },
            {
                phase: "Data Analysis",
                skills: [
                    "NumPy",
                    "Pandas",
                    "Data Cleaning",
                    "Data Wrangling"
                ]
            },
            {
                phase: "Data Visualization",
                skills: [
                    "Matplotlib",
                    "Seaborn",
                    "Plotly",
                    "Dashboard Concepts"
                ]
            },
            {
                phase: "Databases & SQL",
                skills: [
                    "SQL",
                    "PostgreSQL",
                    "Joins",
                    "Indexes",
                    "Data Modeling"
                ]
            },
            {
                phase: "Machine Learning",
                skills: [
                    "Scikit-learn",
                    "Regression",
                    "Classification",
                    "Clustering",
                    "Model Evaluation"
                ]
            },
            {
                phase: "Advanced ML",
                skills: [
                    "Feature Engineering",
                    "Model Optimization",
                    "Pipelines",
                    "Hyperparameter Tuning"
                ]
            },
            {
                phase: "Big Data & Tools",
                skills: [
                    "Apache Spark",
                    "Hadoop Basics",
                    "Data Warehousing"
                ]
            },
            {
                phase: "Deployment & MLOps",
                skills: [
                    "Model Deployment",
                    "FastAPI",
                    "Docker",
                    "MLflow",
                    "Monitoring"
                ]
            }
        ]
    },

    aiMachineLearningEngineer: {
        title: "AI / Machine Learning Engineer",
        description:
            "Builds intelligent systems using deep learning, neural networks, and production AI pipelines.",
        skillFlow: [
            {
                phase: "Programming Core",
                skills: [
                    "Python",
                    "OOP",
                    "Data Structures",
                    "Algorithms"
                ]
            },
            {
                phase: "Math for AI",
                skills: [
                    "Linear Algebra",
                    "Probability",
                    "Statistics",
                    "Optimization"
                ]
            },
            {
                phase: "Data Processing",
                skills: [
                    "NumPy",
                    "Pandas",
                    "Data Preprocessing"
                ]
            },
            {
                phase: "Machine Learning",
                skills: [
                    "Supervised Learning",
                    "Unsupervised Learning",
                    "Scikit-learn",
                    "Evaluation Metrics"
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
                    "LLMs",
                    "Prompt Engineering"
                ]
            },
            {
                phase: "Computer Vision",
                skills: [
                    "OpenCV",
                    "Image Classification",
                    "Object Detection"
                ]
            },
            {
                phase: "MLOps & Deployment",
                skills: [
                    "FastAPI",
                    "Docker",
                    "Kubernetes Basics",
                    "Model Serving",
                    "Monitoring"
                ]
            }
        ]
    }
}

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
