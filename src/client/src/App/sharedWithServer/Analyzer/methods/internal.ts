import { eraseSections } from "./eraseSectionAndSolve";
import { addSections } from "./internal/addSections";
import { addSectionsNext } from "./internal/addSectionsNext";
import {
  eraseChildren,
  eraseSectionAndChildren,
} from "./internal/eraseSectionAndChildren";
import {
  addInEntity,
  addOutEntity,
  removeInEntity,
  removeOutEntity,
} from "./internal/inOutEntities";
import { loadRawSectionPackArr } from "./internal/loadRawSectionPackArr";
import { resetSectionAndChildDbIds } from "./internal/resetSectionAndChildDbIds";
import { updateConnectedEntities } from "./internal/updateConnectedEntities";
import { updateSection } from "./internal/updateSection";
import { updateValue, updateValueDirectly } from "./internal/updateValue";
import { wipeSectionArr } from "./updateSectionArr";

export const internal = {
  loadRawSectionPackArr,
  wipeSectionArr,
  eraseSections,
  addInEntity,
  addOutEntity,
  removeOutEntity,
  removeInEntity,
  updateConnectedEntities,
  addSections,
  updateSection,
  eraseChildren,
  eraseSectionAndChildren,
  resetSectionAndChildDbIds,
  updateValue,
  updateValueDirectly,
  addSectionsNext,
} as const;
