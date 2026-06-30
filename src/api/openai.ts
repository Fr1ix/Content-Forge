import type { GeneratedSection, UserSettings } from '../types';
import { getSettings } from '../storage';

const API_URL = 'https://api.openai.com/v1';

function getApiSettings(): UserSettings {
  const settings = getSettings();
  if (!settings.openAiKey) {
    throw new Error('API-ключ OpenAI не настроен. Перейдите в настройки.');
  }
  return settings;
}

export async function testApiKey(key: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/models`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  return res.ok;
}

const SYSTEM_PROMPT = `Ты — ассистент по созданию контента для сайтов.
На основе описания пользователя сгенерируй структуру страницы.

Ответ верни строго в JSON:
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
Сгенерируй от 3 до 6 секций.`;

export interface GenerateResult {
  sections: GeneratedSection[];
}

export async function generateContent(
  prompt: string,
  toneOfVoice: string
): Promise<GenerateResult> {
  const settings = getApiSettings();
  const fullPrompt = toneOfVoice
    ? `Тон: ${toneOfVoice}\n\n${prompt}`
    : prompt;

  const res = await fetch(`${API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.openAiKey}`,
    },
    body: JSON.stringify({
      model: settings.openAiModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: fullPrompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Ошибка API: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const result: GenerateResult = JSON.parse(data.choices[0].message.content);
  return result;
}

export async function generateImage(prompt: string): Promise<string> {
  const settings = getApiSettings();

  const res = await fetch(`${API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.openAiKey}`,
    },
    body: JSON.stringify({
      prompt,
      n: 1,
      size: '1024x1024',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error?.message || `Ошибка генерации изображения: ${res.status}`
    );
  }

  const data = await res.json();
  return data.data[0].url;
}
