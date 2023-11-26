import { makeDefaultMaker } from "./makeDefault";

const mdm = makeDefaultMaker;

export const makeDefaultUnit = mdm("unit", (unit) =>
  unit.addChild("targetRentEditor")
);

export const makeDefaultPeriodicItem = mdm("periodicItem", (periodicItem) =>
  periodicItem.addChild("valueDollarsEditor")
);

export const makeDefaultMiscPeriodicValue = mdm(
  "miscPeriodicValue",
  (periodicValue) => {
    periodicValue.addChild("valueDollarsEditor");
    periodicValue.addChild("periodicList");
  }
);

export const makeDefaultTaxesValue = mdm("taxesValue", (taxes) => {
  taxes.updateValues({ valueSourceName: "valueDollarsEditor" });
  taxes.addChild("valueDollarsEditor");
});

export const makeDefaultHomeInsValue = mdm("homeInsValue", (homeIns) => {
  homeIns.updateValues({ valueSourceName: "valueDollarsEditor" });
  homeIns.addChild("valueDollarsEditor", {
    sectionValues: { valueEditorFrequency: "yearly" },
  });
});

export const makeDefaultCapExItem = mdm("capExItem", (capExItem) =>
  capExItem.addChild("lifespanEditor", {
    sectionValues: { valueEditorUnit: "years" },
  })
);
