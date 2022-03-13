import hash from "object-hash";
import Analyzer from "../../sharedWithServer/Analyzer";
import { DbEntry } from "../../sharedWithServer/Analyzer/DbEntry";
import { relSections } from "../../sharedWithServer/Analyzer/SectionMetas/relSections";
import { authTokenKey } from "../../sharedWithServer/User/crudTypes";
import { getStoredObj } from "../../utils/localStorage";

const stateKey = "analyzer";
export const relSectionsKey = "relSections";

export function storeAnalyzerState(analyzer: Analyzer): void {
  const { feInfo } = analyzer.singleSection("main");
  const dbMainEntry = analyzer.dbEntry(feInfo);
  localStorage.setItem(stateKey, JSON.stringify(dbMainEntry));
}
export function getStoredAnalyzerState(): Analyzer | undefined {
  rmStoredStateIfPreframesChanged();
  const dbEntry: DbEntry | undefined = getStoredObj(stateKey);
  if (dbEntry) return Analyzer.initAnalyzer({ dbEntry });
  else return undefined;
}
export function rmStoredStateIfPreframesChanged() {
  const newHash = newHashIfRelSectionsDidChange();
  if (newHash) {
    localStorage.setItem(relSectionsKey, newHash);
    localStorage.removeItem(stateKey);
    localStorage.removeItem(authTokenKey);
  }
}

function newHashIfRelSectionsDidChange(): string | null {
  // change this from relSections to SectionMetasRaw
  const hashed = hash(relSections);
  const storedHash = localStorage.getItem(relSectionsKey);
  const relSectionsDidChange = hashed !== storedHash;
  if (relSectionsDidChange) return hashed;
  else return null;
}
