"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

type TagInputProps = {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({
  label,
  placeholder,
  tags,
  onChange,
}: TagInputProps) {
  const [value, setValue] = useState("");

  const addTag = () => {
    const trimmed = value.trim();
    if (!trimmed || tags.includes(trimmed)) {
      setValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setValue("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="mt-1 flex gap-2">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 hover:bg-slate-700"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
