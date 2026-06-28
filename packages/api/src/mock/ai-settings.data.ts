import type { AIProvider, SystemHealthSummary } from '@salesintel/types';

export const mockAIProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT models',
    enabled: true,
    activeModel: 'gpt-4o-mini',
    availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    usageTokenCount: 14820000,
    totalCostUsd: 182.40,
    icon: 'smart_toy',
  },
  {
    id: 'gemini',
    name: 'Google Gemini Pro models',
    enabled: true,
    activeModel: 'gemini-1.5-pro',
    availableModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-ultra'],
    usageTokenCount: 22450000,
    totalCostUsd: 68.12,
    icon: 'auto_awesome',
  },
  {
    id: 'groq',
    name: 'Groq LLaMA models',
    enabled: false,
    activeModel: 'llama-3-70b-8192',
    availableModels: ['llama-3-70b-8192', 'llama-3-8b-8192', 'mixtral-8x7b-32768'],
    usageTokenCount: 0,
    totalCostUsd: 0,
    icon: 'bolt',
  },
  {
    id: 'whisper',
    name: 'OpenAI Whisper Transcription',
    enabled: true,
    activeModel: 'whisper-large-v3',
    availableModels: ['whisper-large-v3', 'whisper-medium', 'whisper-small'],
    usageTokenCount: 894000, // hours translated to counts
    totalCostUsd: 54.30,
    icon: 'record_voice_over',
  },
];

export const mockSystemHealth: SystemHealthSummary = {
  status: 'healthy',
  uptimePercent: 99.98,
  queueBacklog: 2,
  processingRatePerMin: 45,
  components: [
    { name: 'Core API Services', status: 'healthy', responseTimeMs: 42, uptimePercent: 99.99 },
    { name: 'AI Summarization Engine', status: 'healthy', responseTimeMs: 820, uptimePercent: 99.95 },
    { name: 'Transcript Audio Parser', status: 'healthy', responseTimeMs: 1450, uptimePercent: 99.96 },
    { name: 'Webhooks Dispatcher', status: 'healthy', responseTimeMs: 18, uptimePercent: 100.00 },
    { name: 'Sync Integration Workers', status: 'healthy', responseTimeMs: 310, uptimePercent: 99.98 },
  ],
  usageHistory: [
    { timestamp: '10:00 AM', openaiTokens: 120000, geminiTokens: 180000, costUsd: 1.25 },
    { timestamp: '11:00 AM', openaiTokens: 140000, geminiTokens: 210000, costUsd: 1.48 },
    { timestamp: '12:00 PM', openaiTokens: 180000, geminiTokens: 320000, costUsd: 2.10 },
    { timestamp: '01:00 PM', openaiTokens: 150000, geminiTokens: 250000, costUsd: 1.70 },
    { timestamp: '02:00 PM', openaiTokens: 220000, geminiTokens: 410000, costUsd: 2.80 },
    { timestamp: '03:00 PM', openaiTokens: 190000, geminiTokens: 380000, costUsd: 2.45 },
    { timestamp: '04:00 PM', openaiTokens: 240000, geminiTokens: 450000, costUsd: 3.12 },
  ],
};
