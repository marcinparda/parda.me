export interface Project {
  name: string;
  description: string;
  liveUrl?: string;
  codeUrl: string;
}

export const FINISHED_PROJECTS: Project[] = [
  {
    name: "My previous blog",
    description:
      "My previous digital garden. It was built with Next.js and was quite similar to this one.",
    liveUrl: "https://marcinparda.vercel.app/",
    codeUrl: "https://github.com/MarcinParda/marcinparda-blog",
  },
  {
    name: "parda.me",
    description:
      "Page that you are currently on. It's built with Astro and TailwindCSS.",
    liveUrl: "https://parda.me/",
    codeUrl: "https://github.com/MarcinParda/parda.me",
  },
  {
    name: "Firebase superchat",
    description:
      "Chat where all the users can talk to each other. It's possible to login with Google account.",
    liveUrl: "https://superchat-cc2d4.web.app/",
    codeUrl: "https://github.com/MarcinParda/firebase-superchat",
  },
];

export const WIP_PROJECTS: Project[] = [
  {
    name: "IT flashcards",
    description:
      "Flashcards Anki-like app for IT people. It's powered with AI and built with Nx, Nest.js & Next.js.",
    codeUrl: "https://github.com/MarcinParda/it-flashcards",
  },
];
