import type { GeneratedSection } from '../types';
import { getSettings } from '../storage';

const SYSTEM_PROMPT = `Ты — ассистент по созданию контента для сайтов.
На основе описания пользователя сгенерируй структуру страницы.

Ответ верни строго в JSON (без markdown-обёртки, только чистый JSON):
{
  "sections": [
    {
      "type": "hero",
      "title": "...",
      "content": "текст"
    },
    {
      "type": "text",
      "title": "...",
      "content": "текст абзаца"
    },
    {
      "type": "cta",
      "title": "...",
      "content": "текст кнопки"
    }
  ]
}

Доступные type: hero, text, image, gallery, cta, footer
Сгенерируй от 3 до 6 секций. Ответ должен быть ТОЛЬКО JSON, без пояснений.`;

export async function generateContent(
  prompt: string,
  toneOfVoice: string
): Promise<{ sections: GeneratedSection[] }> {
  const settings = getSettings();
  const url = settings.ollamaUrl || 'http://localhost:11434';
  const model = settings.ollamaModel || 'llama3';

  const fullPrompt = toneOfVoice
    ? `Тон: ${toneOfVoice}\n\n${prompt}`
    : prompt;

  const res = await fetch(`${url}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt },
      ],
      stream: false,
      options: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Ollama API error (${res.status}): ${text || res.statusText}. Убедитесь, что Ollama запущена.`
    );
  }

  const data = await res.json();
  const raw = data.message?.content || '';
  
  // Try to parse JSON from response (handle markdown-wrapped JSON)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Ollama вернула некорректный ответ. Попробуйте другую модель.');
  }

  const result = JSON.parse(jsonMatch[0]);
  return result;
}

export async function testConnection(): Promise<boolean> {
  const settings = getSettings();
  const url = settings.ollamaUrl || 'http://localhost:11434';
  try {
    const res = await fetch(`${url}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function listModels(): Promise<string[]> {
  const settings = getSettings();
  const url = settings.ollamaUrl || 'http://localhost:11434';
  const res = await fetch(`${url}/api/tags`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.models || []).map((m: any) => m.name);
}
