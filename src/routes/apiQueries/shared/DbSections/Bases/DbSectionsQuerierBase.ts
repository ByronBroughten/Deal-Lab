
interface DbSectionsQuerierBaseProps {
  userFilter: { [key: string]: string };
}

export class DbSectionsQuerierBase {
  readonly userFilter: { [key: string]: string };
  constructor({ userFilter }: DbSectionsQuerierBaseProps) {
    this.userFilter = userFilter;
  }
}
