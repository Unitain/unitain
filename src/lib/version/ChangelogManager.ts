import { VersionManager } from './VersionManager';

export type ChangelogEntryType = 'added' | 'changed' | 'fixed';

interface ChangelogEntry {
  version: string;
  date: string;
  type: ChangelogEntryType;
  message: string;
}

/**
 * Manages the changelog in browser memory.
 */
export class ChangelogManager {
  private entries: ChangelogEntry[] = [];

  /**
   * Adds a new entry to the changelog.
   */
  addEntry(version: string, type: ChangelogEntryType, message: string): void {
    const entry: ChangelogEntry = {
      version,
      date: new Date().toISOString().split('T')[0],
      type,
      message
    };

    this.entries.push(entry);
  }

  /**
   * Generates a changelog for a specific version.
   */
  generateChangelog(version: string): string {
    const versionEntries = this.entries.filter(entry => entry.version === version);
    if (versionEntries.length === 0) {
      return '';
    }

    const grouped = this.groupEntriesByType(versionEntries);
    return this.formatChangelog(version, grouped);
  }

  /**
   * Exports the entire changelog to markdown format.
   */
  exportToMarkdown(): string {
    const grouped = this.entries.reduce((acc, entry) => {
      if (!acc[entry.version]) {
        acc[entry.version] = [];
      }
      acc[entry.version].push(entry);
      return acc;
    }, {} as Record<string, ChangelogEntry[]>);

    const versions = Object.keys(grouped).sort().reverse();
    return versions.map(version => this.formatChangelog(version, this.groupEntriesByType(grouped[version]))).join('\n\n');
  }

  private groupEntriesByType(entries: ChangelogEntry[]): Record<ChangelogEntryType, string[]> {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry.message);
      return acc;
    }, {} as Record<ChangelogEntryType, string[]>);
  }

  private formatChangelog(version: string, grouped: Record<ChangelogEntryType, string[]>): string {
    const date = this.entries.find(e => e.version === version)?.date;
    let markdown = `## [${version}] - ${date}\n\n`;

    for (const type of ['added', 'changed', 'fixed'] as ChangelogEntryType[]) {
      if (grouped[type]?.length > 0) {
        markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n`;
        grouped[type].forEach(message => {
          markdown += `- ${message}\n`;
        });
        markdown += '\n';
      }
    }

    return markdown.trim();
  }
}