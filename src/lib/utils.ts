import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

export function generateRandomString(): string {
  const rand = Math.random() * Math.pow(20, 10);
  return Math.round(rand).toString(32);
}

export async function writeFileContents(path: string, contents: string): Promise<string> {
  await writeFile(path, contents);
  return path;
}

export async function readFileContents(path: string): Promise<string> {
  try {
    return await readFile(path, 'utf8');
  }
  catch(e) {
    if (e.code === 'ENOENT') {
      throw new Error('Not Found');
    }
    throw e;
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  }
  catch(e) {
    return false;
  }
}
