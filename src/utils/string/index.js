// @flow
export function extractSubdomain(domain: string) {
  const s = domain.split('.');
  return s[0];
  // s.pop();
  // s.pop();
  // return s.join('.');
}

export function extractRootDomain(domain: string) {
  const s = domain.split('.');
  if (s.length <= 2) return domain;
  // eslint-disable-next-line no-unused-vars
  const [f, ...rest] = s;
  return rest.join('.');
  // return [s[s.length - 2], s[s.length - 1]].join('.');
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
