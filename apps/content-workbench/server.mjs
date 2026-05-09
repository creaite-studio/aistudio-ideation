import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import readline from 'node:readline';
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
    postUrl: 'https://app.beehiiv.com/posts',
    postLabel: 'Beehiiv投稿一覧を開く',
  },
  ghost: {
    name: 'ghost',
    label: 'Ghost',
    iconUrl: '/platform-icons/ghost.svg',
    sourceUrl: 'https://docs.ghost.org/logos',
    postUrl: 'https://ghost.org/docs/admin-api/#creating-a-post',
    postLabel: 'Ghost投稿作成ガイドを開く',
  },
  x: {
    name: 'x',
    label: 'X',
    iconUrl: '/platform-icons/x.svg',
    sourceUrl: 'https://x.com/',
    postUrl: 'https://x.com/compose/post',
    postLabel: 'X投稿画面を開く',
  },
  instagram: {
    name: 'instagram',
    label: 'Instagram',
    iconUrl: '/platform-icons/instagram.svg',
    sourceUrl: 'https://www.meta.com/brand/resources/instagram/instagram-brand/',
    postUrl: 'https://www.instagram.com/',
    postLabel: 'Instagramを開く',
  },
  karyaKarsa: {
    name: 'karyaKarsa',
    label: 'KaryaKarsa',
    iconUrl: '/platform-icons/karyakarsa.svg',
    sourceUrl: 'https://karyakarsa.com/about',
    postUrl: 'https://karyakarsa.com/dashboard/karya',
    postLabel: 'KaryaKarsa作品管理を開く',
  },
};

const platformFieldGuides = {
  beehiiv: {
    title: {
      label: '配信タイトル',
      description: 'メール件名に相当する強い導入。対象読者と価値を短く明示します。',
      required: true,
    },
    previewText: {
      label: 'プレビューテキスト',
      description: '受信箱で件名の横や下に出る短い説明。件名を補足して開封理由を作ります。',
      required: true,
    },
    subjectVariants: {
      label: '件名A/B案',
      description: 'A/Bテスト用の件名候補。A案とB案を改行で分けて書きます。',
      required: false,
    },
    summary: {
      label: '要約',
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
      label: '記事タイトル',
      description: '検索意図を含む記事タイトル。主キーワードを前半に置きます。',
      required: true,
    },
    slug: {
      label: 'slug',
      description: 'URLの末尾に入る英数字の識別名。短く、半角英小文字とハイフンで書きます。',
      required: true,
    },
    excerpt: {
      label: '抜粋',
      description: '記事一覧や共有時に見せる短い要約。本文を読む理由が伝わるようにします。',
      required: true,
    },
    seoDescription: {
      label: 'SEO説明文',
      description: '検索結果向けの説明文。記事の結論と対象読者を含めます。',
      required: true,
    },
    primaryTag: {
      label: '主タグ',
      description: '記事の中心カテゴリ。読者と検索エンジンの両方に主題を伝えます。',
      required: true,
    },
    socialCardText: {
      label: 'SNSカード文言',
      description: 'XやFacebookで共有されたときに見せる短い訴求文です。',
      required: false,
    },
  },
  x: {
    hook: {
      label: '冒頭フック',
      description: '最初の1投稿。驚きや課題提起で続きを読みたくさせます。',
      required: true,
    },
    threadDraft: {
      label: 'スレッド下書き',
      description: 'スレッド全体の下書き。1投稿1メッセージで簡潔に構成します。',
      required: true,
    },
    hashtags: {
      label: 'ハッシュタグ',
      description: '関連性の高いタグを最大2つまで。多すぎるタグは読みづらくなります。',
      required: false,
    },
    linkPlan: {
      label: 'リンク導線',
      description: 'リンクを入れる場合の目的と配置。Xではリンクは短縮URLとして文字数に含まれます。',
      required: false,
    },
    mediaPlan: {
      label: '画像・動画案',
      description: '添付する画像や動画の意図。1投稿につき最大4メディアを目安にします。',
      required: false,
    },
  },
  instagram: {
    slide1Hook: {
      label: '1枚目フック',
      description: '1枚目の訴求。誰のどんな悩みに効く内容かを明示します。',
      required: true,
    },
    slideOutline: {
      label: 'カルーセル構成',
      description: 'カルーセル全体の構成。各スライドの役割を箇条書きで整理します。',
      required: true,
    },
    finalCta: {
      label: '最終CTA',
      description: '保存・コメント・プロフィール遷移などの行動を促します。',
      required: true,
    },
    hashtags: {
      label: 'ハッシュタグ候補',
      description: '投稿内容に直接関係するタグを少数に絞ります。広すぎるタグだけに頼らないようにします。',
      required: false,
    },
    recommendationCheck: {
      label: 'おすすめ対象チェック',
      description: 'アカウントステータスや規約面でおすすめ表示を妨げる要素がないかの確認メモです。',
      required: false,
    },
  },
  karyaKarsa: {
    titleId: {
      label: 'タイトル（ID）',
      description: 'インドネシア語タイトル。エピソードの主題が一目でわかる表現にします。',
      required: true,
    },
    seriesName: {
      label: 'シリーズ名',
      description: '継続して読んでもらうためのまとまり。連載ものなら必ず入れます。',
      required: false,
    },
    episodeSummaryId: {
      label: 'エピソード要約（ID）',
      description: 'インドネシア語要約。今回の見どころを短く整理します。',
      required: true,
    },
    packageLead: {
      label: '価格・パッケージ導線',
      description: '有料プランやパッケージへ進む理由。無料部分で価値を伝えてから案内します。',
      required: false,
    },
    halalNote: {
      label: 'ハラール配慮',
      description: 'ハラール対応や配慮事項を必要に応じて明記します。',
      required: true,
    },
    nextEpisodeHook: {
      label: '次回予告',
      description: '次回予告。継続課金・再訪問につながる問いや予告を入れます。',
      required: true,
    },
    safetyNote: {
      label: 'NSFW・規約確認',
      description: 'NSFWや規約違反に当たる内容がないかの確認メモです。',
      required: true,
    },
    fileNotes: {
      label: '添付ファイル確認',
      description: '添付ファイルの種類とサイズの確認メモ。1ファイル128MB以内を目安にします。',
      required: false,
    },
  },
};

