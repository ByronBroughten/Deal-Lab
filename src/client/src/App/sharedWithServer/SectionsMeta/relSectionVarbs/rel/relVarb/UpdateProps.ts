import { ValueName } from "../../../baseSectionsVarbs/baseVarb";
import { UpdateBasics } from "./UpdateBasicts";
import { UpdateOverrides } from "./UpdateOverrides";

export interface UpdateProps<VN extends ValueName = ValueName>
  extends UpdateBasics<VN> {
  updateOverrides: UpdateOverrides;
}
