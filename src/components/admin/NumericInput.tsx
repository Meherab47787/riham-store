"use client";

import { useRef } from "react";

interface NumericInputProps {
  id?: string;
  name: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export default function NumericInput({ id, name, defaultValue, min, max, step = 1, required }: NumericInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  function adjust(delta: number) {
    const input = ref.current;
    if (!input) return;
    const next = (parseFloat(input.value) || 0) + delta * step;
    if (min !== undefined && next < min) return;
    if (max !== undefined && next > max) return;
    input.value = String(next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  return (
    <div className="flex border border-border bg-input group focus-within:border-primary/40 transition-colors">
      <button
        type="button"
        onClick={() => adjust(-1)}
        tabIndex={-1}
        aria-label="Decrease"
        className="w-9 shrink-0 flex items-center justify-center border-r border-border text-foreground/30 hover:text-primary hover:bg-primary/5 transition-colors select-none"
      >
        <span className="text-base font-extralight leading-none">−</span>
      </button>

      <input
        ref={ref}
        id={id}
        name={name}
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        required={required}
        className="flex-1 min-w-0 bg-transparent text-foreground/80 text-xs tracking-[0.05em] px-3 py-2.5 text-center focus:outline-none"
      />

      <button
        type="button"
        onClick={() => adjust(1)}
        tabIndex={-1}
        aria-label="Increase"
        className="w-9 shrink-0 flex items-center justify-center border-l border-border text-foreground/30 hover:text-primary hover:bg-primary/5 transition-colors select-none"
      >
        <span className="text-base font-extralight leading-none">+</span>
      </button>
    </div>
  );
}
