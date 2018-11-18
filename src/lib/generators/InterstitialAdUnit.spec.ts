import fs from 'fs';
import path from 'path';
import test from 'ava';
import {JSDOM} from 'jsdom';

import * as utils from '../utils';

import InterstitialAdUnit, {
  DescriptionTooLongError,
  ButtonTextTooLongError,
  ImageUrlMissingError
} from './InterstitialAdUnit';
import AdConfiguration from './AdConfiguration';

const validAdConfig: AdConfiguration = {
  buttonText: 'Download For Free',
  buttonUrl: 'https://google.com',
  images: ['https://imgplaceholder.com/800x800'],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit '+
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}

test.beforeEach (async t => {
  t.context = {...t.context,
    testOutFilePath: path.resolve('temp', `${utils.generateRandomString()}.html`),
  };
});

test.afterEach.always(async t => {
  const {testOutFilePath} = t.context as any;
  try {
    fs.unlinkSync(testOutFilePath);
  }catch(e){ t.log(e); }
});

test('it should generate ad unit', async t => {
  const {testOutFilePath} = t.context as any;
  const generator = new InterstitialAdUnit(validAdConfig);
  await t.notThrowsAsync(async () => await generator.generate(testOutFilePath));
  const htmlString = await utils.readFileContents(testOutFilePath);
  t.truthy(htmlString);
  const window = new JSDOM(htmlString).window;
  const buttonEl = window.document.getElementById("button") as HTMLAnchorElement;
  t.truthy(buttonEl.href.includes(validAdConfig.buttonUrl as string));
  t.is(buttonEl.textContent, validAdConfig.buttonText);
  const descriptionEl = window.document.getElementById("description") as HTMLElement;
  t.is(descriptionEl.textContent, validAdConfig.description);
  const thumbnailEl = window.document.getElementById("thumbnail") as HTMLImageElement;
  t.is(thumbnailEl.src, validAdConfig.images[0])
});

test('it should not accept button text that exceeds limit', async t => {
  const {testOutFilePath} = t.context as any;
  const generator = new InterstitialAdUnit({...validAdConfig,
    buttonText: 'A Too long button text consectetur adipiscing elit, sed do eiusmod tempor.'
  })
  await t.throwsAsync(async () => 
    await generator.generate(testOutFilePath),
    ButtonTextTooLongError.message
  );
});

test('it should not accept description that exceeds limit', async t => {
  const {testOutFilePath} = t.context as any;
  const generator = new InterstitialAdUnit({...validAdConfig,
    description: `A Too long description. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt.`
  })
  await t.throwsAsync(async () => 
    await generator.generate(testOutFilePath),
    DescriptionTooLongError.message
  );
});

test('it should not accept a config with image url missing', async t => {
  const {testOutFilePath} = t.context as any;
  const generator = new InterstitialAdUnit({...validAdConfig,
    images: []
  });
  await t.throwsAsync(async () => 
    await generator.generate(testOutFilePath),
    ImageUrlMissingError.message
  );
});
