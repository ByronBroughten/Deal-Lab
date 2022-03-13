import {
  addInEntity,
  addOutEntity,
  removeInEntity,
  removeOutEntity,
} from "./internal/inOutEntities";
import { updateConnectedEntities } from "./internal/updateConnectedEntities";

export const internal = {
  addInEntity,
  addOutEntity,
  removeOutEntity,
  removeInEntity,
  updateConnectedEntities,
} as const;
