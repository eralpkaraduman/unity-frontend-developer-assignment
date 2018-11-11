import ejs from 'ejs';
import path from 'path';
import * as utils from './utils';

const getTemplatePath = (templateName: string) => path.resolve(
  'src', 'templates',
  `${templateName}.ejs`
);

export async function generate(templateName: string, outPath: string, params: Object = {}) {
  const templateString = await utils.readFileContents(getTemplatePath(templateName));
  const htmlString = ejs.render(templateString, {params});
  await utils.writeFileContents(outPath, htmlString);
}
