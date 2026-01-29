import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

// SVGs for technology logos
export const TechIcons: Record<string, React.JSX.Element> = {
    React: (
        <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#087ea4]"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>
    ),
    Nextjs: (
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-black"><mask id="mask0" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180"><circle cx="90" cy="90" r="90" fill="black" /></mask><g mask="url(#mask0)"><circle cx="90" cy="90" r="90" fill="black" /><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" /><path d="M115 54H127V125.97H115V54Z" fill="white" /></g></svg>
    ),
    // ... other icons ...

    TypeScript: (
        <svg viewBox="0 0 128 128" className="w-full h-full"><path fill="#007ACC" d="M0 0h128v128H0z" /><path fill="#FFF" d="M71.4 78c-1.6-1.5-2.2-3.6-2.2-6.5v-.5h-15v.8c0 7.8 2 12.3 8.3 14.8 5.6 2.2 24.3 3.6 22 13.9-1.2 5.5-5.9 8.2-12.7 8.2-13.8 0-14.8-10.4-15-12h-15c.3 7 3.5 16.3 14.7 20.3 5.4 1.9 11.2 2 15.6 2 9.4 0 20.6-2.8 23.3-13.4 2.8-10.8-3.4-16.7-10.5-19.1-8.5-2.8-16.4-3.5-17.2-9-1.1-6.8 6.5-7.7 11.2-7.7 5.8 0 10.3 1.2 11.4 9.1h14.8c-1.3-13.3-10-19.4-24.8-19.4-10.8 0-19.3 5.1-23.9 13.7zM24.8 66h15.2v25.3c0 10.6 5.8 16.7 14.7 16.7 15.5 0 13.5-18 13.5-18V66h15.2v25.2c0 10-1 16-6.3 21-6.2 5.7-16 5.7-22.1 5.7-9.5 0-18.4-2.8-23-10-4.5-7-7.2-17.6-7.2-28.5V66z" /></svg>
    ),
    Tailwind: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#38bdf8]" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" /></svg>
    ),
    Node: (
        <svg viewBox="0 0 32 32" className="w-full h-full text-[#339933]" fill="currentColor"><path d="M0 0h32v32H0V0z" fill="none" /><path d="M16 3c-1.5 0-2.8.8-3.5 2.1l-6.3 11c-.7 1.2-.7 2.7 0 3.9l6.3 11c.7 1.2 2 2 3.5 2s2.8-.8 3.5-2.1l6.3-11c.7-1.2.7-2.7 0-3.9l-6.3-11C18.8 3.8 17.5 3 16 3zm0 2.2c.4 0 .7.2.9.5l6.3 11c.2.4.2.8 0 1.2l-6.3 11c-.2.4-.5.5-.9.5s-.7-.2-.9-.5l-6.3-11c-.2-.4-.2-.8 0-1.2l6.3-11c.2-.3.5-.5.9-.5zM16 11c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 2c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" /></svg> // Simplified hexagon
    ),
    Prisma: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#142d3e]" fill="currentColor"><path d="M12 2l-9.5 16h19L12 2zm0 4.14L16.62 16H7.38L12 6.14z" /></svg>
    ),
    Postgres: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#336791]" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg> // Simplified
    ),
    Github: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-black" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
    ),
    Docker: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#2496ed]" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.119a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V3.574a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.888c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V3.574a.185.185 0 00-.186-.185H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V6.291a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.888c0 .102.082.185.185.185m-2.953 0h2.119a.185.185 0 00.186-.185V6.291a.186.186 0 00-.186-.186H8.1a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V6.291a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.888c0 .102.084.185.186.185m-2.929 0h2.12a.185.185 0 00.184-.185V6.291a.185.185 0 00-.184-.186H2.207a.185.185 0 00-.185.186v1.888c0 .102.082.185.185.185m11.032 2.617h2.119a.185.185 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.888c0 .102.083.185.185.185m-2.954 0h2.119a.185.185 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.1a.186.186 0 00-.185.186v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.888c0 .102.084.185.186.185m-2.929 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186H2.207a.185.185 0 00-.185.186v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-1.843 0-2.55 1.15-2.577 1.191-.027.042-.778 1.213-2.435 1.213-2.184 0-3.376-1.888-3.415-1.93-1.077-1.127-2.315-1.574-3.528-1.574-1.39 0-2.456.63-2.96 1.088v-.386c0-.1-.083-.182-.185-.182H.185A.185.185 0 000 8.983v11.16c0 .367.126.892.49 1.433.805 1.196 2.628 2.424 5.923 2.424 4.887 0 6.55-3.08 6.55-3.111.018-.035.801-1.39 2.651-1.39 1.115 0 2.222.463 3.036 1.27.02.02.664.636 1.777.636.953 0 1.959-.444 2.83-1.25.042-.039.068-.092.072-.149l.034-9.928a.185.185 0 00-.1-.188z" /></svg>
    ),
    OpenAI: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#10a37f]" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4533l-.142.0805L8.704 5.4596a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" /></svg>
    ),
    Vercel: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-black" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z" /></svg>
    ),
    Docs: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-indigo-500" fill="currentColor" stroke="none"><path d="M19.988 3.525c-1.35.328-3.098.502-4.488.502-2.197 0-4.048-.544-5.5-.964-1.452.42-3.303.964-5.5.964-1.39 0-3.138-.174-4.488-.502C.008 3.523 0 3.527 0 3.535v15.908c0 .126.06.242.164.316.326.236 1.83.991 4.336.991 2.227 0 4.1-.555 5.5-1.002 1.4.447 3.273 1.002 5.5 1.002 2.506 0 4.01-.755 4.336-.991.104-.074.164-.19.164-.316V3.535c0-.008-.008-.012-.012-.01zM11 18.235c-1.298.528-3.088 1.015-5.5 1.015-1.874 0-3.236-.379-3.953-.63V5.517c.582.16 1.77.483 3.953.483 2.019 0 3.497-.33 4.672-.656.34-.094.636-.208.828-.27v13.16z" /></svg>
    ),
    Firebase: (
        <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M3.89 15.672L6.255.461A.54.54 0 017.27.288l2.54 5.235zm16.794-2.85l-1.63-8.875a.54.54 0 00-.91-.192l-4.75 5.758zm-1.07 1.258l-5.678 3.167-2.617-5.545L3.38 15.158A1.674 1.674 0 004.91 18h14.86a1.675 1.675 0 001.25-2.733l-.336-.387z" fill="#039BE5" /><path d="M13.935 11.696L11.318 17.24 6.254.46a.539.539 0 011.015-.173l2.844 5.86 3.822 5.55z" fill="#FBC02D" /></svg> // Simplified
    ),
    YouTube: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-red-600" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
    ),
    JavaScript: (
        <svg viewBox="0 0 24 24" className="w-full h-full"><path d="M0 0h24v24H0V0z" fill="#F7DF1E" /><path d="M6.744 17.808c.451 1.248 1.564 2.132 3.204 2.132 1.455 0 2.378-.718 2.378-2.585v-5.632h-2.378v5.524c0 .59-.364.916-1.025.916-.549 0-.916-.29-1.127-.724l-2.052 1.369zm13.136-7.854h-2.378v4.956c0 1.29-.636 1.956-1.674 1.956-.78 0-1.282-.41-1.396-1.144l-2.227.766c.383 1.748 1.636 2.5 3.193 2.5 2.518 0 4.082-1.336 4.482-4.149v-4.885z" fill="#000" /></svg>
    ),
    Globe: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
    ),
    Inngest: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <rect width="24" height="24" rx="6" fill="#020817" />
            <path d="M6 8L12 11L18 8M6 16L12 13L18 16M12 13V20M12 4V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Google: (
        <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
    ),
    AWS: (
        <svg role="img" viewBox="0 0 24 24" className="w-full h-full text-[#FF9900]" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.793 8.36c-.053-.186-.337-.189-.524-.006l-2.071 2.036c-.198.196-.549.208-.737.02l-2.112-2.112c-.171-.171-.448-.168-.616.006l-2.115 2.19c-.197.203-.431.146-.464-.131l-.226-1.896c-.035-.297-.474-.403-.66-.16l-2.228 2.909c-.156.203.023.498.272.454l1.961-.347c.28-.05.541.096.586.375l.478 2.964c.061.378.601.408.706.039l.995-3.483c.08-.28.487-.272.556.012l1.636 6.755c.084.348.583.336.649-.016l1.328-7.067c.05-.265.426-.289.513-.032l2.674 7.904c.105.31.554.298.647-.018l2.585-8.773c.092-.313-.197-.597-.497-.539l-2.529.493c-.279.054-.515-.176-.448-.445z" /></svg>
    ),
    Polar: (
        <svg viewBox="0 0 24 24" className="w-full h-full text-[#0062FF]" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm0-8h-6V7h6v2z" /></svg> // Simplified placeholder
    )
};

