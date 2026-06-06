"use client";

import { useState } from "react";
import { useSession } from "@/context/SessionContext";
import Button from "@/components/shared/Button";
import IdeaCard from "./IdeaCard";
import AddIdeaForm from "./AddIdeaForm";

export default function IdeaList() {
  const { session, addIdea, deleteIdea, setStep, setScoringIdea } =
    useSession();
  const [adding, setAdding] = useState(false);

  const ideas = session.ideas;
  const scoredCount = ideas.filter((i) => i.quadrant !== null).length;

  const handleScore = (id: string) => {
    setScoringIdea(id);
    setStep("scoring");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Your Ideas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {ideas.length === 0
              ? "Add your first business idea to get started."
              : `${ideas.length} idea${ideas.length > 1 ? "s" : ""}, ${scoredCount} scored.`}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setStep("matrix")}
          disabled={scoredCount === 0}
        >
          View Matrix
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onScore={() => handleScore(idea.id)}
            onDelete={() => deleteIdea(idea.id)}
          />
        ))}
      </div>

      <div className="mt-6">
        {adding ? (
          <AddIdeaForm
            onAdd={(name, desc) => {
              addIdea(name, desc);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <Button onClick={() => setAdding(true)}>+ Add New Idea</Button>
        )}
      </div>
    </div>
  );
}
