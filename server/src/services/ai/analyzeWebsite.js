import OpenAI from 'openai';

function buildPrompts(scraped) {
  const systemPrompt = `You are a website audit assistant for a web agency. Analyze only the provided factual metrics and extracted page content. Do not invent facts. Keep analysis specific, concise, and grounded in the supplied data. Return valid JSON only.`;

  const structuredInput = {
    url: scraped.url,
    metrics: scraped.metrics,
    contentSnapshot: scraped.contentSnapshot,
    requiredOutputSchema: {
      insights: {
        seoStructure: 'string',
        messagingClarity: 'string',
        ctaUsage: 'string',
        contentDepth: 'string',
        uxStructuralConcerns: 'string'
      },
      recommendations: [
        {
          priority: 'number',
          title: 'string',
          reasoning: 'string',
          action: 'string'
        }
      ]
    }
  };

  const userPrompt = `Analyze this single webpage using the provided structured data. Every insight must reference actual extracted facts. Provide 3 to 5 prioritized recommendations. Output JSON only.\n\n${JSON.stringify(structuredInput, null, 2)}`;

  return { systemPrompt, userPrompt };
}

export async function analyzeWebsite(scraped) {
  const { systemPrompt, userPrompt } = buildPrompts(scraped);
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  if (!process.env.OPENAI_API_KEY) {
    return {
      insights: {
        seoStructure: 'No OPENAI_API_KEY found. AI analysis is unavailable.',
        messagingClarity: 'No OPENAI_API_KEY found. AI analysis is unavailable.',
        ctaUsage: 'No OPENAI_API_KEY found. AI analysis is unavailable.',
        contentDepth: 'No OPENAI_API_KEY found. AI analysis is unavailable.',
        uxStructuralConcerns: 'No OPENAI_API_KEY found. AI analysis is unavailable.'
      },
      recommendations: [],
      logs: {
        systemPrompt,
        userPrompt,
        rawModelOutput: 'No model call made because OPENAI_API_KEY is missing.'
      }
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.responses.create({
    model,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3
  });

  const rawModelOutput = response.output_text;
  let parsed;

  try {
    parsed = JSON.parse(rawModelOutput);
  } catch {
    parsed = {
      insights: {
        seoStructure: 'The model returned a non-JSON response. Review raw output in logs.',
        messagingClarity: 'The model returned a non-JSON response. Review raw output in logs.',
        ctaUsage: 'The model returned a non-JSON response. Review raw output in logs.',
        contentDepth: 'The model returned a non-JSON response. Review raw output in logs.',
        uxStructuralConcerns: 'The model returned a non-JSON response. Review raw output in logs.'
      },
      recommendations: []
    };
  }

  return {
    insights: parsed.insights,
    recommendations: parsed.recommendations || [],
    logs: {
      systemPrompt,
      userPrompt,
      rawModelOutput
    }
  };
}