export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  quickReplies?: string[];
  isResult?: boolean;
  resultData?: {
    skinType: string;
    concerns: string[];
    currentProducts: string[];
    avoidIngredients: string[];
    recommendedIngredients: {
      name: string;
      benefits: string[];
      description: string;
    }[];
    recommendedProducts: {
      id: string;
      name: string;
      brand: string;
      category: string;
      image: string;
      keyIngredients: string[];
      benefits: string[];
      suitableSkinTypes: string[];
      priceRange: string;
      useTime: "Morning" | "Night" | "Both";
    }[];
    expertAnalysis?: string;
    tips?: string[];
    isFallback?: boolean;
  };
}

export interface ConsultationSession {
  id: string;
  title: string;
  date: string;
  skinType?: string;
  concerns?: string[];
  messages: Message[];
  currentStep: number; // 0: welcome, 1: skinType, 2: concerns, 3: currentProducts, 4: avoidIngredients, 5: completed
  completed: boolean;
}
