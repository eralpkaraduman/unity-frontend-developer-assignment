export * from './lib/HtmlGenerator';

import developmentServer from './lib/DevelopmentServer';
import { readFileContents } from './lib/utils';

import AdConfiguration from './lib/generators/AdConfiguration';
import AdGeneratorInterface from './lib/generators/AdGeneratorInterface';
import InterstitialAdUnitGenerator from './lib/generators/InterstitialAdUnitGenerator';

const config: AdConfiguration = {
  title: 'Interstitial Ad Unit',
  images: ['https://imgplaceholder.com/800x800'],
  description: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.`
};

const assetsGenerators: { [assetName: string]: AdGeneratorInterface } = {
  '/interstitial-ad-unit.html': new InterstitialAdUnitGenerator(config)
};

// TODO: don't start dev server if not dev mode
// instead generate all assets once immediately
developmentServer.start(Object.keys(assetsGenerators), async assetName => {
    const generatedAssetPath = await assetsGenerators[assetName].generate();
    return readFileContents(generatedAssetPath);
});
