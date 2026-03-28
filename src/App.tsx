import { useState, useRef, useEffect } from "react";
import { Camera, Upload, History, Languages, Loader2, CheckCircle2, AlertCircle, X, ChevronRight, Leaf, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { cn } from "./lib/utils";
import { identifyDisease } from "./services/geminiService";
import { DiseaseResult, Language, ScanHistory } from "./types";
import { translations } from "./translations";
import Chatbot from "./components/Chatbot";

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  useEffect(() => {
    const savedHistory = localStorage.getItem("agroguard_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Welcome message
    if (voiceGuideEnabled) {
      const timer = setTimeout(() => {
        speak(translations[language].subtitle);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [language]);

  const saveToHistory = (newResult: DiseaseResult, imageUrl: string) => {
    const newEntry: ScanHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUrl,
      result: newResult,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem("agroguard_history", JSON.stringify(updatedHistory));
  };

  const speak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : language;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        if (voiceGuideEnabled) {
          speak(language === 'en' ? "Image uploaded successfully. Tap the analyze button to identify the disease." : 
                language === 'hi' ? "छवि सफलतापूर्वक अपलोड हो गई। बीमारी की पहचान करने के लिए विश्लेषण बटन पर टैप करें।" :
                language === 'te' ? "చిత్రం విజయవంతంగా అప్‌లోడ్ చేయబడింది. వ్యాధిని గుర్తించడానికి విశ్లేషణ బటన్‌ను నొక్కండి." : 
                t.analyzing);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await identifyDisease(image, language);
      setResult(data);
      saveToHistory(data, image);
      // Auto-speak the disease name
      speak(`${t.results}: ${data.diseaseName}. ${data.description}`);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const getLangName = (lang: Language) => {
    const names = { en: "English", hi: "हिंदी", te: "తెలుగు", es: "Español", fr: "Français", zh: "中文", ar: "العربية" };
    return names[lang];
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D3436] font-sans selection:bg-green-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-100 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-green-600 to-green-500 p-2 rounded-2xl shadow-lg shadow-green-200">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800 font-serif">{t.title}</h1>
          </motion.div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setVoiceGuideEnabled(!voiceGuideEnabled)}
              className={cn(
                "p-2.5 rounded-2xl transition-all active:scale-95 border",
                voiceGuideEnabled ? "bg-green-50 border-green-200 text-green-600" : "bg-stone-50 border-stone-200 text-stone-400"
              )}
              title="Voice Guide"
            >
              {voiceGuideEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => setActiveTab('scan')}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'scan' ? "bg-white text-green-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                )}
              >
                Scan
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'history' ? "bg-white text-green-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                )}
              >
                History
              </button>
            </div>
            
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-2xl transition-all text-stone-600 active:scale-95 border border-transparent hover:border-stone-200">
                <Languages className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">{getLangName(language)}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 rounded-[2rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden min-w-[160px] p-2">
                {(Object.keys(translations) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm rounded-xl transition-all",
                      language === lang ? "text-green-600 font-bold bg-green-50" : "text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    {getLangName(lang)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20 pb-32 md:pb-20">
        {activeTab === 'scan' ? (
          <>
            {/* Hero */}
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                AI-Powered Crop Care
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-serif font-light text-stone-800 mb-6 leading-tight"
              >
                {t.subtitle}
              </motion.h2>
              <p className="text-stone-500 max-w-lg mx-auto leading-relaxed text-lg">
                {t.uploadPrompt}
              </p>
            </div>

            {/* Upload Section */}
            <div className="max-w-2xl mx-auto">
              {!image ? (
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video md:aspect-[16/9] border-2 border-dashed border-stone-200 rounded-[3rem] bg-white flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-green-400 hover:bg-green-50/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-green-100/50"
                >
                  <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center group-hover:bg-green-100 transition-all group-hover:rotate-12">
                    <Upload className="w-10 h-10 text-stone-400 group-hover:text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-stone-700">{t.gallery}</p>
                    <p className="text-sm text-stone-400 mt-2">Take a photo or select from gallery</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-stone-100 aspect-video md:aspect-[16/9] group">
                    <img src={image} alt="Crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    <button
                      onClick={reset}
                      className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/40 text-white rounded-2xl backdrop-blur-xl transition-all active:scale-90 border border-white/30"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {!result && !analyzing && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={analyzeImage}
                      className="w-full py-5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-[2rem] font-bold text-xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      {t.analyzing.replace('...', '')}
                    </motion.button>
                  )}

                  {analyzing && (
                    <div className="flex flex-col items-center gap-6 py-12">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
                        <Leaf className="w-6 h-6 text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <p className="text-stone-600 font-bold text-lg animate-pulse tracking-wide uppercase">{t.analyzing}</p>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm"
                    >
                      <AlertCircle className="w-6 h-6 shrink-0" />
                      <p className="font-bold">{error}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-20 space-y-12"
                >
                  <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-stone-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4" />
                            {t.results}
                          </div>
                          <button 
                            onClick={() => speak(`${result.diseaseName}. ${result.description}`)}
                            className={cn(
                              "p-2 rounded-full transition-all active:scale-90 shadow-sm",
                              isSpeaking ? "bg-green-600 text-white" : "bg-stone-100 text-stone-500 hover:text-green-600"
                            )}
                          >
                            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          </button>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-serif text-stone-800 mb-6 leading-tight">
                          {result.diseaseName}
                        </h3>
                        <p className="text-stone-500 leading-relaxed text-lg max-w-2xl">
                          {result.description}
                        </p>
                      </div>
                      <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 min-w-[200px] text-center shadow-inner">
                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em] mb-2">{t.confidence}</p>
                        <p className="text-6xl font-serif text-green-600">
                          {(result.confidence * 100).toFixed(0)}<span className="text-3xl">%</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 relative z-10">
                      {/* Symptoms */}
                      <div className="group">
                        <h4 className="flex items-center gap-4 text-xl font-black text-stone-800 mb-8 uppercase tracking-tighter">
                          <span className="w-10 h-10 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-500 group-hover:bg-green-600 group-hover:text-white transition-all">01</span>
                          {t.symptoms}
                        </h4>
                        <ul className="space-y-5">
                          {result.symptoms.map((symptom, i) => (
                            <motion.li 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className="flex items-start gap-4 text-stone-600 text-lg"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                              {symptom}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Prevention */}
                      <div className="group">
                        <h4 className="flex items-center gap-4 text-xl font-black text-stone-800 mb-8 uppercase tracking-tighter">
                          <span className="w-10 h-10 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-500 group-hover:bg-blue-600 group-hover:text-white transition-all">02</span>
                          {t.prevention}
                        </h4>
                        <ul className="space-y-5">
                          {result.preventionTips.map((tip, i) => (
                            <motion.li 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (i + 3) * 0.1 }}
                              key={i} 
                              className="flex items-start gap-4 text-stone-600 text-lg"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                              {tip}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Pesticides */}
                    <div className="mt-16 pt-16 border-t border-stone-100 relative z-10">
                      <h4 className="flex items-center gap-4 text-xl font-black text-stone-800 mb-10 uppercase tracking-tighter">
                        <span className="w-10 h-10 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-500">03</span>
                        {t.pesticides}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-6">
                        {result.pesticideRecommendations.map((p, i) => (
                          <motion.div 
                            whileHover={{ y: -5 }}
                            key={i} 
                            className="bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100 hover:border-green-200 hover:bg-white hover:shadow-xl hover:shadow-green-100/50 transition-all"
                          >
                            <h5 className="text-xl font-bold text-stone-800 mb-4">{p.name}</h5>
                            <div className="space-y-5">
                              <div>
                                <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-2">{t.dosage}</p>
                                <p className="text-stone-600 font-medium">{p.dosage}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-black text-stone-400 tracking-[0.2em] mb-2">{t.instructions}</p>
                                <p className="text-stone-600 leading-relaxed">{p.instructions}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="space-y-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-serif font-light text-stone-800 mb-6 leading-tight">
                {t.history}
              </h2>
              <p className="text-stone-500 max-w-lg mx-auto leading-relaxed text-lg">
                Review your previous crop analysis and recommendations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {history.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-24 h-24 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                    <History className="w-10 h-10 text-stone-200" />
                  </div>
                  <p className="text-stone-400 font-medium">{t.noHistory}</p>
                </div>
              ) : (
                history.map((item) => (
                  <motion.button
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    key={item.id}
                    onClick={() => {
                      setImage(item.imageUrl);
                      setResult(item.result);
                      setActiveTab('scan');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex gap-5 p-6 rounded-[2.5rem] bg-white border border-stone-100 hover:border-green-200 hover:bg-green-50/30 transition-all text-left group shadow-sm"
                  >
                    <img src={item.imageUrl} className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-md" />
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <h4 className="font-bold text-stone-800 truncate group-hover:text-green-700 transition-colors text-lg mb-2">
                        {item.result.diseaseName}
                      </h4>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {(item.result.confidence * 100).toFixed(0)}% Match
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-stone-300 self-center group-hover:text-green-500 transition-all" />
                  </motion.button>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-2 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[90] border border-stone-100">
        <button
          onClick={() => setActiveTab('scan')}
          className={cn(
            "flex flex-col items-center gap-1 px-8 py-3 rounded-[2rem] transition-all active:scale-95",
            activeTab === 'scan' ? "bg-green-600 text-white shadow-lg shadow-green-200" : "text-stone-400 hover:text-stone-600"
          )}
        >
          <Camera className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Scan</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex flex-col items-center gap-1 px-8 py-3 rounded-[2rem] transition-all active:scale-95",
            activeTab === 'history' ? "bg-green-600 text-white shadow-lg shadow-green-200" : "text-stone-400 hover:text-stone-600"
          )}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-20 border-t border-stone-100 text-center mb-24 md:mb-0">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="bg-stone-100 p-2 rounded-xl">
            <Leaf className="w-5 h-5 text-stone-400" />
          </div>
          <span className="font-serif text-xl font-bold text-stone-800">{t.title}</span>
        </div>
        <p className="text-stone-400 text-sm max-w-xs mx-auto leading-relaxed">
          © {new Date().getFullYear()} {t.title} • Empowering farmers with AI technology.
        </p>
      </footer>

      {/* Chatbot */}
      <Chatbot language={language} />
    </div>
  );
}
