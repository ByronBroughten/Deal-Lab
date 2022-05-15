import hash from "object-hash";
import { config } from "../../Constants";
import Analyzer from "../../sharedWithServer/Analyzer";
import { DbEntry } from "../../sharedWithServer/Analyzer/DbEntry";
import { relSections } from "../../sharedWithServer/SectionsMeta/relSections";
import { getStoredObj } from "../../utils/localStorage";

const { tokenKey } = config;
export function storeAnalyzerState(analyzer: Analyzer): void {
  const { feInfo } = analyzer.singleSection("main");
  const dbMainEntry = analyzer.dbEntry(feInfo);
  localStorage.setItem(tokenKey.analyzerState, JSON.stringify(dbMainEntry));
}
export function getStoredAnalyzerState(): Analyzer | undefined {
  rmStoredStateIfPreframesChanged();
  const dbEntry: DbEntry | undefined = getStoredObj(tokenKey.analyzerState);
  if (dbEntry) return Analyzer.initAnalyzer({ dbEntry });
  else return undefined;
}
export function rmStoredStateIfPreframesChanged() {
  const newHash = newHashIfRelSectionsDidChange();
  if (newHash) {
    localStorage.setItem(tokenKey.analyzerConfigHash, newHash);
    localStorage.removeItem(tokenKey.analyzerState);
    localStorage.removeItem(tokenKey.apiUserAuth);
  }
}

function newHashIfRelSectionsDidChange(): string | null {
  // change this from relSections to SectionMetasRaw
  const hashed = hash(relSections);
  const storedHash = localStorage.getItem(tokenKey.analyzerConfigHash);
  const relSectionsDidChange = hashed !== storedHash;
  if (relSectionsDidChange) return hashed;
  else return null;
}
