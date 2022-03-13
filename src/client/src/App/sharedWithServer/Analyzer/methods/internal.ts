import {
  addInEntity,
  addOutEntity,
  removeInEntity,
  removeOutEntity,
} from "./internal/inOutEntities";
import { updateConnectedEntities } from "./internal/updateConnectedEntities";
import { addSections } from "./internal/addSections";

export const internal = {
  addInEntity,
  addOutEntity,
  removeOutEntity,
  removeInEntity,
  updateConnectedEntities,
  addSections,
} as const;
