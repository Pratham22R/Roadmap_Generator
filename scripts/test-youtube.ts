
import 'dotenv/config'
import { google } from "googleapis"

async function main() {
    console.log("🔍 Testing YouTube API Key...")

    const key = process.env.YOUTUBE_API_KEY
    if (!key) {
        console.error("❌ ERROR: YOUTUBE_API_KEY is missing from process.env")
        console.log("Loaded env vars:", Object.keys(process.env).filter(k => k.includes("YOUTUBE")))
        return
    }

    console.log(`🔑 Key found (starts with: ${key.substring(0, 4)}...)`)

    const youtube = google.youtube({
        version: "v3",
        auth: key
    })

    try {
        console.log("📡 Sending test request...")
        const response = await youtube.search.list({
            part: ["snippet"],
            q: "Traversy Media React",
            maxResults: 1,
            type: ["video"]
        })

        console.log("✅ API Response Received:")
        if (response.data.items && response.data.items.length > 0) {
            const video = response.data.items[0]
            console.log(`   Title: ${video.snippet?.title}`)
            console.log(`   ID: ${video.id?.videoId}`)
            console.log("🎉 SUCCESS: API is working correctly.")
        } else {
            console.warn("⚠️ API returned no results (but worked).")
        }

    } catch (error: any) {
        console.error("❌ API Request Failed:")
        if (error.response) {
            console.error(`   Status: ${error.response.status}`)
            console.error(`   Reason: ${JSON.stringify(error.response.data.error.errors[0]?.reason)}`)
            console.error(`   Message: ${JSON.stringify(error.response.data.error.message)}`)
        } else {
            console.error(error)
        }
    }
}

main()
