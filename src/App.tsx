import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { Message, ConsultationSession } from "./types";
import { getSkincareRecommendations } from "./data";
import { Menu, Sparkles } from "lucide-react";

const LOCAL_STORAGE_KEY = "skincare_expert_consultations_v2";

export default function App() {
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize: Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.error("Local storage loading error, starting fresh:", e);
    }

    // If no history, create an initial default session
    startNewSession();
  }, []);

  // Save history to localStorage whenever sessions change
  const saveSessionsToStorage = (updated: ConsultationSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist skincare sessions to localStorage:", e);
    }
  };

  // Helper: Create initial welcome messages
  const createWelcomeMessages = (): Message[] => {
    return [
      {
        id: "msg-welcome",
        sender: "assistant",
        text: "Hello! 🌸 Welcome to your personal Skincare Expert Consultation. I am your specialized formulation system.\n\nI will guide you through a step-by-step diagnostic journey to analyze your skin's behavior, isolate active concerns, review your current routine, and isolate ingredients to avoid, resulting in a curated regimen.\n\nWhenever you are ready, let's start!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ["Start Free Consultation ✨"]
      }
    ];
  };

  // Action: Launch a brand-new consultation
  const startNewSession = () => {
    const defaultTitle = `Consultation #${sessions.length + 1}`;
    const newSession: ConsultationSession = {
      id: `session-${Date.now()}`,
      title: defaultTitle,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      messages: createWelcomeMessages(),
      currentStep: 0,
      completed: false
    };

    const updated = [newSession, ...sessions];
    setActiveSessionId(newSession.id);
    saveSessionsToStorage(updated);
  };

  // Action: Select another previous session
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
  };

  // Action: Trash a previous session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    saveSessionsToStorage(updated);

    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        // Start a fresh one if everything was deleted
        const newSession: ConsultationSession = {
          id: `session-${Date.now()}`,
          title: "Consultation #1",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }),
          messages: createWelcomeMessages(),
          currentStep: 0,
          completed: false
        };
        setActiveSessionId(newSession.id);
        saveSessionsToStorage([newSession]);
      }
    }
  };

  // Action: Clear and start over active session
  const handleRestartSession = () => {
    if (!activeSessionId) return;
    const updated = sessions.map((s) => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: `Consultation #${sessions.indexOf(s) !== -1 ? sessions.length - sessions.indexOf(s) : sessions.length}`,
          skinType: undefined,
          concerns: undefined,
          messages: createWelcomeMessages(),
          currentStep: 0,
          completed: false
        };
      }
      return s;
    });
    saveSessionsToStorage(updated);
  };

  // Action: Receive and route user chat inputs
  const handleSendMessage = (text: string, isQuickReply: boolean = false) => {
    if (!activeSessionId) return;

    // Retrieve active session details
    const activeSession = sessions.find((s) => s.id === activeSessionId);
    if (!activeSession || activeSession.completed) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let nextStep = activeSession.currentStep;
    let botResponseText = "";
    let systemActions = {};

    // Calculate progression based on the user's input and step context
    if (activeSession.currentStep === 0) {
      // Transition from Welcome -> Skin Type Selection (Step 1)
      nextStep = 1;
      botResponseText = "Wonderful! Let's start with your skin's foundational behavior.\n\nHow does your skin feel most of the day? Please select your Skin Type from the card bento below, or write it down:";
    } else if (activeSession.currentStep === 1) {
      // Transition from Skin Type Selected -> Skin Concerns Question (Step 2)
      nextStep = 2;
      systemActions = { skinType: text };
      botResponseText = `Understood. You have selected "${text}" skin.\n\nNext, what target concerns are you trying to resolve? Select all applicable categories in the checkbox card below and confirm:`;
    } else if (activeSession.currentStep === 2) {
      // Transition from Skin Concerns Selected -> Current Products Routine (Step 3)
      const concernsList = text.split(", ").map((s) => s.trim());
      nextStep = 3;
      systemActions = { concerns: concernsList };
      botResponseText = `Excellent. We've cataloged your concerns as: ${text}.\n\nWhat skincare products are you currently using in your beauty routine? Checking your inventory helps me spot ingredient redundancies or collisions. Toggle what you use above, or specify:`;
    } else if (activeSession.currentStep === 3) {
      // Transition from Current Products Selected -> Avoid Ingredients (Step 4)
      nextStep = 4;
      botResponseText = `Got your current routine outline.\n\nLastly, are there any cosmetic ingredients you want to avoid? Drying Alcohols, Fragrances, Sulfates, or Parabens are common triggers. Select below or write them in:`;
    } else if (activeSession.currentStep === 4) {
      // We do not respond immediately; the transition is handled inside ChatArea.tsx via triggerFormulationSequence
      return;
    }

    const botMsg: Message = {
      id: `msg-bot-${Date.now() + 1}`,
      sender: "assistant",
      text: botResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active session timeline
    const updatedSessions = sessions.map((s) => {
      if (s.id === activeSessionId) {
        const messagesWithUser = [...s.messages, userMsg];
        const finalMessages = botResponseText ? [...messagesWithUser, botMsg] : messagesWithUser;
        
        // Dynamically update the session tab title if they select a skin type to make navigation meaningful
        let sessionTitle = s.title;
        if (activeSession.currentStep === 1) {
          sessionTitle = `${text} Skin Regimen`;
        }

        return {
          ...s,
          title: sessionTitle,
          currentStep: nextStep,
          messages: finalMessages,
          ...systemActions
        };
      }
      return s;
    });

    saveSessionsToStorage(updatedSessions);
  };

  // Action: Finish the consultation (Analyze inputs in the client & ping server-side Gemini)
  const handleCompleteConsultation = async (
    skinType: string,
    concerns: string[],
    currentProducts: string[],
    avoidIngredients: string[]
  ) => {
    if (!activeSessionId) return;

    try {
      const activeSession = sessions.find((s) => s.id === activeSessionId);
      if (!activeSession) return;

      // 1. Compute local rule-based match immediately (prevents any visual delay/failure)
      const localResults = getSkincareRecommendations(skinType, concerns, avoidIngredients);

      // 2. Prepare mock responses block for instant offline fallback
      let finalAnalysisText = `Based on your ${skinType} Skin Type and concerns targeting ${concerns.join(", ")}, we recommend incorporating focused botanical active serums rich in ${localResults.ingredients.map(i=>i.name).join(", ")}. These will work in harmony to calm irritation and boost barrier repair while you exclude ${avoidIngredients.join(", ")}.`;
      let finalTips = [
        "Store visual active serums in a cool, dark drawer to preserve active raw effectiveness.",
        "Always follow up active retinoids or acids with our Curated Barrier Moistures to keep water content sealed.",
        "Include a broad-spectrum mineral SPF 50+ sunscreen during morning steps to dodge sun sensitivity fires."
      ];

      // 3. Update the layout to showing loading state
      // We will perform a true fetch to Express `/api/consult`
      let isFallback = true;
      try {
        const res = await fetch("/api/consult", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            skinType,
            concerns,
            currentProducts,
            avoidIngredients,
            history: activeSession.messages.map(m => `${m.sender}: ${m.text}`)
          })
        });

        if (res.ok) {
          const apiData = await res.json();
          if (apiData.success) {
            finalAnalysisText = apiData.expertAnalysis;
            finalTips = apiData.tips;
            isFallback = apiData.isFallback;
          }
        }
      } catch (err) {
        console.warn("Backend consultation API failed. Falling back gracefully to client formulations:", err);
      }

      // Add a final product result message to the timeline
      const resultMessage: Message = {
        id: `msg-result-${Date.now()}`,
        sender: "assistant",
        text: `Consultation complete! 🎉 Here is your scientifically tailored clinical skincare routine overview. Our formulation module has analyzed your profile and drafted recommended ingredients and formulation product cards. Scroll down to review:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isResult: true,
        resultData: {
          skinType,
          concerns,
          currentProducts,
          avoidIngredients,
          recommendedIngredients: localResults.ingredients,
          recommendedProducts: localResults.products,
          expertAnalysis: finalAnalysisText,
          tips: finalTips,
          isFallback
        }
      };

      // Set active session finished
      const updated = sessions.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            completed: true,
            currentStep: 5,
            skinType,
            concerns,
            messages: [...s.messages, resultMessage]
          };
        }
        return s;
      });

      saveSessionsToStorage(updated);
    } catch (e) {
      console.error("Critical Consultation Completion Error:", e);
    }
  };

  // Find active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800" id="main-app-container">
      
      {/* Sidebar Panel Section */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={startNewSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Area Section */}
      {activeSession ? (
        <ChatArea
          activeSessionId={activeSessionId}
          messages={activeSession.messages}
          currentStep={activeSession.currentStep}
          completed={activeSession.completed}
          onSendMessage={handleSendMessage}
          onRestartSession={handleRestartSession}
          onToggleSidebar={() => setSidebarOpen(true)}
          onCompleteConsultation={handleCompleteConsultation}
        />
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-white" id="no-active-session">
          <Sparkles className="w-12 h-12 text-rose-300 animate-pulse mb-4" />
          <h4 className="text-sm font-bold text-slate-700">Loading consultation records...</h4>
          <p className="text-xs text-slate-400 mt-1">Please wait while the expert system synchronizes.</p>
        </div>
      )}

    </div>
  );
}
