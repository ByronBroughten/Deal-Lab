import { Grid, Link } from "@mui/material";
import React from "react";
import { timeS } from "../sharedWithServer/utils/timeS";
import { nativeTheme } from "../theme/nativeTheme";
import { DealLabIconBtn } from "./DealLabIcon";
import { MuiRow } from "./general/MuiRow";

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
          <FooterLink href="https://deallab.app/">Why Deal Lab?</FooterLink>
          <FooterLink href="https://deallab.app/contact/">
            Contact
          </FooterLink>{" "}
          <FooterLink href="https://deallab.app/pricing/">Pricing</FooterLink>
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
          {`©${timeS.currentYear()} Deal Lab. All right reserved.`}
        </MuiRow>
      </Grid>
    </Grid>
  );
}
