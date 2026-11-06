/**
 * Client-Side GitHub API Client & Frontmatter Serializer
 * Operates directly in the browser with no server required.
 */

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  postsPath: string;
}

export interface PostFrontmatter {
  title: string;
  subtitle?: string;
  excerpt: string;
  author: string;
  pubDate: string;
  issue: string;
  draft: boolean;
  tags: string[];
  specimen?: {
    name: string;
    commonName?: string;
    logNo?: string;
    origin?: string;
    coordinates?: string;
    process?: string;
    chemicalStructure?: {
      name: string;
      formula: string;
      description?: string;
    };
  };
  swatches?: Array<{
    name: string;
    binomial?: string;
    color: string;
    texture?: string;
  }>;
  coverImage?: string;
  coverCaption?: string;
}

export interface GitPostFile {
  name: string;
  path: string;
  sha: string;
  download_url?: string;
  frontmatter?: PostFrontmatter;
  contentMarkdown?: string;
  isDraft: boolean;
}

export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUtf8(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

const STORAGE_KEY = 'geographies_blog_github_config';

export function getGitHubConfig(): GitHubConfig | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGitHubConfig(config: GitHubConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearGitHubConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Parses YAML frontmatter from raw Markdown text
 */
export function parseMarkdownWithFrontmatter(rawContent: string): { frontmatter: Partial<PostFrontmatter>; body: string } {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: rawContent };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const frontmatter: any = { tags: [], swatches: [] };

  const lines = yamlBlock.split('\n');
  let currentArrayKey: string | null = null;
  let currentNestedObj: string | null = null;

  for (let line of lines) {
    line = line.trimEnd();
    if (!line || line.startsWith('#')) continue;

    // Check for draft: true / false
    const draftMatch = line.match(/^draft:\s*(true|false)/i);
    if (draftMatch) {
      frontmatter.draft = draftMatch[1].toLowerCase() === 'true';
      currentArrayKey = null;
      continue;
    }

    // Check key: "value" or key: value
    const keyValMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (keyValMatch && !line.startsWith('  ') && !line.startsWith('-')) {
      const key = keyValMatch[1];
      let val = keyValMatch[2].trim();
      currentArrayKey = null;
      currentNestedObj = null;

      if (val === '') {
        // Could be an object or array start
        if (key === 'tags' || key === 'swatches') {
          currentArrayKey = key;
          frontmatter[key] = [];
        } else if (key === 'specimen' || key === 'chemicalStructure') {
          currentNestedObj = key;
          frontmatter[key] = {};
        }
        continue;
      }

      // Strip enclosing quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      // Check inline arrays like tags: ["Indigo", "Dye"]
      if (val.startsWith('[') && val.endsWith(']')) {
        try {
          frontmatter[key] = JSON.parse(val.replace(/'/g, '"'));
        } catch {
          frontmatter[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
        }
        continue;
      }

      frontmatter[key] = val;
      continue;
    }

    // Nested object properties (e.g. specimen.name or specimen.coordinates)
    if (line.startsWith('  ') && currentNestedObj) {
      const nestedMatch = line.trim().match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (nestedMatch) {
        let nKey = nestedMatch[1];
        let nVal = nestedMatch[2].trim();
        if ((nVal.startsWith('"') && nVal.endsWith('"')) || (nVal.startsWith("'") && nVal.endsWith("'"))) {
          nVal = nVal.slice(1, -1);
        }
        if (!frontmatter[currentNestedObj]) frontmatter[currentNestedObj] = {};
        frontmatter[currentNestedObj][nKey] = nVal;
      }
      continue;
    }

    // Array items like - "Tag" or - Tag
    if (line.trim().startsWith('-') && currentArrayKey) {
      const itemVal = line.trim().replace(/^-\s*/, '').replace(/['"]/g, '');
      if (itemVal) {
        frontmatter[currentArrayKey].push(itemVal);
      }
    }
  }

  return { frontmatter, body };
}

/**
 * Serializes frontmatter and markdown body into standard Astro .md format
 */
export function serializeMarkdownWithFrontmatter(fm: PostFrontmatter, markdownBody: string): string {
  const yamlLines: string[] = ['---'];

  yamlLines.push(`title: "${fm.title.replace(/"/g, '\\"')}"`);
  if (fm.subtitle) yamlLines.push(`subtitle: "${fm.subtitle.replace(/"/g, '\\"')}"`);
  yamlLines.push(`excerpt: "${(fm.excerpt || '').replace(/"/g, '\\"')}"`);
  yamlLines.push(`author: "${fm.author || 'Dr. E. Archer'}"`);
  yamlLines.push(`pubDate: ${fm.pubDate || new Date().toISOString().split('T')[0]}`);
  yamlLines.push(`issue: "${fm.issue || 'FIELD LOG // NATURAL DYES'}"`);
  yamlLines.push(`draft: ${Boolean(fm.draft)}`);

  // Tags
  if (fm.tags && fm.tags.length > 0) {
    yamlLines.push('tags:');
    fm.tags.forEach(tag => yamlLines.push(`  - "${tag.trim()}"`));
  } else {
    yamlLines.push('tags: []');
  }

  // Specimen
  if (fm.specimen && fm.specimen.name) {
    yamlLines.push('specimen:');
    yamlLines.push(`  name: "${fm.specimen.name.replace(/"/g, '\\"')}"`);
    if (fm.specimen.commonName) yamlLines.push(`  commonName: "${fm.specimen.commonName.replace(/"/g, '\\"')}"`);
    if (fm.specimen.logNo) yamlLines.push(`  logNo: "${fm.specimen.logNo.replace(/"/g, '\\"')}"`);
    if (fm.specimen.origin) yamlLines.push(`  origin: "${fm.specimen.origin.replace(/"/g, '\\"')}"`);
    if (fm.specimen.coordinates) yamlLines.push(`  coordinates: "${fm.specimen.coordinates.replace(/"/g, '\\"')}"`);
    if (fm.specimen.process) yamlLines.push(`  process: "${fm.specimen.process.replace(/"/g, '\\"')}"`);

    if (fm.specimen.chemicalStructure) {
      yamlLines.push('  chemicalStructure:');
      yamlLines.push(`    name: "${fm.specimen.chemicalStructure.name.replace(/"/g, '\\"')}"`);
      yamlLines.push(`    formula: "${fm.specimen.chemicalStructure.formula.replace(/"/g, '\\"')}"`);
      if (fm.specimen.chemicalStructure.description) {
        yamlLines.push(`    description: "${fm.specimen.chemicalStructure.description.replace(/"/g, '\\"')}"`);
      }
    }
  }

  // Swatches
  if (fm.swatches && fm.swatches.length > 0) {
    yamlLines.push('swatches:');
    fm.swatches.forEach(swatch => {
      yamlLines.push(`  - name: "${swatch.name}"`);
      if (swatch.binomial) yamlLines.push(`    binomial: "${swatch.binomial}"`);
      yamlLines.push(`    color: "${swatch.color}"`);
      yamlLines.push(`    texture: "${swatch.texture || 'linen'}"`);
    });
  }

  if (fm.coverImage) yamlLines.push(`coverImage: "${fm.coverImage}"`);
  if (fm.coverCaption) yamlLines.push(`coverCaption: "${fm.coverCaption.replace(/"/g, '\\"')}"`);

  yamlLines.push('---');
  yamlLines.push('');
  yamlLines.push(markdownBody.trim());
  yamlLines.push('');

  return yamlLines.join('\n');
}

/**
 * Fetch list of posts from GitHub API
 */
export async function fetchGitHubPosts(config: GitHubConfig): Promise<GitPostFile[]> {
  const { owner, repo, branch, postsPath, token } = config;
  const cleanPath = postsPath.replace(/^\/+|\/+$/g, '');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const files = await res.json();
  const mdFiles = Array.isArray(files) ? files.filter(f => f.name.endsWith('.md')) : [];

  // Fetch individual content to extract frontmatter & draft status
  const postFiles: GitPostFile[] = [];

  for (const file of mdFiles) {
    try {
      const fileRes = await fetch(file.url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (fileRes.ok) {
        const fileData = await fileRes.json();
        const decoded = base64ToUtf8(fileData.content);
        const { frontmatter, body } = parseMarkdownWithFrontmatter(decoded);

        postFiles.push({
          name: file.name,
          path: file.path,
          sha: file.sha,
          download_url: file.download_url,
          frontmatter: frontmatter as PostFrontmatter,
          contentMarkdown: body,
          isDraft: Boolean(frontmatter.draft),
        });
      }
    } catch (e) {
      console.warn(`Failed to parse ${file.name}:`, e);
      postFiles.push({
        name: file.name,
        path: file.path,
        sha: file.sha,
        isDraft: false,
      });
    }
  }

  return postFiles;
}

/**
 * Commit or update a post markdown file on GitHub
 */
export async function commitPostToGitHub(
  config: GitHubConfig,
  filename: string,
  frontmatter: PostFrontmatter,
  markdownBody: string,
  existingSha?: string
): Promise<{ sha: string; commit: any }> {
  const { owner, repo, branch, postsPath, token } = config;
  const cleanPath = postsPath.replace(/^\/+|\/+$/g, '');
  const fullPath = `${cleanPath}/${filename.replace(/^\/+/, '')}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`;

  const fullMarkdown = serializeMarkdownWithFrontmatter(frontmatter, markdownBody);
  const base64Content = utf8ToBase64(fullMarkdown);

  const actionText = frontmatter.draft ? 'Save draft' : 'Publish post';
  const commitMessage = `${actionText}: ${frontmatter.title} [skip ci]`;

  const payload: any = {
    message: commitMessage,
    content: base64Content,
    branch: branch,
  };

  if (existingSha) {
    payload.sha = existingSha;
  } else {
    // Check if file already exists on GitHub to grab its sha
    try {
      const checkRes = await fetch(url + `?ref=${branch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (checkRes.ok) {
        const existingData = await checkRes.json();
        if (existingData.sha) {
          payload.sha = existingData.sha;
        }
      }
    } catch {
      // New file, proceed without sha
    }
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${errorBody}`);
  }

  return await res.json();
}

/**
 * Delete a post file from GitHub
 */
export async function deletePostFromGitHub(
  config: GitHubConfig,
  filename: string,
  sha: string
): Promise<void> {
  const { owner, repo, branch, postsPath, token } = config;
  const cleanPath = postsPath.replace(/^\/+|\/+$/g, '');
  const fullPath = `${cleanPath}/${filename}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Delete post: ${filename}`,
      sha: sha,
      branch: branch,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to delete file (${res.status}): ${errorBody}`);
  }
}
