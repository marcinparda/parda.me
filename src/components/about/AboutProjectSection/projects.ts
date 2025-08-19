export interface Project {
  name: string;
  description: string;
  liveUrl?: string;
  codeUrl: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Cockpit (working on adding test user)",
    description:
      "NX monorepo for my frontend cockpit project apps. Cockpit project is several apps helping boosting my productivy or life quality in general. Managing budget, helping with newsletters etc. ",
    liveUrl: "https://cockpit.parda.me/",
    codeUrl: "https://github.com/marcinparda/cockpit-app",
  },
  {
    name: "Cockpit API",
    description:
      "FastAPI backend for cockpit projects. It is meant to be refactored to microservices in the future.",
    liveUrl: "https://api.parda.me/api/docs",
    codeUrl: "https://github.com/marcinparda/cockpit-api",
  },
  {
    name: "parda.me",
    description:
      "My technical blog. Page that you are currently on ☺️ It's built with Astro and TailwindCSS.",
    liveUrl: "https://parda.me/",
    codeUrl: "https://github.com/MarcinParda/parda.me",
  },
] as const;
