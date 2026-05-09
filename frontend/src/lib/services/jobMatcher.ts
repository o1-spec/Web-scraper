export function calculateMatchScore(title: string, description: string, userKeywords: string[]): { score: number, tags: string[] } {
  if (!userKeywords || userKeywords.length === 0) {
    return { score: 0, tags: [] };
  }

  const combinedText = `${title} ${description}`.toLowerCase();
  const matchedTags: string[] = [];
  let score = 0;

  for (const keyword of userKeywords) {
    const kw = keyword.toLowerCase();
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    
    if (regex.test(combinedText)) {
      matchedTags.push(keyword);
      if (title.toLowerCase().includes(kw)) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  const normalizedScore = Math.min(100, Math.max(0, score));

  return { score: normalizedScore, tags: matchedTags };
}
