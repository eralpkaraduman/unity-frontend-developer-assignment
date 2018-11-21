export * from './lib/HtmlGenerator';

import path from 'path';

import developmentServer from './lib/DevelopmentServer';
import { readFileContents, writeFileContents } from './lib/utils';

import AppDataAggregator from './lib/AppDataAggregator';
import AdConfiguration from './lib/generators/AdConfiguration';
import AdGeneratorInterface from './lib/generators/AdGeneratorInterface';
import InterstitialAdUnit from './lib/generators/InterstitialAdUnit';

// tslint:disable-next-line:interface-over-type-literal
type AssetGenerators = { readonly[assetName: string]: AdGeneratorInterface };
async function buildAssetGenerators(): Promise<AssetGenerators> {
  const staticAdConfig: AdConfiguration = {
    buttonText: 'Download For Free',
    buttonUrl: '#',
    description: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua.`,
    images: ['https://imgplaceholder.com/800x800'],
    title: 'Interstitial Ad Unit',
  };

  const appSearchResponse = await AppDataAggregator.searchApp('888422857')!;
  const iosAppData = appSearchResponse.appleItunes!;
  const dynamicAdConfig: AdConfiguration = {
    buttonText: 'Download For Free',
    buttonUrl: iosAppData.downloadUrl!,
    description: iosAppData.description!,
    images: iosAppData.imageUrls!,
    title: iosAppData.title!,
  };

  return {
    '0-interstitial-ad-unit.html': new InterstitialAdUnit().setConfiguration(staticAdConfig),
    '1-dynamic-interstitial-ad-unit.html': new InterstitialAdUnit().setConfiguration(dynamicAdConfig),
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
    <html><body>
      <strong>Failed To generate Asset:</strong><br/>
      <strong>${assetName}</strong><br/>
      <strong>Error: ${e.message}</strong>
    </body></html>
    `);
  }
}

// Begin
buildAssetGenerators().then(async assetGenerators => {
  const assetNames = Object.keys(assetGenerators);
  // generate all assets
  await Promise.all(assetNames.map(assetName => handleOnGenerateAsset(assetGenerators, assetName)));
  // TODO: don't start dev server if not dev mode
  // instead generate all assets once immediately
  developmentServer.start(assetNames, async assetName => {
    const generatedAssetPath = await handleOnGenerateAsset(assetGenerators, assetName);
    return readFileContents(generatedAssetPath);
  });
});

