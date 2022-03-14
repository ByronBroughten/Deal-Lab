import {
  addInEntity,
  addOutEntity,
  removeInEntity,
  removeOutEntity,
} from "./internal/inOutEntities";
import { updateConnectedEntities } from "./internal/updateConnectedEntities";
import { addSections } from "./internal/addSections";
import { updateSection } from "./internal/updateSection";
import {
  eraseChildren,
  eraseSectionAndChildren,
} from "./internal/eraseSectionAndChildren";
import { resetSectionAndChildDbIds } from "./internal/resetSectionAndChildDbIds";
import { updateValue } from "./internal/updateValue";
import { updateValueDirectly } from "./internal/updateValue";

export const internal = {
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
} as const;
