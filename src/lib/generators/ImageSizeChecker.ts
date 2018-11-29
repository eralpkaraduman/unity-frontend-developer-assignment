// tslint:disable-next-line:no-var-requires
const probe = require('probe-image-size');
type ImageDimensions = {readonly width: number, readonly height: number};
export async function getImageDimensions(imageUrl: string): Promise<ImageDimensions> {
  const result = await probe(imageUrl);
  const {width, height} = result;
  return { width, height };
}
