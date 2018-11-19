import test from 'ava';
import path from 'path';

import { parseAppStoreResponse } from './AppDataAggregator';
import {readFileContents} from './utils';

test('it should parse apple itunes api response', async t => {
  const mockResponseString = await readFileContents(path.resolve('mock', 'appleItunesApiSearchResponse.json'));
  const mockResponse = JSON.parse(mockResponseString);
  const appData = parseAppStoreResponse('1438319854', mockResponse);
  t.is(appData.title, 'Text Wallpaper');
  t.truthy(appData.imageUrls);
  t.is(appData.imageUrls!.length, 6);
  t.truthy(appData.downloadUrl);
  t.truthy(appData.description);
});
