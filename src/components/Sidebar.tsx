import React from "react";
import { Plus, Trash2, Sparkles, MessageSquare, Clock, Heart, ShieldAlert, AlignLeft, ChevronRight } from "lucide-react";
import { ConsultationSession } from "../types";

interface SidebarProps {
  sessions: ConsultationSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-[#3a3031]/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-rose-100 shadow-sm z-50 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-out flex flex-col h-full ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Banner Logo Section */}
        <div className="p-6 border-b border-rose-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-sky-400 flex items-center justify-center shadow-sm text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans text-xl font-bold tracking-tight text-slate-900">
                Skin<span className="text-rose-500 font-medium italic">Consult</span>
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Expert System v2.5
              </span>
            </div>
          </div>
          <button
            id="mobile-sidebar-close-btn"
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Start New Chat Action */}
        <div className="p-4">
          <button
            id="start-new-consultation-btn"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 transition-colors rounded-xl border border-rose-200 text-rose-600 font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 cursor-pointer" />
            New Consultation
          </button>
        </div>

        {/* Previous Consultation Logs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
          <div className="px-3 py-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-300" />
              Recent Sessions
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto stroke-1 mb-2 text-rose-100" />
              <p className="text-xs font-semibold">No previous consultations</p>
              <p className="text-[10px] mt-1 text-slate-400/80">Previous reports cataloged here</p>
            </div>
          ) : (
            <div className="space-y-1.5" id="consultation-sessions-list">
              {sessions.map((session) => {
                const isActive = session.id === activeSessionId;
                return (
                  <div
                    key={session.id}
                    id={`session-card-${session.id}`}
                    name={`session-card-${session.id}`}
                    className={`group relative rounded-xl p-3 cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? "bg-sky-50 border-sky-100 text-sky-700 shadow-xs"
                        : "bg-white hover:bg-slate-50 border-transparent hover:border-slate-100 text-slate-500"
                    }`}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start gap-2.5 pr-8">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isActive ? "bg-sky-100 text-sky-600" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {session.completed ? (
                          <Heart className="w-4 h-4 fill-current text-rose-400" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold truncate ${isActive ? "text-sky-900" : "text-slate-705"}`}>
                          {session.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <span>{session.date}</span>
                        </p>

                        {/* Badging the metrics */}
                        {(session.skinType || session.concerns?.length) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {session.skinType && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
                                {session.skinType}
                              </span>
                            )}
                            {session.concerns?.slice(0, 1).map((con) => (
                              <span
                                key={con}
                                className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100/30"
                              >
                                {con}
                              </span>
                            ))}
                            {session.concerns && session.concerns.length > 1 && (
                              <span className="text-[9px] font-medium px-1 text-slate-400">
                                +{session.concerns.length - 1}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete session button only visible on hover */}
                    <button
                      id={`delete-btn-${session.id}`}
                      name={`delete-btn-${session.id}`}
                      title="Delete log"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-rose-100 text-slate-400 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Doctor clinical bio block */}
        <div className="p-4 border-t border-rose-50 bg-rose-50/20 m-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-rose-100 flex items-center justify-center text-rose-400 shadow-xs relative shrink-0">
              <span className="font-sans text-sm font-bold text-rose-500">NS</span>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-white rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">Najwah's Lab</p>
              <p className="text-[10px] text-slate-500 font-medium truncate">Clinical Skincare System</p>
              <span className="inline-flex items-center gap-1 text-[9px] bg-rose-100 text-rose-750 px-1.5 py-0.5 rounded-full mt-1 font-bold">
                Expert AI Panel
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
