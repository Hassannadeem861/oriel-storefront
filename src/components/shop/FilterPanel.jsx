"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-border py-6 first:pt-0">
      <legend className="mb-4 text-[13px] font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckList({ name, items, selected, onToggle }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => {
        const id = `${name}-${item.value}`;
        return (
          <li key={item.value} className="flex items-center gap-3">
            <Checkbox id={id} checked={selected.includes(item.value)} onCheckedChange={() => onToggle(item.value)} />
            <Label htmlFor={id} className="flex flex-1 cursor-pointer justify-between font-normal">
              {item.label}
              <span className="font-mono text-[11px] text-muted-foreground">{item.count}</span>
            </Label>
          </li>
        );
      })}
    </ul>
  );
}

/** Price slider with local state while dragging; committed to the URL on release. */
function PriceRange({ min, max, bounds, onChange }) {
  const [range, setRange] = useState([Number(min) || bounds[0], Number(max) || bounds[1]]);
  return (
    <>
      <Slider
        min={bounds[0]}
        max={bounds[1]}
        step={10}
        minStepsBetweenThumbs={1}
        value={range}
        onValueChange={setRange}
        onValueCommit={([lo, hi]) =>
          onChange({ min: lo > bounds[0] ? String(lo) : "", max: hi < bounds[1] ? String(hi) : "" })
        }
        thumbLabels={["Minimum price", "Maximum price"]}
      />
      <p className="mt-2 flex justify-between font-mono text-[12px] text-muted-foreground" aria-live="polite">
        <span>{formatPrice(range[0])}</span>
        <span>{formatPrice(range[1])}</span>
      </p>
    </>
  );
}

/** Controlled filter form; every change is written to the URL by the parent. */
export default function FilterPanel({ filters, facets, bounds, hideCategories, onChange }) {
  const toggleIn = (key, value) => {
    const list = filters[key];
    onChange({ [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] });
  };

  return (
    <div>
      {!hideCategories && (
        <Group title="Category">
          <CheckList name="cat" items={facets.categories} selected={filters.categories} onToggle={(v) => toggleIn("categories", v)} />
        </Group>
      )}
      <Group title="Price">
        {/* Keyed so the slider resets when the price filter is cleared elsewhere. */}
        <PriceRange key={`${filters.min}-${filters.max}`} min={filters.min} max={filters.max} bounds={bounds} onChange={onChange} />
      </Group>
      <Group title="Maker">
        <CheckList name="brand" items={facets.brands} selected={filters.brands} onToggle={(v) => toggleIn("brands", v)} />
      </Group>
      <Group title="Availability">
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <Checkbox id="f-sale" checked={filters.sale} onCheckedChange={(c) => onChange({ sale: Boolean(c) })} />
            <Label htmlFor="f-sale" className="cursor-pointer font-normal">On sale</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="f-stock" checked={filters.inStock} onCheckedChange={(c) => onChange({ inStock: Boolean(c) })} />
            <Label htmlFor="f-stock" className="cursor-pointer font-normal">In stock only</Label>
          </div>
        </div>
      </Group>
    </div>
  );
}
