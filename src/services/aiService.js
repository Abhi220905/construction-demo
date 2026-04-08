const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Calls Groq AI to generate analysis for construction/real estate data.
 * Updated to provide more strategic, growth-focused, and actionable advice.
 */
export async function callGroqAI(prompt, industry = 'construction') {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.error('VITE_GROQ_API_KEY is not set in .env');
    return {
      success: false,
      error: 'API Key Missing: Please add VITE_GROQ_API_KEY to your .env file.',
    };
  }

  const systemPrompt = industry === 'real-estate' 
    ? `You are a High-Performance Real Estate Strategy Consultant and Revenue Growth Advisor. 
       Analyze the provided market data to identify **untapped revenue streams** and **high-yield investment opportunities**.
       Provide 4-5 professional executive-level bullet points that:
       1. Maximize Investor Revenue (Growth & Yield).
       2. Suggest Specific Changes for portfolio enhancement.
       3. Identify Market Anomalies that can be leveraged for PROFIT.
       4. Provide Risk Mitigation Strategies.
       5. Highlight Emerging Market Trends.

       Format:
       - Use only 4-5 highly professional bullet points.
       - Each bullet must start with a bold category (e.g., **Revenue Acceleration:**).
       - Focus on MONEY and GROWTH. Keep it under 200 words. No intro text.`
    : `You are a Senior Strategic Operations & Construction Efficiency Specialist at a global EPC firm.
       Analyze the site operations data provided to identify **cost-reduction opportunities** and **revenue-maximizing project shifts**.
       Provide 4-5 professional executive-level bullet points that:
       1. Identify Operational Inefficiencies affecting the bottom line.
       2. Suggest Specific Actions to speed up construction completion (TIME = MONEY).
       3. Highlight Critical Risks that could lead to financial losses.
       4. Provide Resource Optimization Strategies.
       5. Recommend Technology Integration Opportunities.

       Format:
       - Use only 4-5 highly professional bullet points.
       - Each bullet must start with a bold category (e.g., **Operational Optimization:**).
       - Focus on EFFICIENCY and PROFIT. Keep it under 200 words. No intro text.`;

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `API Error: ${response.status}`);
    }

    return {
      success: true,
      insight: data.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.error('Groq AI Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
