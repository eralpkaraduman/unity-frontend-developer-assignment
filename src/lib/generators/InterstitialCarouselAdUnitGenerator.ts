import path from 'path';

import * as HTMLGenerator from '../HtmlGenerator';
import AdConfiguration from './AdConfiguration';
import InterstitialAdUnitGenerator from './InterstitialAdUnitGenerator';

const TooFewImagesError = new Error('IMAGES_TOO_FEW');
const minimumImagecount = 3;
const templatePath = path.resolve('src', 'templates', 'interstitial-carousel-ad-unit', 'template.ejs');


export default class InterstitialCarouselAdUnitGenerator extends InterstitialAdUnitGenerator { // TODO: rename to ..Generator
  public async generate(outPath: string): Promise<string> {
    const {
      title,
      images,
      description,
      buttonText,
      buttonUrl,
    }: AdConfiguration = this.configuration || { images: [] };

    if (images.length < minimumImagecount) {
      throw TooFewImagesError;
    }

    await HTMLGenerator.generate(
      templatePath, outPath,
      { title, images, description, buttonUrl, buttonText },
    );

    return outPath;
  }
}
