const platformOrder = ['beehiiv', 'ghost', 'x', 'instagram', 'karyaKarsa'];
const statusLabels = {
  draft: '下書き',
  review: 'レビュー中',
  published: '公開済み',
  archived: 'アーカイブ',
};
const themeLabels = {
  '72ms': '72候',
  bungu: '文具',
  'id-travel': 'インドネシア向け旅行',
};

let articles = [];
let guides = {};
let platformMeta = {};
let platformStores = {};
let currentArticle = null;
let dashboardFilter = 'total';
let platformDrafts = {};

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

function emptyArticle() {
  return {
    theme: '72ms',
    status: 'draft',
    baseTitle: '無題の記事',
    baseBodyMd: '',
    tags: [],
    images: [],
  };
}

async function load() {
  const guidePayload = await api('/api/guides');
  guides = guidePayload.platformFieldGuides;
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
  renderDashboardCards();
  renderRecent();
  renderDashboardDetail();
  renderArticleList();
  renderEditor();
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

function renderDashboardCards() {
  const filtered = getDashboardArticles();
  const title = dashboardFilter === 'total' ? 'すべての記事' : `${statusLabels[dashboardFilter]}の記事`;
  $('#dashboardListTitle').textContent = title;
  $('#dashboardArticleCards').innerHTML =
    filtered.map((article) => articleCard(article)).join('') || '<p class="empty">該当する記事はありません。</p>';
  bindArticleCardClicks();
}

function renderRecent() {
  $('#recentArticles').innerHTML =
    articles.slice(0, 6).map((article) => articleCard(article)).join('') || '<p class="empty">記事はまだありません。</p>';
  bindArticleCardClicks();
}

function renderDashboardDetail() {
  if (!currentArticle) {
    $('#dashboardArticleDetail').innerHTML = '<p class="empty">記事カードを選択してください。</p>';
    return;
  }
  const enabledPlatforms = platformOrder.filter((platform) => getPlatformRecord(platform, currentArticle.id)?.enabled);
  $('#dashboardArticleDetail').innerHTML = `
    <div class="detail-title">${escapeHtml(currentArticle.baseTitle)}</div>
    <dl class="detail-grid">
      <dt>テーマ</dt><dd>${themeLabel(currentArticle.theme)}</dd>
      <dt>状態</dt><dd>${statusLabel(currentArticle.status)}</dd>
      <dt>タグ</dt><dd>${tagMarkup(currentArticle.tags)}</dd>
      <dt>本文文字数</dt><dd>${currentArticle.baseBodyMd?.length || 0} 字</dd>
      <dt>更新日時</dt><dd>${formatDate(currentArticle.updatedAt)}</dd>
      <dt>対象PF</dt><dd>${enabledPlatforms.map(platformPill).join('') || '未選択'}</dd>
    </dl>
    <button class="primary" type="button" id="openSelectedInEditorBtn">エディターで開く</button>
  `;
  $('#openSelectedInEditorBtn').addEventListener('click', () => showView('editor'));
}

function articleCard(article) {
  return `
    <button class="article-card ${currentArticle?.id === article.id ? 'active' : ''}" type="button" data-article-id="${article.id}">
      <span class="status-badge">${statusLabel(article.status)}</span>
      <strong>${escapeHtml(article.baseTitle)}</strong>
      <span class="meta-line">${themeLabel(article.theme)} / ${formatDate(article.updatedAt)}</span>
      <span class="tag-row">${tagMarkup(article.tags)}</span>
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
    filtered.map((article) => articleCard(article)).join('') || '<p class="empty">該当する記事はありません。</p>';
  bindArticleCardClicks();
}

function renderEditor() {
  if (!currentArticle) currentArticle = emptyArticle();
  $('#baseTitle').value = currentArticle.baseTitle || '';
  $('#theme').value = currentArticle.theme || '72ms';
  $('#status').value = currentArticle.status || 'draft';
  $('#tags').value = (currentArticle.tags || []).join(', ');
  $('#baseBodyMd').value = currentArticle.baseBodyMd || '';
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
    });
  });
  $$('[data-platform-field]').forEach((field) => {
    field.addEventListener('input', () => {
      const platform = field.dataset.platform;
      platformDrafts[platform] = collectPlatformRecord(platform);
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
    });
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
        <span class="readiness-chip ${readiness?.ready ? 'ready' : 'not-ready'}">${readiness?.ready ? '投稿可' : '未完了'}</span>
      </header>
      <div class="platform-body">
        ${Object.entries(fields)
          .map(([field, guide]) => fieldControl(platform, field, guide, record?.fields?.[field] || '', enabled))
          .join('')}
        <div class="platform-readiness" data-readiness="${platform}">
          ${renderReadiness(readiness)}
        </div>
        <button class="check-platform-btn" type="button" data-platform="${platform}" ${enabled ? '' : 'disabled'}>このPFをチェック</button>
      </div>
    </section>
  `;
}

function fieldControl(platform, field, guide, value, enabled) {
  const rows = field.toLowerCase().includes('draft') || field.toLowerCase().includes('outline') ? 5 : 2;
  return `
    <div class="field-card">
      <label>
        <span class="field-label">
          ${escapeHtml(guide.label)} ${guide.required ? '<b>*</b>' : ''}
          <span class="help" role="button" tabindex="0" aria-label="${escapeHtml(guide.label)} の説明" data-tip="${escapeHtml(guide.description)}">?</span>
        </span>
        <textarea data-platform="${platform}" data-platform-field="${field}" rows="${rows}" ${enabled ? '' : 'disabled'}>${escapeHtml(value)}</textarea>
      </label>
    </div>
  `;
}

function renderReadiness(readiness) {
  if (!readiness) return '<p class="meta-line">まだチェックしていません。</p>';
  return readiness.checks
    .map((check) => `<div class="${check.passed ? 'check-pass' : 'check-fail'}">${check.passed ? 'OK' : 'NG'}: ${escapeHtml(check.message)}</div>`)
    .join('');
}

function renderReadinessInto(platform, readiness) {
  platformDrafts[platform] = { ...(platformDrafts[platform] || collectPlatformRecord(platform)), readiness };
  const target = $(`[data-readiness="${platform}"]`);
  if (target) target.innerHTML = renderReadiness(readiness);
  const chip = $(`[data-platform-panel="${platform}"] .readiness-chip`);
  if (chip) {
    chip.textContent = readiness.ready ? '投稿可' : '未完了';
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
  const enabled = Boolean($(`[data-platform-toggle="${platform}"]`)?.checked);
  const fields = Object.fromEntries(
    $$(`[data-platform="${platform}"][data-platform-field]`).map((field) => [field.dataset.platformField, field.value]),
  );
  return { enabled, fields };
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
    tags: $('#tags').value.split(',').map((tag) => tag.trim()).filter(Boolean),
    baseBodyMd: $('#baseBodyMd').value,
  };
}

async function saveCurrentArticle() {
  collectEditor();
  const payload = await api('/api/articles', {
    method: 'POST',
    body: JSON.stringify({ article: currentArticle, platformRecords: collectPlatformRecords() }),
  });
  currentArticle = payload.article;
  const index = articles.findIndex((article) => article.id === payload.article.id);
  if (index >= 0) articles[index] = payload.article;
  else articles.unshift(payload.article);
  platformStores = (await api('/api/articles')).platformStores;
  resetPlatformDrafts();
  renderAll();
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
        <div class="meta-line">${escapeHtml(image.articleTitle)} / ${image.purpose} / ${image.ratio}</div>
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
  const title = currentArticle.baseTitle || '無題の記事';
  const theme = themeLabel(currentArticle.theme);
  const purpose = $('#imagePurpose').value;
  const ratio = $('#imageRatio').value;
  const composed = [
    `記事「${title}」の画像を生成してください。`,
    `テーマ: ${theme}`,
    `用途: ${purpose}`,
    `アスペクト比: ${ratio}`,
    'スタイル: 編集記事向け、主題が明確、記事内で使いやすい、指示がない限り画像内テキストなし。',
    '避ける: 汎用的なストックフォト感、読めない文字、ロゴ、ウォーターマーク。',
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
  return tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join('') || 'なし';
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

$$('.tab').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
$('#newArticleBtn').addEventListener('click', () => {
  currentArticle = emptyArticle();
  resetPlatformDrafts();
  renderAll();
  showView('editor');
});
$('#saveBtn').addEventListener('click', saveCurrentArticle);
$('#composePromptBtn').addEventListener('click', composeImagePrompt);
$('#copyPromptBtn').addEventListener('click', copyImagePrompt);
$('#attachImageBtn').addEventListener('click', attachImage);
$('#clearDashboardFilterBtn').addEventListener('click', () => {
  dashboardFilter = 'total';
  renderAll();
});
['searchInput', 'themeFilter', 'statusFilter'].forEach((id) => $(`#${id}`).addEventListener('input', renderArticleList));
$('#librarySearch').addEventListener('input', renderLibrary);

load().catch((error) => {
  document.body.innerHTML = `<pre>${escapeHtml(error.stack || error.message)}</pre>`;
});
