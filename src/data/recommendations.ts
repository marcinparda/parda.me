interface Recommendation {
  recommender: {
    name: string;
    title: string;
    linkedinProfileUrl: string;
    imageSource: string;
  };
  recommendationText: string;
}

export const recommendations: Recommendation[] = [
  {
    recommendationText:
      "Marcin is a JavaScript developer with a vast range of skills. He has a great knowledge about many frameworks, which I personally admire. Great understanding of software development lets him tackle even the most complex software and JavaScript solutions. I had a pleasure of working with Marcin and apart from his high technical skills he was a great team member. Always willing to help out and share programming knowledge when needed, and was very proactive in identifying potential issues.",
    recommender: {
      name: "Grzegorz Długokęcki",
      title: "Senior Frontend Developer",
      linkedinProfileUrl:
        "https://www.linkedin.com/in/grzegorz-d%C5%82ugok%C4%99cki-00647916a/",
      imageSource: "grzegorz.png",
    },
  },
  {
    recommendationText:
      "I worked with Marcin on different cooperation levels. For some time I was his team lead. This way he showed he is a great software developer. He was a team player who always helped teammates in their daily work. On the other hand, he didn't have a problem understanding the business requirements, and he wasn't afraid to speak about his vision of the software and suggestions to make it better, and better. Cooperating with Marcin on the same team was a pleasure. I love the way how he was explaining frontend solutions, suggested improvements in a code, and mentored me. To sum up - Marcin is great software developer and team player!",
    recommender: {
      name: "Szymon Darmofał",
      title: "Senior Backend Developer",
      linkedinProfileUrl: "https://www.linkedin.com/in/sdarmofal/",
      imageSource: "szymi.png",
    },
  },
];
