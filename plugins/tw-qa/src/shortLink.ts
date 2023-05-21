import fs from 'fs-extra';
import { shortLinkCachePath } from './paths';

const shortLinkCache = fs.existsSync(shortLinkCachePath) ? JSON.parse(fs.readFileSync(shortLinkCachePath, 'utf-8')) : {};
export async function getShortLink(link: string): Promise<string> {
  if (shortLinkCache[link]) {
    return shortLinkCache[link];
  }
  const resultJSON = await fetch(`https://api.uomg.com/api/long2dwz?dwzapi=urlcn&url=${encodeURIComponent(link)}`).then((res) => res.json());
  const { ae_url: result } = resultJSON;
  shortLinkCache[link] = result;
  return result;
}
export async function saveShortLinkCache() {
  await fs.writeFile(shortLinkCachePath, JSON.stringify(shortLinkCache));
}