const glossary = {
  slug: 'URLの末尾に入る短い識別名です。例: /posts/japan-note-monetization の japan-note-monetization。',
  'A/Bテスト': '件名や見出しなどを2案用意し、どちらの反応が良いか比較する方法です。',
  カルーセル: 'Instagramなどで複数枚の画像や動画を横にスワイプして見せる投稿形式です。',
  CTA: 'Call To Actionの略です。読者に取ってほしい行動、例: 保存する、登録する、コメントする。',
  NSFW: 'Not Safe For Workの略です。性的・暴力的など、職場や公共の場で見せにくい内容を指します。',
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

function sendRpc(proc, message) {
  proc.stdin.write(`${JSON.stringify(message)}\n`);
}

function extractJsonObject(text) {
  const trimmed = String(text || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) return JSON.parse(fenced[1]);
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error('Codex response did not contain JSON.');
  }
}

async function runCodexJsonTask(prompt, { timeoutMs = 180000 } = {}) {
  const codexCommand = process.env.CODEX_APP_SERVER_COMMAND || 'codex';
  const proc = spawn(codexCommand, ['app-server'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  });

  let stderr = '';
  let threadId = null;
  let finalText = '';
  let deltaText = '';
  let settled = false;

  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      proc.kill();
      reject(new Error('Codex app-server timed out.'));
    }, timeoutMs);

    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      proc.kill();
      if (error) reject(error);
      else resolve(result);
    };

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    proc.on('error', (error) => finish(error));
    proc.on('exit', (code) => {
      if (!settled && code !== 0) finish(new Error(stderr || `Codex app-server exited with code ${code}.`));
    });

    const rl = readline.createInterface({ input: proc.stdout });
    rl.on('line', (line) => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        return;
      }

      if (message.id === 1 && message.result?.thread?.id) {
        threadId = message.result.thread.id;
        sendRpc(proc, {
          method: 'turn/start',
          id: 2,
          params: {
            threadId,
            input: [{ type: 'text', text: prompt }],
          },
        });
        return;
      }

      if (message.id === 2 && message.error) {
        finish(new Error(message.error.message || 'Codex turn/start failed.'));
        return;
      }

      if (message.method === 'item/agentMessage/delta') {
        deltaText += message.params?.delta || message.params?.text || '';
        return;
      }

      if (message.method === 'item/completed' && message.params?.item?.type === 'agentMessage') {
        finalText = message.params.item.text || finalText;
        return;
      }

      if (message.method === 'turn/completed') {
        try {
          finish(null, extractJsonObject(finalText || deltaText));
        } catch (error) {
          finish(error);
        }
      }
    });

    sendRpc(proc, {
      method: 'initialize',
      id: 0,
      params: {
        clientInfo: {
          name: 'content_workbench',
          title: 'Content Workbench',
          version: '0.1.0',
        },
      },
    });
    sendRpc(proc, { method: 'initialized', params: {} });
    sendRpc(proc, {
      method: 'thread/start',
      id: 1,
      params: {
        model: process.env.CONTENT_WORKBENCH_CODEX_MODEL || 'gpt-5.4',
        cwd: __dirname,
        approvalPolicy: 'never',
      },
    });
  });
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
  const schedule = input.schedule && typeof input.schedule === 'object' ? input.schedule : existing?.schedule || null;
  const rawScheduleItems = Array.isArray(input.scheduleItems) ? input.scheduleItems : existing?.scheduleItems || [];
  const scheduleItems = rawScheduleItems
    .filter((item) => item && typeof item.date === 'string')
    .map((item) => ({
      id: item.id || randomUUID(),
      date: item.date,
      platforms: Array.isArray(item.platforms) ? item.platforms.filter((platform) => platforms.includes(platform)) : [],
      note: String(item.note || ''),
    }));
  return {
    id: input.id || existing?.id || randomUUID(),
    theme: themes.includes(input.theme) ? input.theme : '72ms',
    status: statuses.includes(input.status) ? input.status : 'draft',
    baseTitle: String(input.baseTitle || '').trim() || '新規記事',
    baseBodyMd: String(input.baseBodyMd || ''),
    tags: Array.isArray(input.tags)
      ? input.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : String(input.tags || '')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
    images: Array.isArray(input.images) ? input.images : existing?.images || [],
    schedule:
      schedule && typeof schedule.date === 'string'
        ? {
            date: schedule.date,
            platforms: Array.isArray(schedule.platforms) ? schedule.platforms.filter((platform) => platforms.includes(platform)) : [],
            note: String(schedule.note || ''),
        }
        : null,
    scheduleItems,
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
      message: '対象配信先の必須項目が入力済み',
    },
    ...evaluatePlatformSpecificChecks(platform, values),
  ];
  return { ready: checks.every((check) => check.passed), checks };
}

