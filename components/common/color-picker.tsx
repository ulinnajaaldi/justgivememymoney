"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

type ColorPickerCustomProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (next: string) => void;
  predefinedColors?: string[];
  className?: string;
  "aria-describedby"?: string;
};

const DEFAULT_COLORS = [
  "#0a0a0a",
  "#ffffff",
  "#e11d48", // rose-600
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#a855f7", // purple-500 (accent use only)
  "#ec4899", // pink-500
  "#64748b", // slate-500
];

// Validate via the platform: supports most CSS color formats
function isValidCssColor(input: string): boolean {
  const v = input?.trim();
  if (!v) return false;
  // Fast path: try CSS.supports
  if (
    typeof CSS !== "undefined" &&
    typeof (CSS as any).supports === "function"
  ) {
    try {
      return (CSS as any).supports("color", v);
    } catch {
      // fallback below
    }
  }
  // Canvas fallback
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return false;
    ctx.fillStyle = "#000";
    const before = ctx.fillStyle;
    ctx.fillStyle = v;
    const after = ctx.fillStyle;
    return before !== after || v.toLowerCase() === "#000000";
  } catch {
    return false;
  }
}

// Normalize to a 7-char hex for <input type="color"> where possible.
// For non-hex inputs, we map to rgb via canvas then convert to hex.
function normalizeToHex(color: string, fallback = "#000000"): string {
  if (!color) return fallback;
  const v = color.trim();
  // Handle hex inputs
  if (v.startsWith("#")) {
    // Expand 3/4 hex to 6
    if (v.length === 4) {
      const r = v[1],
        g = v[2],
        b = v[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (v.length === 5) {
      // #RGBA -> ignore alpha, expand RGB
      const r = v[1],
        g = v[2],
        b = v[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    if (v.length === 7) return v.toLowerCase();
    if (v.length === 9) {
      // #RRGGBBAA -> strip alpha
      return `#${v.slice(1, 7)}`.toLowerCase();
    }
    // Unknown hex length, fallback
  }
  // Canvas approach for general colors -> returns normalized rgb(a)
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = v;
    const normalized = ctx.fillStyle; // often 'rgb(r, g, b)' or '#rrggbb'
    if (typeof normalized === "string") {
      if (normalized.startsWith("#")) {
        return normalizeToHex(normalized, fallback);
      }
      // Parse rgb/rgba
      const m = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (m) {
        const r = Math.max(0, Math.min(255, Number.parseInt(m[1], 10)));
        const g = Math.max(0, Math.min(255, Number.parseInt(m[2], 10)));
        const b = Math.max(0, Math.min(255, Number.parseInt(m[3], 10)));
        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    }
  } catch {
    // ignore
  }
  return fallback;
}

export function ColorPickerCustom({
  id,
  value,
  defaultValue = "",
  onChange,
  predefinedColors = DEFAULT_COLORS,
  className,
  ...rest
}: ColorPickerCustomProps) {
  const generatedId = React.useId();
  const inputId = id ?? `color-input-${generatedId}`;
  const [internal, setInternal] = React.useState<string>(value ?? defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as string) : internal;

  const [inputValue, setInputValue] = React.useState<string>(current);
  const [touched, setTouched] = React.useState(false);
  const valid = React.useMemo(() => isValidCssColor(inputValue), [inputValue]);

  React.useEffect(() => {
    if (isControlled) {
      setInputValue(value as string);
    }
  }, [isControlled, value]);

  const lastValidHex = React.useMemo(() => normalizeToHex(current), [current]);

  function commit(next: string) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInputValue(v);
    if (isValidCssColor(v)) {
      commit(v.trim());
    }
  }

  function handleBlur() {
    setTouched(true);
    // If invalid on blur, revert view to last committed valid value
    if (!valid) {
      setInputValue(current);
    }
  }

  function handleNativeColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value;
    setInputValue(hex);
    commit(hex);
  }

  function handleSwatchClick(c: string) {
    setInputValue(c);
    commit(c);
  }

  return (
    <div className={cn("w-full", className)}>
      <InputGroup>
        <InputGroupInput
          id={inputId}
          placeholder="e.g., #ff5733, rgb(255,87,51), hsl(14 100% 60%), tomato"
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          aria-invalid={touched && !valid ? "true" : "false"}
          {...rest}
        />
        <InputGroupAddon>
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <div
              aria-hidden
              className={cn("h-full w-full rounded-md border")}
              style={{ background: valid ? inputValue : current }}
              title={valid ? inputValue : current}
            />
          </div>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <input
            aria-label="Open native color picker"
            title="Open native color picker"
            type="color"
            value={lastValidHex}
            onChange={handleNativeColorChange}
            className={cn(
              "h-8 w-8 cursor-pointer rounded-md",
              "border-border p-0",
            )}
          />
        </InputGroupAddon>
      </InputGroup>

      {touched && !valid ? (
        <p
          role="alert"
          className={cn("text-destructive-foreground mt-2 text-xs")}
        >
          Enter a valid CSS color (hex, rgb, hsl, or a named color).
        </p>
      ) : null}

      {predefinedColors?.length ? (
        <div className="mt-4">
          <div className="text-muted-foreground mb-2 text-xs">
            Predefined colors
          </div>
          <ul className="grid grid-cols-5 gap-1 rounded-md bg-gray-50 p-2 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-8">
            {predefinedColors.map((c) => {
              const selected =
                isValidCssColor(c) &&
                isValidCssColor(current) &&
                normalizeToHex(c) === normalizeToHex(current);
              return (
                <li key={c} className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleSwatchClick(c)}
                    className={cn(
                      "h-7 w-7 rounded-md border transition-transform",
                      "border-border focus-visible:ring-ring hover:scale-105 focus-visible:ring-2 focus-visible:outline-none",
                      selected && "ring-ring ring-2",
                    )}
                    style={{ background: c }}
                    aria-label={`Choose ${c}`}
                    title={c}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default ColorPickerCustom;
