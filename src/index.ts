export * from './lib/HtmlGenerator';
import path from 'path';
import DevelopmentServer from './lib/DevelopmentServer';
import { generate } from './lib/HtmlGenerator';
import {generateRandomString, readFileContents} from './lib/utils';

async function generateInterstitialAdUnit(params: any): Promise<string> {
    const templatePath = path.resolve('src', 'templates', 'interstitial-ad-unit.ejs');
    const outPath = path.resolve('assets', 'interstitial-ad-unit.html');
    await generate(templatePath, outPath, params);
    return outPath;
}

const assets: { readonly [assetName: string]: (params: any) => Promise<string> } = {
    '/interstitial-ad-unit.html': generateInterstitialAdUnit
};

// TODO: don't start dev server if not dev mode
DevelopmentServer.start(Object.keys(assets), async assetName => {
    const generator = assets[assetName];
    const generatedAssetPath = await generator({ title: 'Hello! ' + generateRandomString()});
    return await readFileContents(generatedAssetPath);
});
