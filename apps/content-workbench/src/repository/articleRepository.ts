import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Article, ArticleStatus, Platform, Theme } from '../domain/article';

type ListFilter = {
  theme?: Theme;
  status?: ArticleStatus;
  tag?: string;
  platform?: Platform;
};

export class ArticleRepository {
  constructor(private readonly baseDir: string) {}

  private articlePath(id: string): string {
    return path.join(this.baseDir, `${id}.json`);
  }

  async list(filter: ListFilter = {}): Promise<Article[]> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const files = await fs.readdir(this.baseDir);
    const articles = await Promise.all(
      files.filter((f) => f.endsWith('.json')).map(async (file) => {
        const raw = await fs.readFile(path.join(this.baseDir, file), 'utf-8');
        return JSON.parse(raw) as Article;
      }),
    );

    return articles
      .filter((a) => !filter.theme || a.theme === filter.theme)
      .filter((a) => !filter.status || a.status === filter.status)
      .filter((a) => !filter.tag || a.tags.includes(filter.tag))
      .filter((a) => !filter.platform || Boolean(a.platformVariants[filter.platform]))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }

  async save(input: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Article> {
    const now = new Date().toISOString();
    const existing = input.id ? await this.findById(input.id) : null;

    const article: Article = {
      ...input,
      id: input.id ?? randomUUID(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    await fs.mkdir(this.baseDir, { recursive: true });
    await fs.writeFile(this.articlePath(article.id), JSON.stringify(article, null, 2));

    return article;
  }

  async findById(id: string): Promise<Article | null> {
    try {
      const raw = await fs.readFile(this.articlePath(id), 'utf-8');
      return JSON.parse(raw) as Article;
    } catch {
      return null;
    }
  }
}
