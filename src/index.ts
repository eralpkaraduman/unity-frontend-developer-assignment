export * from './lib/HtmlGenerator';

import path from 'path';

import developmentServer from './lib/DevelopmentServer';
import { readFileContents } from './lib/utils';

import AdConfiguration from './lib/generators/AdConfiguration';
import AdGeneratorInterface from './lib/generators/AdGeneratorInterface';
import InterstitialAdUnit from './lib/generators/InterstitialAdUnit';

const config: AdConfiguration = {
  buttonText: 'Download For Free',
  buttonUrl: '#',
  description: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua.`,
  images: ['https://imgplaceholder.com/800x800'],
  title: 'Interstitial Ad Unit',
};

const assetsGenerators: { readonly [assetName: string]: AdGeneratorInterface } = {
  'interstitial-ad-unit.html': new InterstitialAdUnit(config),
};

// TODO: don't start dev server if not dev mode
// instead generate all assets once immediately
developmentServer.start(Object.keys(assetsGenerators), async assetName => {
  const outPath = path.resolve('assets', assetName);
  console.log(outPath);
  const generatedAssetPath = await assetsGenerators[assetName].generate(outPath);
  return readFileContents(generatedAssetPath);
});
