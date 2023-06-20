import { sxProps } from "../../utils/mui";

export const themeShadows = {
  oldShadow1:
    "0px 2px 1px -2px rgb(0 0 0 / 15%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 4px 0px rgb(0 0 0 / 12%)",
  oldShadow4:
    "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 4px 0px rgba(0 0 0 /14%), 0px 1px 10px 0px rgba(0 0 0 / 12%)",
  boxShadow1: sxProps({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }),
  boxShadow2: sxProps({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  }),
  boxShadow3: sxProps({
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  }),
};
