"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { systemPrompt, setSystemPrompt, presets, savePreset, deletePreset } = useAppStore();
  const [promptInput, setPromptInput] = useState(systemPrompt);
  const [presetName, setPresetName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleApply = () => {
    setSystemPrompt(promptInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (presetName.trim() && promptInput.trim()) {
      savePreset(presetName.trim(), promptInput.trim());
      setPresetName("");
    }
  };

  const loadPreset = (prompt: string) => {
    setPromptInput(prompt);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <header className="h-14 border-b border-border flex items-center px-4 shrink-0 bg-background/90 backdrop-blur-sm z-10 gap-4">
        <Link 
          href="/chat" 
          className="text-muted hover:text-foreground transition-colors p-2"
          title="Back to Chat"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-mono text-sm tracking-widest text-accent uppercase font-bold">
          System Configuration
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-10">
          
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-sm font-bold uppercase tracking-widest">Active System Prompt</h2>
              {saveSuccess && <span className="text-xs text-green-500 font-mono flex items-center gap-1"><CheckCircle2 size={12}/> APPLIED</span>}
            </div>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              Define the core behavior and identity of the AI model. Changes here apply only to the current session and future requests until cleared.
            </p>
            <textarea
              className="w-full h-48 bg-surface border border-border p-4 text-sm font-mono focus:outline-none focus:border-accent resize-y mb-4"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="You are a helpful assistant..."
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApply}
                className="bg-foreground text-background font-bold text-xs uppercase tracking-widest px-6 py-2 hover:bg-foreground/90 transition-colors text-center"
              >
                Apply to Session
              </button>
              <button
                onClick={() => {
                  setPromptInput("");
                  setSystemPrompt("");
                }}
                className="border border-border text-foreground font-bold text-xs uppercase tracking-widest px-6 py-2 hover:bg-surface transition-colors text-center"
              >
                Clear
              </button>
            </div>
          </section>

          <div className="h-px w-full bg-border"></div>

          <section>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest mb-4">Save Current as Preset</h2>
            <form onSubmit={handleSavePreset} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Preset Name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="flex-1 bg-surface border border-border px-4 py-2 text-sm font-mono focus:outline-none focus:border-accent"
                required
              />
              <button
                type="submit"
                disabled={!promptInput.trim()}
                className="border border-border text-foreground font-bold text-xs uppercase tracking-widest px-6 py-2 hover:bg-surface transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save
              </button>
            </form>
          </section>

          <section>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest mb-4">Saved Presets</h2>
            {presets.length === 0 ? (
              <p className="text-xs text-muted font-mono border border-dashed border-border p-4 text-center">
                NO PRESETS FOUND
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presets.map(preset => (
                  <div key={preset.id} className="border border-border bg-surface p-4 flex flex-col justify-between group">
                    <div className="mb-4">
                      <h3 className="font-bold text-sm mb-2">{preset.name}</h3>
                      <p className="text-xs text-muted font-mono truncate">{preset.prompt}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <button
                        onClick={() => loadPreset(preset.prompt)}
                        className="text-xs font-mono uppercase text-accent hover:text-accent/80 transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="text-muted hover:text-red-500 transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
