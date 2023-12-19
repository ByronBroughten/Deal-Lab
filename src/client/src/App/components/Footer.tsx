import { Grid, Link } from "@mui/material";
import React from "react";
import { constants } from "../../sharedWithServer/Constants";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { nativeTheme } from "../theme/nativeTheme";
import { DealLabIconBtn } from "./DealLabIcon";
import { MuiRow } from "./general/MuiRow";

export function FooterNext() {
  return (
    <Grid
      container
      alignItems={"center"}
      spacing={"50px"}
      sx={{
        paddingX: "35px",
        paddingY: "20px",
        backgroundColor: nativeTheme.light,
        whiteSpace: "nowrap",
      }}
    >
      <Grid item sm={12} md={4}>
        <MuiRow sx={{ justifyContent: "center", flexWrap: "nowrap" }}>
          <FooterLink href="https://homeestimator.net/">{`Why ${constants.appName}`}</FooterLink>
          <FooterLink href="https://homeestimator.net/contact/">
            Contact
          </FooterLink>{" "}
          <FooterLink href="https://homeestimator.net/pricing/">
            Pricing
          </FooterLink>
        </MuiRow>
      </Grid>
      <Grid item sm={12} md={4}>
        <MuiRow sx={{ justifyContent: "center" }}>
          <DealLabIconBtn />
        </MuiRow>
      </Grid>
      <Grid item sm={12} md={4}>
        <MuiRow
          sx={{ justifyContent: "center", color: nativeTheme.primary.dark }}
        >
          {`©${timeS.currentYear()} ${constants.appName}. All right reserved.`}
        </MuiRow>
      </Grid>
    </Grid>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      sx={{
        fontStyle: "normal",
        textDecoration: "none",
        color: nativeTheme.primary.dark,
        paddingRight: nativeTheme.s45,
      }}
      href={href}
    >
      {children}
    </Link>
  );
}
