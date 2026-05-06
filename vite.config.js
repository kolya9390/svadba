import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
  const isGitHubPagesBuild = Boolean(process.env.GITHUB_ACTIONS && repoName);

  return {
    plugins: [vue()],
    base: isGitHubPagesBuild ? `/${repoName}/` : "/",
  };
});
