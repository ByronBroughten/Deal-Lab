export const extendUrl = (main: string, extension: string) => {
  return new URL(extension, main).href;
};

export function urlPlusParams(url: string, params: string[]) {
  return extendUrl(url, params.join("/"));
}
