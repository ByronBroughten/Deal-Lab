import { reactNativeS } from "../utils/reactNative";

const basicColors = {
  blue: "#0d6efd",
  indigo: "#6610f2",
  purple: "#6f42c1",
  pink: "#d63384",
  violet: "#d333d3",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#198754",
  teal: "#20c997",
  cyan: "#0dcaf0",
  white: "#fff",
  "gray-100": "#f8f9fa",
  "gray-200": "#e9ecef",
  "gray-300": "#dee2e6",
  "gray-400": "#ced4da",
  "gray-500": "#adb5bd",
  "gray-600": "#6c757d",
  "gray-700": "#495057",
  "gray-800": "#343a40",
  "gray-900": "#212529",
  black: "#000",
} as const;

const spacings = {
  s0: "0.0625rem",
  s1: "0.125rem",
  s15: "0.1875rem",
  s2: "0.25rem",
  s25: "0.375rem",
  s3: "0.5rem",
  s35: "0.75rem",
  s4: "1rem",
  s45: "1.5rem",
  s5: "2rem",
} as const;

const themeColors = {
  primary: "#00684A",
  secondary: "#00A35C",
} as const;

const borderRadiuses = {
  br0: 5,
} as const;

const view = reactNativeS.view;
const text = reactNativeS.text;
export const nativeTheme = {
  ...basicColors,
  ...borderRadiuses,
  ...spacings,
  ...themeColors,
  subSection: {
    borderLines: view({
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: basicColors["gray-400"],
    }),
  },
} as const;
