import path from 'path';

import * as HTMLGenerator from '../HtmlGenerator';
import AdConfiguration from './AdConfiguration';
import AdGeneratorInterface from './AdGeneratorInterface';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');

export const DescriptionTooLongError = new Error('DESCTRIPTION_TOO_LONG');
export const ButtonTextTooLongError = new Error('BUTTON_TEXT_TOO_LONG');
export const ImageUrlMissingError = new Error('IMAGE_URL_MISSING');

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface {
  private configuration: AdConfiguration | undefined; // tslint:disable-line:readonly-keyword

  public setConfiguration(configuration: AdConfiguration): InterstitialAdUnitGenerator {
    this.configuration = configuration;
    return this;
  }

  public async generate(outPath: string): Promise<string> {
    const configuration: AdConfiguration = this.configuration || {images: []};
    const title = configuration.title;
    const images = configuration.images;
    const description = configuration.description;
    const buttonText = configuration.buttonText;
    const buttonUrl = configuration.buttonUrl;

    if (description && description.length >= 160) {
      throw DescriptionTooLongError;
    }

    if (buttonText && buttonText.length >= 40) {
      throw ButtonTextTooLongError;
    }

    const [image] = images;

    if (!image) {
      throw ImageUrlMissingError;
    }

    await HTMLGenerator.generate(
      templatePath, outPath,
      {title, image, description, buttonUrl},
    );

    return outPath;
  }
}
