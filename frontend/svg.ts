export const reverseX = (path: string): string => {
  return path
    .replace(/-([0-9\.]+),/g, 'P$1,')
    .replace(/ ([0-9\.]+),/g, ' -$1,')
    .replace(/P([0-9\.]+),/g, '$1,');
};
export const reverseY = (path: string): string => {
  return path
    .replace(/,-([0-9\.]+)/g, ',P$1')
    .replace(/,([0-9\.]+)/g, ',-$1')
    .replace(/,P([0-9\.]+)/g, ',$1');
};
export const rotate = (path: string): string => {
  return path.replace(/([-0-9\.]+),([-0-9\.]+)/g, '$2,$1');
};
