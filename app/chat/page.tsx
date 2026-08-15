"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppStore, Message } from "@/lib/store";
import { ArrowRight, Settings, Plus, Download, StopCircle, Edit2, RotateCcw, Copy } from "lucide-react";
import Link from "next/link";

type Model = {
  id: string;
  name: string;
  context_length: number;
};

export default function ChatPage() {
  const { apiKey, setApiKey, messages, setMessages, clearChat, systemPrompt } = useAppStore();
  const [inputKey, setInputKey] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchModel, setSearchModel] = useState("");
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [pendingReset, setPendingReset] = useState<{ index: number, content: string } | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchModels = async () => {
    setIsLoadingModels(true);
    setError(null);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      setModels(data.data || []);
      if (data.data?.length > 0) {
        setSelectedModel(data.data[0].id);
        setSearchModel(data.data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    if (apiKey && models.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchModels();
    }
  }, [apiKey, models.length]);

  const handleNewChatClick = () => {
    if (isGenerating) return;
    if (messages.length === 0) {
      clearChat();
    } else {
      setIsResetModalOpen(true);
    }
  };

  const handleSetKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      setApiKey(inputKey.trim());
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const sendMessage = async (e?: React.FormEvent, contextMessages?: Message[]) => {
    e?.preventDefault();
    const isNewMessage = !contextMessages;
    
    if (isNewMessage && (!inputMessage.trim() || !apiKey || !selectedModel || isGenerating)) return;
    if (!apiKey || !selectedModel || isGenerating) return;

    const payloadMessages = contextMessages ? [...contextMessages] : [...messages];
    
    if (isNewMessage) {
      const userMessage: Message = { role: "user", content: inputMessage.trim() };
      payloadMessages.push(userMessage);
      setInputMessage("");
    }

    setMessages(payloadMessages);
    setIsGenerating(true);
    setError(null);

    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    const apiPayload = [];
    if (systemPrompt) {
      apiPayload.push({ role: "system", content: systemPrompt });
    }
    apiPayload.push(...payloadMessages);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "Hyperion",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiPayload,
          stream: true,
        }),
        signal: currentSignal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        let errMsg = errData.error?.message || `HTTP ${res.status}`;
        if (res.status === 401) errMsg = "API KEY REJECTED. OpenRouter did not accept the supplied API key.";
        if (res.status === 429) errMsg = "RATE LIMITED. OpenRouter is temporarily limiting requests.";
        if (res.status === 402) errMsg = "REQUEST NOT AVAILABLE. Check your OpenRouter credits/account status.";
        throw new Error(errMsg);
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setMessages([...payloadMessages, { role: "assistant", content: "" }]);

      let done = false;
      let assistantMessage = "";
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (currentSignal.aborted) break;
        
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
            if (trimmedLine.startsWith("data: ")) {
              try {
                const data = JSON.parse(trimmedLine.slice(6));
                if (data.choices && data.choices[0].delta?.content) {
                  assistantMessage += data.choices[0].delta.content;
                  setMessages((prev) => {
                    if (prev.length > 0 && prev[prev.length - 1].role === "assistant") {
                      const latest = [...prev];
                      latest[latest.length - 1] = { ...latest[latest.length - 1], content: assistantMessage };
                      return latest;
                    }
                    return prev;
                  });
                }
              } catch {
                // Ignore parse errors for fragmented chunks
              }
            }
          }
        }
      }
    } catch (err: unknown) {
      if (!currentSignal.aborted) {
        if (err instanceof Error) {
          if (err.name !== "AbortError") {
            setError(err.message || "CONNECTION FAILED. Hyperion could not reach OpenRouter.");
          }
        } else {
          setError("An error occurred during generation");
        }
      }
    } finally {
      if (!currentSignal.aborted) {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleRetryUser = (index: number) => {
    if (isGenerating) return;
    const ctx = messages.slice(0, index + 1);
    sendMessage(undefined, ctx);
  };

  const handleRegenerateAssistant = (index: number) => {
    if (isGenerating) return;
    const ctx = messages.slice(0, index);
    sendMessage(undefined, ctx);
  };

  const startEdit = (index: number) => {
    if (isGenerating) return;
    setEditingIndex(index);
    setEditContent(messages[index].content);
  };

  const confirmEdit = (index: number, content: string) => {
    if (!content.trim()) return;
    if (messages.length > index + 1) {
      setPendingReset({ index, content });
      setEditingIndex(null);
    } else {
      executeEdit(index, content);
    }
  };

  const executeEdit = (index: number, content: string) => {
    setEditingIndex(null);
    setPendingReset(null);
    if (!content.trim()) return;
    const ctx = messages.slice(0, index);
    ctx.push({ role: "user", content: content.trim() });
    sendMessage(undefined, ctx);
  };

  const exportChat = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      model: selectedModel,
      systemPrompt,
      messages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hyperion-chat-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  if (!apiKey) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-border bg-surface p-8 shadow-2xl">
          <h2 className="text-xl font-bold tracking-tight mb-4 uppercase">OpenRouter API Key Required</h2>
          <p className="text-sm text-muted mb-8 leading-relaxed">
            Provide your OpenRouter API key to initialize the console. The key is stored in memory only and will be discarded when you close the tab.
          </p>
          <form onSubmit={handleSetKey} className="flex flex-col gap-4">
            <input 
              type="password"
              placeholder="sk-or-v1-..."
              className="bg-background border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors w-full"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-foreground text-background font-bold uppercase tracking-widest text-xs py-3 px-4 hover:bg-opacity-90 transition-opacity"
            >
              Connect
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-2 text-xs text-muted text-center">
            <p>
              Don&apos;t have a key? <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Get one from OpenRouter</a>.
            </p>
            <p className="opacity-70">
              By connecting, you agree to our <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold tracking-tight text-accent uppercase">Hyperion</Link>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          
          <div className="relative group flex items-center gap-2" ref={dropdownRef}>
            <input 
              type="text"
              value={searchModel}
              onChange={(e) => {
                setSearchModel(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Select Model..."
              className="bg-transparent border border-border px-2 py-1 text-sm font-mono focus:outline-none focus:border-accent w-[160px] sm:w-[280px] text-foreground/80 hover:text-foreground truncate"
              disabled={isGenerating}
            />
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-[240px] sm:w-[320px] max-h-60 overflow-y-auto bg-background border border-border shadow-2xl z-50 rounded-sm">
                {models
                  .filter(m => (m.name || m.id).toLowerCase().includes(searchModel.toLowerCase()) || m.id.toLowerCase().includes(searchModel.toLowerCase()))
                  .map(m => (
                    <div 
                      key={m.id}
                      className="px-3 py-2 text-xs font-mono text-foreground/80 hover:bg-foreground/10 hover:text-foreground cursor-pointer flex flex-col gap-0.5 border-b border-border/30 last:border-0"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur before click registers
                        setSelectedModel(m.id);
                        setSearchModel(m.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="font-bold truncate">{m.name || m.id.split('/').pop()}</span>
                      <span className="text-[10px] text-muted truncate opacity-70">{m.id}</span>
                    </div>
                  ))}
                  {models.filter(m => (m.name || m.id).toLowerCase().includes(searchModel.toLowerCase()) || m.id.toLowerCase().includes(searchModel.toLowerCase())).length === 0 && (
                    <div className="px-3 py-4 text-xs font-mono text-muted text-center italic">No models found</div>
                  )}
              </div>
            )}
          </div>
          {isLoadingModels && <span className="text-xs text-muted animate-pulse hidden sm:inline">Loading models...</span>}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleNewChatClick}
            disabled={isGenerating}
            className="flex items-center gap-2 text-xs font-mono uppercase text-muted hover:text-foreground transition-colors px-2 py-1 disabled:opacity-50"
            title="New Session"
          >
            <Plus size={14} /> <span className="hidden sm:inline">New Chat</span>
          </button>
          <button 
            onClick={exportChat}
            disabled={messages.length === 0}
            className="flex items-center gap-2 text-xs font-mono uppercase text-muted hover:text-foreground transition-colors px-2 py-1 disabled:opacity-50"
            title="Export JSON"
          >
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>
          <Link 
            href="/chat/settings"
            className={`flex items-center gap-2 text-xs font-mono uppercase text-muted hover:text-foreground transition-colors px-2 py-1 ${isGenerating ? 'pointer-events-none opacity-50' : ''}`}
            title="Settings & System Prompt"
          >
            <Settings size={14} />
          </Link>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 relative">
        {messages.length === 0 ? (
          <div className="m-auto text-center max-w-md text-muted font-mono text-sm">
            <div className="inline-block border border-border p-4 bg-surface/50 mb-4">
              SESSION ACTIVE
            </div>
            <p>System is ready. All messages are transmitted directly to OpenRouter. No history is stored by Hyperion.</p>
            {systemPrompt && (
               <p className="mt-4 text-accent border border-accent/20 bg-accent/5 p-2 text-xs uppercase">
                 System Prompt Active
               </p>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col group ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[100%] sm:max-w-[85%] text-sm relative ${msg.role === "user" ? "bg-surface border border-border text-foreground px-4 py-3" : "text-foreground/90 font-mono"}`}>
                  
                  {/* Assistant Header */}
                  {msg.role === "assistant" && (
                    <div className="text-[10px] uppercase tracking-widest text-muted mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 ${isGenerating && i === messages.length - 1 && !error ? 'bg-accent animate-pulse' : 'bg-muted'} rounded-full`}></div>
                        {selectedModel}
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                        <button onClick={() => copyToClipboard(msg.content)} className="hover:text-foreground transition-colors flex items-center gap-1" title="Copy">
                          <Copy size={12} /> <span className="hidden sm:inline">COPY</span>
                        </button>
                        {!isGenerating && (
                          <button onClick={() => handleRegenerateAssistant(i)} className="hover:text-foreground transition-colors flex items-center gap-1" title="Retry Response">
                            <RotateCcw size={12} /> <span className="hidden sm:inline">REGENERATE</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Header */}
                  {msg.role === "user" && (
                     <div className="text-[10px] uppercase tracking-widest text-muted mb-2 flex items-center justify-between gap-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                          {!isGenerating && (
                            <>
                              <button onClick={() => startEdit(i)} className="hover:text-foreground transition-colors flex items-center gap-1" title="Edit">
                                <Edit2 size={12} /> <span className="hidden sm:inline">EDIT</span>
                              </button>
                              <button onClick={() => handleRetryUser(i)} className="hover:text-foreground transition-colors flex items-center gap-1" title="Retry">
                                <RotateCcw size={12} /> <span className="hidden sm:inline">RETRY</span>
                              </button>
                            </>
                          )}
                        </div>
                        <span>USER</span>
                     </div>
                  )}

                  {editingIndex === i ? (
                    <div className="flex flex-col gap-3 min-w-[280px] sm:min-w-[400px]">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-background border border-border p-3 focus:outline-none focus:border-accent resize-y font-sans text-sm min-h-[100px]"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => setEditingIndex(null)}
                          className="px-4 py-1.5 border border-border hover:bg-background transition-colors text-[10px] uppercase tracking-widest font-bold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => confirmEdit(i, editContent)}
                          className="px-4 py-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-[10px] uppercase tracking-widest font-bold"
                        >
                          {messages.length > i + 1 ? "Edit & Reset" : "Edit & Send"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {msg.content === "" && isGenerating && i === messages.length - 1 ? (
                        <span className="animate-pulse">_</span>
                      ) : (
                        msg.content
                      )}
                    </div>
                  )}
                  
                </div>
              </div>
            ))}
            
            {error && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 text-sm font-mono mt-2">
                <div className="font-bold mb-1 uppercase tracking-widest text-xs">Error Detected</div>
                <div>{error}</div>
                {!isGenerating && messages.length > 0 && (
                  <button 
                    onClick={() => {
                      // Automatically detect if we should retry user or assistant based on last message
                      const lastMsg = messages[messages.length - 1];
                      if (lastMsg.role === "assistant" && !lastMsg.content) {
                        handleRegenerateAssistant(messages.length - 1);
                      } else {
                        // Usually if it's user, we can retry user
                        if (lastMsg.role === "user") {
                          handleRetryUser(messages.length - 1);
                        } else {
                          handleRegenerateAssistant(messages.length - 1);
                        }
                      }
                    }}
                    className="mt-3 px-4 py-2 border border-red-900/50 hover:bg-red-900/20 text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Retry Request
                  </button>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Composer */}
      <footer className="p-4 sm:p-6 bg-background border-t border-border shrink-0">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto relative flex gap-4">
          <textarea 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={isGenerating ? "Processing..." : "Initialize query..."}
            className="flex-1 bg-surface border border-border px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none min-h-[60px] max-h-[200px] font-sans disabled:opacity-50"
            rows={1}
            disabled={isGenerating}
          />
          <div className="flex flex-col gap-2 justify-end">
            {isGenerating ? (
              <button 
                type="button"
                onClick={stopGeneration}
                className="h-[60px] w-[60px] flex items-center justify-center bg-red-950/50 text-red-500 hover:bg-red-950 transition-colors border border-red-900/50 shrink-0"
                title="Stop Generation"
              >
                <StopCircle size={20} />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!inputMessage.trim()}
                className="h-[60px] w-[60px] flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                title="Send Message"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </form>
        <div className="max-w-4xl mx-auto mt-2 flex justify-between text-[10px] font-mono text-muted uppercase">
          <span>{systemPrompt ? 'SYS PROMPT: ACTIVE' : 'SYS PROMPT: DEFAULT'}</span>
          <span className="hidden sm:inline">ENTER TO SEND / SHIFT+ENTER FOR NEWLINE</span>
        </div>
      </footer>

      {/* Edit Confirmation Modal */}
      {pendingReset && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setPendingReset(null);
          }}
          tabIndex={-1}
        >
          <div className="bg-surface border border-border max-w-md w-full shadow-2xl relative font-mono text-sm flex flex-col">
            <div className="border-b border-border p-3 px-4 text-xs font-bold tracking-widest uppercase text-muted">
              Branch Control
            </div>
            <div className="p-6">
              <h2 id="edit-modal-title" className="text-accent font-bold mb-4 tracking-widest uppercase">
                Reset Conversation From This Point?
              </h2>
              <p className="text-foreground/90 mb-4 leading-relaxed">
                Editing this message will remove all messages after this point from the current session.
              </p>
              <p className="text-foreground/90 mb-6 leading-relaxed">
                The removed conversation is not saved by Hyperion and cannot be recovered. Export the conversation first if you want to keep the current version.
              </p>
              <p className="text-muted text-xs border border-border/50 bg-background/50 p-3 mb-8 uppercase tracking-widest">
                This creates a new in-memory branch from the selected turn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => setPendingReset(null)}
                  className="px-6 py-2 border border-border hover:bg-background transition-colors uppercase tracking-widest text-xs font-bold text-foreground text-center"
                  autoFocus
                >
                  Cancel
                </button>
                <button 
                  onClick={() => executeEdit(pendingReset.index, pendingReset.content)}
                  className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors uppercase tracking-widest text-xs font-bold text-center"
                >
                  Edit & Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {isResetModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsResetModalOpen(false);
          }}
          tabIndex={-1}
        >
          <div className="bg-surface border border-border max-w-md w-full shadow-2xl relative font-mono text-sm flex flex-col">
            <div className="border-b border-border p-3 px-4 text-xs font-bold tracking-widest uppercase text-muted">
              Session Control
            </div>
            <div className="p-6">
              <h2 id="reset-modal-title" className="text-accent font-bold mb-4 tracking-widest uppercase">
                Reset Current Session?
              </h2>
              <p className="text-foreground/90 mb-4 leading-relaxed">
                Starting a new chat will reset the current session. This conversation is not saved by Hyperion and cannot be recovered after reset.
              </p>
              <p className="text-foreground/90 mb-6 leading-relaxed">
                Make sure you have exported the conversation if you want to keep it.
              </p>
              <p className="text-muted text-xs border border-border/50 bg-background/50 p-3 mb-8 uppercase tracking-widest">
                New Chat does not create a stored session. It only clears the current memory.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-6 py-2 border border-border hover:bg-background transition-colors uppercase tracking-widest text-xs font-bold text-foreground text-center"
                  autoFocus
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    clearChat();
                    setIsResetModalOpen(false);
                  }}
                  className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors uppercase tracking-widest text-xs font-bold text-center"
                >
                  Reset Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
