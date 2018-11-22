import path from 'path';

import * as HTMLGenerator from '../HtmlGenerator';
import AdConfiguration from './AdConfiguration';
import AdGeneratorInterface from './AdGeneratorInterface';
import { trimTextWithElipsis } from '../utils';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');

export const DescriptionTooLongError = new Error('DESCTRIPTION_TOO_LONG');
export const ButtonTextTooLongError = new Error('BUTTON_TEXT_TOO_LONG');
export const ImageUrlMissingError = new Error('IMAGE_URL_MISSING');

const descriptionMaxLength = 160;
const buttonTextMaxLength = 40;

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface { // TODO: rename to ..Generator
  private config!: AdConfiguration; // tslint:disable-line:readonly-keyword

  public set configuration(configuration: AdConfiguration) {
    this.config = { 
      ...configuration,
      buttonText: trimTextWithElipsis(configuration.buttonText),
      description: trimTextWithElipsis(configuration.description)
    };
  }

  public get configuration(): AdConfiguration {
    return this.config;
  }

  public async generate(outPath: string): Promise<string> {
    const configuration: AdConfiguration = this.configuration || {images: []};
    const title = configuration.title;
    const images = configuration.images;
    const description = configuration.description;
    const buttonText = configuration.buttonText;
    const buttonUrl = configuration.buttonUrl;
    
    if (description && description.length > descriptionMaxLength) {
      throw DescriptionTooLongError;
    }

    if (buttonText && buttonText.length > buttonTextMaxLength) {
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
