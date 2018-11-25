import path from 'path';

import * as HTMLGenerator from '../HtmlGenerator';
import { trimTextWithElipsis } from '../utils';
import AdConfiguration from '../AdConfiguration';
import AdGeneratorInterface from '../AdGeneratorInterface';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');

export const ImageUrlMissingError = new Error('IMAGE_URL_MISSING');

export const descriptionMaxLength = 160;
export const buttonTextMaxLength = 40;

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface { // TODO: rename to ..Generator
  // tslint:disable-next-line:variable-name readonly-keyword
  private _configuration!: AdConfiguration;
  public set configuration(value: AdConfiguration) {
    this._configuration = {
      ...value,
      buttonText: trimTextWithElipsis(value.buttonText, buttonTextMaxLength),
      description: trimTextWithElipsis(value.description, descriptionMaxLength),
    };
  }

  public get configuration(): AdConfiguration {
    return this._configuration;
  }

  public async generate(outPath: string): Promise<string> {
    const {
      title,
      images,
      description,
      buttonText,
      buttonUrl,
    }: AdConfiguration = this._configuration || {images: []};

    const [image] = images;

    if (!image) {
      throw ImageUrlMissingError;
    }

    await HTMLGenerator.generate(
      templatePath, outPath,
      { title, image, description, buttonUrl, buttonText},
    );

    return outPath;
  }
}
