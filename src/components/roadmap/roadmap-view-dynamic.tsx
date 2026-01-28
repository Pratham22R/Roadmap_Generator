'use client'

import dynamic from "next/dynamic"

const RoadmapView = dynamic(() => import("./roadmap-view"), {
    ssr: false,
})

export default RoadmapView
