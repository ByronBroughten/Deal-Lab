// this is a prototype designed to show what it might look
// like to implement allUpdateSections with more nuanced control over
// how sections are solved.
const relSectionsNext = {
  property: {
    default: { price: "updateVarb" },
    display: {},
  },
  loan: {
    default: { interestRate: "updateVarb" },
    display: {},
  },
  unit: {
    default: { targetRent: "updateVarb" },
  },
};

const relSectionsChildrenNext = {
  "property.default": {
    unit: "default",
  },
};
