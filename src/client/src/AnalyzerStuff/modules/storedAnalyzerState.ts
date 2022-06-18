import hash from "object-hash";
import { config } from "../../App/Constants";
import { relSections } from "../../App/sharedWithServer/SectionsMeta/relSections";
import { getStoredObj } from "../../App/utils/localStorage";
import { DbEntry } from "../types/DbEntry";
import Analyzer from "./Analyzer";

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
