import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getSettings, saveSettings } from '../storage';
import { testApiKey } from '../api/openai';
import { testConnection } from '../api/ollama';
import type { UserSettings } from '../types';
import {
  PageWrapper,
  PageTitle,
  GlassInput,
  GlassSelect,
  GlassButton,
  SuccessBlock,
  ErrorBlock,
  Field,
  Label,
  WarningBlock,
} from '../styles/glass';

const Form = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 32px;
  max-width: 540px;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
  padding: 6px 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--accent-1);
  cursor: pointer;
`;

const SavedNote = styled.div`
  background: rgba(0, 206, 201, 0.1);
  border: 1px solid rgba(0, 206, 201, 0.2);
  border-radius: var(--radius-sm);
  color: var(--accent-2);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  margin-top: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ProviderTag = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: ${({ $active }) =>
    $active ? 'rgba(108, 92, 231, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ $active }) =>
    $active ? 'rgba(108, 92, 231, 0.25)' : 'var(--glass-border)'};
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ProviderInfo = styled.div`
  flex: 1;
`;

const ProviderName = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
`;

const ProviderDesc = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
`;

const ProviderRadio = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $checked }) =>
    $checked ? 'var(--accent-1)' : 'rgba(255,255,255,0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $checked }) =>
      $checked ? 'var(--accent-1)' : 'transparent'};
    transition: all 0.2s ease;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 20px 0;
