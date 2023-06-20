import { darken, lighten } from "polished";

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
  "gray-150": "#f0f0f0",
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

const baseThemeColors = {
  primary: "#00684A",
  secondary: "#00A35C",
  lightBackground: "#ecf7fd",
  darkBlue: "#3c7c9c",
  notice: "#ff9868",
  danger: "#ff3527",
  yellowGreen: "#ECF87F",
  complementary: "#3f51b5",
  placeholderGray: basicColors["gray-600"] + "e0",
  dark: "#001E2B",
  light: "#fff",
} as const;

export const themeColors = {
  ...basicColors,
  ...baseThemeColors,
  inactiveLabel: baseThemeColors.primary,
  activeLabel: baseThemeColors.darkBlue,
  primary: colorVariants(baseThemeColors.primary),
  secondary: colorVariants(baseThemeColors.secondary),
  darkBlue: colorVariants(baseThemeColors.darkBlue),
  yellowGreen: colorVariants(baseThemeColors.yellowGreen),
  notice: colorVariants(baseThemeColors.notice),
  complementary: colorVariants(baseThemeColors.complementary),
  danger: colorVariants(baseThemeColors.danger),
} as const;

type ColorVariantOptions = {
  light?: string;
  dark?: string;
  contrast?: string;
};
type ColorVariants = {
  main: string;
  light: string;
  dark: string;
  contrast: string;
};
function colorVariants(
  main: string,
  { contrast, ...rest }: ColorVariantOptions = {}
): ColorVariants {
  return {
    main,
    get light(): string {
      return lighten(0.25, this.main);
    },
    get dark(): string {
      return darken(0.1, this.main);
    },
    contrast: contrast ?? baseThemeColors.dark,
    ...rest,
  };
}
