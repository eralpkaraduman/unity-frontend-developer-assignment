import path from 'path';

import AdGeneratorInterface from './AdGeneratorInterface';
import AdConfiguration from './AdConfiguration';
import * as HTMLGenerator from '../HtmlGenerator';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');

export const DescriptionTooLongError = new Error('DESCTRIPTION_TOO_LONG');
export const ButtonTextTooLongError = new Error('BUTTON_TEXT_TOO_LONG');
export const ImageUrlMissingError = new Error('IMAGE_URL_MISSING');

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface {
  configuration: AdConfiguration;

  constructor(configuration: AdConfiguration) {
    this.configuration = configuration;
  }

  async generate(outPath: string): Promise<string> {
    const {title, images, description, buttonText, buttonUrl} = this.configuration;

    if (description.length >= 160) 
      throw DescriptionTooLongError;

    if (buttonText.length >= 40) 
      throw ButtonTextTooLongError;

    const [image] = images;

    if (!image)
      throw ImageUrlMissingError;

    await HTMLGenerator.generate(
      templatePath, outPath,
      {title, image, description, buttonUrl}
    )
    return outPath;
  }
}