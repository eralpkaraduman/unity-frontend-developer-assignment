import ejs from 'ejs';
import * as utils from './utils';

export async function generate(templatePath: string, outPath: string, params: any = {}): Promise<string> {
  const templateString = await utils.readFileContents(templatePath);
  const htmlString = ejs.render(templateString, {params});
  await utils.writeFileContents(outPath, htmlString);
  return outPath;
}