function countHashtags(value) {
  return (String(value || '').match(/#[\p{L}\p{N}_-]+/gu) || []).length;
}

function splitMeaningfulLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function countCarouselSlides(value) {
  const text = String(value || '').trim();
  if (!text) return 0;
  const explicitMatches = text.match(/(?:^|\n)(?:##\s*)?(?:スライド|Slide)\s*\d+/gi);
  if (explicitMatches) return explicitMatches.length;
  return text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean).length;
}

function evaluatePlatformSpecificChecks(platform, values) {
  if (platform === 'beehiiv') {
    return [
      {
        id: 'beehiiv-title-length',
        passed: String(values.title || '').length > 0 && String(values.title || '').length <= 80,
        message: '配信タイトルは80文字以内で価値が伝わる',
      },
      {
        id: 'beehiiv-preview-text',
        passed: String(values.previewText || '').trim().length >= 20,
        message: 'プレビューテキストが20文字以上ある',
      },
      {
        id: 'beehiiv-subject-variants',
        passed: splitMeaningfulLines(values.subjectVariants).length >= 2,
        message: '件名A/B案が2案以上ある',
      },
    ];
  }

  if (platform === 'ghost') {
    return [
      {
        id: 'ghost-slug-format',
        passed: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(values.slug || '')),
        message: 'slugが半角英小文字・数字・ハイフンで書かれている',
      },
      {
        id: 'ghost-seo-description-length',
        passed: String(values.seoDescription || '').length >= 80 && String(values.seoDescription || '').length <= 160,
        message: 'SEO説明文が80〜160文字に収まっている',
      },
      {
        id: 'ghost-excerpt',
        passed: String(values.excerpt || '').trim().length >= 40,
        message: '抜粋が40文字以上ある',
      },
    ];
  }

  if (platform === 'x') {
    const tweets = splitMeaningfulLines(values.threadDraft);
    return [
      {
        id: 'x-hook-length',
        passed: String(values.hook || '').length > 0 && String(values.hook || '').length <= 280,
        message: '冒頭フックが280文字以内',
      },
      {
        id: 'x-thread-length',
        passed: tweets.length > 0 && tweets.every((tweet) => tweet.length <= 280),
        message: 'スレッド各投稿が280文字以内',
      },
      {
        id: 'x-hashtag-count',
        passed: countHashtags(values.hashtags) <= 2,
        message: 'ハッシュタグが2個以内',
      },
    ];
  }

  if (platform === 'instagram') {
    const slideCount = countCarouselSlides(values.slideOutline);
    return [
      {
        id: 'instagram-carousel-count',
        passed: slideCount >= 3 && slideCount <= 10,
        message: 'カルーセル構成が3〜10枚分で整理されている',
      },
      {
        id: 'instagram-save-cta',
        passed: /保存|save|コメント|プロフィール|フォロー/i.test(String(values.finalCta || '')),
        message: '最終CTAに保存・コメント・プロフィール遷移などの行動がある',
      },
      {
        id: 'instagram-recommendation-check',
        passed: String(values.recommendationCheck || '').trim().length > 0,
        message: 'おすすめ対象チェックの確認メモがある',
      },
    ];
  }

  if (platform === 'karyaKarsa') {
    return [
      {
        id: 'karyakarsa-next-hook',
        passed: String(values.nextEpisodeHook || '').trim().length >= 20,
        message: '次回予告が20文字以上ある',
      },
      {
        id: 'karyakarsa-safety-note',
        passed: String(values.safetyNote || '').trim().length > 0,
        message: 'NSFW・規約確認メモが入力済み',
      },
      {
        id: 'karyakarsa-series-or-package',
        passed: String(values.seriesName || values.packageLead || '').trim().length > 0,
        message: 'シリーズ名または価格・パッケージ導線がある',
      },
    ];
  }

  return [];
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

function aiContext(body) {
  return {
    article: body.article || {},
    researchNotes: String(body.researchNotes || ''),
    platformRecords: body.platformRecords || {},
    guides: platformFieldGuides,
    platforms,
  };
}

function aiPrompt(task, context, outputShape) {
  return [
    'あなたは日本語の記事制作ワークベンチに組み込まれた編集AIです。',
    'ユーザーのサブスク利用枠で動くCodex app-server経由の生成として、実務でそのまま編集できる下書きを作ります。',
    '出力は必ずJSONだけにしてください。Markdownコードフェンス、説明文、前置きは禁止です。',
    `タスク: ${task}`,
    `期待するJSON形: ${JSON.stringify(outputShape)}`,
    'コンテキスト:',
    JSON.stringify(context, null, 2),
  ].join('\n');
}

async function handleAiRoute(url, body) {
  const context = aiContext(body);
  if (url.pathname === '/api/ai/draft') {
    return await runCodexJsonTask(
      aiPrompt('調査メモと現在の記事情報をもとに、記事タイトル、本文Markdown、タグ案を作成する。', context, {
        title: 'string',
        bodyMarkdown: 'string',
        tags: ['string'],
      }),
    );
  }

  if (url.pathname === '/api/ai/variants') {
    return await runCodexJsonTask(
      aiPrompt('記事本文と調査メモをもとに、各プラットフォームの入力欄を最適化して埋める。', context, {
        variants: {
          beehiiv: { enabled: true, fields: {} },
          ghost: { enabled: true, fields: {} },
          x: { enabled: true, fields: {} },
          instagram: { enabled: true, fields: {} },
          karyaKarsa: { enabled: true, fields: {} },
        },
      }),
    );
  }

  if (url.pathname === '/api/ai/image-prompt') {
    return await runCodexJsonTask(
      aiPrompt('投稿内容をもとに、ChatGPT画像生成に貼るための日本語画像ブリーフを提案する。画像内文字とロゴは避ける。', context, {
        imagePrompt: 'string',
      }),
    );
  }

  if (url.pathname === '/api/ai/schedule') {
    return await runCodexJsonTask(
      aiPrompt('記事一覧と配信先をもとに、今後30日間の投稿スケジュール案を作る。詰め込みすぎず、同じ日に多すぎる投稿を置かない。', {
        ...context,
        articles: body.articles || [],
      }, {
        schedules: [{ articleId: 'string', date: 'YYYY-MM-DD', note: 'string', platforms: ['string'] }],
      }),
    );
  }

  const error = new Error('AI route not found.');
  error.statusCode = 404;
  throw error;
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
    sendJson(res, 200, { platformFieldGuides, platforms: platformMeta, glossary });
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
    const body = await readJsonBody(req);
    try {
      sendJson(res, 200, await handleAiRoute(url, body));
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: error instanceof Error ? error.message : 'AI generation failed.',
      });
    }
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
