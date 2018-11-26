import test from 'ava';
import fs from 'fs';
import {JSDOM} from 'jsdom';
import path from 'path';

import * as utils from '../utils';
import AdConfiguration from '../AdConfiguration';
import InterstitialAdUnit, {
  ImageUrlMissingError,
} from './InterstitialAdUnitGenerator';

const validAdConfig: AdConfiguration = {
  buttonText: 'Download',
  buttonUrl: 'https://google.com',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit '+
  'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  images: ['https://imgplaceholder.com/800x800'],
};

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
  const generator = new InterstitialAdUnit();
  generator.configuration = validAdConfig;
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
  t.is(thumbnailEl.src, validAdConfig.images![0]);
});

test('it should sanitize ad configuration', async t => {
  const generator = new InterstitialAdUnit();
  generator.configuration = {...validAdConfig,
    buttonText: 'A Too long button text consectetur adipiscing elit, sed do eiusmod tempor.',
    description: `A Too long description. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit, sed do eiusmod tempor incididunt.`,
  };
  t.is(generator.configuration.buttonText, 'A Too long button text consectetur ad...');
  t.is(generator.configuration.description, 'A Too long description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ips...');
});

test('it should not accept a config with image url missing', async t => {
  const {testOutFilePath} = t.context as any;
  const generator = new InterstitialAdUnit();
  generator.configuration = { ...validAdConfig, images: [] };
  await t.throwsAsync(async () =>
    await generator.generate(testOutFilePath),
    ImageUrlMissingError.message,
  );
});

test.todo('should not images should not be larger than 800x800px');
