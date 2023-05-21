import path from 'path';

export const projectRootPath = path.join(__dirname, '..', '..', '..');
export const shortLinkCachePath = path.join(projectRootPath, 'data', 'shortLinkCache.json');