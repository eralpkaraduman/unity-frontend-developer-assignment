import ejs from 'ejs';
import fs from 'fs';
import util from 'util';
import path from 'path';
const readFile = util.promisify(fs.readFile);

export function generateHtml(template: string, params: Object = {}) : string {
  return ejs.render(template, {params});
}

export async function loadTemplate(templateName: string): Promise<string> {
  const templatePath = path.resolve('src', 'templates', `${templateName}.ejs`);
  try {
    return await readFile(templatePath, 'utf8');
  }
  catch(e) {
    if (e.code === 'ENOENT') {
      throw new Error('Template Not Found');
    }
    throw e;
  }
}