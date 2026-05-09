const platformOrder = ['beehiiv', 'ghost', 'x', 'instagram', 'karyaKarsa'];
const statusLabels = {
  draft: '下書き',
  review: 'レビュー中',
  published: '公開済み',
  archived: 'アーカイブ',
};
const statusDescriptions = {
  total: '全記事',
  draft: '未公開',
  review: '確認待ち',
  published: '公開済み',
};
const themeLabels = {
  '72ms': '72ms',
  bungu: '文具',
  'id-travel': 'インドネシア旅行',
};
const purposeLabels = {
  hero: 'アイキャッチ',
  inline: '挿絵',
  carousel: 'カルーセル',
};

let articles = [];
let guides = {};
let glossary = {};
let platformMeta = {};
let platformStores = {};
let currentArticle = null;
let dashboardFilter = 'total';
let platformDrafts = {};
let calendarCursor = new Date();
let selectedScheduleDate = toDateKey(new Date());

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'content-type': 'application/json' },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

async function aiRequest(path, extra = {}) {
  collectEditor();
  collectPlatformValues();
  setSaveStatus('Codexで生成中...', 'busy');
  return await api(path, {
    method: 'POST',
    body: JSON.stringify({
      article: currentArticle,
      researchNotes: researchText(),
      platformRecords: collectPlatformRecords(),
      articles,
      ...extra,
    }),
  });
}

function emptyArticle() {
  return {
    theme: '72ms',
    status: 'draft',
    baseTitle: '新規記事',
    baseBodyMd: '',
    tags: [],
    images: [],
  };
}

async function load() {
  const guidePayload = await api('/api/guides');
  guides = guidePayload.platformFieldGuides;
  glossary = guidePayload.glossary || {};
  platformMeta = guidePayload.platforms;
  const articlePayload = await api('/api/articles');
  articles = articlePayload.articles;
  platformStores = articlePayload.platformStores;
  currentArticle = articles[0] || emptyArticle();
  resetPlatformDrafts();
  renderAll();
}

function renderAll() {
  renderMetrics();
  renderCalendar();
  renderDashboardCards();
  renderRecent();
  renderDashboardDetail();
  renderArticleList();
  renderEditor();
  renderGlossary();
  renderPlatformFields();
  renderLibrary();
}

function renderMetrics() {
  const metrics = [
    ['total', 'すべて', articles.length],
    ['draft', '下書き', articles.filter((a) => a.status === 'draft').length],
    ['review', 'レビュー中', articles.filter((a) => a.status === 'review').length],
    ['published', '公開済み', articles.filter((a) => a.status === 'published').length],
  ];
  $('#metrics').innerHTML = metrics
    .map(
      ([key, label, value]) => `
      <button class="metric ${dashboardFilter === key ? 'active' : ''}" type="button" data-dashboard-filter="${key}">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${statusDescriptions[key]}</small>
      </button>
    `,
    )
    .join('');
  $$('[data-dashboard-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      dashboardFilter = button.dataset.dashboardFilter;
      const filtered = getDashboardArticles();
      if (filtered.length) {
        currentArticle = filtered[0];
        resetPlatformDrafts();
      }
      renderAll();
    });
  });
}

function getDashboardArticles() {
  return dashboardFilter === 'total' ? articles : articles.filter((article) => article.status === dashboardFilter);
}

function toDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function scheduleEntriesForArticle(article) {
  const items = Array.isArray(article.scheduleItems) ? article.scheduleItems : [];
  if (items.length) return items.map((schedule) => ({ article, schedule }));
  return article.schedule?.date ? [{ article, schedule: { ...article.schedule, id: `${article.id}-legacy` } }] : [];
}

function scheduleForDate(dateKey) {
  return articles.flatMap(scheduleEntriesForArticle).filter((entry) => entry.schedule.date === dateKey);
}

function nextScheduleLabel(article) {
  const entries = scheduleEntriesForArticle(article).sort((a, b) => a.schedule.date.localeCompare(b.schedule.date));
  return entries[0]?.schedule.date || '未予定';
}

function enabledPlatformsForArticle(article) {
  return platformOrder.filter((platform) => getPlatformRecord(platform, article.id)?.enabled);
}

