# Sample Prompt Log

## System Prompt

You are a website audit assistant for a web agency. Analyze only the provided factual metrics and extracted page content. Do not invent facts. Keep analysis specific, concise, and grounded in the supplied data. Return valid JSON only.

## User Prompt Template

Analyze this single webpage using the provided structured data. Every insight must reference actual extracted facts. Provide 3 to 5 prioritized recommendations. Output JSON only.

{
  "url": "https://example.com",
  "metrics": {
    "wordCount": 1200,
    "headingCounts": { "h1": 1, "h2": 5, "h3": 3 },
    "ctaCount": 2,
    "internalLinks": 12,
    "externalLinks": 3,
    "imageCount": 6,
    "imagesMissingAlt": 2,
    "imagesMissingAltPercentage": 33.33,
    "metaTitle": "Example Title",
    "metaDescription": "Example description"
  },
  "contentSnapshot": {
    "title": "Example Title",
    "metaDescription": "Example description",
    "headings": {
      "h1": ["Main Heading"],
      "h2": ["Section 1", "Section 2"],
      "h3": []
    },
    "ctaTexts": ["Contact Us", "Get Started"],
    "bodyTextExcerpt": "Example excerpt..."
  }
}

## Example Raw Model Output

{
  "insights": {
    "seoStructure": "The page has a clear primary heading structure with 1 H1, supported by 5 H2s and 3 H3s, but 33.33% of images are missing alt text, which weakens accessibility and image SEO.",
    "messagingClarity": "The page appears to have moderate content depth at roughly 1,200 words, which is enough to communicate value, but the clarity should be checked against how focused the H2 sections are.",
    "ctaUsage": "Only 2 CTA elements were detected, which may be light if the page is intended to drive lead generation.",
    "contentDepth": "The word count suggests the page has enough substance for a service or landing page, assuming the content stays focused and scannable.",
    "uxStructuralConcerns": "Missing image alt text and a relatively low CTA count suggest the page may underperform in accessibility and conversion support."
  },
  "recommendations": [
    {
      "priority": 1,
      "title": "Fix missing alt text",
      "reasoning": "Two of six images are missing alt text, affecting accessibility and SEO.",
      "action": "Add concise, descriptive alt text to all images that convey meaningful content."
    },
    {
      "priority": 2,
      "title": "Strengthen CTA presence",
      "reasoning": "Only two CTA elements were detected across the page.",
      "action": "Add or reinforce action-oriented CTAs near key content sections and near the bottom of the page."
    }
  ]
}
