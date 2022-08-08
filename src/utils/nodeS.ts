import { URL } from "url";

export const nodeS = {
  isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch (err) {
      return false;
    }
  },
};
