import axios from 'axios';

class QuizAPIService {
  constructor() {
    this.categories = [
      { id: 9, name: "General Knowledge" },
      { id: 18, name: "Science: Computers" },
      { id: 23, name: "History" },
      { id: 21, name: "Sports" },
      { id: 22, name: "Geography" }
    ];
  }

  async fetchQuestions({ amount = 10, category = null, difficulty = 'medium', type = 'multiple' } = {}) {
    let url = `https://opentdb.com/api.php?amount=${amount}&type=${type}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (category) url += `&category=${category}`;

    try {
      const response = await axios.get(url);
      if (response.data.response_code !== 0) {
         throw new Error(this.getErrorMessage(response.data.response_code));
      }
      return response.data.results.map(q => this.formatQuestion(q));
    } catch (error) {
      console.error("Quiz API Error:", error);
      throw error;
    }
  }

  getErrorMessage(code) {
    if (code === 1) return "Not enough questions available for the specified parameters";
    if (code === 2) return "Invalid parameter";
    if (code === 3) return "Token not found";
    if (code === 4) return "Token empty";
    return "Unknown API Error";
  }

  mapCategoryToID(categoryName) {
    const map = {
      'bollywood': null,
      'cricket': null,
      'indian_history': 23,
      'indian_culture': null,
      'general_knowledge': 9,
      'technology': 18,
      'random': null
    };
    return map[categoryName] !== undefined ? map[categoryName] : null;
  }

  async fetchQuestionsByCategory(name, amt = 10, diff = 'medium') {
    if (name === 'random' || name === 'bollywood' || name === 'indian_culture' || name === 'cricket') {
      return this.fetchRandomQuestions(amt, diff);
    }
    const categoryId = this.mapCategoryToID(name);
    if (!categoryId) {
        throw new Error("Unsupported category");
    }
    return this.fetchQuestions({ amount: amt, difficulty: diff, category: categoryId });
  }

  async fetchRandomQuestions(amount = 10, difficulty = 'medium') {
    // Fetches from 5 different categories and mixes them together.
    const cats = [9, 18, 23, 21, 22]; // General Knowledge, Computers, History, Sports, Geography
    const perCategory = Math.max(1, Math.floor(amount / cats.length));
    
    let allQuestions = [];
    for (const cat of cats) {
      try {
        const batch = await this.fetchQuestions({ amount: perCategory, difficulty, category: cat });
        allQuestions = [...allQuestions, ...batch];
      } catch (e) {
        // Skip on error
      }
    }
    
    // Fill remaining if needed
    if (allQuestions.length < amount) {
       try {
         const extras = await this.fetchQuestions({ amount: amount - allQuestions.length, difficulty });
         allQuestions = [...allQuestions, ...extras];
       } catch (e) {}
    }
    
    this.shuffleArray(allQuestions);
    return allQuestions.slice(0, amount);
  }

  formatQuestion(apiQuestion) {
    const decode = (str) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      return txt.value;
    };

    const qDecode = decode(apiQuestion.question);
    const correctAns = decode(apiQuestion.correct_answer);
    const options = apiQuestion.incorrect_answers.map(decode);
    options.push(correctAns);
    
    this.shuffleArray(options);

    return {
      question: qDecode,
      options: options,
      correct: options.indexOf(correctAns),
      difficulty: apiQuestion.difficulty
    };
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async getCategories() {
    return this.categories;
  }
}

export default new QuizAPIService();
