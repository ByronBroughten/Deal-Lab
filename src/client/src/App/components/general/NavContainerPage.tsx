import {
  NavContainerProps,
  NavTopAndSideContainer,
} from "./NavTopAndSideContainer";
import { PageMain } from "./PageMain";

export function NavContainerPage({ className, ...rest }: NavContainerProps) {
  return (
    <PageMain className={`NavContainerPage-root ${className ?? ""}`}>
      <NavTopAndSideContainer {...rest} />
    </PageMain>
  );
}
