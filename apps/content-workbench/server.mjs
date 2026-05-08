import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const dataDir = process.env.CONTENT_WORKBENCH_DATA_DIR || path.join(__dirname, '.data');
const articleDir = path.join(dataDir, 'articles');
const port = Number(process.env.PORT || 3000);

const platforms = ['beehiiv', 'ghost', 'x', 'instagram', 'karyaKarsa'];

const platformMeta = {
  beehiiv: {
    name: 'beehiiv',
    label: 'Beehiiv',
    iconUrl: '/platform-icons/beehiiv.svg',
    sourceUrl: 'https://www.beehiiv.com/',
  },
  ghost: {
    name: 'ghost',
    label: 'Ghost',
    iconUrl: '/platform-icons/ghost.svg',
    sourceUrl: 'https://docs.ghost.org/logos',
  },
  x: {
    name: 'x',
    label: 'X',
    iconUrl: '/platform-icons/x.svg',
    sourceUrl: 'https://x.com/',
  },
  instagram: {
    name: 'instagram',
    label: 'Instagram',
    iconUrl: '/platform-icons/instagram.svg',
    sourceUrl: 'https://www.meta.com/brand/resources/instagram/instagram-brand/',
  },
  karyaKarsa: {
    name: 'karyaKarsa',
    label: 'KaryaKarsa',
    iconUrl: '/platform-icons/karyakarsa.svg',
    sourceUrl: 'https://karyakarsa.com/about',
  },
};

const platformFieldGuides = {
  beehiiv: {
    title: {
      label: 'Title',
      description: 'メール件名に相当する強い導入。対象読者と価値を短く明示します。',
      required: true,
    },
    summary: {
      label: 'Summary',
      description: '本文の要点を2〜3文で記載し、読むメリットを提示します。',
      required: true,
    },
    cta: {
      label: 'CTA',
      description: '読了後に取ってほしい行動を1文で書きます。',
      required: true,
    },
  },
  ghost: {
    title: {
      label: 'Title',
      description: '検索意図を含む記事タイトル。主キーワードを前半に置きます。',
      required: true,
    },
    seoDescription: {
      label: 'SEO Description',
      description: '検索結果向けの説明文。記事の結論と対象読者を含めます。',
      required: true,
    },
  },
  x: {
    hook: {
      label: 'Hook',
      description: '最初の1投稿。驚きや課題提起で続きを読みたくさせます。',
      required: true,
    },
    threadDraft: {
      label: 'Thread Draft',
      description: 'スレッド全体の下書き。1投稿1メッセージで簡潔に構成します。',
      required: true,
    },
  },
  instagram: {
    slide1Hook: {
      label: 'Slide 1 Hook',
      description: '1枚目の訴求。誰のどんな悩みに効く内容かを明示します。',
      required: true,
    },
    slideOutline: {
      label: 'Slide Outline',
      description: 'カルーセル全体の構成。各スライドの役割を箇条書きで整理します。',
      required: true,
    },
    finalCta: {
      label: 'Final CTA',
      description: '保存・コメント・プロフィール遷移などの行動を促します。',
      required: true,
    },
  },
  karyaKarsa: {
    titleId: {
      label: 'Title (ID)',
      description: 'インドネシア語タイトル。エピソードの主題が一目でわかる表現にします。',
      required: true,
    },
    episodeSummaryId: {
      label: 'Episode Summary (ID)',
      description: 'インドネシア語要約。今回の見どころを短く整理します。',
      required: true,
    },
    halalNote: {
      label: 'Halal Note',
      description: 'ハラール対応や配慮事項を必要に応じて明記します。',
      required: true,
    },
    nextEpisodeHook: {
      label: 'Next Episode Hook',
      description: '次回予告。継続課金・再訪問につながる問いや予告を入れます。',
      required: true,
    },
  },
};

const themes = ['72ms', 'bungu', 'id-travel'];
const statuses = ['draft', 'review', 'published', 'archived'];

async function ensureDataDir() {
  await fs.mkdir(articleDir, { recursive: true });
}

function articlePath(id) {
  return path.join(articleDir, `${id}.json`);
}

