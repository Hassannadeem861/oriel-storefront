# Brand direction

The storefront currently runs under the temporary name **Oriel**. Every
occurrence of the name comes from `src/config/brand.js`; changing `brand.name`
there updates the logo wordmark, page titles, metadata, structured data and copy.

## Name proposals

| Name | Why it works | Watch-outs |
| --- | --- | --- |
| **Oriel** *(current)* | An oriel is a bay window: "a window onto well-made things". Short, easy to say in most languages, gives the arch logo mark its meaning. | Common English word; check trademark class 35 and domain availability. |
| **Kaivo** | Finnish for "well" (as in a water well): a source you return to. Two syllables, neutral pronunciation worldwide. | Check for existing apps/brands using the word. |
| **Aurel** | From Latin *aureus*, golden. Warm and premium without being loud. | Several small businesses use similar names; needs a distinctive suffix such as "Aurel Studio". |
| **Tessura** | Suggests *tessera*, a mosaic tile: many small, considered pieces forming a whole, which mirrors a curated catalog. | Three syllables; stress may vary by language. |
| **Morrow** | "Tomorrow" without the prefix: buying things that will still be good tomorrow. Soft, memorable, English-friendly. | Common surname; a distinctive logotype matters more here. |

These names have **not** been checked for trademark conflicts or domain
availability. Run a trademark search (USPTO, EUIPO, WIPO Global Brand Database)
and a domain/social-handle check before choosing.

## Visual identity

| Token | Value | Use |
| --- | --- | --- |
| Bone | `#F3EFE7` | Page background |
| Paper | `#FBF9F5` | Cards, panels |
| Ink | `#16140F` | Text, primary buttons |
| Muted ink | `#625B51` | Secondary text (5.8:1 on Bone) |
| Clay | `#A84A2A` | Accent, sale prices, focus ring (5.7:1 with white) |
| Moss | `#3F4A3C` | Confirmation and editorial panels |
| Night | `#12110E` | Footer, Glaze Lab |

- **Display type:** Instrument Serif (editorial headlines, large numerals)
- **UI type:** Manrope
- **Micro labels:** JetBrains Mono, uppercase, tracked (`.eyebrow`)
- **Mark:** a double arch (an oriel window), drawn in `src/components/common/Logo.jsx`

All colours are defined once as CSS variables in `src/app/globals.css` and
exposed to Tailwind through `@theme`, so components never hardcode colour values.
