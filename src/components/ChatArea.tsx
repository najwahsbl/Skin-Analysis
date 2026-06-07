import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Check,
  RotateCcw,
  Menu,
  Heart,
  Droplet,
  Flame,
  Activity,
  AlertTriangle,
  Layers,
  Sparkle,
  Dumbbell,
  Shield,
  HelpCircle,
  Clock,
  BriefcaseMedical,
  CheckSquare
} from "lucide-react";
import { Message } from "../types";
import {
  SKIN_TYPES,
  SKIN_CONCERNS,
  COMMON_PRODUCTS,
  INGREDIENTS_TO_AVOID_OPTIONS,
  getSkincareRecommendations
} from "../data";

interface ChatAreaProps {
  activeSessionId: string | null;
  messages: Message[];
  currentStep: number;
  completed: boolean;
  onSendMessage: (text: string, isQuickReply?: boolean) => void;
  onRestartSession: () => void;
  onToggleSidebar: () => void;
  onCompleteConsultation: (
    skinType: string,
    concerns: string[],
    currentProducts: string[],
    avoidIngredients: string[]
  ) => void;
}

export default function ChatArea({
  activeSessionId,
  messages,
  currentStep,
  completed,
  onSendMessage,
  onRestartSession,
  onToggleSidebar,
  onCompleteConsultation,
}: ChatAreaProps) {
  const [inputText, setInputText] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedCurrentProducts, setSelectedCurrentProducts] = useState<string[]>([]);
  const [selectedAvoidIngredients, setSelectedAvoidIngredients] = useState<string[]>([]);
  const [isFormulating, setIsFormulating] = useState(false);
  const [formulationProgress, setFormulationProgress] = useState(0);
  const [formulationStatus, setFormulationStatus] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isFormulating]);

  // Sync state if session restarts
  useEffect(() => {
    if (messages.length <= 1) {
      setSelectedSkinType(null);
      setSelectedConcerns([]);
      setSelectedCurrentProducts([]);
      setSelectedAvoidIngredients([]);
    }
  }, [messages]);

  // Calculate completion percentage:
  // Step 0: Welcome (0%)
  // Step 1: Skin Type (20%)
  // Step 2: Skin Concerns (40%)
  // Step 3: Current Products (60%)
  // Step 4: Avoid Ingredients (80%)
  // Step 5: Completed (100%)
  const percentage = Math.min(currentStep * 20, 100);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  // Step 1 Trigger selection
  const handleSkinTypeClick = (type: string) => {
    setSelectedSkinType(type);
    onSendMessage(type, true);
  };

  // Step 2 Concern manipulation
  const toggleConcern = (concernId: string) => {
    if (selectedConcerns.includes(concernId)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concernId));
    } else {
      setSelectedConcerns([...selectedConcerns, concernId]);
    }
  };

  const handleConcernsConfirm = () => {
    if (selectedConcerns.length === 0) {
      onSendMessage("No major concerns", true);
    } else {
      onSendMessage(selectedConcerns.join(", "), true);
    }
  };

  // Step 3 Products manipulation
  const toggleCurrentProduct = (product: string) => {
    if (selectedCurrentProducts.includes(product)) {
      setSelectedCurrentProducts(selectedCurrentProducts.filter((p) => p !== product));
    } else {
      setSelectedCurrentProducts([...selectedCurrentProducts, product]);
    }
  };

  const handleProductsConfirm = () => {
    const defaultResponse = selectedCurrentProducts.length === 0 ? "Minimal routine / None" : selectedCurrentProducts.join(", ");
    onSendMessage(defaultResponse, true);
  };

  // Step 4 Avoid ingredients logic
  const toggleAvoidIngredient = (ingredientId: string) => {
    if (selectedAvoidIngredients.includes(ingredientId)) {
      setSelectedAvoidIngredients(selectedAvoidIngredients.filter((i) => i !== ingredientId));
    } else {
      // If "None" is selected, clear everything else
      if (ingredientId === "None") {
        setSelectedAvoidIngredients(["None"]);
      } else {
        setSelectedAvoidIngredients(
          selectedAvoidIngredients.filter((i) => i !== "None").concat(ingredientId)
        );
      }
    }
  };

  const handleAvoidIngredientsConfirm = () => {
    const listToExclude = selectedAvoidIngredients.length === 0 ? ["None"] : selectedAvoidIngredients;
    onSendMessage(listToExclude.join(", "), true);

    // Now start the consultation formulation sequence!
    triggerFormulationSequence(listToExclude);
  };

  const triggerFormulationSequence = (excludeList: string[]) => {
    setIsFormulating(true);
    setFormulationProgress(5);
    setFormulationStatus("Analyzing epidermal lipid matrix...");

    const statuses = [
      { prg: 25, title: "Analyzing epidermal lipid matrix..." },
      { prg: 50, title: "Formulating matched ingredient compounds..." },
      { prg: 75, title: "Reviewing active routine synergies..." },
      { prg: 90, title: "Generating curated dermatologist report..." },
      { prg: 100, title: "Recipes ready!" }
    ];

    statuses.forEach((st, idx) => {
      setTimeout(() => {
        setFormulationProgress(st.prg);
        setFormulationStatus(st.title);
        if (st.prg === 100) {
          setTimeout(() => {
            setIsFormulating(false);
            // Complete consultation with state
            onCompleteConsultation(
              selectedSkinType || "Combination",
              selectedConcerns,
              selectedCurrentProducts,
              excludeList
            );
          }, 600);
        }
      }, (idx + 1) * 600); // Progress updates nicely over ~3 seconds
    });
  };

  // Displaying beautiful labels for types
  const getSkinTypeIcon = (type: string) => {
    switch (type) {
      case "Oily":
        return <Flame className="w-5 h-5 text-amber-500" />;
      case "Dry":
        return <Droplet className="w-5 h-5 text-blue-400" />;
      case "Combination":
        return <Layers className="w-5 h-5 text-teal-400" />;
      case "Sensitive":
        return <Shield className="w-5 h-5 text-rose-400" />;
      default:
        return <Droplet className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] relative overflow-hidden" id="chat-workspace">
      
      {/* Top Professional Header Panel */}
      <header className="px-6 py-4 bg-white border-b border-rose-50 flex items-center justify-between shadow-xs shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
            title="Open history panel"
          >
            <Menu className="w-5 h-5 cursor-pointer" />
          </button>
          
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-extrabold bg-[#FFF2F4] px-2.5 py-0.5 rounded-full mb-1">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Skincare Clinical Consultation
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Skin Formulation Lab
              </h2>
              {completed && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                  <Check className="w-3 h-3" /> Ready
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Start over button inside the header */}
        <div className="flex items-center gap-3">
          {messages.length > 1 && (
            <button
              id="reset-active-session-btn"
              onClick={onRestartSession}
              className="px-3 py-1.5 rounded-lg border border-rose-100 hover:border-rose-200 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/40 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}
        </div>
      </header>

      {/* Modern consultation progress bar */}
      <div className="w-full bg-slate-100 h-2 relative shrink-0">
        <div
          className="bg-gradient-to-r from-rose-400 to-sky-400 h-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute right-4 top-3 text-[10px] font-bold text-sky-500 tracking-wider">
          {percentage}% Complete
        </div>
      </div>

      {/* Main scrolling dialog space */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:p-6 custom-scrollbar space-y-6">
        
        {/* Welcome branding card shown when list is brief */}
        {messages.length <= 1 && (
          <div className="max-w-2xl mx-auto block bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 text-center shadow-sm mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-sky-400 flex items-center justify-center mx-auto mb-6 text-white shadow-md">
              <Bot className="w-8 h-8 strike-1" />
            </div>
            <h3 className="font-sans text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Dermatology Expert Formulation System
            </h3>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-lg mx-auto font-medium">
              Our clinical AI guides you through skin analysis, target concerns, 
              current routine checking, and ingredient exclusions to formulate 
              curated solutions tailored specifically for your lipid barrier.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-sky-50 border border-sky-100 px-3.5 py-1.5 rounded-full">
                <Shield className="w-4 h-4 text-emerald-500" />
                Sensitive Friendly
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-sky-50 border border-sky-100 px-3.5 py-1.5 rounded-full">
                <Layers className="w-4 h-4 text-blue-500" />
                Active Formulation
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-rose-50 border border-rose-100 px-3.5 py-1.5 rounded-full">
                <Sparkle className="w-4 h-4 text-amber-500" />
                100% Custom
              </div>
            </div>
          </div>
        )}

        {/* Message timeline list */}
        <div className="max-w-3xl mx-auto space-y-6" id="messages-list">
          {messages.map((msg, index) => {
            const isAI = msg.sender === "assistant";
            return (
              <div key={msg.id} className="space-y-2">
                <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${isAI ? "" : "flex-row-reverse"}`}>
                    
                    {/* Avatar Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      isAI 
                        ? "bg-sky-100 text-sky-600 border-sky-250 font-bold shadow-sm" 
                        : "bg-rose-100 text-rose-500 border-white font-bold shadow-sm"
                    }`}>
                      {isAI ? <span className="text-xs">AI</span> : <User className="w-5 h-5 shrink-0" />}
                    </div>

                    {/* Chat Bubble Card */}
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        isAI
                          ? "bg-sky-50 text-slate-705 border border-sky-100 shadow-sm rounded-tl-none animate-fade-in"
                          : "bg-rose-500 text-white shadow-lg shadow-rose-100/50 rounded-tr-none"
                      }`}>
                        
                        {/* Render simple text containing lines nicely */}
                        <div className="whitespace-pre-wrap font-sans font-medium text-slate-700 select-text" style={!isAI ? {color: 'white'} : {}}>
                          {msg.text}
                        </div>

                      </div>
                      
                      {/* Message Timestamp */}
                      <p className={`text-[9px] text-slate-400 font-medium px-1.5 ${!isAI ? "text-right" : ""}`}>
                        {msg.timestamp}
                      </p>
                    </div>

                  </div>
                </div>

                {/* STEPS - Render interactive panels INLINE inside the timeline directly under corresponding AI question */}
                
                {/* Step 1: Skin Type Grid */}
                {isAI && currentStep === 1 && index === messages.length - 1 && (
                  <div className="ml-12 mr-4 mt-2 max-w-xl animate-fade-in" id="skin-type-picker-grid">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SKIN_TYPES.map((type) => (
                        <button
                          key={type.id}
                          id={`skin-type-btn-${type.id}`}
                          onClick={() => handleSkinTypeClick(type.id)}
                          className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-sky-300 hover:bg-sky-50/40 text-left transition-all group flex items-start gap-3 shadow-sm hover:shadow-md cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-white flex items-center justify-center border border-slate-100/60 transition-colors shrink-0">
                            {getSkinTypeIcon(type.id)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{type.name}</p>
                            <p className="text-[10px] text-slate-500 leading-normal mt-1 font-semibold">{type.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Skin Concerns Multiple Checkbox Panel */}
                {isAI && currentStep === 2 && index === messages.length - 1 && (
                  <div className="ml-12 mr-4 mt-2 max-w-xl bg-white border border-rose-100 p-5 rounded-2xl shadow-sm animate-fade-in" id="skin-concerns-checkbox-panel">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-3 mb-4">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-sky-500" />
                        Select Concerns (Pick Multiple)
                      </span>
                      <span className="text-[10px] bg-sky-50 font-bold text-sky-600 px-2.5 py-0.5 rounded-full border border-sky-100/40">
                        {selectedConcerns.length} Selected
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {SKIN_CONCERNS.map((con) => {
                        const checked = selectedConcerns.includes(con.id);
                        return (
                          <div
                            key={con.id}
                            onClick={() => toggleConcern(con.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              checked
                                ? "bg-sky-50/50 border-sky-200"
                                : "bg-white border-slate-100 hover:bg-[#FAF9F6]"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                checked ? "bg-sky-500 border-sky-500 text-white" : "border-slate-300 bg-white"
                              }`}>
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{con.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-semibold">{con.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      id="confirm-skin-concerns-btn"
                      onClick={handleConcernsConfirm}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Confirm Concerns
                    </button>
                  </div>
                )}

                {/* Step 3: Current Products Panel Checkboxes */}
                {isAI && currentStep === 3 && index === messages.length - 1 && (
                  <div className="ml-12 mr-4 mt-2 max-w-xl bg-white border border-rose-100 p-5 rounded-2xl shadow-sm animate-fade-in" id="current-products-selector-panel">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-3 mb-4">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-rose-505" />
                        My Skincare Active Inventory
                      </span>
                      <span className="text-[10px] bg-rose-50 font-bold text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-100/40">
                        {selectedCurrentProducts.length} Activated
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {COMMON_PRODUCTS.map((prod) => {
                        const checked = selectedCurrentProducts.includes(prod);
                        return (
                          <button
                            key={prod}
                            onClick={() => toggleCurrentProduct(prod)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                              checked
                                ? "bg-rose-500 text-white border-rose-400 shadow-sm"
                                : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                            }`}
                          >
                            {prod}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2 mt-4 pt-1">
                      <button
                        id="confirm-current-products-btn"
                        onClick={handleProductsConfirm}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Confirm Current Regimen
                      </button>
                      <p className="text-[9px] text-slate-400 text-center font-semibold">
                        Tip: You can also write down your exact brand products in the chat input below!
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Ingredients to Avoid Options Panel */}
                {isAI && currentStep === 4 && index === messages.length - 1 && (
                  <div className="ml-12 mr-4 mt-2 max-w-xl bg-white border border-rose-100 p-5 rounded-2xl shadow-sm animate-fade-in" id="exclusions-selector-panel">
                    <div className="flex items-center justify-between border-b border-rose-50 pb-3 mb-4">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Ingredient Exclusion Filters
                      </span>
                      <span className="text-[10px] bg-amber-50 font-bold text-amber-600 px-2.5 py-0.5 rounded-full border border-amber-100">
                        {selectedAvoidIngredients.length} Excluded
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {INGREDIENTS_TO_AVOID_OPTIONS.map((ing) => {
                        const checked = selectedAvoidIngredients.includes(ing.id);
                        return (
                          <div
                            key={ing.id}
                            onClick={() => toggleAvoidIngredient(ing.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              checked
                                ? "bg-amber-50/30 border-amber-200"
                                : "bg-white border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                checked ? "bg-amber-500 border-amber-500 text-white" : "border-slate-300 bg-white"
                              }`}>
                                {checked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-700">{ing.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{ing.desc}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      id="confirm-exclusions-btn"
                      onClick={handleAvoidIngredientsConfirm}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 cursor-pointer animate-spin" style={{ animationDuration: '3s' }} />
                      Formulate My Personal Regimen
                    </button>
                  </div>
                )}

                {/* Final Diagnostic prescription report block */}
                {msg.isResult && msg.resultData && (
                  <div className="mt-4 max-w-3xl animate-fade-in" id="dermatological-clinic-report">
                    <div className="bg-white border-2 border-rose-100/80 rounded-3xl overflow-hidden shadow-md">
                      
                      {/* Clinical Banner */}
                      <div className="bg-gradient-to-r from-[#FFF6F7] to-[#F3F8FF] p-6 border-b border-[#FEE5E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-[#FFCCD2] flex items-center justify-center text-rose-500 shadow-xs shrink-0">
                            <BriefcaseMedical className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-serif text-lg font-bold text-slate-800 leading-tight">
                              Regimen Formulation & Diagnostic Chart
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                              Custom Lab Formulation for {msg.resultData.skinType} Skin
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded-full">
                            Type: {msg.resultData.skinType}
                          </span>
                          {msg.resultData.concerns.map((con) => (
                            <span
                              key={con}
                              className="text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-500 px-2.5 py-1 rounded-full"
                            >
                              {con}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Dermatological Analysis signed block */}
                      <div className="p-6 border-b border-slate-50 bg-[#FFFAFA]/30">
                        <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                          AI Derm-Scan Consultation Assessment
                        </h5>
                        
                        <div className="text-xs text-slate-600 leading-relaxed font-medium bg-white border border-[#FAECEE] p-4 rounded-xl shadow-xs">
                          {msg.resultData.expertAnalysis}
                        </div>

                        {/* Lifestyle / clinical staging tips */}
                        {msg.resultData.tips && msg.resultData.tips.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              Therapeutic Application Guidelines & Lifestyle Staging
                            </h6>
                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {msg.resultData.tips.map((tip, idx) => (
                                <li key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-normal font-medium flex items-start gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-rose-100/60 text-rose-500 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Recommended Ingredients with benefits */}
                      <div className="p-6 border-b border-slate-50">
                        <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                          <Sparkle className="w-4 h-4 text-emerald-400" />
                          Target Active Ingredients Recommended
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="ingredients-recommendations-list">
                          {msg.resultData.recommendedIngredients.length === 0 ? (
                            <p className="text-xs text-slate-400 col-span-2">No specific ingredients targeted.</p>
                          ) : (
                            msg.resultData.recommendedIngredients.map((ing) => (
                              <div
                                key={ing.name}
                                className="bg-[#FAFBFD] hover:bg-gradient-to-r hover:from-blue-50/10 hover:to-white p-4 rounded-xl border border-slate-100/80 hover:border-blue-100 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100/50 mb-2">
                                    <span className="text-xs font-bold text-slate-800">{ing.name}</span>
                                    <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">
                                      Primary Active
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-normal mb-2.5">
                                    {ing.description}
                                  </p>
                                </div>
                                <div className="space-y-1 mt-1">
                                  {ing.benefits.map((ben: string, bIdx: number) => (
                                    <div key={bIdx} className="flex items-center gap-1.5">
                                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                      <span className="text-[10px] text-slate-600 font-semibold">{ben}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Recommended Skincare Products and Category breakdown in Cards */}
                      <div className="p-6 bg-slate-50/50">
                        <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                          <Droplet className="w-4 h-4 text-blue-400" />
                          Curated Skincare Prescription Cards
                        </h5>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" id="products-recommendations-cards">
                          {msg.resultData.recommendedProducts.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl col-span-2 font-semibold text-xs">
                              No products matching parameters. Let's adjust exclusions.
                            </div>
                          ) : (
                            msg.resultData.recommendedProducts.map((prod, pIdx) => (
                              <div
                                key={prod.id}
                                className={`bg-white rounded-2xl border ${
                                  pIdx % 2 === 0 ? "border-rose-100" : "border-sky-100"
                                } hover:border-pink-300 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col h-full group`}
                              >
                                {/* Thumbnail */}
                                <div className="h-44 bg-slate-100 relative overflow-hidden shrink-0">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                                      pIdx % 2 === 0
                                        ? "bg-rose-50 border border-rose-100 text-rose-600"
                                        : "bg-sky-50 border border-sky-100 text-sky-600"
                                    }`}>
                                      {prod.category}
                                    </span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                                      prod.useTime === "Morning" 
                                        ? "bg-amber-50 text-amber-600 border border-amber-200" 
                                        : prod.useTime === "Night" 
                                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100" 
                                        : "bg-teal-50 text-teal-600 border border-teal-100"
                                    }`}>
                                      {prod.useTime}
                                    </span>
                                  </div>
                                  <div className="absolute bottom-2 right-2">
                                    <span className="text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded-md">
                                      {prod.priceRange}
                                    </span>
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="mb-1">
                                      <span className={`text-[10px] uppercase tracking-wider font-extrabold ${pIdx % 2 === 0 ? "text-rose-500" : "text-sky-500"}`}>
                                        {prod.brand}
                                      </span>
                                    </div>
                                    <h6 className="text-xs font-bold text-slate-900 leading-snug">
                                      {prod.name}
                                    </h6>
                                    
                                    {/* Key actives list */}
                                    <div className="mt-2.5 mb-3 flex flex-wrap gap-1">
                                      {prod.keyIngredients.map((ki) => (
                                        <span key={ki} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">
                                          {ki}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Benefits snippet */}
                                    <div className="space-y-1">
                                      {prod.benefits.map((ben, bIdx) => (
                                        <div key={bIdx} className="flex items-start gap-1">
                                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                                          <span className="text-[10px] text-slate-600 leading-normal font-semibold">{ben}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Suitable types bottom banner */}
                                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400">
                                    <span className="font-semibold">Skin compatibility:</span>
                                    <div className="flex gap-1">
                                      {prod.suitableSkinTypes.slice(0, 2).map((st) => (
                                        <span key={st} className="font-bold text-slate-500">
                                          {st}
                                        </span>
                                      ))}
                                      {prod.suitableSkinTypes.length > 2 && <span>+</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Doctor Clinical Signoff Stamp */}
                      <div className="p-6 bg-rose-50/10 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-rose-500 fill-current" />
                          <p className="text-xs text-slate-500 font-semibold text-center sm:text-left">
                            Formulated dynamically with care by your SkinClinic Expert Agent.
                          </p>
                        </div>
                        <button
                          id="reset-consultation-final-btn"
                          onClick={onRestartSession}
                          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 font-sans font-bold text-xs text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Consult Again / Start New
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })}

          {/* Clincal Formulation Progress View */}
          {isFormulating && (
            <div className="flex justify-start animate-fade-in" id="formulation-progress-card">
              <div className="flex gap-3 max-w-[85%] w-full">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 border border-sky-200 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  AI
                </div>
                
                <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-sm w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-850 animate-pulse">
                      {formulationStatus}
                    </span>
                    <span className="text-xs font-bold text-sky-505">
                      {formulationProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-rose-400 to-sky-400 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${formulationProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Applying dermatologist rulesets and running biological scan... Please wait.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subtle clinical Typing Indicator */}
          {!isFormulating && messages.length > 0 && messages[messages.length - 1].sender === "user" && !completed && (
            <div className="flex justify-start" id="typing-indicator">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 border border-sky-200 flex items-center justify-center font-bold">
                  AI
                </div>
                <div className="bg-sky-50 border border-sky-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-sky-455 rounded-full typing-dot animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-sky-455 rounded-full typing-dot animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-sky-455 rounded-full typing-dot animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* FOOTER INPUT AREA */}
      <footer className="p-4 bg-white border-t border-rose-50 shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          
          {/* Quick-reply buttons just above footer */}
          {!completed && messages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 justify-center" id="active-quick-replies-list">
              {/* If step 0 (Welcome stage), offer Start button */}
              {currentStep === 0 && (
                <button
                  id="welcome-start-btn"
                  onClick={() => onSendMessage("Start Free Consultation ✨", true)}
                  className="px-5 py-3 bg-rose-500 text-white font-sans font-bold text-xs rounded-xl shadow-md hover:bg-rose-600 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                  Start Free Consultation ✨
                </button>
              )}
            </div>
          )}

          {/* Standard Input Form */}
          <form onSubmit={handleSend} className="flex gap-2" id="chat-input-form">
            <input
              id="message-input-textbox"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                completed
                  ? "Regimen formulated. Start over above if you want a new log."
                  : currentStep === 2
                  ? "Click 'Confirm Concerns' in the timeline or type here..."
                  : currentStep === 3
                  ? "Type products you currently use or use the checklist card above..."
                  : currentStep === 4
                  ? "Type ingredients to dodge or check options above..."
                  : "Type your skincare query or answer here..."
              }
              disabled={completed || isFormulating}
              className="flex-1 px-5 py-4.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400 text-sm bg-slate-50 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
            />
            <button
              id="send-message-btn"
              type="submit"
              disabled={!inputText.trim() || completed || isFormulating}
              className="px-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all font-bold flex items-center justify-center shrink-0 cursor-pointer gap-2"
              title="Send Message"
            >
              Send <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Subtle medical safe regulatory footer advice */}
          <p className="text-[9px] text-slate-400 mt-3 text-center select-none font-extrabold uppercase tracking-[0.15em]">
            Dermatological Intelligence v2.0 • Clean Formula
          </p>
        </div>
      </footer>

    </div>
  );
}
