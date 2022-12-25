import { NavContainer, NavContainerProps } from "./NavContainer";
import { PageMain } from "./PageMain";

export function NavContainerPage({ className, ...rest }: NavContainerProps) {
  return (
    <PageMain className={`NavContainerPage-root ${className ?? ""}`}>
      <NavContainer {...rest} />
    </PageMain>
  );
}
