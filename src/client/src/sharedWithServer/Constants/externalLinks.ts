const externalLinks = {
  capEx: "https://homeestimator.net/capital-expenses",
  contact: "https://homeestimator.net/contact",
} as const;

type ExternalLinks = typeof externalLinks;

type LinkName = keyof ExternalLinks;

export function externalLink(linkName: LinkName): string {
  return externalLinks[linkName];
}
