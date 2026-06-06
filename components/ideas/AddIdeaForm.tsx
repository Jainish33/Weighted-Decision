"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";

interface Props {
  onAdd: (name: string, description: string) => void;
  onCancel: () => void;
}

export default function AddIdeaForm({ onAdd, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setName("");
    setDescription("");
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Idea name
      </label>
      <input
        type="text"
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Subscription coffee box"
        className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="A short description of the idea"
        className="mb-4 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!name.trim()}>
          Add Idea
        </Button>
      </div>
    </div>
  );
}
