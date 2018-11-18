import path from 'path';

import AdGeneratorInterface from './AdGeneratorInterface';
import AdConfiguration from './AdConfiguration';
import * as HTMLGenerator from '../HtmlGenerator';

const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit', 'template.ejs');
const outPath = path.resolve('assets', 'interstitial-ad-unit.html');

export default class InterstitialAdUnitGenerator implements AdGeneratorInterface {
  configuration: AdConfiguration;

  constructor(configuration: AdConfiguration) {
    this.configuration = configuration;
  }

  async generate(): Promise<string> {
    const {title, images, description} = this.configuration;
    const [image] = images;
    await HTMLGenerator.generate(
      templatePath, outPath,
      {title, image, description}
    )
    return outPath;
  }
}