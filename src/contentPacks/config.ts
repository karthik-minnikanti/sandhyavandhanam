/** Public GitHub repo that hosts audio and other large content assets. */
export const CONTENT_REPO = {
  owner: "karthik-minnikanti",
  repo: "sandhyavandhanam",
  branch: "main",
} as const;

export function githubRawUrl(repoPath: string): string {
  const normalized = repoPath.replace(/^\//, "");
  return `https://raw.githubusercontent.com/${CONTENT_REPO.owner}/${CONTENT_REPO.repo}/${CONTENT_REPO.branch}/${normalized}`;
}
