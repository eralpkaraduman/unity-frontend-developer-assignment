import { Url } from "url";

export async function downloadImage(url: Url, toPath: string): Promise<string> {
  return url + toPath;
}
