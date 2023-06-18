import {
  VarbInfoText,
  VarbInfoTextProps,
  varbLabels,
} from "../../../varbLabels";
import { SectionVarbNames } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../sharedWithServer/SectionsMeta/SectionName";

export function useVarbInfoText<SN extends SectionName>({
  sectionName,
  varbName,
}: SectionVarbNames<SN>): VarbInfoTextProps {
  const props = (varbLabels[sectionName] as any)[varbName] as VarbInfoText;
  if (props) return props;
  else {
    throw new Error(`${sectionName}.${varbName} returned null varbInfoText`);
  }
}
