import path from 'path';
import * as HTMLGenerator from '../HtmlGenerator';
import AdConfiguration from '../AdConfiguration';
import InterstitialAdUnitGenerator from './InterstitialAdUnitGenerator';
import ScriptTranspiler, { TranspilerError } from '../ScriptTranspiler';
import { readFileContents } from '../utils';

export const TooFewImagesErrorKey = 'IMAGES_TOO_FEW';

const minimumImagecount = 3;
const templateDir = path.resolve(
  'src',
  'templates',
  'interstitial-carousel-ad-unit'
);
const templatePath = path.resolve(templateDir, 'template.ejs');
const scriptPath = path.resolve(templateDir, 'script.ts');

export default class InterstitialCarouselAdUnitGenerator extends InterstitialAdUnitGenerator {
  public async generate(outPath: string): Promise<string> {
    const {
      title,
      images,
      description,
      buttonText,
      buttonUrl
    }: AdConfiguration = this.configuration || { images: [] };

    if (images.length < minimumImagecount) {
      throw new Error(TooFewImagesErrorKey);
    }

    let script;
    try {
      script = ScriptTranspiler.transpile(
        await readFileContents(scriptPath),
        scriptPath
      );
    } catch (e) {
      if (e instanceof TranspilerError) {
        console.error(e.linterOutput);
      }
      throw e;
    }

    await HTMLGenerator.generate(templatePath, outPath, {
      title,
      images,
      description,
      buttonUrl,
      buttonText,
      script
    });

    return outPath;
  }
}
