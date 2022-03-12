import urljoin from "url-join";

export function extendUrl<M extends string, E extends string>(
  main: M,
  extension: E
) {
  return urljoin(main, extension);
}

export function urlPlusParams(url: string, params: string[]) {
  return extendUrl(url, params.join("/"));
}
