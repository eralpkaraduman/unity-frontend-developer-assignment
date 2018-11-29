import path from 'path';
import AdConfiguration from '../AdConfiguration';
import * as HTMLGenerator from '../HtmlGenerator';
import ScriptTranspiler, { TranspilerError } from '../ScriptTranspiler';
import { readFileContents } from '../utils';
import InterstitialAdUnitGenerator, { ImageDimensionsExceedsLimitErrorKey } from './InterstitialAdUnitGenerator';

export const TooFewImagesErrorKey = 'IMAGES_TOO_FEW';

const minimumImagecount = 3;
const templateDir = path.resolve(
  'src',
  'templates',
  'interstitial-carousel-ad-unit',
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
      buttonUrl,
    }: AdConfiguration = this.configuration || { images: [] };

    if (images.length < minimumImagecount) {
      throw new Error(TooFewImagesErrorKey);
    }

    await Promise.all(images.map(async image => {
      if (!await this.validateImageSize(image)) {
        throw new Error(ImageDimensionsExceedsLimitErrorKey);
      }
    }));

    // tslint:disable-next-line:no-let
    let script;
    try {
      script = ScriptTranspiler.transpile(
        await readFileContents(scriptPath),
        scriptPath,
      );
    } catch (e) {
      if (e instanceof TranspilerError) {
        // tslint:disable-next-line:no-console
        console.error(e.linterOutput);
      }
      throw e;
    }

    await HTMLGenerator.generate(templatePath, outPath, {
      buttonText,
      buttonUrl,
      description,
      images,
      script,
      title,
    });

    return outPath;
  }
}
