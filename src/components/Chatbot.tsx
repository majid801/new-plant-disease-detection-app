import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Loader2, HelpCircle, ChevronRight, User, Bot, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { chatWithAI } from "../services/geminiService";
import { Language, ChatMessage } from "../types";
import { translations } from "../translations";
import { farmerProblems } from "../constants";

interface ChatbotProps {
  language: Language;
}

// Speech Recognition Type (for browsers that support it)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Chatbot({ language }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const t = translations[language];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis.cancel(); // Stop any current speech
      setIsSpeaking(false);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = (text: string, index: number) => {
    if (isSpeaking && activeVoiceId === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveVoiceId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveVoiceId(index);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveVoiceId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setShowQuickHelp(false);

    try {
      const response = await chatWithAI(text, messages, language);
      const botMsg: ChatMessage = { role: "model", text: response };
      setMessages((prev) => [...prev, botMsg]);
      // Auto-speak the response
      speak(response, messages.length + 1);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { role: "model", text: "Sorry, I'm having trouble connecting right now." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const selectProblem = (problem: typeof farmerProblems[0]) => {
    const userMsg: ChatMessage = { role: "user", text: problem.question };
    const botMsg: ChatMessage = { role: "model", text: problem.solution };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setShowQuickHelp(false);
    speak(problem.solution, messages.length + 1);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[90vw] max-w-[420px] h-[650px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight">{t.chatbotTitle}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[11px] font-medium opacity-90 uppercase tracking-wider">Voice Assistant Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }} className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-95">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FDFCF8]">
              {messages.length === 0 && !showQuickHelp && (
                <div className="text-center py-12 px-6">
                  <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-2">Namaste!</h4>
                  <p className="text-stone-500 text-sm leading-relaxed mb-8">
                    I'm your AI farming expert. You can type or use your voice to ask me anything about your crops.
                  </p>
                  <button
                    onClick={() => setShowQuickHelp(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-2xl text-sm font-bold text-stone-700 hover:border-green-400 hover:text-green-600 transition-all shadow-sm active:scale-95"
                  >
                    <HelpCircle className="w-4 h-4" />
                    {t.chatbotQuickHelp}
                  </button>
                </div>
              )}

              {showQuickHelp ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#FDFCF8]/90 backdrop-blur-sm py-2 z-10">
                    <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{t.chatbotQuickHelp}</h4>
                    <button onClick={() => setShowQuickHelp(false)} className="text-xs text-green-600 font-bold hover:underline">Back</button>
                  </div>
                  {farmerProblems.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProblem(p)}
                      className="w-full text-left p-4 rounded-2xl bg-white border border-stone-100 hover:border-green-200 hover:bg-green-50/50 transition-all text-sm text-stone-700 flex items-center justify-between group shadow-sm"
                    >
                      <span className="truncate pr-4 font-medium">{p.question}</span>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-green-500 shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={i}
                    className={cn(
                      "flex gap-3 max-w-[90%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === "user" ? "bg-stone-200" : "bg-green-100"
                    )}>
                      {msg.role === "user" ? <User className="w-5 h-5 text-stone-500" /> : <Bot className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="space-y-1.5">
                      <div className={cn(
                        "p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm relative group",
                        msg.role === "user" 
                          ? "bg-gradient-to-br from-green-600 to-green-500 text-white rounded-tr-none" 
                          : "bg-white border border-stone-100 text-stone-700 rounded-tl-none"
                      )}>
                        {msg.text}
                        {msg.role === 'model' && (
                          <button 
                            onClick={() => speak(msg.text, i)}
                            className={cn(
                              "absolute -right-2 -bottom-2 p-1.5 rounded-full shadow-md transition-all active:scale-90 opacity-0 group-hover:opacity-100 focus:opacity-100",
                              activeVoiceId === i ? "bg-green-600 text-white opacity-100" : "bg-white text-stone-400 hover:text-green-600"
                            )}
                          >
                            {activeVoiceId === i ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              {loading && (
                <div className="flex gap-3 mr-auto max-w-[90%]">
                  <div className="w-9 h-9 rounded-2xl bg-green-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="bg-white border border-stone-100 p-4 rounded-[1.5rem] rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            {!showQuickHelp && (
              <div className="p-5 bg-white border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder={t.chatbotPlaceholder}
                      className="w-full pl-5 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-3xl text-sm focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || loading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 transition-all active:scale-95 shadow-md"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={toggleListening}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-md relative",
                      isListening ? "bg-red-500 text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    )}
                  >
                    {isListening && (
                      <span className="absolute inset-0 rounded-2xl bg-red-500 animate-ping opacity-40" />
                    )}
                    {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all",
          isOpen ? "bg-stone-800 text-white" : "bg-green-600 text-white"
        )}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
      </motion.button>
    </div>
  );
}
