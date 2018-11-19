import axios from 'axios';

export const NotFoundError = new Error('NOT_FOUND_ERROR');

export interface AppData {
  readonly title?: string;
  readonly imageUrls?: ReadonlyArray<string>;
  readonly downloadUrl?: string;
  readonly description?: string;
}

export interface SearchAppResponse {
  readonly appleItunes?: AppData;
  readonly googlePlayStore?: AppData; // TODO: Google PlayStore is not implemented
}

async function searchApp(appleItunesId: string): Promise<SearchAppResponse> {
  return {
    appleItunes: await searchAppleItunes(appleItunesId),
    googlePlayStore: undefined, // TODO: Google PlayStore is not implemented
  };
}

async function searchAppleItunes(term: string, country: string ='us'): Promise<AppData> {
  const url = `http://itunes.apple.com/search?term=${term}&${country}=us&entity=software`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function parseAppStoreResponse(response: any): AppData {
  const [firstResult] = response.results;
  if (!firstResult){ throw NotFoundError; }
  const { screenshotUrls } = firstResult;
  const imageUrls = screenshotUrls ? screenshotUrls.map((url: string) => url) : [];
  return {
    description: firstResult.description,
    downloadUrl: firstResult.trackViewUrl,
    imageUrls,
    title: firstResult.trackName,
  };
}

export default {
  searchApp,
};
