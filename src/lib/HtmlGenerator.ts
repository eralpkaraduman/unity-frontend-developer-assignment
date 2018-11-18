import ejs from 'ejs';
import * as utils from './utils';
import path from 'path';
import {minify} from 'html-minifier';
const miniCssPath = path.resolve(
  'node_modules', 'mini.css',
  'dist', 'mini-default.min.css'
);

const minifierOptions = {
  collapseWhitespace: true,
  conservativeCollapse: false,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  useShortDoctype: true
}

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
  params: any = {},
  shouldMinify: boolean = true): Promise<string> {
  const miniCss = await utils.readFileContents(miniCssPath);
  let htmlString = await renderTemplate(templatePath, {...params, miniCss});
  if (false || shouldMinify) {
    htmlString = minify(htmlString, minifierOptions);
  }
  await utils.writeFileContents(outPath, htmlString);
  return outPath;
}
