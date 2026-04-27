import { Container } from "@/components/ui/Container";

const clients = [
  "CareConnect Live",
  "SaveYours",
  "Entrusted Home Healthcare",
  "Rift Valley Transportation",
  "Oromo Platform",
  "Arsi Tech Group",
];

export function HomeLogoBar() {
  return (
    <section className="border-y border-cimaa-border bg-white">
      <Container>
        <div className="py-8 md:py-12 mx-auto max-w-6xl flex flex-col items-center gap-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cimaa-text-subtle">
            Trusted by
          </span>

          <div
            className="group relative w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div className="flex w-max animate-scroll-x group-hover:[animation-play-state:paused]">
              {[...clients, ...clients].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="mx-10 shrink-0 text-sm font-semibold text-cimaa-text-muted/80 grayscale whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