function renderCalendar() {
  const title = $('#calendarTitle');
  const grid = $('#calendarGrid');
  if (!title || !grid) return;

  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = addDays(firstDay, -firstDay.getDay());
  title.textContent = `${year}年${month + 1}月`;

  const weekdayLabels = ['日', '月', '火', '水', '木', '金', '土'];
  const cells = weekdayLabels.map((day) => `<div class="calendar-weekday">${day}</div>`);
  for (let index = 0; index < 42; index += 1) {
    const date = addDays(start, index);
    const key = toDateKey(date);
    const items = scheduleForDate(key);
    const outside = date.getMonth() !== month;
    const today = key === toDateKey(new Date());
    cells.push(`
      <button class="calendar-day ${outside ? 'outside' : ''} ${today ? 'today' : ''} ${selectedScheduleDate === key ? 'selected' : ''}" type="button" data-calendar-date="${key}">
        <span class="calendar-date-number">${date.getDate()}</span>
        <span class="calendar-events">
          ${items
            .slice(0, 3)
            .map(({ article, schedule }) => `<span class="calendar-event">${escapeHtml(article.baseTitle)} / ${(schedule.platforms || []).join(', ')}</span>`)
            .join('')}
          ${items.length > 3 ? `<span class="calendar-more">+${items.length - 3}</span>` : ''}
        </span>
      </button>
    `);
  }
  grid.innerHTML = cells.join('');

  $$('[data-calendar-date]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedScheduleDate = button.dataset.calendarDate;
      renderCalendar();
    });
  });

  renderSelectedSchedule();
}

function renderSelectedSchedule() {
  const title = $('#selectedDateTitle');
  const items = $('#selectedDateItems');
  if (!title || !items) return;
  title.textContent = new Date(`${selectedScheduleDate}T00:00:00`).toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
  const scheduled = scheduleForDate(selectedScheduleDate);
  items.innerHTML =
    scheduled
      .map(
        ({ article, schedule }) => `
        <button class="schedule-item ${currentArticle?.id === article.id ? 'active' : ''}" type="button" data-article-id="${article.id}">
          <strong>${escapeHtml(article.baseTitle)}</strong>
          <span>${(schedule.platforms || []).map(platformPill).join('') || '配信先未選択'}</span>
          ${schedule.note ? `<small>${escapeHtml(schedule.note)}</small>` : ''}
        </button>
      `,
      )
      .join('') || '<p class="empty">この日の予定はありません。</p>';
  bindArticleCardClicks();
}

async function saveScheduleForArticle(article, dateKey, note = '', scheduledPlatforms = null) {
  const platforms = Array.isArray(scheduledPlatforms) ? scheduledPlatforms : enabledPlatformsForArticle(article);
  const scheduleItem = {
    id: randomId(),
    date: dateKey,
    platforms,
    note,
  };
  const payload = await api('/api/articles', {
    method: 'POST',
    body: JSON.stringify({
      article: {
        ...article,
        schedule: {
          date: dateKey,
          platforms,
          note,
        },
        scheduleItems: [...(article.scheduleItems || []), scheduleItem],
      },
      platformRecords: platformStoresToRecords(article.id),
    }),
  });
  const index = articles.findIndex((item) => item.id === payload.article.id);
  if (index >= 0) articles[index] = payload.article;
  if (currentArticle?.id === payload.article.id) currentArticle = payload.article;
}

function randomId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function platformStoresToRecords(articleId) {
  return Object.fromEntries(platformOrder.map((platform) => [platform, getPlatformRecord(platform, articleId) || { enabled: false, fields: {} }]));
}

async function scheduleSelectedArticle() {
  if (!currentArticle?.id) {
    setSaveStatus('先に記事を保存してください', 'error');
    return;
  }
  await saveScheduleForArticle(currentArticle, selectedScheduleDate, '手動で予定');
  const articlePayload = await api('/api/articles');
  articles = articlePayload.articles;
  platformStores = articlePayload.platformStores;
  renderAll();
  setSaveStatus('投稿予定を保存しました', 'ok');
}

