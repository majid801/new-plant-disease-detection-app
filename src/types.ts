export interface DiseaseResult {
  diseaseName: string;
  confidence: number;
  description: string;
  symptoms: string[];
  pesticideRecommendations: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  preventionTips: string[];
}

export interface ScanHistory {
  id: string;
  timestamp: number;
  imageUrl: string;
  result: DiseaseResult;
}

export type Language = 'en' | 'hi' | 'te' | 'es' | 'fr' | 'zh' | 'ar';

export interface Translation {
  title: string;
  subtitle: string;
  uploadPrompt: string;
  analyzing: string;
  results: string;
  pesticides: string;
  prevention: string;
  history: string;
  noHistory: string;
  camera: string;
  gallery: string;
  confidence: string;
  symptoms: string;
  dosage: string;
  instructions: string;
  chatbotTitle: string;
  chatbotPlaceholder: string;
  chatbotQuickHelp: string;
  chatbotSend: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
