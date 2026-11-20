import PageHeader from "./PageHeader";
import DemoNotice from "./DemoNotice";

/**
 * Shared layout for policy pages: header, sticky table of contents and
 * readable prose. `sections` is [{ id, title, body: ReactNode }].
 */
export default function PolicyPage({ title, description, updated, sections, crumb }) {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: crumb || title }]} eyebrow={`Last updated ${updated}`} title={title} description={description} />
      <div className="container-page grid gap-12 pb-24 lg:grid-cols-12">
        <nav aria-label="On this page" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-4">On this page</p>
            <ol className="grid gap-2 text-[14px]">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-3 text-muted-foreground transition-colors hover:text-ink">
                    <span className="font-mono text-[11px] leading-6">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <article className="prose-oriel lg:col-span-8 lg:col-start-5">
          <DemoNotice className="mb-10 not-prose">
            This policy is realistic sample content for a demo storefront. Have it reviewed by a legal professional before launch.
          </DemoNotice>
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
