// this is a prototype designed to show what it might look
// like to implement relSections with more nuanced control over
// how sections are solved.
const relSectionsNext = {
  property: {
    default: { price: "relVarb" },
    display: {},
  },
  loan: {
    default: { interestRate: "relVarb" },
    display: {},
  },
  unit: {
    default: { targetRent: "relVarb" },
  },
};

const relSectionsChildrenNext = {
  "property.default": {
    unit: "default",
  },
};
