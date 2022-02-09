export function extendUrl<M extends string, E extends string>(
  main: M,
  extension: E
) {
  return new URL(extension, main).href;
}

export function urlPlusParams(url: string, params: string[]) {
  return extendUrl(url, params.join("/"));
}
