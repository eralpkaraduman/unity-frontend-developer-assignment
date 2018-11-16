import ejs from 'ejs';
import * as utils from './utils';

export function renderTemplate(templatePath: string, data: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export async function generate(
  templatePath: string,
  outPath: string,
  params: any = {}): Promise<string> {
  const htmlString = await renderTemplate(templatePath, params);
  await utils.writeFileContents(outPath, htmlString);
  return outPath;
}
