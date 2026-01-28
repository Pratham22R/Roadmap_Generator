import { Inngest } from "inngest";

// valid event keys to prevent typos
type Events = {
    "user/signed.up": {
        data: {
            userId: string;
            email: string;
            name?: string;
        };
    };
    "roadmap/generated": {
        data: {
            userId: string;
            email: string;
            roadmapId: string;
            roadmapTitle: string;
        };
    };
    "progress/weekly.summary": {
        data: {
            userId: string;
            email: string;
            periodStart: string;
            periodEnd: string;
        };
    };
    "user/inactive": {
        data: {
            userId: string;
            email: string;
            lastActiveAt: string;
        };
    };
    "progress/milestone.reached": {
        data: {
            userId: string;
            email: string;
            milestoneType: "25%" | "50%" | "100%";
            roadmapId: string;
        };
    };
    "user/motivation.trigger": {
        data: {
            userId: string;
            email: string;
            message: string;
        };
    };
};

export const inngest = new Inngest({ id: "roadmap-gen", schemas: {} as any });
