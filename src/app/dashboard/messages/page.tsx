"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Briefcase, ChevronLeft, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Thread {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  jobSlug: string;
  companyName: string;
  companyLogo: string | null;
  role: "applicant" | "poster";
  status: string;
  appliedAt: string;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessageContent: string | null;
  otherParty: { fullName: string | null; email: string; avatarUrl: string | null } | null;
}

interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/messages/threads")
      .then((r) => r.json())
      .then((d) => { setThreads(Array.isArray(d) ? d : []); setLoadingThreads(false); })
      .catch(() => setLoadingThreads(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingMessages(true);
    fetch(`/api/messages?applicationId=${selected.applicationId}`)
      .then((r) => r.json())
      .then((d) => { setMessages(Array.isArray(d) ? d : []); setLoadingMessages(false); })
      .catch(() => setLoadingMessages(false));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selected || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      applicationId: selected.applicationId,
      senderId: session?.user?.id ?? "",
      content,
      readAt: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selected.applicationId, content }),
      });
      // refresh to get server-assigned ID
      const updated = await fetch(`/api/messages?applicationId=${selected.applicationId}`).then((r) => r.json());
      if (Array.isArray(updated)) setMessages(updated);
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  const threadName = (t: Thread) =>
    t.role === "applicant" ? t.companyName : (t.otherParty?.fullName ?? t.otherParty?.email ?? "Applicant");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
          <div className="flex h-full">
            {/* Thread list */}
            <div className={`w-full sm:w-80 border-r border-slate-100 flex flex-col ${selected ? "hidden sm:flex" : "flex"}`}>
              <div className="p-4 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-700">Conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingThreads ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
                ) : threads.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 font-medium">No conversations yet</p>
                    <p className="text-xs text-slate-400 mt-1">Apply to a job to start messaging</p>
                  </div>
                ) : (
                  threads.map((t) => (
                    <button
                      key={t.applicationId}
                      onClick={() => setSelected(t)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${selected?.applicationId === t.applicationId ? "bg-indigo-50 border-l-2 border-l-indigo-500" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={t.companyLogo ?? ""} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                            {threadName(t).slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className="text-sm font-semibold text-slate-800 truncate">{threadName(t)}</p>
                            {t.lastMessageAt && (
                              <span className="text-xs text-slate-400 shrink-0 ml-1">{formatTime(t.lastMessageAt)}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{t.jobTitle}</p>
                          {t.lastMessageContent && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">{t.lastMessageContent}</p>
                          )}
                        </div>
                        {t.unreadCount > 0 && (
                          <span className="shrink-0 h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                            {t.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message thread */}
            <div className={`flex-1 flex flex-col ${selected ? "flex" : "hidden sm:flex"}`}>
              {!selected ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Select a conversation</p>
                    <p className="text-sm text-slate-400 mt-1">Choose a thread on the left to read messages</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => setSelected(null)}
                      className="sm:hidden p-1 text-slate-400 hover:text-slate-600"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selected.companyLogo ?? ""} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                        {threadName(selected).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{threadName(selected)}</p>
                      <Link
                        href={`/jobs/${selected.jobSlug}`}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Briefcase className="h-3 w-3" />
                        {selected.jobTitle}
                      </Link>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingMessages ? (
                      <div className="text-center text-slate-400 text-sm py-8">Loading messages…</div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.senderId === session?.user?.id;
                        return (
                          <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-2.5 ${isOwn ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-indigo-200" : "text-slate-400"}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message…"
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || sending}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
