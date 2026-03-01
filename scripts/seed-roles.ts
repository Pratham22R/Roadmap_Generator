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
                skills: ["HTML", "Semantic HTML", "CSS", "Responsive Design", "Web Accessibility", "Browser Rendering Basics"]
            },
            {
                phase: "Core JavaScript",
                skills: ["JavaScript", "ES6+ Features", "DOM Manipulation", "Asynchronous JavaScript", "Event Handling"]
            },
            {
                phase: "Frontend Framework",
                skills: ["React", "Component Architecture", "Hooks", "Routing", "API Integration"]
            },
            {
                phase: "Styling & UI Systems",
                skills: ["Tailwind CSS", "CSS Modules", "Radix UI", "Shadcn UI", "Framer Motion"]
            },
            {
                phase: "State & Data Management",
                skills: ["React Context API", "Zustand", "Redux Toolkit", "Server State Management"]
            },
            {
                phase: "Type Safety",
                skills: ["TypeScript", "Typing React Components", "Generics", "Advanced Type Patterns"]
            },
            {
                phase: "Modern Frontend Tools",
                skills: ["Vite", "Next.js", "Server Components", "API Routes", "SEO Optimization"]
            },
            {
                phase: "Testing & Optimization",
                skills: ["Jest", "React Testing Library", "Performance Optimization", "Code Splitting", "Lazy Loading"]
            },
            {
                phase: "Version Control & Deployment",
                skills: ["Git", "GitHub", "Environment Variables", "Deployment (Vercel, Netlify)", "CI/CD Basics"]
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
                skills: ["JavaScript", "TypeScript", "Node.js Fundamentals", "Asynchronous Programming"]
            },
            {
                phase: "Backend Core Concepts",
                skills: ["Node.js Runtime", "Event Loop", "File System", "Streams", "Process Management"]
            },
            {
                phase: "API Development",
                skills: ["REST APIs", "Express.js", "Request Validation", "Error Handling", "API Documentation", "GraphQL Basics"]
            },
            {
                phase: "Databases",
                skills: ["SQL Fundamentals", "PostgreSQL", "MongoDB", "Indexes", "Database Design", "Redis"]
            },
            {
                phase: "ORM & Data Layer",
                skills: ["Prisma ORM", "Drizzle ORM", "Migrations", "Transactions", "Query Optimization"]
            },
            {
                phase: "Authentication & Security",
                skills: ["JWT", "OAuth 2.0", "Session Management", "Role-Based Access Control", "Security Best Practices", "CORS", "Rate Limiting"]
            },
            {
                phase: "Advanced Backend",
                skills: ["Caching", "Message Queues (RabbitMQ/Kafka)", "Background Jobs", "WebSockets", "Serverless Basics"]
            },
            {
                phase: "System Design",
                skills: ["Scalability", "Load Balancing", "Microservices Basics", "CAP Theorem", "Distributed Systems Concepts"]
            },
            {
                phase: "DevOps & Deployment",
                skills: ["Docker", "Environment Configuration", "Logging", "Monitoring", "Deployment (Railway, Render, AWS)"]
            }
        ]
    },

    fullStackDeveloper: {
        title: "Full Stack Developer",
        description: "Handles both client-side and server-side development, bridging the gap between user interfaces and backend architecture.",
        skillFlow: [
            {
                phase: "Web Fundamentals",
                skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "Git & Version Control"]
            },
            {
                phase: "Frontend Core",
                skills: ["React", "State Management", "Tailwind CSS", "TypeScript Basics", "API Consumption"]
            },
            {
                phase: "Backend Core",
                skills: ["Node.js", "Express.js", "RESTful APIs", "Authentication (JWT/OAuth)"]
            },
            {
                phase: "Database & Data Modeling",
                skills: ["PostgreSQL", "MongoDB", "Prisma ORM", "Database Design", "SQL Queries"]
            },
            {
                phase: "Full Stack Frameworks",
                skills: ["Next.js", "Server Components", "API Routes", "Data Fetching Strategies"]
            },
            {
                phase: "System Integration",
                skills: ["WebSockets", "Third-party APIs (Stripe, OpenAI)", "Caching", "File Uploads"]
            },
            {
                phase: "Testing & QA",
                skills: ["Unit Testing", "Integration Testing", "E2E Testing (Cypress/Playwright)"]
            },
            {
                phase: "DevOps & Deployment",
                skills: ["Docker Basics", "CI/CD Pipelines", "Vercel / AWS / DigitalOcean", "Monitoring Basics"]
            }
        ]
    },

    devOpsEngineer: {
        title: "DevOps Engineer",
        description: "Focuses on uniting software development and IT operations to shorten the development lifecycle and provide continuous delivery.",
        skillFlow: [
            {
                phase: "OS & Fundamentals",
                skills: ["Linux/Unix", "Bash Scripting", "Networking Concepts", "SSH", "DNS", "HTTP/HTTPS"]
            },
            {
                phase: "Version Control",
                skills: ["Git", "GitHub/GitLab", "Branching Strategies", "Merge Conflict Resolution"]
            },
            {
                phase: "Containerization",
                skills: ["Docker", "Docker Compose", "Image Optimization", "Container Security"]
            },
            {
                phase: "Container Orchestration",
                skills: ["Kubernetes", "Helm", "Kustomize", "Service Meshes (Istio)"]
            },
            {
                phase: "Continuous Integration & Delivery (CI/CD)",
                skills: ["GitHub Actions", "Jenkins", "GitLab CI", "ArgoCD", "Deployment Strategies"]
            },
            {
                phase: "Infrastructure as Code (IaC)",
                skills: ["Terraform", "Ansible", "CloudFormation", "Pulumi"]
            },
            {
                phase: "Cloud Providers",
                skills: ["AWS", "Azure", "Google Cloud Platform (GCP)", "IAM", "VPC"]
            },
            {
                phase: "Monitoring & Observability",
                skills: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "Tracing (Jaeger)"]
            }
        ]
    },

    dataScientist: {
        title: "Data Scientist",
        description: "Extracts insights from structured and unstructured data using mathematical modeling, statistics, and machine learning.",
        skillFlow: [
            {
                phase: "Programming & Tools",
                skills: ["Python", "SQL", "Jupyter Notebooks", "Git Basics"]
            },
            {
                phase: "Mathematics & Statistics",
                skills: ["Linear Algebra", "Calculus", "Probability", "Inferential Statistics", "Hypothesis Testing"]
            },
            {
                phase: "Data Wrangling & Analysis",
                skills: ["Pandas", "NumPy", "Data Cleaning", "Exploratory Data Analysis (EDA)"]
            },
            {
                phase: "Data Visualization",
                skills: ["Matplotlib", "Seaborn", "Plotly", "Tableau / PowerBI"]
            },
            {
                phase: "Machine Learning Core",
                skills: ["Scikit-learn", "Regression", "Classification", "Clustering", "Dimensionality Reduction"]
            },
            {
                phase: "Advanced Machine Learning",
                skills: ["Ensemble Methods", "XGBoost", "Hyperparameter Tuning", "Model Evaluation Metrics"]
            },
            {
                phase: "Deep Learning & AI Basics",
                skills: ["PyTorch / TensorFlow", "Neural Networks Fundamentals", "NLP Basics", "Computer Vision Basics"]
            },
            {
                phase: "Deployment & Production",
                skills: ["Model Serialization", "FastAPI / Flask", "Docker", "MLflow"]
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
                skills: ["Python", "OOP", "Data Structures", "Algorithms"]
            },
            {
                phase: "Mathematics for AI",
                skills: ["Linear Algebra", "Probability", "Statistics", "Optimization Techniques"]
            },
            {
                phase: "Data Handling",
                skills: ["NumPy", "Pandas", "Data Cleaning", "Feature Engineering"]
            },
            {
                phase: "Machine Learning Core",
                skills: ["Supervised Learning", "Unsupervised Learning", "Scikit-learn", "Model Evaluation"]
            },
            {
                phase: "Deep Learning",
                skills: ["Neural Networks", "TensorFlow", "PyTorch", "CNN", "RNN", "Transformers"]
            },
            {
                phase: "Natural Language Processing",
                skills: ["Tokenization", "Embeddings", "Text Classification", "Large Language Models"]
            },
            {
                phase: "Generative AI",
                skills: ["Prompt Engineering", "RAG Pipelines", "Vector Databases (Pinecone/Weaviate)", "LangChain", "Advanced Agents"]
            },
            {
                phase: "AI Deployment",
                skills: ["FastAPI", "Model Serving (vLLM/TGI)", "Docker", "Inference Optimization"]
            },
            {
                phase: "MLOps",
                skills: ["MLflow", "Model Monitoring", "Experiment Tracking", "CI/CD for ML"]
            }
        ]
    },

    mobileDeveloper: {
        title: "Mobile Developer (Cross-Platform)",
        description: "Develops applications for mobile devices using cross-platform frameworks to target iOS and Android simultaneously.",
        skillFlow: [
            {
                phase: "Programming Basics",
                skills: ["JavaScript", "TypeScript", "Dart", "OOP Concepts"]
            },
            {
                phase: "Framework Fundamentals",
                skills: ["React Native", "Flutter", "Component Lifecycle", "State Management (Redux/Provider)"]
            },
            {
                phase: "UI/UX Implementation",
                skills: ["Mobile Styling", "Animations", "Gestures", "Responsive Layouts for Mobile"]
            },
            {
                phase: "Device Features & Native Modules",
                skills: ["Camera & Storage Integration", "Geolocation", "Push Notifications", "Linking Native Code"]
            },
            {
                phase: "Data & Networking",
                skills: ["REST APIs", "GraphQL", "Offline Storage (AsyncStorage/SQLite)", "Data Synchronization"]
            },
            {
                phase: "Testing & Debugging",
                skills: ["Mobile Debugging Tools", "Unit Testing", "E2E Testing (Detox/Appium)", "Performance Profiling"]
            },
            {
                phase: "App Store Deployment",
                skills: ["App Store Connect", "Google Play Console", "Code Signing", "Over-the-Air Updates", "Mobile CI/CD (Fastlane)"]
            }
        ]
    },

    cybersecurityAnalyst: {
        title: "Cybersecurity Analyst",
        description: "Protects IT infrastructure, networks, and data by identifying vulnerabilities, monitoring for threats, and responding to incidents.",
        skillFlow: [
            {
                phase: "Networking Basics",
                skills: ["TCP/IP Suite", "OSI Model", "DNS/DHCP", "Subnetting", "Firewalls"]
            },
            {
                phase: "OS Security",
                skills: ["Linux Security", "Windows Security", "Active Directory", "File Permissions", "Command Line Tools"]
            },
            {
                phase: "Threats & Vulnerabilities",
                skills: ["Malware Types", "Phishing", "Social Engineering", "OWASP Top 10", "DDoS"]
            },
            {
                phase: "Security Operations",
                skills: ["SIEM (Splunk/QRadar)", "Log Analysis", "Intrusion Detection/Prevention (IDS/IPS)", "Vulnerability Scanning"]
            },
            {
                phase: "Incident Response",
                skills: ["Incident Handling Lifecycle", "Digital Forensics Basics", "Malware Analysis Basics", "Disaster Recovery"]
            },
            {
                phase: "Cryptography",
                skills: ["Symmetric/Asymmetric Encryption", "Hashing", "PKI/Certificates", "Data at Rest/Transit"]
            },
            {
                phase: "Identity & Access Management",
                skills: ["MFA", "SSO", "OAuth/SAML", "Principle of Least Privilege"]
            },
            {
                phase: "Compliance & Frameworks",
                skills: ["NIST", "ISO 27001", "GDPR", "Risk Assessment"]
            }
        ]
    },

    cloudArchitect: {
        title: "Cloud Architect",
        description: "Designs, plans, and oversees the implementation of cloud computing strategies and infrastructure.",
        skillFlow: [
            {
                phase: "Cloud Fundamentals",
                skills: ["Cloud Concepts (IaaS, PaaS, SaaS)", "Virtualization", "AWS / Azure / GCP Overview"]
            },
            {
                phase: "Compute & Storage",
                skills: ["VMs (EC2/Azure VMs)", "Serverless (Lambda/Functions)", "Block/Object Storage (S3)", "EBS"]
            },
            {
                phase: "Networking & Delivery",
                skills: ["VPC / Virtual Networks", "Load Balancing", "CDN (CloudFront)", "Route 53 / DNS", "API Gateways"]
            },
            {
                phase: "Database Services",
                skills: ["Managed Relational DBs (RDS)", "NoSQL (DynamoDB/CosmosDB)", "Data Warehousing", "Caching Strategies"]
            },
            {
                phase: "Identity & Security",
                skills: ["IAM Configuration", "Security Groups / WAF", "KMS / Secret Management", "Compliance Standards"]
            },
            {
                phase: "Architecture Patterns",
                skills: ["High Availability", "Disaster Recovery", "Microservices Architecture", "Event-Driven Architecture", "Well-Architected Framework"]
            },
            {
                phase: "Infrastructure & Automation",
                skills: ["Terraform", "CloudFormation", "Cost Optimization", "FinOps Basics"]
            }
        ]
    },

    uiuxDesigner: {
        title: "UI/UX Designer",
        description: "Focuses on user experience and visual design to create intuitive, accessible, and aesthetically pleasing digital products.",
        skillFlow: [
            {
                phase: "UX Fundamentals",
                skills: ["User Centered Design", "Design Thinking", "User Empathy", "Accessibility Basics (WCAG)"]
            },
            {
                phase: "User Research",
                skills: ["User Interviews", "Surveys", "Personas", "User Journey Mapping", "Competitor Analysis"]
            },
            {
                phase: "Information Architecture",
                skills: ["Sitemaps", "User Flows", "Card Sorting", "Wireframing"]
            },
            {
                phase: "UI Design & Prototyping",
                skills: ["Figma / Sketch", "Typography", "Color Theory", "Grid Systems", "Interactive Prototyping"]
            },
            {
                phase: "Design Systems",
                skills: ["Component Libraries", "Design Tokens", "Style Guides", "Auto Layout / Constraints"]
            },
            {
                phase: "Usability Testing",
                skills: ["A/B Testing", "Heuristic Evaluation", "Usability Testing Sessions", "Feedback Iteration"]
            },
            {
                phase: "Handoff & Collaboration",
                skills: ["Developer Handoff", "Asset Exporting", "Design QA", "Understanding Basic HTML/CSS"]
            }
        ]
    },

    qaEngineer: {
        title: "QA Engineer (Automation)",
        description: "Ensures software quality through automated testing frameworks, CI/CD integration, and comprehensive test planning.",
        skillFlow: [
            {
                phase: "Testing Fundamentals",
                skills: ["Software Testing Life Cycle (STLC)", "Test Cases & Plans", "Bug Reporting", "Agile Methodology"]
            },
            {
                phase: "Programming & Tools",
                skills: ["JavaScript/TypeScript", "Python/Java", "Git Version Control", "Command Line Basics"]
            },
            {
                phase: "Web Automation",
                skills: ["Selenium", "Playwright", "Cypress", "Page Object Model (POM)", "Locator Strategies"]
            },
            {
                phase: "API Testing",
                skills: ["Postman", "REST APIs", "GraphQL Testing", "Contract Testing", "Automated API Tests"]
            },
            {
                phase: "Performance & Security QA",
                skills: ["JMeter", "k6", "Load Testing", "Security Testing Basics", "Accessibility Testing"]
            },
            {
                phase: "Mobile Testing",
                skills: ["Appium", "Emulators / Simulators", "Mobile Test Automation", "BrowserStack"]
            },
            {
                phase: "CI/CD & DevOps Integration",
                skills: ["Jenkins/GitHub Actions integration", "Test Reporting (Allure)", "Docker for Testing", "Parallel Execution"]
            }
        ]
    }
};

async function main() {
    console.log("🌱 Seeding Extended Industry Standard Career Roles...")

    for (const [roleKey, roleData] of Object.entries(careerRoleSkills)) {
        console.log(`Processing Role: ${roleData.title}`)

        // 1. Upsert Career Role (Update if exists, Create if not)
        const roleRecord = await prisma.careerRole.upsert({
            where: { title: roleData.title },
            update: { description: roleData.description, isActive: true },
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
