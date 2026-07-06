export type ContentPackId =
  | "sandhyavandanam-audio"
  | "lalitha-audio"
  | "dakshinamurthy-audio"
  | "lingashtakam-audio"
  | "arunachala-audio"
  | "chandrasekhara-audio"
  | "jyotirlinga-audio";

export type ContentPack = {
  id: ContentPackId;
  title: string;
  titleTe: string;
  description: string;
  /** Bump when files change on GitHub so cached copies are refreshed. */
  version: number;
  /** Paths relative to the GitHub repo root. */
  files: readonly string[];
};

export type ContentPackProgress = {
  downloaded: number;
  total: number;
  downloading: boolean;
  error: string | null;
};

export type AudioUriSource = { uri: string };
