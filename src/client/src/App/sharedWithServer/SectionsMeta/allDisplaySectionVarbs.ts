import {
  sectionVarbNames,
  VarbName,
} from "./baseSectionsDerived/baseSectionsVarbsTypes";
import { RelLocalVarbInfo } from "./SectionInfo/RelVarbInfo";
import { SectionName, sectionNames } from "./SectionName";

export type DisplayName = string | RelLocalVarbInfo;

type DisplaySectionVarbGeneric = {
  displayName: DisplayName;
  displayNameStart: string;
  displayNameEnd: string;
  startAdornment: string;
  endAdornment: string;
};

const displaySectionVarbCheck = <DS extends DisplaySectionVarbGeneric>(
  value: DS
): DS => value;

function defaultDisplaySectionVarb() {
  return displaySectionVarbCheck({
    displayName: "",
    displayNameStart: "",
    displayNameEnd: "",
    startAdornment: "",
    endAdornment: "",
  });
}

type SectionVarbOptions = Partial<DisplaySectionVarbGeneric>;
function displaySectionVarb(
  partial: SectionVarbOptions = {}
): DisplaySectionVarbGeneric {
  return {
    ...defaultDisplaySectionVarb(),
    ...partial,
  };
}

type SectionVarbsOptions<SN extends SectionName> = Partial<{
  [VN in VarbName<SN>]: Partial<DisplaySectionVarbGeneric>;
}>;

function optionsToFull<SN extends SectionName>(
  sectionName: SN,
  options: SectionVarbsOptions<SN>
): DisplaySectionVarbsGeneric<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((full, varbName) => {
    const varbOptions = options[varbName] ?? {};
    full[varbName] = displaySectionVarb(varbOptions);
    return full;
  }, {} as DisplaySectionVarbsGeneric<SN>);
}

function displaySectionVarbsProp<SN extends SectionName>(
  sectionName: SN,
  options: Partial<DisplaySectionVarbsGeneric<SN>> = {}
): DisplaySectionVarbsProp<SN> {
  return {
    [sectionName]: optionsToFull(sectionName, options),
  } as DisplaySectionVarbsProp<SN>;
}

type DisplaySectionVarbsProp<SN extends SectionName> = {
  [S in SN]: DisplaySectionVarbsGeneric<SN>;
};

type DisplaySectionVarbsGeneric<SN extends SectionName> = {
  [VN in VarbName<SN>]: DisplaySectionVarbGeneric;
};

function defaultDisplaySectionVarbs<SN extends SectionName>(
  sectionName: SN
): DisplaySectionVarbsGeneric<SN> {
  const varbNames = sectionVarbNames(sectionName);
  return varbNames.reduce((defaults, varbName) => {
    defaults[varbName] = defaultDisplaySectionVarb();
    return defaults;
  }, {} as DisplaySectionVarbsGeneric<SN>);
}

type AllDisplaySectionVarbsGeneric = {
  [SN in SectionName]: DisplaySectionVarbsGeneric<SN>;
};

function allDefaultDisplaySectionVarbs(): AllDisplaySectionVarbsGeneric {
  return sectionNames.reduce((defaults, sectionName) => {
    (defaults as any)[sectionName] = defaultDisplaySectionVarbs(sectionName);
    return defaults;
  }, {} as AllDisplaySectionVarbsGeneric);
}

const displayVarbsS = {
  ongoing<BN extends string>(baseName: BN, displayName: string) {},
};
// there's gotta be a better way.

const displayVarbS = {
  named(displayName: string) {
    return displaySectionVarb({
      displayName,
    });
  },
  namedDollars(displayName: string, options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      ...this.dollars(options),
      displayName,
    });
  },
  dollars(options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      startAdornment: "$",
      ...options,
    });
  },
  monthly(options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      endAdornment: "/month",
      ...options,
    });
  },
  yearly(options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      endAdornment: "/year",
      ...options,
    });
  },
  dollarsMonthly(options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      startAdornment: this.dollars(options).startAdornment,
      endAdornment: this.monthly(options).endAdornment,
    });
  },
  dollarsYearly(options: SectionVarbOptions = {}) {
    return displaySectionVarb({
      startAdornment: this.dollars(options).startAdornment,
      endAdornment: this.yearly(options).endAdornment,
    });
  },
};

export const displaySectionVarbs = {
  ...allDefaultDisplaySectionVarbs,
  ...displaySectionVarbsProp("property", {
    price: displayVarbS.namedDollars("Purchase price"),
    sqft: displayVarbS.named("Square feet"),
    arv: displayVarbS.namedDollars("ARV"),
    sellingCosts: displayVarbS.namedDollars("Selling costs"),
    numUnits: displayVarbS.named("Unit count"),
    numBedrooms: displayVarbS.named("Bedroom count"),
    upfrontExpenses: displayVarbS.namedDollars("Upfront expenses"),
    upfrontRevenue: displayVarbS.namedDollars("Upfront revenues"),
  }),
};
