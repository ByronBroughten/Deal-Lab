import { PackBuilderSection } from "../Packers/PackBuilderSection";

export function makeDefaultActiveDealSystem() {
  const dealSystem = PackBuilderSection.initAsOmniChild("dealSystem");
  dealSystem.addChild("calculatedVarbs");
  return dealSystem.makeSectionPack();
}
