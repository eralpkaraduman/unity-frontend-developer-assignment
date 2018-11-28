import path from 'path';

import AdConfiguration from './lib/AdConfiguration';
import AdGeneratorInterface from './lib/AdGeneratorInterface';
import AppDataAggregator from './lib/AppDataAggregator';
import developmentServer from './lib/DevelopmentServer';
import InterstitialAdUnit from './lib/generators/InterstitialAdUnitGenerator';
import InterstitialCarouselAdUnitGenerator from './lib/generators/InterstitialCarouselAdUnitGenerator';
import { readFileContents, writeFileContents } from './lib/utils';

type Config = {
  readonly devServerPort: number,
  readonly appId: {
    readonly itunes: string,
    readonly playStore: string,
  },
};

const DEV_SERVER = process.argv.includes('--dev-server');

type AssetGenerators = { readonly[assetName: string]: AdGeneratorInterface };

async function buildAssetGenerators(config: Config): Promise<AssetGenerators> {
  const staticAdConfig: AdConfiguration = {
    buttonText: 'Download For Free',
    buttonUrl: '#',
    description: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua.`,
    images: ['https://imgplaceholder.com/800x800'],
    title: 'Interstitial Ad Unit',
  };
  const staticAdGenerator = new InterstitialAdUnit();
  staticAdGenerator.configuration = staticAdConfig;

  const appSearchResponse = await AppDataAggregator.searchApp(config.appId.itunes)!;
  const iosAppData = appSearchResponse.appleItunes!;
  const dynamicAdConfig: AdConfiguration = {
    buttonText: 'Download For Free',
    buttonUrl: iosAppData.downloadUrl!,
    description: iosAppData.description!,
    images: iosAppData.imageUrls!,
    title: iosAppData.title!,
  };
  const dynamicAdGenerator = new InterstitialAdUnit();
  dynamicAdGenerator.configuration = dynamicAdConfig;

  const dynamicCarouseldAdGenerator = new InterstitialCarouselAdUnitGenerator();
  dynamicCarouseldAdGenerator.configuration = dynamicAdConfig;

  return {
    '1-interstitial-ad-unit.html': staticAdGenerator,
    '2-dynamic-interstitial-ad-unit.html': dynamicAdGenerator,
    '3-dynamic-carousel-interstitial-ad-unit.html': dynamicCarouseldAdGenerator,
  };
}

async function handleOnGenerateAsset(assetGenerators: AssetGenerators, assetName: string): Promise<string> {
  const outPath = path.resolve('assets', assetName);
  console.log(`[generator] generating asset: ${assetName}`); // tslint:disable-line:no-console
  try {
    return await assetGenerators[assetName].generate(outPath);
  }
  catch(e) {
    // tslint:disable-next-line:no-console
    console.error(`[generator] failed to generate asset: ${assetName} error: ${e.message}`);
    return await writeFileContents(outPath, `
    <html><head><meta charset="utf-8" /></head><body>
      <strong>Failed To generate Asset:</strong><br/>
      <strong>${assetName}</strong><br/>
      <strong>Error: ${e.message}</strong>
    </body></html>
    `);
  }
}

// Begin
readFileContents('config.json')
.then(json => JSON.parse(json))
.then((config: Config) => buildAssetGenerators(config)
.then(async (assetGenerators: AssetGenerators) => {
  const assetNames = Object.keys(assetGenerators);
  await Promise.all(assetNames.map(assetName => handleOnGenerateAsset(assetGenerators, assetName)));
  if (DEV_SERVER) {
    developmentServer.start(config.devServerPort, assetNames, async assetName => {
      const generatedAssetPath = await handleOnGenerateAsset(assetGenerators, assetName);
      return readFileContents(generatedAssetPath);
    });
  }
}));
