// Join a path onto the Pages base path with exactly one slash at the seam.
// import.meta.env.BASE_URL may or may not have a trailing slash, so never
// concatenate it directly.
const RAW = import.meta.env.BASE_URL;
export const BASE_PATH = RAW.endsWith('/') ? RAW : RAW + '/';
export const withBase = (path = '') => BASE_PATH + path.replace(/^\//, '');
