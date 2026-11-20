"use client";

import { cn } from "@/lib/utils";

/**
 * Accessible option picker (radio group semantics). Swatches for colours,
 * pills for sizes and other options. Unavailable values are disabled.
 */
export default function VariantPicker({ options, selections, onChange, idPrefix = "opt" }) {
  if (!options?.length) return null;
  return (
    <div className="grid gap-6">
      {options.map((option) => {
        const selected = option.values.find((v) => v.value === selections[option.name]);
        const isSwatch = option.values.every((v) => v.swatch);
        const labelId = `${idPrefix}-${option.name}`;
        return (
          <fieldset key={option.name}>
            <legend id={labelId} className="mb-3 flex gap-2 text-[13px]">
              <span className="font-semibold">{option.name}</span>
              <span className="text-muted-foreground">{selected?.label}</span>
            </legend>
            <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2">
              {option.values.map((v) => {
                const active = selections[option.name] === v.value;
                const disabled = v.available === false;
                return (
                  <button
                    key={v.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`${v.label}${disabled ? " (sold out)" : ""}`}
                    disabled={disabled}
                    onClick={() => onChange({ ...selections, [option.name]: v.value })}
                    className={cn(
                      "relative transition-all duration-200 disabled:cursor-not-allowed",
                      isSwatch
                        ? "grid size-10 place-items-center rounded-full ring-1 ring-ink/10 ring-offset-2 ring-offset-bone"
                        : "h-11 min-w-12 rounded-full border px-4 text-[13px] font-semibold",
                      isSwatch && active && "ring-2 ring-ink",
                      !isSwatch && (active ? "border-ink bg-ink text-paper" : "border-ink/15 hover:border-ink"),
                      disabled && "opacity-40"
                    )}
                  >
                    {isSwatch ? (
                      <span className="size-8 rounded-full" style={{ backgroundColor: v.swatch }} aria-hidden="true" />
                    ) : (
                      v.label
                    )}
                    {disabled && (
                      <span className="absolute inset-0 m-auto h-px w-[70%] rotate-[-30deg] bg-ink/60" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
