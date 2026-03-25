import axios from 'axios';
import * as cheerio from 'cheerio';
import { isInternalLink, normalizeUrl } from '../../utils/url.js';

const CTA_PATTERNS = [
  'contact', 'book', 'start', 'sign up', 'signup', 'get started', 'request',
  'schedule', 'buy', 'learn more', 'talk to sales', 'demo', 'try', 'join', 'subscribe'
];

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  const cleaned = cleanText(text);
  return cleaned ? cleaned.split(/\s+/).length : 0;
}

function extractMeta($, name) {
  return cleanText($(`meta[name="${name}"]`).attr('content') || '');
}

function extractHeadings($, tag) {
  return $(tag)
    .map((_i, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean);
}

function looksLikeCTA(text) {
  const lower = text.toLowerCase();
  return CTA_PATTERNS.some((pattern) => lower.includes(pattern));
}

function extractLinks($, baseUrl) {
  let internalLinks = 0;
  let externalLinks = 0;
  let ctaLinks = 0;

  $('a[href]').each((_i, el) => {
    const href = ($(el).attr('href') || '').trim();
    const text = cleanText($(el).text());

    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    if (isInternalLink(baseUrl, href)) internalLinks += 1;
    else externalLinks += 1;

    if (looksLikeCTA(text)) ctaLinks += 1;
  });

  return { internalLinks, externalLinks, ctaLinks };
}

function extractButtons($) {
  const buttonTexts = $('button')
    .map((_i, el) => cleanText($(el).text()))
    .get()
    .filter(Boolean);

  return {
    buttonTexts,
    buttonCount: $('button').length
  };
}

function extractImages($) {
  const images = $('img');
  let missingAlt = 0;

  images.each((_i, el) => {
    const alt = ($(el).attr('alt') || '').trim();
    if (!alt) missingAlt += 1;
  });

  const total = images.length;
  const percentage = total === 0 ? 0 : Number(((missingAlt / total) * 100).toFixed(2));

  return {
    imageCount: total,
    imagesMissingAlt: missingAlt,
    imagesMissingAltPercentage: percentage
  };
}

export async function scrapeWebsite(inputUrl) {
  const url = normalizeUrl(inputUrl);

  let response;
  try {
    response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      maxRedirects: 5
    });
  } catch (error) {
    const message = error.response
      ? `Could not fetch webpage. Received status ${error.response.status}.`
      : 'Could not fetch webpage. The site may block automated requests or be unavailable.';
    const customError = new Error(message);
    customError.status = 502;
    throw customError;
  }

  const html = response.data;
  const $ = cheerio.load(html);

  $('script, style, noscript').remove();

  const pageTitle = cleanText($('title').first().text());
  const metaDescription = extractMeta($, 'description');
  const h1Texts = extractHeadings($, 'h1');
  const h2Texts = extractHeadings($, 'h2');
  const h3Texts = extractHeadings($, 'h3');
  const bodyText = cleanText($('body').text());
  const { internalLinks, externalLinks, ctaLinks } = extractLinks($, url);
  const { buttonTexts, buttonCount } = extractButtons($);
  const ctaTexts = [
    ...buttonTexts,
    ...$('a[href]')
      .map((_i, el) => cleanText($(el).text()))
      .get()
      .filter((text) => text && looksLikeCTA(text))
  ];
  const imageInfo = extractImages($);

  return {
    url,
    metrics: {
      wordCount: countWords(bodyText),
      headingCounts: {
        h1: h1Texts.length,
        h2: h2Texts.length,
        h3: h3Texts.length
      },
      ctaCount: buttonCount + ctaLinks,
      internalLinks,
      externalLinks,
      imageCount: imageInfo.imageCount,
      imagesMissingAlt: imageInfo.imagesMissingAlt,
      imagesMissingAltPercentage: imageInfo.imagesMissingAltPercentage,
      metaTitle: pageTitle,
      metaDescription
    },
    contentSnapshot: {
      title: pageTitle,
      metaDescription,
      headings: {
        h1: h1Texts,
        h2: h2Texts,
        h3: h3Texts
      },
      ctaTexts: [...new Set(ctaTexts)].slice(0, 20),
      bodyTextExcerpt: bodyText.slice(0, 5000)
    }
  };
}