async function autoScheduleDraft() {
  try {
    const result = await aiRequest('/api/ai/schedule');
    const schedules = Array.isArray(result.schedules) ? result.schedules : [];
    if (!schedules.length) {
      setSaveStatus('Codexの予定案は空でした', 'error');
      return;
    }
    for (const schedule of schedules) {
      const article = articles.find((item) => item.id === schedule.articleId);
      if (!article || !schedule.date) continue;
      await saveScheduleForArticle(article, schedule.date, schedule.note || 'Codex予定案', schedule.platforms);
    }
    const articlePayload = await api('/api/articles');
    articles = articlePayload.articles;
    platformStores = articlePayload.platformStores;
    calendarCursor = new Date();
    selectedScheduleDate = schedules[0]?.date || toDateKey(new Date());
    renderAll();
    setSaveStatus('Codexで予定案を作成しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || 'Codex生成に失敗しました', 'error');
  }
}

function renderDashboardCards() {
  const filtered = getDashboardArticles();
  $('#dashboardListTitle').textContent =
    dashboardFilter === 'total' ? 'すべての記事' : `${statusLabels[dashboardFilter]}の記事`;
  $('#dashboardArticleCards').innerHTML =
    filtered.map((article) => articleCard(article)).join('') ||
    `<div class="empty-state">
      <p>該当する記事はありません。</p>
      <button type="button" class="primary" id="createFirstArticleBtn">記事を作成</button>
    </div>`;
  bindArticleCardClicks();
  $('#createFirstArticleBtn')?.addEventListener('click', startNewArticle);
}

function renderRecent() {
  $('#recentArticles').innerHTML =
    articles.slice(0, 6).map((article) => articleCard(article)).join('') ||
    '<p class="empty">記事はまだありません。</p>';
  bindArticleCardClicks();
}

function renderDashboardDetail() {
  if (!currentArticle || !articles.length) {
    $('#dashboardArticleDetail').innerHTML =
      '<p class="empty">記事カードを選択すると、テーマ・状態・配信先がここに表示されます。</p>';
    return;
  }
  const enabledPlatforms = platformOrder.filter((platform) => getPlatformRecord(platform, currentArticle.id)?.enabled);
  $('#dashboardArticleDetail').innerHTML = `
    <div class="detail-title">${escapeHtml(currentArticle.baseTitle)}</div>
    <dl class="detail-grid">
      <dt>テーマ</dt><dd>${themeLabel(currentArticle.theme)}</dd>
      <dt>状態</dt><dd><span class="status-badge">${statusLabel(currentArticle.status)}</span></dd>
      <dt>タグ</dt><dd>${tagMarkup(currentArticle.tags)}</dd>
      <dt>本文</dt><dd>${currentArticle.baseBodyMd?.length || 0} 文字</dd>
      <dt>更新</dt><dd>${formatDate(currentArticle.updatedAt)}</dd>
      <dt>予定</dt><dd>${nextScheduleLabel(currentArticle)}</dd>
      <dt>配信先</dt><dd>${enabledPlatforms.map(platformPill).join('') || '未選択'}</dd>
    </dl>
    <button class="primary wide-action" type="button" id="openSelectedInEditorBtn">エディターで開く</button>
  `;
  $('#openSelectedInEditorBtn').addEventListener('click', () => showView('editor'));
}

function articleCard(article) {
  const enabledPlatforms = platformOrder.filter((platform) => getPlatformRecord(platform, article.id)?.enabled);
  return `
    <button class="article-card ${currentArticle?.id === article.id ? 'active' : ''}" type="button" data-article-id="${article.id}">
      <span class="card-topline">
        <span class="status-badge">${statusLabel(article.status)}</span>
        <span class="meta-line">${formatDate(article.updatedAt)}</span>
      </span>
      <strong>${escapeHtml(article.baseTitle)}</strong>
      <span class="meta-line">${themeLabel(article.theme)} / 本文 ${article.baseBodyMd?.length || 0} 文字</span>
      <span class="meta-line">投稿予定: ${nextScheduleLabel(article)}</span>
      <span class="tag-row">${tagMarkup(article.tags)}</span>
      <span class="platform-row">${enabledPlatforms.map(platformPill).join('') || '<span class="meta-line">配信先未選択</span>'}</span>
    </button>
  `;
}

function bindArticleCardClicks() {
  $$('[data-article-id]').forEach((button) => {
    button.addEventListener('click', () => {
      currentArticle = articles.find((article) => article.id === button.dataset.articleId) || currentArticle;
      resetPlatformDrafts();
      renderAll();
    });
  });
}

function renderArticleList() {
  const query = $('#searchInput').value.trim().toLowerCase();
  const theme = $('#themeFilter').value;
  const status = $('#statusFilter').value;
  const filtered = articles
    .filter((article) => !theme || article.theme === theme)
    .filter((article) => !status || article.status === status)
    .filter((article) => {
      if (!query) return true;
      return `${article.baseTitle} ${article.tags.join(' ')}`.toLowerCase().includes(query);
    });

  $('#articleList').innerHTML =
    filtered.map((article) => articleCard(article)).join('') ||
    '<p class="empty">該当する記事はありません。</p>';
  bindArticleCardClicks();
}

function renderEditor() {
  if (!currentArticle) currentArticle = emptyArticle();
  $('#editorContext').innerHTML = `
    <div>
      <span class="status-badge">${statusLabel(currentArticle.status)}</span>
      <strong>${escapeHtml(currentArticle.baseTitle || '新規記事')}</strong>
    </div>
    <span class="meta-line">${themeLabel(currentArticle.theme)} / ${formatDate(currentArticle.updatedAt)} / ${enabledPlatformCount()}件の配信先</span>
  `;
  $('#baseTitle').value = currentArticle.baseTitle || '';
  $('#theme').value = currentArticle.theme || '72ms';
  $('#status').value = currentArticle.status || 'draft';
  $('#tags').value = (currentArticle.tags || []).join(', ');
  $('#baseBodyMd').value = currentArticle.baseBodyMd || '';
}

function enabledPlatformCount() {
  return platformOrder.filter((platform) => platformDrafts[platform]?.enabled).length;
}

function researchText() {
  return ($('#researchNotes')?.value || '').trim();
}

function plainExcerpt(text, max = 120) {
  return String(text || '')
    .replace(/[#>*_`[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function firstMeaningfulLine(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, '').trim())
    .find(Boolean);
}

function slugifyTitle(title) {
  const slug = String(title || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return slug || 'japan-note-idea';
}

function hashtagText(tags = []) {
  return tags
    .slice(0, 2)
    .map((tag) => `#${String(tag).replace(/^#/, '').replace(/\s+/g, '')}`)
    .join(' ');
}

async function draftFromResearch() {
  try {
    const result = await aiRequest('/api/ai/draft');
    $('#baseTitle').value = result.title || currentArticle.baseTitle || '';
    $('#baseBodyMd').value = result.bodyMarkdown || currentArticle.baseBodyMd || '';
    if (Array.isArray(result.tags)) $('#tags').value = result.tags.join(', ');
    collectEditor();
    renderEditor();
    setSaveStatus('Codexで本文案を作成しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || 'Codex生成に失敗しました', 'error');
  }
}

function generatePlatformFields(platform) {
  collectEditor();
  const title = currentArticle.baseTitle || '新規記事';
  const body = currentArticle.baseBodyMd || researchText();
  const excerpt = plainExcerpt(body || researchText(), 140);
  const tags = currentArticle.tags || [];
  const tagLine = hashtagText(tags);
  const cta = 'よければ保存して、あとで見返してください。';

  if (platform === 'beehiiv') {
    return {
      title: `${title}: 調査から見えた要点`,
      previewText: excerpt || '調査メモをもとに、今すぐ使える要点を短く整理しました。',
      subjectVariants: [`${title}で押さえるべきこと`, `調査で見えた${title}の要点`].join('\n'),
      summary: excerpt || '本文の要点を短く整理します。',
      cta: '詳しい内容は本文で確認してください。',
    };
  }

  if (platform === 'ghost') {
    return {
      title,
      slug: slugifyTitle(title),
      excerpt: excerpt || '調査内容をもとに、読者が実践しやすい形で要点を整理します。',
      seoDescription: plainExcerpt(`${title}について、調査内容から重要なポイントと実践のヒントを整理します。${excerpt}`, 155),
      primaryTag: tags[0] || themeLabel(currentArticle.theme),
      socialCardText: `${title}の要点を調査ベースで整理しました。`,
    };
  }

  if (platform === 'x') {
    return {
      hook: `${title}について調べると、見落としやすいポイントがありました。`,
      threadDraft: [
        `${title}について調査した要点をまとめます。`,
        excerpt || 'まず押さえたいのは、読者が次に何をすべきかが明確になることです。',
        '使うときは、前提・具体例・次の行動の順に整理すると伝わりやすくなります。',
      ].join('\n'),
      hashtags: tagLine,
      linkPlan: '本文公開後に最終投稿へ記事リンクを追加する。',
      mediaPlan: '要点を1枚で整理した図解、または記事テーマを表すアイキャッチを添付する。',
    };
  }

  if (platform === 'instagram') {
    return {
      slide1Hook: `${title}で迷ったら、まずここを確認`,
      slideOutline: [
        '1枚目: 読者の悩みと結論',
        '2枚目: 調査でわかった重要ポイント',
        '3枚目: 具体例',
        '4枚目: 実践手順',
        '5枚目: 保存を促すまとめ',
      ].join('\n'),
      finalCta: cta,
      hashtags: tagLine,
      recommendationCheck: '規約違反・誤解を招く表現・過度な煽りがないか確認する。',
    };
  }

  if (platform === 'karyaKarsa') {
    return {
      titleId: title,
      seriesName: themeLabel(currentArticle.theme),
      episodeSummaryId: excerpt || 'Ringkasan episode berdasarkan riset dan catatan utama.',
      packageLead: '続きを読みたい人向けに、次回のテーマと有料部分の価値を明確にする。',
      halalNote: '飲食・観光・生活情報にハラール配慮が必要な場合は本文内で明記する。',
      nextEpisodeHook: '次回は、今回の内容を実践するときの具体例を紹介します。',
      safetyNote: 'NSFWや規約違反に当たる内容がないことを確認済み。',
      fileNotes: '添付ファイルがある場合は種類と128MB以内であることを確認する。',
    };
  }

  return {};
}

function fillPlatformVariant(platform) {
  platformDrafts[platform] = {
    ...(platformDrafts[platform] || {}),
    enabled: true,
    fields: {
      ...(platformDrafts[platform]?.fields || {}),
      ...generatePlatformFields(platform),
    },
    readiness: platformDrafts[platform]?.readiness || null,
  };
}

function applyGeneratedVariants(variants, onlyPlatform = null) {
  const targetPlatforms = onlyPlatform ? [onlyPlatform] : platformOrder;
  targetPlatforms.forEach((platform) => {
    const generated = variants?.[platform];
    if (!generated) return;
    platformDrafts[platform] = {
      ...(platformDrafts[platform] || {}),
      enabled: generated.enabled ?? true,
      fields: {
        ...(platformDrafts[platform]?.fields || {}),
        ...(generated.fields || {}),
      },
      readiness: platformDrafts[platform]?.readiness || null,
    };
  });
}

async function fillAllVariants() {
  try {
    const result = await aiRequest('/api/ai/variants');
    applyGeneratedVariants(result.variants || {});
    renderPlatformFields();
    renderEditor();
    setSaveStatus('Codexで各PF入力案を作成しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || 'Codex生成に失敗しました', 'error');
  }
}

async function fillSingleVariant(platform) {
  try {
    const result = await aiRequest('/api/ai/variants');
    applyGeneratedVariants(result.variants || {}, platform);
    renderPlatformFields();
    renderEditor();
    setSaveStatus('CodexでPF入力案を作成しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || 'Codex生成に失敗しました', 'error');
  }
}

async function suggestImagePrompt() {
  try {
    const result = await aiRequest('/api/ai/image-prompt');
    $('#imagePrompt').value = result.imagePrompt || '';
    composeImagePrompt();
    setSaveStatus('Codexで画像プロンプト案を作成しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || 'Codex生成に失敗しました', 'error');
  }
}

function renderGlossary() {
  const target = $('#glossaryPanel');
  if (!target) return;
  const entries = Object.entries(glossary);
  target.innerHTML = entries.length
    ? `
      <details>
        <summary>用語の説明</summary>
        <dl>
          ${entries.map(([term, description]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(description)}</dd>`).join('')}
        </dl>
      </details>
    `
    : '';
}

function renderPlatformFields() {
  if (!currentArticle) return;
  $('#platformFields').innerHTML = platformOrder
    .map((platform) => platformPanel(platform, platformDrafts[platform] || getPlatformRecord(platform, currentArticle.id)))
    .join('');

  $$('.platform-toggle').forEach((input) => {
    input.addEventListener('change', () => {
      collectPlatformValues();
      const platform = input.dataset.platformToggle;
      platformDrafts[platform] = { ...(platformDrafts[platform] || {}), enabled: input.checked };
      renderPlatformFields();
      renderEditor();
    });
  });
  $$('[data-platform-field]').forEach((field) => {
    field.addEventListener('input', () => {
      const platform = field.dataset.platform;
      platformDrafts[platform] = collectPlatformRecord(platform);
      setSaveStatus('未保存', 'dirty');
    });
  });
  $$('.check-platform-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      collectEditor();
      const platform = button.dataset.platform;
      const record = collectPlatformRecord(platform);
      const result = await api('/api/readiness', {
        method: 'POST',
        body: JSON.stringify({ article: currentArticle, platform, record }),
      });
      renderReadinessInto(platform, result);
      setSaveStatus('チェック済み', 'ok');
    });
  });
  $$('.fill-platform-btn').forEach((button) => {
    button.addEventListener('click', () => fillSingleVariant(button.dataset.platform));
  });
}

function platformPanel(platform, record = {}) {
  const meta = platformMeta[platform] || { label: platform, iconUrl: '' };
  const enabled = Boolean(record?.enabled);
  const readiness = record?.readiness;
  const fields = guides[platform] || {};
  return `
    <section class="platform-panel ${enabled ? 'enabled' : ''}" data-platform-panel="${platform}">
      <header class="platform-header">
        <label class="switch-label">
          <input class="platform-toggle" type="checkbox" data-platform-toggle="${platform}" ${enabled ? 'checked' : ''} />
          <span class="switch-ui"></span>
          <img class="platform-icon" src="${meta.iconUrl}" alt="" />
          <span>${escapeHtml(meta.label)}</span>
        </label>
        <div class="platform-header-actions">
          <a class="platform-link" href="${meta.postUrl || meta.sourceUrl}" target="_blank" rel="noreferrer">${escapeHtml(meta.postLabel || '投稿ページを開く')}</a>
          <span class="readiness-chip ${readiness?.ready ? 'ready' : 'not-ready'}">${readiness?.ready ? '公開可' : '未完了'}</span>
        </div>
      </header>
      ${
        enabled
          ? `<div class="platform-body">
              ${Object.entries(fields)
                .map(([field, guide]) => fieldControl(platform, field, guide, record?.fields?.[field] || ''))
                .join('')}
              <div class="platform-readiness" data-readiness="${platform}">
                ${renderReadiness(readiness)}
              </div>
              <div class="top-actions">
                <button class="fill-platform-btn" type="button" data-platform="${platform}">AI入力案を作成</button>
                <button class="check-platform-btn" type="button" data-platform="${platform}">この配信先をチェック</button>
              </div>
            </div>`
          : '<p class="platform-disabled-note">オンにすると入力欄と公開チェックが表示されます。</p>'
      }
    </section>
  `;
}

function fieldControl(platform, field, guide, value) {
  const rows = field.toLowerCase().includes('draft') || field.toLowerCase().includes('outline') ? 5 : 2;
  return `
    <label class="field-group">
      <span class="field-label">
        ${escapeHtml(guide.label)} ${guide.required ? '<b>*</b>' : ''}
        <span class="help" role="button" tabindex="0" aria-label="${escapeHtml(guide.label)} の説明" data-tip="${escapeHtml(guide.description)}">?</span>
      </span>
      <textarea data-platform="${platform}" data-platform-field="${field}" rows="${rows}" placeholder="${escapeHtml(guide.description)}">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function renderReadiness(readiness) {
  if (!readiness) return '<p class="meta-line">まだチェックしていません。</p>';
  return readiness.checks
    .map(
      (check) => `
      <div class="check-row ${check.passed ? 'check-pass' : 'check-fail'}">
        <span>${check.passed ? '完了' : '要対応'}</span>
        <p>${escapeHtml(check.message)}</p>
      </div>
    `,
    )
    .join('');
}

function renderReadinessInto(platform, readiness) {
  platformDrafts[platform] = { ...(platformDrafts[platform] || collectPlatformRecord(platform)), readiness };
  const target = $(`[data-readiness="${platform}"]`);
  if (target) target.innerHTML = renderReadiness(readiness);
  const chip = $(`[data-platform-panel="${platform}"] .readiness-chip`);
  if (chip) {
    chip.textContent = readiness.ready ? '公開可' : '未完了';
    chip.classList.toggle('ready', readiness.ready);
    chip.classList.toggle('not-ready', !readiness.ready);
  }
}

function getPlatformRecord(platform, articleId) {
  return platformStores?.[platform]?.articles?.[articleId] || null;
}

function resetPlatformDrafts() {
  platformDrafts = Object.fromEntries(
    platformOrder.map((platform) => [
      platform,
      structuredClone(getPlatformRecord(platform, currentArticle?.id) || { enabled: false, fields: {}, readiness: null }),
    ]),
  );
}

function collectPlatformValues() {
  platformOrder.forEach((platform) => {
    if ($(`[data-platform-toggle="${platform}"]`)) {
      platformDrafts[platform] = collectPlatformRecord(platform);
    }
  });
}

function collectPlatformRecord(platform) {
  const existing = platformDrafts[platform] || {};
  const enabled = Boolean($(`[data-platform-toggle="${platform}"]`)?.checked);
  const fields = Object.fromEntries(
    $$(`[data-platform="${platform}"][data-platform-field]`).map((field) => [field.dataset.platformField, field.value]),
  );
  return { enabled, fields: { ...(existing.fields || {}), ...fields }, readiness: existing.readiness || null };
}

function collectPlatformRecords() {
  collectPlatformValues();
  return platformDrafts;
}

function collectEditor() {
  currentArticle = {
    ...currentArticle,
    baseTitle: $('#baseTitle').value,
    theme: $('#theme').value,
    status: $('#status').value,
    tags: $('#tags').value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    baseBodyMd: $('#baseBodyMd').value,
  };
  setSaveStatus('未保存', 'dirty');
}

async function saveCurrentArticle() {
  collectEditor();
  setSaveStatus('保存中...', 'busy');
  try {
    const payload = await api('/api/articles', {
      method: 'POST',
      body: JSON.stringify({ article: currentArticle, platformRecords: collectPlatformRecords() }),
    });
    currentArticle = payload.article;
    const index = articles.findIndex((article) => article.id === payload.article.id);
    if (index >= 0) articles[index] = payload.article;
    else articles.unshift(payload.article);
    const articlePayload = await api('/api/articles');
    articles = articlePayload.articles;
    platformStores = articlePayload.platformStores;
    resetPlatformDrafts();
    renderAll();
    setSaveStatus('保存しました', 'ok');
  } catch (error) {
    setSaveStatus(error.message || '保存に失敗しました', 'error');
  }
}

function setSaveStatus(text, state = '') {
  const target = $('#saveStatus');
  if (!target) return;
  target.textContent = text;
  target.dataset.state = state;
}

function renderLibrary() {
  const query = ($('#librarySearch')?.value || '').trim().toLowerCase();
  const images = articles.flatMap((article) =>
    (article.images || []).map((image) => ({ ...image, articleTitle: article.baseTitle })),
  );
  const filtered = images.filter((image) => !query || image.prompt.toLowerCase().includes(query));
  $('#imageLibrary').innerHTML =
    filtered
      .map(
        (image) => `
      <article class="image-card">
        <img src="${image.url}" alt="${escapeHtml(image.prompt)}" />
        <p>${escapeHtml(image.prompt)}</p>
        <div class="meta-line">${escapeHtml(image.articleTitle)} / ${purposeLabels[image.purpose] || image.purpose} / ${image.ratio}</div>
        <button type="button" data-copy-md="${escapeHtml(markdownForImage(image))}">Markdownをコピー</button>
      </article>
    `,
      )
      .join('') || '<p class="empty">画像はまだありません。</p>';
  bindCopyButtons();
}

function composeImagePrompt() {
  collectEditor();
  const prompt = $('#imagePrompt').value.trim();
  const title = currentArticle.baseTitle || '新規記事';
  const theme = themeLabel(currentArticle.theme);
  const purpose = purposeLabels[$('#imagePurpose').value] || $('#imagePurpose').value;
  const ratio = $('#imageRatio').value;
  const composed = [
    `記事「${title}」の画像を生成してください。`,
    `テーマ: ${theme}`,
    `用途: ${purpose}`,
    `アスペクト比: ${ratio}`,
    'スタイル: 編集記事向け、主題が明確、記事内で使いやすい、文字やロゴなし。',
    '避ける: 汎用的なストックフォト感、読めない文字、ウォーターマーク。',
    '',
    `画像ブリーフ: ${prompt}`,
  ].join('\n');
  $('#composedPrompt').value = composed;
  return composed;
}

async function copyImagePrompt() {
  const composed = $('#composedPrompt').value || composeImagePrompt();
  await navigator.clipboard.writeText(composed);
  $('#copyPromptBtn').textContent = 'コピー済み';
  setTimeout(() => {
    $('#copyPromptBtn').textContent = 'ChatGPT用にコピー';
  }, 1200);
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function attachImage() {
  collectEditor();
  if (!currentArticle.id) await saveCurrentArticle();
  const file = $('#imageUpload').files?.[0];
  if (!file) {
    $('#imageResult').innerHTML = '<p class="check-fail">ChatGPTで生成した画像を選択してください。</p>';
    return;
  }
  const { image } = await api('/api/images/attach', {
    method: 'POST',
    body: JSON.stringify({
      articleId: currentArticle.id,
      prompt: $('#composedPrompt').value || composeImagePrompt(),
      purpose: $('#imagePurpose').value,
      ratio: $('#imageRatio').value,
      url: await fileToDataUrl(file),
    }),
  });
  currentArticle.images = [...(currentArticle.images || []), image];
  const articlePayload = await api('/api/articles');
  articles = articlePayload.articles;
  platformStores = articlePayload.platformStores;
  resetPlatformDrafts();
  $('#imageResult').innerHTML = `
    <img src="${image.url}" alt="${escapeHtml(image.prompt)}" />
    <button type="button" data-copy-md="${escapeHtml(markdownForImage(image))}">Markdownをコピー</button>
  `;
  bindCopyButtons();
  renderLibrary();
  setSaveStatus('画像を追加しました', 'ok');
}

function bindCopyButtons() {
  $$('[data-copy-md]').forEach((button) => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.copyMd);
      button.textContent = 'コピー済み';
    });
  });
}

function showView(view) {
  $$('.view').forEach((element) => element.classList.toggle('active', element.id === `${view}View`));
  $$('.tab').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
}

function platformPill(platform) {
  const meta = platformMeta[platform] || { label: platform, iconUrl: '' };
  return `<span class="platform-pill"><img src="${meta.iconUrl}" alt="" />${escapeHtml(meta.label)}</span>`;
}

function tagMarkup(tags = []) {
  return tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join('') || '<span class="meta-line">なし</span>';
}

function statusLabel(status) {
  return statusLabels[status] || status;
}

function themeLabel(theme) {
  return themeLabels[theme] || theme;
}

function markdownForImage(image) {
  return `![${image.prompt}](${image.url})`;
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('ja-JP') : '未保存';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return entities[char];
  });
}

function startNewArticle() {
  currentArticle = emptyArticle();
  resetPlatformDrafts();
  renderAll();
  setSaveStatus('未保存', 'dirty');
  showView('editor');
}

$$('.tab').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
$('#newArticleBtn').addEventListener('click', startNewArticle);
$('#saveBtn').addEventListener('click', saveCurrentArticle);
$('#draftFromResearchBtn').addEventListener('click', draftFromResearch);
$('#fillVariantsBtn').addEventListener('click', fillAllVariants);
$('#suggestImagePromptBtn').addEventListener('click', suggestImagePrompt);
$('#suggestImagePromptInlineBtn').addEventListener('click', suggestImagePrompt);
$('#composePromptBtn').addEventListener('click', composeImagePrompt);
$('#copyPromptBtn').addEventListener('click', copyImagePrompt);
$('#attachImageBtn').addEventListener('click', attachImage);
$('#clearDashboardFilterBtn').addEventListener('click', () => {
  dashboardFilter = 'total';
  renderAll();
});
$('#calendarPrevBtn').addEventListener('click', () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderCalendar();
});
$('#calendarNextBtn').addEventListener('click', () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderCalendar();
});
$('#scheduleSelectedArticleBtn').addEventListener('click', scheduleSelectedArticle);
$('#autoScheduleBtn').addEventListener('click', autoScheduleDraft);
['baseTitle', 'theme', 'status', 'tags', 'baseBodyMd'].forEach((id) => $(`#${id}`).addEventListener('input', collectEditor));
['searchInput', 'themeFilter', 'statusFilter'].forEach((id) => $(`#${id}`).addEventListener('input', renderArticleList));
$('#librarySearch').addEventListener('input', renderLibrary);

load().catch((error) => {
  document.body.innerHTML = `<pre>${escapeHtml(error.stack || error.message)}</pre>`;
});
