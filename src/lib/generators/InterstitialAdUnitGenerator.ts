import path from 'path';
import AdConfiguration from '../AdConfiguration';
import AdGeneratorInterface from '../AdGeneratorInterface';
import * as HTMLGenerator from '../HtmlGenerator';
import { trimTextWithElipsis } from '../utils';
import * as ImageSizeChecker from './ImageSizeChecker';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');

export const ImageUrlMissingErrorKey = 'IMAGE_URL_MISSING';
export const ImageDimensionsExceedsLimitErrorKey = 'IMAGE_DIMENSIONS_EXCEED_LIMIT';

export const descriptionMaxLength = 160;
export const buttonTextMaxLength = 40;
export const maxImageDimensions = { width: 800, height: 800 };

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface {
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

  public async validateImageSize(imageUrl: string): Promise<boolean> {
    const {width, height} = await ImageSizeChecker.getImageDimensions(imageUrl);
    if (width > maxImageDimensions.width) {
      return false;
    }
    if (height > maxImageDimensions.width) {
      return false;
    }
    return true;
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
      throw new Error(ImageUrlMissingErrorKey);
    }

    if (!await this.validateImageSize(image)) {
      throw new Error(ImageDimensionsExceedsLimitErrorKey);
    }

    await HTMLGenerator.generate(
      templatePath, outPath,
      { title, image, description, buttonUrl, buttonText},
    );

    return outPath;
  }
}
