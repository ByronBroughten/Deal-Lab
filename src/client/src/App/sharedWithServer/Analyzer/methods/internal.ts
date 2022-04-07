import { addSections, nextAddSections } from "./internal/addSections";
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
import { resetSectionAndChildDbIds } from "./internal/resetSectionAndChildDbIds";
import { updateConnectedEntities } from "./internal/updateConnectedEntities";
import { updateSection } from "./internal/updateSection";
import { updateValue, updateValueDirectly } from "./internal/updateValue";

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
  nextAddSections,
} as const;
