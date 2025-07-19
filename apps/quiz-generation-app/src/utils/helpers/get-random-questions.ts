export const getRandomQuestions = async (arr: any[], n: number) => {
  const shuffledQuestions = [...arr];
  for (let i = shuffledQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [
      shuffledQuestions[j],
      shuffledQuestions[i],
    ];
  }
  return shuffledQuestions.slice(0, n);
};
