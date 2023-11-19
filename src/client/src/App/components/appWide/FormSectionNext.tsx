import { Box, SxProps } from "@mui/material";
import ChunkTitle from "../general/ChunkTitle";
import { nativeTheme } from "./../../theme/nativeTheme";
import { FormSection } from "./FormSection";

type Props = {
  className?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  sx?: SxProps;
};

export function FormSectionNext({ children, label, sx, ...rest }: Props) {
  return (
    <FormSection
      {...{
        ...rest,
        sx: [
          {
            paddingTop: nativeTheme.s3,
          },
        ],
      }}
    >
      <Box>
        {label && <ChunkTitle>{label}</ChunkTitle>}
        {children}
      </Box>
    </FormSection>
  );
}