function platformPath(platform) {
  return path.join(articleDir, `${platform}.json`);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function listArticles() {
  await ensureDataDir();
  const files = await fs.readdir(articleDir);
  const articles = await Promise.all(
    files
      .filter((file) => file.endsWith('.json') && !platforms.includes(path.basename(file, '.json')))
      .map(async (file) => {
        const article = JSON.parse(await fs.readFile(path.join(articleDir, file), 'utf8'));
        const { platformVariants, ...baseArticle } = article;
        return baseArticle;
      }),
  );
  return articles.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

async function findArticle(id) {
  try {
    return JSON.parse(await fs.readFile(articlePath(id), 'utf8'));
  } catch {
    return null;
  }
}

function normalizeArticle(input, existing) {
  const now = new Date().toISOString();
  return {
    id: input.id || existing?.id || randomUUID(),
    theme: themes.includes(input.theme) ? input.theme : '72ms',
    status: statuses.includes(input.status) ? input.status : 'draft',
    baseTitle: String(input.baseTitle || '').trim() || 'Untitled article',
    baseBodyMd: String(input.baseBodyMd || ''),
    tags: Array.isArray(input.tags)
      ? input.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : String(input.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
    images: Array.isArray(input.images) ? input.images : existing?.images || [],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

async function saveArticle(input) {
  await ensureDataDir();
  const existing = input.id ? await findArticle(input.id) : null;
  const article = normalizeArticle(input, existing);
  await fs.writeFile(articlePath(article.id), JSON.stringify(article, null, 2));
  return article;
}

function evaluatePlatformReadiness(article, platform, record) {
  const fields = platformFieldGuides[platform] || {};
  const values = record?.fields || {};
  const checks = [
    {
      id: 'body-length',
      passed: article.baseBodyMd.trim().length >= 300,
      message: '本文が300文字以上ある',
    },
    {
      id: 'tag-exists',
      passed: article.tags.length > 0,
      message: 'タグが1つ以上ある',
    },
    {
      id: 'platform-required-fields',
      passed: Object.entries(fields)
        .filter(([, guide]) => guide.required)
        .every(([field]) => typeof values[field] === 'string' && values[field].trim().length > 0),
      message: '対象PFの必須項目が入力済み',
    },
  ];
  return { ready: checks.every((check) => check.passed), checks };
}

async function readPlatformStore(platform) {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(platformPath(platform), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      platform,
      updatedAt: parsed.updatedAt || null,
      articles: parsed.articles && typeof parsed.articles === 'object' ? parsed.articles : {},
    };
  } catch {
    return { platform, updatedAt: null, articles: {} };
  }
}

async function readAllPlatformStores() {
  const entries = await Promise.all(platforms.map(async (platform) => [platform, await readPlatformStore(platform)]));
  return Object.fromEntries(entries);
}

async function savePlatformRecords(article, records) {
  await ensureDataDir();
  const now = new Date().toISOString();
  const saved = {};
  for (const platform of platforms) {
    const current = await readPlatformStore(platform);
    const incoming = records?.[platform];
    if (!incoming) {
      saved[platform] = current.articles[article.id] || null;
      continue;
    }
    const record = {
      enabled: Boolean(incoming.enabled),
      fields: incoming.fields && typeof incoming.fields === 'object' ? incoming.fields : {},
      readiness: evaluatePlatformReadiness(article, platform, incoming),
      updatedAt: now,
    };
    current.articles[article.id] = record;
    current.updatedAt = now;
    await fs.writeFile(platformPath(platform), JSON.stringify(current, null, 2));
    saved[platform] = record;
  }
  return saved;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function sendStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(publicDir, requestedPath));
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.svg': 'image/svg+xml',
    };
    res.writeHead(200, { 'content-type': contentTypes[ext] || 'application/octet-stream' });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, { ok: true, app: 'content-workbench' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/guides') {
    sendJson(res, 200, { platformFieldGuides, platforms: platformMeta });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/articles') {
    sendJson(res, 200, { articles: await listArticles(), platformStores: await readAllPlatformStores() });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/articles') {
    const body = await readJsonBody(req);
    const article = await saveArticle(body.article || body);
    const platformRecords = await savePlatformRecords(article, body.platformRecords || {});
    sendJson(res, 200, { article, platformRecords });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/readiness') {
    const body = await readJsonBody(req);
    const article = body.articleId ? await findArticle(body.articleId) : body.article;
    if (!article) {
      sendJson(res, 404, { error: 'Article not found' });
      return;
    }
    const platform = body.platform;
    if (!platforms.includes(platform)) {
      sendJson(res, 400, { error: 'Unknown platform' });
      return;
    }
    sendJson(res, 200, evaluatePlatformReadiness(article, platform, body.record || {}));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/images/attach') {
    const body = await readJsonBody(req);
    const image = {
      id: randomUUID(),
      prompt: String(body.prompt || ''),
      purpose: body.purpose || 'hero',
      ratio: body.ratio || '1:1',
      url: String(body.url || ''),
      createdAt: new Date().toISOString(),
    };
    if (!image.url.startsWith('data:image/') && !image.url.startsWith('http')) {
      sendJson(res, 400, { error: 'Image url must be a data:image URL or http(s) URL.' });
      return;
    }
    if (body.articleId) {
      const article = await findArticle(body.articleId);
      if (article) await saveArticle({ ...article, images: [...article.images, image] });
    }
    sendJson(res, 200, { image });
    return;
  }

  if (req.method === 'POST' && url.pathname.startsWith('/api/ai/')) {
    sendJson(res, 501, {
      error: 'AI adapter is not configured yet.',
      expectedEnv: ['CODEX_APP_SERVER_URL'],
      plannedUseCases: ['research', 'drafting', 'review'],
    });
    return;
  }

  sendJson(res, 404, { error: 'API route not found' });
}

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith('/api/')) {
      await handleApi(req, res);
      return;
    }
    await sendStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

server.listen(port, () => {
  console.log(`Content Workbench running at http://localhost:${port}`);
  console.log(`Data directory: ${dataDir}`);
});
