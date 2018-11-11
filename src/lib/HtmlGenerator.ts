import ejs from 'ejs';
// import path from 'path';
import * as utils from './utils';

export async function generate(templatePath: string, outPath: string, params: Object = {}) {
  const templateString = await utils.readFileContents(templatePath);
  const htmlString = ejs.render(templateString, {params});
  await utils.writeFileContents(outPath, htmlString);
}
