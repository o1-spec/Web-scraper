import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const lowerQuery = query.toLowerCase();

  // Mocked discovery results based on regional relevance (Nigeria/Africa/Remote)
  const allSuggestions = [
    { 
      name: 'NewGlobe', 
      url: 'https://boards.greenhouse.io/newglobe', 
      sourceType: 'greenhouse', 
      industry: 'Education Technology' 
    },
    { 
      name: 'TELUS International', 
      url: 'https://jobs.lever.co/telusinternational', 
      sourceType: 'lever', 
      industry: 'Digital Experience / BPO' 
    },
    { 
      name: 'Kuda Bank', 
      url: 'https://boards.greenhouse.io/kuda', 
      sourceType: 'greenhouse', 
      industry: 'Fintech / Banking' 
    },
    { 
      name: 'Paystack', 
      url: 'https://boards.greenhouse.io/paystack', 
      sourceType: 'greenhouse', 
      industry: 'Fintech / Payments' 
    },
    { 
      name: 'Andela', 
      url: 'https://boards.greenhouse.io/andela', 
      sourceType: 'greenhouse', 
      industry: 'Talent / Staffing' 
    },
    { 
      name: 'FairMoney', 
      url: 'https://jobs.lever.co/fairmoney', 
      sourceType: 'lever', 
      industry: 'Fintech / Lending' 
    },
    { 
      name: 'TeamApt (Moniepoint)', 
      url: 'https://boards.greenhouse.io/teamapt', 
      sourceType: 'greenhouse', 
      industry: 'Fintech' 
    },
    { 
      name: 'Helium Health', 
      url: 'https://boards.greenhouse.io/heliumhealth', 
      sourceType: 'greenhouse', 
      industry: 'Health Tech' 
    },
    { 
      name: 'Brass', 
      url: 'https://boards.greenhouse.io/brass', 
      sourceType: 'greenhouse', 
      industry: 'Fintech / Business Banking' 
    },
  ];

  // Simple filter to make it feel "real"
  const filteredResults = allSuggestions.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) || 
    s.industry.toLowerCase().includes(lowerQuery) ||
    lowerQuery.includes('nigeria') || 
    lowerQuery.includes('africa') ||
    lowerQuery.includes('tech')
  );

  // Return at most 6 results
  const results = filteredResults.slice(0, 6);

  // Artificial delay for "discovery" feel
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json({ results });
}