`;

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettingsState] = useState<UserSettings>(getSettings);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);
  const [saved, setSaved] = useState(false);
  const [ollamaTesting, setOllamaTesting] = useState(false);
  const [ollamaTestResult, setOllamaTestResult] = useState<'ok' | 'fail' | null>(null);

  const update = (patch: Partial<UserSettings>) => {
    const updated = { ...settings, ...patch };
    setSettingsState(updated);
    saveSettings(updated);
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestOpenAi = async () => {
    if (!settings.openAiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const ok = await testApiKey(settings.openAiKey.trim());
      setTestResult(ok ? 'ok' : 'fail');
    } catch {
      setTestResult('fail');
    } finally {
      setTesting(false);
    }
  };

  const handleTestOllama = async () => {
    setOllamaTesting(true);
    setOllamaTestResult(null);
    try {
      const ok = await testConnection();
      setOllamaTestResult(ok ? 'ok' : 'fail');
    } catch {
      setOllamaTestResult('fail');
    } finally {
      setOllamaTesting(false);
    }
  };

  return (
    <PageWrapper>
      <PageTitle>⚙️ Настройки</PageTitle>

      <Form>
        {/* ─── Provider selection ─── */}
        <Field>
          <Label>Провайдер генерации</Label>

          <ProviderTag
            $active={settings.provider === 'demo'}
            onClick={() => update({ provider: 'demo' })}
          >
            <ProviderRadio $checked={settings.provider === 'demo'} />
            <ProviderInfo>
              <ProviderName>🎭 Демо-режим</ProviderName>
              <ProviderDesc>
                Никаких ключей не нужно — мок-секции генерируются прямо в браузере
              </ProviderDesc>
            </ProviderInfo>
          </ProviderTag>

          <ProviderTag
            $active={settings.provider === 'openai'}
            onClick={() => update({ provider: 'openai' })}
          >
            <ProviderRadio $checked={settings.provider === 'openai'} />
            <ProviderInfo>
              <ProviderName>🤖 OpenAI</ProviderName>
              <ProviderDesc>GPT-4o / GPT-3.5 Turbo. Требуется API-ключ</ProviderDesc>
            </ProviderInfo>
          </ProviderTag>

          <ProviderTag
            $active={settings.provider === 'ollama'}
            onClick={() => update({ provider: 'ollama' })}
          >
            <ProviderRadio $checked={settings.provider === 'ollama'} />
            <ProviderInfo>
              <ProviderName>🦙 Ollama (локальная)</ProviderName>
              <ProviderDesc>
                Бесплатно, работает локально. Llama 3, Mistral и другие модели
              </ProviderDesc>
            </ProviderInfo>
          </ProviderTag>
        </Field>

        <Divider />

        {/* ─── Demo notice ─── */}
        {settings.provider === 'demo' && (
          <WarningBlock style={{ marginBottom: 0 }}>
            🎭 Демо-режим активен. Контент генерируется по шаблонам прямо в браузере.
            Никаких внешних запросов и API-ключей не требуется.
          </WarningBlock>
        )}

        {/* ─── OpenAI fields ─── */}
        {settings.provider === 'openai' && (
          <>
            <Field>
              <Label>OpenAI API-ключ</Label>
              <GlassInput
                type="password"
                placeholder="sk-..."
                value={settings.openAiKey}
                onChange={(e) => update({ openAiKey: e.target.value })}
              />
            </Field>

            <Field>
              <Label>Модель</Label>
              <GlassSelect
                value={settings.openAiModel}
                onChange={(e) =>
                  update({ openAiModel: e.target.value as 'gpt-4o' | 'gpt-3.5-turbo' })
                }
              >
                <option value="gpt-4o">GPT-4o (рекомендуется)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </GlassSelect>
            </Field>

            <ButtonRow>
              <GlassButton
                $variant="secondary"
                onClick={handleTestOpenAi}
                disabled={!settings.openAiKey.trim() || testing}
              >
                {testing ? '⏳ Проверка...' : '🔍 Проверить ключ'}
              </GlassButton>
            </ButtonRow>

            {testResult === 'ok' && (
              <SuccessBlock style={{ marginTop: 12 }}>
                ✅ Ключ работает! Подключение к OpenAI установлено.
              </SuccessBlock>
            )}
            {testResult === 'fail' && (
              <ErrorBlock style={{ marginTop: 12 }}>
                ❌ Ключ не работает. Проверьте правильность ввода и баланс на аккаунте.
              </ErrorBlock>
            )}
          </>
        )}

        {/* ─── Ollama fields ─── */}
        {settings.provider === 'ollama' && (
          <>
            <Field>
              <Label>URL сервера Ollama</Label>
              <GlassInput
                type="url"
                placeholder="http://localhost:11434"
                value={settings.ollamaUrl}
                onChange={(e) => update({ ollamaUrl: e.target.value })}
              />
            </Field>

            <Field>
              <Label>Модель</Label>
              <GlassInput
                placeholder="llama3, mistral, gemma:2b, ..."
                value={settings.ollamaModel}
                onChange={(e) => update({ ollamaModel: e.target.value })}
              />
            </Field>

            <ButtonRow>
              <GlassButton
                $variant="secondary"
                onClick={handleTestOllama}
                disabled={ollamaTesting}
              >
                {ollamaTesting ? '⏳ Проверка...' : '🔍 Проверить соединение'}
              </GlassButton>
            </ButtonRow>

            {ollamaTestResult === 'ok' && (
              <SuccessBlock style={{ marginTop: 12 }}>
                ✅ Ollama доступна! Сервер отвечает.
              </SuccessBlock>
            )}
            {ollamaTestResult === 'fail' && (
              <ErrorBlock style={{ marginTop: 12 }}>
                ❌ Не удалось подключиться к Ollama. Убедитесь, что сервер запущен.
              </ErrorBlock>
            )}
          </>
        )}

        {/* ─── Image generation (not for Ollama — no image API) ─── */}
        {settings.provider !== 'ollama' && (
          <Field style={{ marginTop: 16 }}>
            <CheckboxRow>
              <Checkbox
                type="checkbox"
                checked={settings.generateImages}
                onChange={(e) => update({ generateImages: e.target.checked })}
              />
              Генерировать изображения
              {settings.provider === 'demo' && ' (через picsum.photos)'}
              {settings.provider === 'openai' && ' (DALL-E 3)'}
            </CheckboxRow>
          </Field>
        )}

        <Divider />

        <ButtonRow>
          <GlassButton $variant="primary" onClick={handleSave}>
            💾 Сохранить
          </GlassButton>
          <GlassButton $variant="ghost" onClick={() => navigate('/')}>
            ← Назад
          </GlassButton>
        </ButtonRow>

        {saved && <SavedNote>💾 Настройки сохранены</SavedNote>}
      </Form>
    </PageWrapper>
  );
}
