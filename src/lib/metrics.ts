import { getPrisma } from "@/lib/prisma"

export async function calculateStreak(userId: string) {
  const logs = await getPrisma().progressLog.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    select: { timestamp: true }
  })
  
  if (logs.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let currentCompareDate = today
  
  // Check if active today
  const lastLogDate = new Date(logs[0].timestamp)
  lastLogDate.setHours(0,0,0,0)
  
  if (lastLogDate.getTime() === today.getTime()) {
    streak = 1
    currentCompareDate.setDate(currentCompareDate.getDate() - 1)
  } else {
    // If not active today, check if active yesterday to keep streak alive?
    // Usually streak breaks if not active today OR yesterday depending on leniency.
    // Let's assume strict daily. If last log was yesterday, streak is alive but count starts from yesterday.
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (lastLogDate.getTime() === yesterday.getTime()) {
        streak = 1
        currentCompareDate.setDate(currentCompareDate.getDate() - 1)
    } else {
        return 0 // Streak broken
    }
  }

  // Iterate backwards unique days
  const uniqueDates = new Set(logs.map((l: { timestamp: Date }) => {
      const d = new Date(l.timestamp)
      d.setHours(0,0,0,0)
      return d.getTime()
  }))
  
  // Already validated uniqueDates contains lastLogDate.
  // We need to check if it has currentCompareDate, then currentCompareDate - 1, etc.
  
  // Simple optimization:
  while (true) {
    if (uniqueDates.has(currentCompareDate.getTime())) {
        streak++
        currentCompareDate.setDate(currentCompareDate.getDate() - 1)
    } else {
        break
    }
  }
  
  return streak
}
