import { Inf } from "../../../../../../SectionMetas/Info";
import { DbEnt } from "../../../../../DbEntry";

export const initOutputs = [
  {
    dbId: "cQymV2Bkt0iZ",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "totalInvestment",
    },
  },
  {
    dbId: "f6XSAyPzjFhR",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "cashFlowYearly",
    },
  },
  {
    dbId: "FOleBYyjtcW6",
    values: {
      id: "static",
      idType: "relative",
      sectionName: "final",
      varbName: "roiYearly",
    },
  },
] as const;

// alright. I want to get these into the state every time a new analysis is create.
// I can just add another section called "outputs", have it be a child of analysis

// That would make sense.
// But it would be annoying to make that its own thing.
// I would like to eventually make something called "output groups"
// and I'd like loading a deal to load everything that went into it.
// outputs should be children of anaysis.

// creating a new deal should create new outputs.
// do you have to load a deal in order to access an output collection?
// No, you do not. You can save those separately.

// creating a new property always produces the same result.
// creating a new analysis shouldn't necessarily always produce the same
// result. but people shouldn't really need to create new ones.
// No, it's fine for it to always produce the same result.

// I want analysis to contain the other stuff

// How can I add propertyGeneral to this, and then add a default property to
// propertyGeneral?

// For now I can just ditch the default sections, yeah?
// But that's not cool.
// I'm not able to iteratively improve the thing, then.

// All I can do is a fairly hacky roundabout, I think.

let initEntry = DbEnt.initEntry(
  "outputListDefault",
  { title: "" },
  { dbId: "_8k6-iypEf84" }
);

export const initOutputListDefault = DbEnt.addLikeChildren(
  initEntry,
  initOutputs.map((output) => DbEnt.initSection(output.dbId, output.values)),
  "output",
  Inf.db("outputListDefault", initEntry.dbId)
);
