import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

export const NotFoundError = new Error('NOT_FOUND');

export function generateRandomString(): string {
  const rand = Math.random() * Math.pow(20, 10);
  return Math.round(rand).toString(32);
}

export async function writeFileContents(
  path: string,
  contents: string,
): Promise<string> {
  await writeFile(path, contents);
  return path;
}

export async function readFileContents(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  } catch (e) {
    throw e.code === 'ENOENT' ? NotFoundError : e;
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (e) {
    return false;
  }
}

export function trimTextWithElipsis(text?: string, limit?: number): string | undefined {
  const elipsis = '...';
  if (!text) {return undefined;}
  const trimmedText = text!.trim().split('\n').map(p => p.trim()).join(' ');
  const clampedLimit = Math.floor(limit || 0);
  if (clampedLimit <= 0) {return trimmedText;}
  return !(trimmedText.length <= clampedLimit) ?
    trimmedText.substring(0, clampedLimit - elipsis.length) + elipsis :
    trimmedText;
}
