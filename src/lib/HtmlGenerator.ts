import ejs from 'ejs';
import {minify} from 'html-minifier';
import path from 'path';
import * as utils from './utils';

const miniCssPath = path.resolve('node_modules', 'mini.css', 'dist', 'mini-default.min.css');

const minifierOptions = {
  collapseWhitespace: true,
  conservativeCollapse: false,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  useShortDoctype: true,
};

export function renderTemplate(templatePath: string, data: any = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, result) => {
      if (err) {return reject(err);}
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
  const htmlString = await renderTemplate(templatePath, {...params, miniCss});
  await utils.writeFileContents(
    outPath,
    shouldMinify ? minify(htmlString, minifierOptions) : htmlString,
  );
  return outPath;
}
