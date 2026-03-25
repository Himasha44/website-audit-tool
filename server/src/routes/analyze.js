import { Router } from 'express';
import { scrapeWebsite } from '../services/scraper/scrapeWebsite.js';
import { analyzeWebsite } from '../services/ai/analyzeWebsite.js';
import { isValidHttpUrl } from '../utils/url.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url || !isValidHttpUrl(url)) {
      return res.status(400).json({ error: 'Please provide a valid http/https URL.' });
    }

    const scraped = await scrapeWebsite(url);

    let aiResult = {
      insights: {
        seoStructure: 'AI analysis not available. Add an OpenAI API key to enable this section.',
        messagingClarity: 'AI analysis not available. Add an OpenAI API key to enable this section.',
        ctaUsage: 'AI analysis not available. Add an OpenAI API key to enable this section.',
        contentDepth: 'AI analysis not available. Add an OpenAI API key to enable this section.',
        uxStructuralConcerns: 'AI analysis not available. Add an OpenAI API key to enable this section.'
      },
      recommendations: [],
      logs: {
        systemPrompt: 'Not executed',
        userPrompt: 'Not executed',
        rawModelOutput: 'Not executed'
      }
    };

    if (process.env.OPENAI_API_KEY) {
      aiResult = await analyzeWebsite(scraped);
    }

    res.json({
      url: scraped.url,
      fetchedAt: new Date().toISOString(),
      metrics: scraped.metrics,
      contentSnapshot: scraped.contentSnapshot,
      insights: aiResult.insights,
      recommendations: aiResult.recommendations,
      logs: aiResult.logs
    });
  } catch (error) {
    next(error);
  }
});

export default router;
