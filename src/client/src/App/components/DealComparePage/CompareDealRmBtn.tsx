import styled from "styled-components";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { nativeTheme } from "../../theme/nativeTheme";
import theme from "../../theme/Theme";
import { RemoveSectionXBtn } from "../appWide/RemoveSectionXBtn";
import { NativeStandardProps } from "../general/StandardProps";

interface Props extends NativeStandardProps, FeSectionInfo {}
export function CompareDealRmBtn({ style, ...rest }: Props) {
  return (
    <StyledRmSectionBtn
      {...{
        ...rest,
        style: {
          ...style,
          borderRadius: nativeTheme.br0,
        },
      }}
    />
  );
}

const StyledRmSectionBtn = styled(RemoveSectionXBtn)`
  background-color: ${theme.light};
  border: solid 1px ${theme["gray-400"]};
  :hover {
    border-color: ${theme.info.main};
    background-color: ${theme.info.main};
    color: ${theme.light};
  }
`;
