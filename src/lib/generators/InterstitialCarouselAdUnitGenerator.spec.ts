import test from 'ava';
import fs from 'fs';
import path from 'path';
import * as utils from '../utils';
import { JSDOM } from 'jsdom';

import AdConfiguration from '../AdConfiguration';
import InterstitialCarouselAdUnitGenerator, {
  TooFewImagesErrorKey
} from './InterstitialCarouselAdUnitGenerator';

const validAdConfig: AdConfiguration = {
  buttonText: 'Download',
  buttonUrl: 'https://google.com',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
    'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  images: [
    'https://imgplaceholder.com/800x800',
    'https://imgplaceholder.com/800x801',
    'https://imgplaceholder.com/800x802',
    'https://imgplaceholder.com/800x803'
  ]
};

test.beforeEach(async t => {
  t.context = {
    ...t.context,
    testOutFilePath: path.resolve('temp', `${utils.generateRandomString()}.html`),
  };
});

test.afterEach.always(async t => {
  const { testOutFilePath } = t.context as any;
  try {
    fs.unlinkSync(testOutFilePath);
  } catch (e) { t.log(e); }
});

test('it should not accept a config with too few images', async t => {
  const { testOutFilePath } = t.context as any;
  const generator = new InterstitialCarouselAdUnitGenerator();
  generator.configuration = {
    ...validAdConfig,
    images: [
      'https://imgplaceholder.com/800x800',
      'https://imgplaceholder.com/800x800',
    ]
  };
  await t.throwsAsync(
    async () => await generator.generate(testOutFilePath),
    TooFewImagesErrorKey
  );
});

test('it should generate ad unit', async t => {
  const { testOutFilePath } = t.context as any;
  const generator = new InterstitialCarouselAdUnitGenerator();
  generator.configuration = validAdConfig;
  await t.notThrowsAsync(async () => await generator.generate(testOutFilePath));
  const htmlString = await utils.readFileContents(testOutFilePath);
  t.truthy(htmlString);
  const window = new JSDOM(htmlString).window;
  const thumbnailElements = window.document.getElementsByClassName('thumbnail');
  t.is(thumbnailElements.length, validAdConfig.images.length);
  t.is(
    (thumbnailElements.item(3) as HTMLImageElement).src,
    'https://imgplaceholder.com/800x803'
  );
});
