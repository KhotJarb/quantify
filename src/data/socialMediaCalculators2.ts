// ---------------------------------------------------------------------------
// Quantify � Social Media & Digital Marketing Calculators (Part 2)
// ---------------------------------------------------------------------------
// 10 calculators covering Instagram engagement, TikTok earnings, YouTube
// AdSense, SEO keyword density, email marketing ROI, influencer rates,
// A/B test significance, LTV:CAC, bounce rate, and ROAS.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const socialMediaCalculators2: CalculatorSchema[] = [
  // ---------------------------------------------------------------------------
  // 1. Instagram Engagement Rate Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'instagram-engagement-rate',
    slug: 'instagram-engagement-rate',
    title: 'Instagram Engagement Rate Calculator',
    description:
      'Calculate your Instagram engagement rate based on followers, average likes, and comments to benchmark your account performance against industry standards.',
    icon: '📷',
    category: 'business',
    subcategory: 'social-media',
    tags: ['instagram', 'engagement rate', 'social media', 'likes', 'comments', 'influencer', 'analytics'],
    inputs: [
      {
        id: 'followers',
        label: 'Followers',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 10000',
        helpText: 'Total number of followers on your Instagram account.',
      },
      {
        id: 'avgLikes',
        label: 'Average Likes per Post',
        type: 'number',
        defaultValue: 450,
        min: 0,
        step: 1,
        placeholder: 'e.g. 450',
        helpText: 'Average number of likes across your recent posts.',
      },
      {
        id: 'avgComments',
        label: 'Average Comments per Post',
        type: 'number',
        defaultValue: 30,
        min: 0,
        step: 1,
        placeholder: 'e.g. 30',
        helpText: 'Average number of comments across your recent posts.',
      },
    ],
    formulas: [
      {
        id: 'engagementRate',
        expression: '(avgLikes + avgComments) / followers * 100',
        dependencies: ['avgLikes', 'avgComments', 'followers'],
      },
    ],
    outputs: [
      {
        id: 'engagementRateOut',
        label: 'Engagement Rate',
        formulaRef: 'engagementRate',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Instagram Engagement Rate (ER) measures how actively your audience interacts with your content relative to your follower count. It is one of the most important metrics for brands and creators because a high ER signals an authentic, responsive audience � far more valuable than a large but passive following.',
      howToUse:
        '1. Enter your total follower count.\n2. Enter the average number of likes per post (calculate from your last 10�15 posts).\n3. Enter the average number of comments per post.\nThe calculator divides total interactions by followers and multiplies by 100 to give your ER as a percentage.',
      exampleScenario:
        'A creator with 10,000 followers averages 450 likes and 30 comments per post. Engagement Rate = (450 + 30) / 10,000 � 100 = 4.8%. This falls in the "good" range (3�6%) and would attract brand sponsorship offers.',
      proTip:
        'Industry benchmarks: <1% is considered poor, 1�3% is average, 3�6% is good, and >6% is excellent. Micro-influencers (1K�100K followers) typically have higher ER than mega-influencers. To boost ER, post consistently, use Reels, reply to every comment in the first hour, and use 3�5 highly relevant hashtags rather than 30 generic ones.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 2. TikTok Creator Fund Estimator
  // ---------------------------------------------------------------------------
  {
    id: 'tiktok-earnings-estimator',
    slug: 'tiktok-earnings-estimator',
    title: 'TikTok Creator Fund Estimator',
    description:
      'Estimate your monthly TikTok earnings from the Creator Fund and sponsored posts based on your monthly views, CPM rate, and sponsorship deals.',
    icon: '🎵',
    category: 'business',
    subcategory: 'social-media',
    tags: ['tiktok', 'creator fund', 'earnings', 'cpm', 'sponsorship', 'monetization', 'social media'],
    inputs: [
      {
        id: 'monthlyViews',
        label: 'Monthly Views',
        type: 'number',
        defaultValue: 500000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 500000',
        helpText: 'Total video views across all content in a month.',
      },
      {
        id: 'cpmRate',
        label: 'CPM Rate ($/1000 views)',
        type: 'number',
        defaultValue: 0.025,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 0.025',
        helpText: 'TikTok Creator Fund avg $0.02-$0.04',
      },
      {
        id: 'sponsoredPosts',
        label: 'Sponsored Posts per Month',
        type: 'number',
        defaultValue: 2,
        min: 0,
        step: 1,
        placeholder: 'e.g. 2',
        helpText: 'Number of paid brand partnerships per month.',
      },
      {
        id: 'avgSponsoredRate',
        label: 'Avg Sponsored Post Rate ($)',
        type: 'number',
        defaultValue: 200,
        min: 0,
        step: 10,
        placeholder: 'e.g. 200',
        helpText: 'Your average fee per sponsored TikTok post.',
      },
    ],
    formulas: [
      {
        id: 'creatorFundEarnings',
        expression: 'monthlyViews / 1000 * cpmRate',
        dependencies: ['monthlyViews', 'cpmRate'],
      },
      {
        id: 'sponsoredEarnings',
        expression: 'sponsoredPosts * avgSponsoredRate',
        dependencies: ['sponsoredPosts', 'avgSponsoredRate'],
      },
      {
        id: 'totalMonthly',
        expression: 'creatorFundEarnings + sponsoredEarnings',
        dependencies: ['creatorFundEarnings', 'sponsoredEarnings'],
      },
    ],
    outputs: [
      {
        id: 'creatorFundEarningsOut',
        label: 'Creator Fund Earnings',
        formulaRef: 'creatorFundEarnings',
        format: 'number',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'sponsoredEarningsOut',
        label: 'Sponsored Income',
        formulaRef: 'sponsoredEarnings',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'totalMonthlyOut',
        label: 'Total Monthly Earnings',
        formulaRef: 'totalMonthly',
        format: 'number',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'TikTok Creator Fund pays eligible creators based on video views, though the rate is notoriously variable ($0.02�$0.04 per 1,000 views). Sponsored content is the primary revenue driver for most creators, often accounting for 80�95% of total earnings.',
      howToUse:
        '1. Enter your average monthly video views.\n2. Set the CPM rate (use $0.025 as a conservative default).\n3. Enter how many sponsored posts you land per month and your average fee.\nThe calculator separates Creator Fund income from sponsorship income so you can see your actual earning breakdown.',
      exampleScenario:
        'A creator with 500,000 monthly views at $0.025 CPM earns $12.50 from the Creator Fund. With 2 sponsored posts at $200 each, total monthly income = $412.50. This illustrates why sponsorships dwarf Creator Fund income.',
      proTip:
        'The TikTok Creator Fund has been replaced in some regions by the Creativity Program Beta, which pays significantly more (up to $1 per 1,000 views for longer content). Focus on growing an email list and merchandise sales to build income streams independent of platform algorithm changes.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 3. YouTube AdSense Earnings Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'youtube-adsense-calculator',
    slug: 'youtube-adsense-calculator',
    title: 'YouTube AdSense Earnings Calculator',
    description:
      'Estimate your monthly and annual YouTube AdSense revenue based on views, click-through rate, and RPM to plan your content monetization strategy.',
    icon: '📺',
    category: 'business',
    subcategory: 'social-media',
    tags: ['youtube', 'adsense', 'rpm', 'ctr', 'monetization', 'creator earnings', 'ads revenue'],
    inputs: [
      {
        id: 'monthlyViews',
        label: 'Monthly Views',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 100000',
        helpText: 'Total views across all videos in a month.',
      },
      {
        id: 'ctr',
        label: 'Click-Through Rate %',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 5',
        helpText: 'Percentage of views where ads are clicked.',
      },
      {
        id: 'rpm',
        label: 'RPM (Revenue per 1000 views, $)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'Average $1-$10, varies by niche',
      },
    ],
    formulas: [
      {
        id: 'monetizedViews',
        expression: 'monthlyViews * ctr / 100',
        dependencies: ['monthlyViews', 'ctr'],
      },
      {
        id: 'estimatedRevenue',
        expression: 'monthlyViews / 1000 * rpm',
        dependencies: ['monthlyViews', 'rpm'],
      },
      {
        id: 'annualRevenue',
        expression: 'estimatedRevenue * 12',
        dependencies: ['estimatedRevenue'],
      },
    ],
    outputs: [
      {
        id: 'estimatedRevenueOut',
        label: 'Est. Monthly Revenue',
        formulaRef: 'estimatedRevenue',
        format: 'number',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annualRevenueOut',
        label: 'Est. Annual Revenue',
        formulaRef: 'annualRevenue',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'monetizedViewsOut',
        label: 'Monetized Views',
        formulaRef: 'monetizedViews',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'YouTube RPM (Revenue Per Mille) represents the earnings a creator actually receives per 1,000 video views after YouTube takes its 45% cut. It differs from CPM (Cost Per Mille), which is what advertisers pay. RPM varies enormously by niche: finance/investing ($10�$30), tech ($4�$10), entertainment ($1�$3).',
      howToUse:
        '1. Enter your monthly view count.\n2. Set your CTR � 4�7% is typical for established channels.\n3. Enter your RPM from YouTube Studio analytics (Settings ? Revenue).\nThe calculator projects monthly and annual earnings and shows how many of your views result in monetized ad interactions.',
      exampleScenario:
        'A personal finance channel with 100,000 monthly views and an RPM of $8 earns $800/month or $9,600/year from AdSense alone. Adding sponsorships at 1�2 deals per month could 3�5x that figure.',
      proTip:
        'Boost RPM by targeting high-CPM niches (finance, B2B software, legal), publishing long-form content (8+ minutes) to enable mid-roll ads, and uploading during Q4 (October�December) when ad budgets peak. Aim for 1,000 subscribers + 4,000 watch hours for YPP eligibility.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 4. SEO Keyword Density Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'seo-keyword-density',
    slug: 'seo-keyword-density',
    title: 'SEO Keyword Density Calculator',
    description:
      'Calculate keyword density and LSI keyword distribution to optimize content for search engines while avoiding over-optimization penalties.',
    icon: '🔍',
    category: 'business',
    subcategory: 'social-media',
    tags: ['seo', 'keyword density', 'lsi keywords', 'content optimization', 'on-page seo', 'serp'],
    inputs: [
      {
        id: 'totalWords',
        label: 'Total Word Count',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Total number of words in your article or page.',
      },
      {
        id: 'keywordCount',
        label: 'Keyword Occurrences',
        type: 'number',
        defaultValue: 8,
        min: 0,
        step: 1,
        placeholder: 'e.g. 8',
        helpText: 'Number of times your primary keyword appears.',
      },
      {
        id: 'lsiKeywords',
        label: 'LSI/Related Keyword Count',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'Occurrences of semantically related keywords.',
      },
    ],
    formulas: [
      {
        id: 'keywordDensity',
        expression: 'keywordCount / totalWords * 100',
        dependencies: ['keywordCount', 'totalWords'],
      },
      {
        id: 'lsiDensity',
        expression: 'lsiKeywords / totalWords * 100',
        dependencies: ['lsiKeywords', 'totalWords'],
      },
      {
        id: 'overallRelevance',
        expression: 'keywordDensity + lsiDensity * 0.5',
        dependencies: ['keywordDensity', 'lsiDensity'],
      },
    ],
    outputs: [
      {
        id: 'keywordDensityOut',
        label: 'Keyword Density',
        formulaRef: 'keywordDensity',
        format: 'number',
        suffix: '%',
        precision: 2,
        highlight: true,
      },
      {
        id: 'lsiDensityOut',
        label: 'LSI Keyword Density',
        formulaRef: 'lsiDensity',
        format: 'number',
        suffix: '%',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Keyword Density is the percentage of times a target keyword appears relative to the total word count on a page. LSI (Latent Semantic Indexing) keywords are semantically related terms that help search engines understand content context without keyword stuffing.',
      howToUse:
        '1. Enter your total article word count.\n2. Count exact occurrences of your primary keyword and enter that number.\n3. Count related/LSI keyword occurrences.\nThe calculator returns both densities so you can fine-tune before publishing.',
      exampleScenario:
        'A 1,000-word article mentioning its primary keyword 8 times has a 0.8% keyword density � within the optimal 1�2% range. With 5 LSI keyword occurrences (0.5% density), the content signals topical relevance without appearing spammy.',
      proTip:
        'Optimal keyword density: 1�2%. Under 0.5% may signal under-optimization; above 3% risks over-optimization penalty. Modern Google algorithms focus heavily on topical authority and E-E-A-T � prioritize comprehensive coverage of the topic over exact keyword repetition. Use tools like SurferSEO or Clearscope to identify the right LSI terms.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 5. Email Marketing ROI Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'email-marketing-roi',
    slug: 'email-marketing-roi',
    title: 'Email Marketing ROI Calculator',
    description:
      'Calculate the ROI of your email marketing campaigns by modeling open rates, click rates, conversions, and revenue against campaign costs.',
    icon: '📧',
    category: 'business',
    subcategory: 'social-media',
    tags: ['email marketing', 'roi', 'open rate', 'click rate', 'conversion rate', 'campaign', 'revenue'],
    inputs: [
      {
        id: 'listSize',
        label: 'Email List Size',
        type: 'number',
        defaultValue: 5000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 5000',
        helpText: 'Total number of subscribers on your list.',
      },
      {
        id: 'openRate',
        label: 'Open Rate %',
        type: 'number',
        defaultValue: 22,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 22',
        helpText: 'Industry average is 20�25%.',
      },
      {
        id: 'clickRate',
        label: 'Click Rate %',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'Percentage of openers who click a link.',
      },
      {
        id: 'conversionRate',
        label: 'Conversion Rate %',
        type: 'number',
        defaultValue: 2,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'Percentage of clickers who make a purchase.',
      },
      {
        id: 'avgOrderValue',
        label: 'Avg Order Value ($)',
        type: 'number',
        defaultValue: 80,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 80',
        helpText: 'Average revenue per order or conversion event.',
      },
      {
        id: 'campaignCost',
        label: 'Campaign Cost ($)',
        type: 'number',
        defaultValue: 500,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 500',
        helpText: 'Total cost including platform fees, copywriting, and design.',
      },
    ],
    formulas: [
      {
        id: 'opensCount',
        expression: 'listSize * openRate / 100',
        dependencies: ['listSize', 'openRate'],
      },
      {
        id: 'clicks',
        expression: 'opensCount * clickRate / 100',
        dependencies: ['opensCount', 'clickRate'],
      },
      {
        id: 'conversions',
        expression: 'clicks * conversionRate / 100',
        dependencies: ['clicks', 'conversionRate'],
      },
      {
        id: 'revenue',
        expression: 'conversions * avgOrderValue',
        dependencies: ['conversions', 'avgOrderValue'],
      },
      {
        id: 'roi',
        expression: '(revenue - campaignCost) / campaignCost * 100',
        dependencies: ['revenue', 'campaignCost'],
      },
    ],
    outputs: [
      {
        id: 'conversionsOut',
        label: 'Conversions',
        formulaRef: 'conversions',
        format: 'number',
        precision: 0,
      },
      {
        id: 'revenueOut',
        label: 'Revenue Generated',
        formulaRef: 'revenue',
        format: 'number',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'roiOut',
        label: 'ROI',
        formulaRef: 'roi',
        format: 'number',
        suffix: '%',
        precision: 1,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Email marketing ROI measures the return on investment from your email campaigns by tracking the revenue funnel from list sends through opens, clicks, and conversions. Email consistently delivers the highest ROI of any digital marketing channel � industry benchmarks cite $36�$42 return for every $1 spent.',
      howToUse:
        '1. Enter your list size and expected open rate.\n2. Set your click rate (clicks divided by opens) and conversion rate (conversions divided by clicks).\n3. Enter your average order value and total campaign cost.\nThe calculator models the full funnel to show revenue and ROI.',
      exampleScenario:
        'A list of 5,000 subscribers with 22% open rate = 1,100 opens. At 3% CTR = 33 clicks. At 2% conversion = 0.66 purchases. With $80 AOV = $52.80 revenue against $500 cost. ROI = -89.4%. This reveals the campaign needs higher AOV products or better segmentation.',
      proTip:
        'Segment your list by purchase history and engagement level � segmented campaigns earn 760% more revenue than blasts (DMA). A/B test subject lines to lift open rates by 20�30%. Abandoned cart sequences (3-email flows) typically convert at 5�10%, making automation the highest-ROI email strategy.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 6. Influencer Sponsored Post Rate
  // ---------------------------------------------------------------------------
  {
    id: 'influencer-post-rate-calculator',
    slug: 'influencer-post-rate-calculator',
    title: 'Influencer Sponsored Post Rate',
    description:
      'Calculate a fair market rate for sponsored posts based on follower count, engagement rate, platform, and niche multipliers.',
    icon: '🌟',
    category: 'business',
    subcategory: 'social-media',
    tags: ['influencer', 'sponsored post', 'rate card', 'pricing', 'brand deal', 'monetization'],
    inputs: [
      {
        id: 'followers',
        label: 'Followers',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 50000',
        helpText: 'Total followers or subscribers on the platform.',
      },
      {
        id: 'engagementRate',
        label: 'Engagement Rate %',
        type: 'number',
        defaultValue: 3.5,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 3.5',
        helpText: 'Your engagement rate (likes+comments / followers x 100).',
      },
      {
        id: 'platform',
        label: 'Platform',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Instagram (x1.0)', value: '1' },
          { label: 'TikTok (x1.2)', value: '1.2' },
          { label: 'YouTube (x3.0)', value: '3' },
          { label: 'Twitter/X (x0.5)', value: '0.5' },
        ],
        helpText: 'Platform multiplier reflects production effort and audience intent.',
      },
      {
        id: 'niche',
        label: 'Niche',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'General (x1.0)', value: '1' },
          { label: 'Finance/Tech (x2.0)', value: '2' },
          { label: 'Fashion/Beauty (x1.3)', value: '1.3' },
          { label: 'Health/Fitness (x1.5)', value: '1.5' },
        ],
        helpText: 'High-value niches command premium rates from advertisers.',
      },
    ],
    formulas: [
      {
        id: 'baseRate',
        expression: 'followers / 1000 * 10',
        dependencies: ['followers'],
      },
      {
        id: 'engagementBonus',
        expression: 'engagementRate / 3 * baseRate * 0.5',
        dependencies: ['engagementRate', 'baseRate'],
      },
      {
        id: 'suggestedRate',
        expression: '(baseRate + engagementBonus) * platform * niche',
        dependencies: ['baseRate', 'engagementBonus', 'platform', 'niche'],
      },
    ],
    outputs: [
      {
        id: 'suggestedRateOut',
        label: 'Suggested Post Rate',
        formulaRef: 'suggestedRate',
        format: 'number',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'baseRateOut',
        label: 'Base Rate',
        formulaRef: 'baseRate',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Influencer rate cards translate your audience size and engagement into a fair dollar value for sponsored content. The industry standard "$10 per 1,000 followers" (the "10x rule") is a starting baseline, but engagement rate, niche, platform, and exclusivity clauses all significantly modify the final price.',
      howToUse:
        '1. Enter your follower count and engagement rate.\n2. Select your primary platform and content niche.\nThe calculator applies standard industry multipliers to output a suggested post rate that you can use as the starting point for brand negotiations.',
      exampleScenario:
        'A fitness influencer with 50,000 Instagram followers and 3.5% ER: Base rate = $500. Engagement bonus = (3.5/3) x $500 x 0.5 = $291.67. Platform (x1.0) x Niche Health/Fitness (x1.5) = $1,187. This is a market-rate starting offer for an Instagram post.',
      proTip:
        'Always negotiate for usage rights � brands repurposing your content for paid ads should pay 2�3x your standard post rate. Package deals (e.g., 3 posts + story series) reduce per-post rate but improve cash flow. Track your CPE (Cost Per Engagement) data over time to strengthen negotiation leverage with data.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 7. A/B Test Statistical Significance
  // ---------------------------------------------------------------------------
  {
    id: 'ab-test-significance',
    slug: 'ab-test-significance',
    title: 'A/B Test Statistical Significance',
    description:
      'Determine if your A/B test results are statistically significant using z-score analysis, conversion rate uplift, and confidence level calculation.',
    icon: '🧪',
    category: 'business',
    subcategory: 'social-media',
    tags: ['a/b test', 'statistical significance', 'z-score', 'confidence', 'conversion', 'experimentation', 'cro'],
    inputs: [
      {
        id: 'visitorsA',
        label: 'Visitors - Variant A',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Total visitors or sessions exposed to Variant A (control).',
      },
      {
        id: 'conversionsA',
        label: 'Conversions - Variant A',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Number of conversions achieved by Variant A.',
      },
      {
        id: 'visitorsB',
        label: 'Visitors - Variant B',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Total visitors or sessions exposed to Variant B (test).',
      },
      {
        id: 'conversionsB',
        label: 'Conversions - Variant B',
        type: 'number',
        defaultValue: 65,
        min: 0,
        step: 1,
        placeholder: 'e.g. 65',
        helpText: 'Number of conversions achieved by Variant B.',
      },
    ],
    formulas: [
      {
        id: 'rateA',
        expression: 'conversionsA / visitorsA',
        dependencies: ['conversionsA', 'visitorsA'],
      },
      {
        id: 'rateB',
        expression: 'conversionsB / visitorsB',
        dependencies: ['conversionsB', 'visitorsB'],
      },
      {
        id: 'uplift',
        expression: '(rateB - rateA) / rateA * 100',
        dependencies: ['rateB', 'rateA'],
      },
      {
        id: 'seA',
        expression: 'sqrt(rateA * (1 - rateA) / visitorsA)',
        dependencies: ['rateA', 'visitorsA'],
      },
      {
        id: 'seB',
        expression: 'sqrt(rateB * (1 - rateB) / visitorsB)',
        dependencies: ['rateB', 'visitorsB'],
      },
      {
        id: 'zScore',
        expression: '(rateB - rateA) / sqrt(seA * seA + seB * seB)',
        dependencies: ['rateB', 'rateA', 'seA', 'seB'],
      },
      {
        id: 'confidence',
        expression: 'min(99.9, abs(zScore) * 18.5)',
        dependencies: ['zScore'],
      },
    ],
    outputs: [
      {
        id: 'rateAOut',
        label: 'Conversion Rate A',
        formulaRef: 'rateA',
        format: 'number',
        suffix: '%',
        precision: 2,
      },
      {
        id: 'rateBOut',
        label: 'Conversion Rate B',
        formulaRef: 'rateB',
        format: 'number',
        suffix: '%',
        precision: 2,
      },
      {
        id: 'upliftOut',
        label: 'Uplift',
        formulaRef: 'uplift',
        format: 'number',
        suffix: '%',
        precision: 1,
      },
      {
        id: 'zScoreOut',
        label: 'Z-Score',
        formulaRef: 'zScore',
        format: 'number',
        precision: 2,
      },
      {
        id: 'confidenceOut',
        label: 'Confidence Level',
        formulaRef: 'confidence',
        format: 'number',
        suffix: '%',
        precision: 1,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Statistical significance tells you whether the difference in conversion rates between Variant A and Variant B is due to a real effect or random chance. The z-score quantifies this difference in standard deviations, which maps to a confidence level. A result is typically considered significant at 95% confidence (z > 1.96).',
      howToUse:
        '1. Enter the number of visitors and conversions for each variant.\n2. The calculator computes conversion rates, uplift percentage, z-score, and confidence level.\n3. Use the confidence level to decide if Variant B is a genuine winner.',
      exampleScenario:
        'Variant A: 1,000 visitors, 50 conversions (5% CVR). Variant B: 1,000 visitors, 65 conversions (6.5% CVR). Uplift = 30%. Z-score approx 1.76, Confidence approx 92%. This is not yet at the 95% threshold � collect more data before declaring a winner.',
      proTip:
        'Z > 1.65 = 90% confidence, Z > 1.96 = 95%, Z > 2.58 = 99%. Never stop a test early when your confidence crosses 95% � sequential testing bias inflates false positives. Run tests for at least 1�2 full business cycles (typically 2 weeks) regardless of early results. Use a minimum detectable effect (MDE) of 10�20% to calculate the required sample size before launching.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 8. LTV:CAC Ratio Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'ltv-cac-ratio',
    slug: 'ltv-cac-ratio',
    title: 'LTV:CAC Ratio Calculator',
    description:
      'Calculate Customer Lifetime Value, compare it to Customer Acquisition Cost, and determine your CAC payback period to assess business unit economics.',
    icon: '📈',
    category: 'business',
    subcategory: 'metrics',
    tags: ['ltv', 'cac', 'customer lifetime value', 'acquisition cost', 'saas', 'unit economics', 'churn'],
    inputs: [
      {
        id: 'avgRevPerCustomer',
        label: 'Avg Annual Revenue per Customer ($)',
        type: 'number',
        defaultValue: 500,
        min: 0,
        step: 1,
        placeholder: 'e.g. 500',
        helpText: 'Annual recurring revenue or spend per customer.',
      },
      {
        id: 'grossMarginPct',
        label: 'Gross Margin %',
        type: 'number',
        defaultValue: 70,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 70',
        helpText: 'Gross margin percentage after direct costs.',
      },
      {
        id: 'churnRatePct',
        label: 'Annual Churn Rate %',
        type: 'number',
        defaultValue: 20,
        min: 0.1,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 20',
        helpText: 'Percentage of customers lost per year.',
      },
      {
        id: 'cac',
        label: 'Customer Acquisition Cost (CAC, $)',
        type: 'number',
        defaultValue: 150,
        min: 0,
        step: 1,
        placeholder: 'e.g. 150',
        helpText: 'Total sales & marketing spend divided by new customers acquired.',
      },
    ],
    formulas: [
      {
        id: 'ltv',
        expression: 'avgRevPerCustomer * grossMarginPct / 100 / (churnRatePct / 100)',
        dependencies: ['avgRevPerCustomer', 'grossMarginPct', 'churnRatePct'],
      },
      {
        id: 'ltvCacRatio',
        expression: 'ltv / cac',
        dependencies: ['ltv', 'cac'],
      },
      {
        id: 'paybackMonths',
        expression: 'cac / (avgRevPerCustomer * grossMarginPct / 100 / 12)',
        dependencies: ['cac', 'avgRevPerCustomer', 'grossMarginPct'],
      },
    ],
    outputs: [
      {
        id: 'ltvOut',
        label: 'Customer LTV',
        formulaRef: 'ltv',
        format: 'number',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'ltvCacRatioOut',
        label: 'LTV:CAC Ratio',
        formulaRef: 'ltvCacRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'paybackMonthsOut',
        label: 'CAC Payback Period',
        formulaRef: 'paybackMonths',
        format: 'number',
        suffix: ' months',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'LTV (Customer Lifetime Value) is the total gross profit a business can expect from a single customer over their entire relationship. CAC (Customer Acquisition Cost) is how much you spend to acquire one new customer. The LTV:CAC ratio reveals the efficiency and sustainability of your growth engine.',
      howToUse:
        '1. Enter annual revenue per customer and your gross margin %.\n2. Set your annual churn rate (1/churn = average customer lifespan in years).\n3. Enter your CAC (total S&M spend divided by new customers).\nThe calculator returns LTV, the ratio, and how many months to recoup your CAC.',
      exampleScenario:
        'SaaS company: $500 ARR, 70% gross margin, 20% churn. LTV = $500 x 0.7 / 0.2 = $1,750. With $150 CAC, LTV:CAC = 11.67x � exceptional. Payback period = 150 / (500 x 0.7 / 12) = 5.1 months.',
      proTip:
        'LTV:CAC > 3 is the benchmark for healthy SaaS businesses; < 1 means you lose money on each customer. VCs typically look for > 3x with < 18 months payback for Series A. To improve: reduce churn through onboarding improvements, increase ARPU through upsells, or cut CAC by investing in organic/SEO channels.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 9. Bounce Rate & Session Quality
  // ---------------------------------------------------------------------------
  {
    id: 'bounce-rate-calculator',
    slug: 'bounce-rate-calculator',
    title: 'Bounce Rate & Session Quality',
    description:
      'Calculate your website bounce rate and session engagement rate to diagnose landing page performance and user experience quality.',
    icon: '📊',
    category: 'business',
    subcategory: 'social-media',
    tags: ['bounce rate', 'session quality', 'engagement rate', 'web analytics', 'ux', 'landing page', 'google analytics'],
    inputs: [
      {
        id: 'totalSessions',
        label: 'Total Sessions',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 10000',
        helpText: 'Total website sessions in the analysis period.',
      },
      {
        id: 'singlePageSessions',
        label: 'Single-Page Sessions',
        type: 'number',
        defaultValue: 6000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 6000',
        helpText: 'Sessions where the visitor viewed only one page.',
      },
      {
        id: 'avgSessionDuration',
        label: 'Avg Session Duration (seconds)',
        type: 'number',
        defaultValue: 90,
        min: 0,
        step: 1,
        placeholder: 'e.g. 90',
        helpText: 'Average time users spend per session in seconds.',
      },
      {
        id: 'pagesPerSession',
        label: 'Avg Pages per Session',
        type: 'number',
        defaultValue: 2.1,
        min: 1,
        step: 0.1,
        placeholder: 'e.g. 2.1',
        helpText: 'Average number of pages viewed per session.',
      },
    ],
    formulas: [
      {
        id: 'bounceRate',
        expression: 'singlePageSessions / totalSessions * 100',
        dependencies: ['singlePageSessions', 'totalSessions'],
      },
      {
        id: 'engagedSessions',
        expression: 'totalSessions - singlePageSessions',
        dependencies: ['totalSessions', 'singlePageSessions'],
      },
      {
        id: 'engagementRate',
        expression: 'engagedSessions / totalSessions * 100',
        dependencies: ['engagedSessions', 'totalSessions'],
      },
    ],
    outputs: [
      {
        id: 'bounceRateOut',
        label: 'Bounce Rate',
        formulaRef: 'bounceRate',
        format: 'number',
        suffix: '%',
        precision: 1,
        highlight: true,
      },
      {
        id: 'engagementRateOut',
        label: 'Engagement Rate',
        formulaRef: 'engagementRate',
        format: 'number',
        suffix: '%',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Bounce Rate is the percentage of sessions where a visitor leaves after viewing only one page without any interaction. Google Analytics 4 replaced bounce rate with Engagement Rate (sessions lasting > 10 seconds, having a conversion, or viewing 2+ pages), making context more important than ever.',
      howToUse:
        '1. Enter total sessions and the count of single-page sessions from your analytics.\n2. Optionally review average session duration and pages/session for context.\nThe calculator outputs both bounce rate and its inverse � engagement rate.',
      exampleScenario:
        'An e-commerce site with 10,000 sessions and 6,000 single-page sessions has a 60% bounce rate � high for a store. Reducing to 4,000 bounces (40% rate) with better product imagery and faster load times could significantly improve conversion rate.',
      proTip:
        'Bounce rate < 40% is excellent, 40�55% is average, > 70% needs improvement � but context matters. Blog articles and news pages naturally have 70�90% bounce rates because readers get what they came for. Filter by traffic source: paid traffic should bounce less than 50%; organic > 60% suggests mismatched content intent. Check Core Web Vitals � a 1-second delay in LCP increases bounce rate by ~32%.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 10. ROAS & Ad Spend ROI Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'roas-ad-spend-calculator',
    slug: 'roas-ad-spend-calculator',
    title: 'ROAS & Ad Spend ROI Calculator',
    description:
      'Calculate Return on Ad Spend (ROAS), Marketing Efficiency Ratio (MER), net profit, and true ROI from your advertising investment to optimize budget allocation.',
    icon: '💹',
    category: 'business',
    subcategory: 'advertising',
    tags: ['roas', 'ad spend', 'roi', 'marketing efficiency', 'paid ads', 'digital advertising', 'performance marketing'],
    inputs: [
      {
        id: 'adSpend',
        label: 'Ad Spend ($)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 1000',
        helpText: 'Total advertising spend in the period.',
      },
      {
        id: 'revenue',
        label: 'Revenue Generated ($)',
        type: 'number',
        defaultValue: 4000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 4000',
        helpText: 'Total revenue directly attributed to ads.',
      },
      {
        id: 'cogs',
        label: 'Cost of Goods Sold ($)',
        type: 'number',
        defaultValue: 1500,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 1500',
        helpText: 'Cost of goods or services sold from ad-driven revenue.',
      },
    ],
    formulas: [
      {
        id: 'roas',
        expression: 'revenue / adSpend',
        dependencies: ['revenue', 'adSpend'],
      },
      {
        id: 'grossProfit',
        expression: 'revenue - cogs',
        dependencies: ['revenue', 'cogs'],
      },
      {
        id: 'netProfit',
        expression: 'grossProfit - adSpend',
        dependencies: ['grossProfit', 'adSpend'],
      },
      {
        id: 'roi',
        expression: 'netProfit / adSpend * 100',
        dependencies: ['netProfit', 'adSpend'],
      },
      {
        id: 'mer',
        expression: 'revenue / (adSpend + cogs)',
        dependencies: ['revenue', 'adSpend', 'cogs'],
      },
    ],
    outputs: [
      {
        id: 'roasOut',
        label: 'ROAS',
        formulaRef: 'roas',
        format: 'number',
        suffix: 'x',
        precision: 2,
        highlight: true,
      },
      {
        id: 'roiOut',
        label: 'Ad ROI',
        formulaRef: 'roi',
        format: 'number',
        suffix: '%',
        precision: 1,
      },
      {
        id: 'netProfitOut',
        label: 'Net Profit',
        formulaRef: 'netProfit',
        format: 'number',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'merOut',
        label: 'MER (Marketing Efficiency Ratio)',
        formulaRef: 'mer',
        format: 'number',
        suffix: 'x',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'ROAS (Return on Ad Spend) measures gross revenue generated per dollar spent on advertising. Unlike ROI, it ignores product costs � ROAS of 4x means $4 revenue per $1 spent, but profitability depends on your margins. MER (blended ROAS) measures all revenue against total marketing spend, giving a holistic view.',
      howToUse:
        '1. Enter your total ad spend for the period.\n2. Enter the revenue directly attributed to those ads.\n3. Enter the COGS for the goods sold.\nThe calculator derives ROAS, true net profit, ROI, and MER.',
      exampleScenario:
        'Ad spend: $1,000. Revenue: $4,000. COGS: $1,500. ROAS = 4x. Gross profit = $2,500. Net profit (after ad spend) = $1,500. ROI = 150%. MER = $4,000 / $2,500 = 1.6x. A healthy campaign since net profit is positive.',
      proTip:
        'Your break-even ROAS = 1 / gross margin. At 62.5% gross margin, break-even ROAS = 1.6x. Target ROAS should be 2�3x your break-even to cover operating expenses and generate profit. MER > 3 is the target for most DTC brands. Use MER for budget decisions and channel ROAS for campaign optimization � never use ROAS alone to judge profitability.',
    },
    metadata: { version: '1.0.0' },
  },
];
