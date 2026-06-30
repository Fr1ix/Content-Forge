import type { GeneratedSection } from '../types';

const toneAdjectives: Record<string, string[]> = {
  professional: ['надежный', 'профессиональный', 'компетентный', 'экспертный'],
  casual: ['дружелюбный', 'простой', 'доступный', 'уютный'],
  creative: ['креативный', 'вдохновляющий', 'смелый', 'уникальный'],
  formal: ['официальный', 'авторитетный', 'солидный', 'респектабельный'],
};

const defaultAdjectives = ['уникальный', 'качественный', 'современный', 'эффективный'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeTitle(base: string, adj: string): string {
  const templates = [
    `${adj} ${base}`,
    `${base}: ${adj} решения`,
    `Ваш ${adj} партнёр по ${base.toLowerCase()}`,
    `${base} нового поколения`,
  ];
  return pick(templates);
}

function makeText(base: string, adj: string): string {
  const paras = [
    `Мы предлагаем ${adj} решения в сфере ${base.toLowerCase()}. Наш опыт и экспертиза позволяют достигать выдающихся результатов для каждого клиента.`,
    `Благодаря инновационному подходу и использованию передовых технологий, мы создаём ${adj} продукты, которые меняют представление о ${base.toLowerCase()}.`,
    `Наша команда профессионалов с многолетним опытом работы готова воплотить самые смелые идеи в ${base.toLowerCase()}. Мы гарантируем ${adj} качество и индивидуальный подход.`,
    `Присоединяйтесь к тысячам довольных клиентов, которые уже оценили наши ${adj} решения в области ${base.toLowerCase()}.`,
  ];
  return paras.slice(0, Math.floor(Math.random() * 3) + 1).join('\n\n');
}

function makeCtaText(adj: string): string {
  const ctas = [
    `Начните свой ${adj} проект уже сегодня`,
    `Запишитесь на ${adj} консультацию`,
    `Получите ${adj} предложение первыми`,
    `Откройте ${adj} возможности вместе с нами`,
  ];
  return pick(ctas);
}

function generateSections(prompt: string, toneOfVoice: string): GeneratedSection[] {
  const words = prompt.split(/\s+/).filter(w => w.length > 2);
  const base = words.length > 0 ? words.slice(0, 3).join(' ') : 'вашем проекте';
  const adj = pick(toneAdjectives[toneOfVoice.toLowerCase()] ?? defaultAdjectives);

  const sections: GeneratedSection[] = [
    {
      type: 'hero',
      title: makeTitle(words[0] ?? 'Проект', adj),
      content: `${pick(['Добро пожаловать в мир', 'Откройте для себя', 'Погрузитесь в'])} ${adj} ${base}. ${pick(['Мы создаём решения, которые вдохновляют.', 'Ваш успех — наша главная цель.', 'Начните путь к совершенству уже сегодня.'])}`,
    },
    {
      type: 'text',
      title: `О нас и нашем подходе`,
      content: makeText(base, adj),
    },
    {
      type: 'image',
      title: `Наши работы`,
      content: `Примеры наших ${adj} проектов в сфере ${base.toLowerCase()}. Каждый проект — это результат тщательной работы и внимания к деталям.`,
    },
    {
      type: 'gallery',
      title: `Галерея проектов`,
      content: `Ознакомьтесь с портфолио наших ${adj} проектов. Мы гордимся каждой выполненной работой и стремимся превзойти ожидания клиентов.`,
    },
    {
      type: 'cta',
      title: makeCtaText(adj),
      content: `Готовы начать? Свяжитесь с нами, чтобы обсудить ваш проект и получить ${adj} предложение, адаптированное под ваши потребности.`,
    },
    {
      type: 'footer',
      title: '',
      content: `© ${new Date().getFullYear()} ${base}. Все права защищены. Создано с помощью Content Forge.`,
    },
  ];

  return sections;
}

export async function generateContent(
  prompt: string,
  toneOfVoice: string
): Promise<{ sections: GeneratedSection[] }> {
  // Simulate network/processing delay
  await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
  return { sections: generateSections(prompt, toneOfVoice) };
}

export async function generateImage(_prompt: string): Promise<string> {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
  return `https://picsum.photos/seed/${Date.now()}/800/600`;
}
