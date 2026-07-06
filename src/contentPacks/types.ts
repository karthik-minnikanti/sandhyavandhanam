export type ContentPackId =
  | "sandhyavandanam-audio"
  | "lalitha-audio"
  | "dakshinamurthy-audio"
  | "lingashtakam-audio"
  | "arunachala-audio"
  | "chandrasekhara-audio"
  | "jyotirlinga-audio"
  | "sankat-mochana-hanuman-audio"
  | "hanuman-chalisa-audio"
  | "hanumad-ashtakam-audio"
  | "ganesha-pancharatnam-audio"
  | "gananayaka-ashtakam-audio"
  | "govinda-namalu-audio"
  | "venkatesha-ashtakam-audio"
  | "vishnu-sahasranamam-audio"
  | "subrahmanya-ashtakam-audio";

export type ContentPack = {
  id: ContentPackId;
  title: string;
  titleTe: string;
  description: string;
  /** Bump when files change on GitHub so cached copies are refreshed. */
  version: number;
  /** Paths relative to the GitHub repo root. */
  files: readonly string[];
  /** True when MP3s are published on GitHub (show play/download UI). */
  audioPublished: boolean;
};

export type ContentPackProgress = {
  downloaded: number;
  total: number;
  downloading: boolean;
  error: string | null;
};

export type AudioUriSource = { uri: string };