// 5x5 Grid pattern configuration (25 items)
// Pattern based on request: Empty/Icon scattered organically
// 0 = Empty, 1 = Icon, 2 = Center
// Indices:
// 0  1  2  3  4
// 5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24
// Center is 12

// Let's define the items based on the visual pattern requested
// " ⬜ ⬜ 🟦 ⬜ 🟦" -> Row 1 (Empty, Empty, Tech, Empty, Tech)
// ... and so on to create a nice scattered look centered around 12.

const gridLayout = [
    // Row 0
    null, "React", null, "Node", null,
    // Row 1
    "TypeScript", null, "Tailwind", null, "Postgres",
    // Row 2
    null, "Prisma", "CENTER", "Github", null,
    // Row 3
    "Docker", null, "AWS", "Firebase", null,
    // Row 4
    null, "YouTube", null, "Docs", null
];

export function TechnologyGrid() {
    // Container orchestrates the staggered entrance
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    // Item variants for entrance + continuous floating
    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.5,
            y: 20 // Start slightly below
        },
        visible: (custom: number) => ({
            opacity: 1,
            scale: 1,
            y: [0, -6, 0], // Float up and down
            transition: {
                opacity: { duration: 0.5, ease: "easeOut" },
                scale: { type: "spring", stiffness: 260, damping: 20 },
                y: {
                    duration: 4 + (custom % 5), // Randomize duration (4-9s)
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (custom % 3) * 0.5 // Randomize start delay for float
                }
            }
        })
    };

    return (
        <div className="relative flex items-center justify-center p-8 select-none w-full h-full">
            {/* 5x5 Grid Container with radial mask */}
            <motion.div
                className="grid grid-cols-5 gap-3 md:gap-4 p-4"
                style={{
                    maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 90%)",
                    WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 90%)"
                }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {gridLayout.map((techName, i) => {
                    const isCenter = techName === "CENTER";
                    const isEmpty = !techName;

                    if (isCenter) {
                        return (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={itemVariants}
                                className="relative z-10 flex h-14 w-14 md:h-[72px] md:w-[72px] items-center justify-center rounded-[20px] bg-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] cursor-pointer"
                                whileHover={{
                                    scale: 1.1,
                                    boxShadow: "0px 20px 40px rgba(0,0,0,0.25)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <span className="text-white font-bold text-2xl">R</span>
                            </motion.div>
                        )
                    }

                    if (isEmpty) {
                        return (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={itemVariants}
                                className="flex h-12 w-12 md:h-16 md:w-16 rounded-[20px] bg-[#f6f7f9] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] opacity-50"
                                whileHover={{
                                    opacity: 1,
                                    backgroundColor: "#ffffff",
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                            />
                        )
                    }

                    const Icon = TechIcons[techName] || TechIcons["Globe"]; // Fallback

                    return (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={itemVariants}
                            className={cn(
                                "group relative flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-[20px] bg-[#f6f7f9] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] cursor-pointer",
                                "transition-colors duration-300 hover:bg-white" // Keep simple classes for colors
                            )}
                            whileHover={{
                                scale: 1.15,
                                zIndex: 20,
                                boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
                                transition: { duration: 0.2 }
                            }}
                        >
                            <div className="w-6 h-6 md:w-8 md:h-8 opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-3">
                                {Icon}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
