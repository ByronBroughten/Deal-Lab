const externalLinks = {
  capEx: "https://deallab.app/capital-expenses",
  contact: "https://deallab.app/contact",
} as const;

type ExternalLinks = typeof externalLinks;

type LinkName = keyof ExternalLinks;

export function externalLink(linkName: LinkName): string {
  return externalLinks[linkName];
}
