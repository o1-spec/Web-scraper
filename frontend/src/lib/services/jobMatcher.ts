export function calculateMatchScore(title: string, description: string, userKeywords: string[]): { score: number, tags: string[] } {
  if (!userKeywords || userKeywords.length === 0) {
    return { score: 0, tags: [] };
  }

  const combinedText = `${title} ${description}`.toLowerCase();
  const matchedTags: string[] = [];
  let score = 0;

  for (const keyword of userKeywords) {
    const kw = keyword.toLowerCase();
    
    // Check if exact match exists
    // Basic word boundary regex
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    
    if (regex.test(combinedText)) {
      matchedTags.push(keyword);
      // Give more weight to matches in the title
      if (title.toLowerCase().includes(kw)) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  // Cap score at 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  return { score: normalizedScore, tags: matchedTags };
}
