import { Container } from "@/components/ui/section";
import { quickWhatsappLink } from "@/lib/booking";
import { disciplines } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const services = [
  { label: "Full project builds", href: "#build" },
  { label: "CAD & mechanical design", href: "#build" },
  { label: "ANSYS & simulation", href: "#build" },
  { label: "Fabrication & welding", href: "#build" },
  { label: "Electronics & robotics", href: "#build" },
  { label: "Research & collaboration", href: "#build" },
];

const elsewhere = [
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  {
    label: "Web portfolio",
    href: siteConfig.links.devPortfolio,
    external: true,
  },
  {
    label: "Engineering portfolio",
    href: siteConfig.links.engPortfolio,
    external: true,
  },
  { label: "WhatsApp", href: quickWhatsappLink(), external: true },
  { label: siteConfig.email, href: `mailto:${siteConfig.email}` },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------- brand -------------------------------- */}
          <div className="lg:col-span-5">
            <p className="display text-2xl tracking-[-0.02em]">
              {siteConfig.name}
            </p>
            <p className="tech mt-3">{siteConfig.tagline}</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {siteConfig.shortDescription}
            </p>
            <p className="mt-6 max-w-sm text-sm font-medium leading-relaxed text-bone">
              If it needs to be designed, fabricated, simulated, soldered,
              welded, assembled or tested — let&rsquo;s build it.
            </p>
          </div>

          {/* ------------------------------- columns ------------------------------ */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Services" items={services} />

            <FooterColumn
              title="Departments"
              items={disciplines.map((discipline) => ({
                label: discipline.name,
                href: "#disciplines",
              }))}
            />

            <div>
              <p className="tech">Elsewhere</p>
              <ul className="mt-5 flex flex-col gap-3">
                <li>
                  <a
                    href="#about"
                    className="text-sm text-muted transition-colors hover:text-signal"
                  >
                    About the engineer
                  </a>
                </li>
                {elsewhere.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="break-words text-sm text-muted transition-colors hover:text-signal"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ------------------------------ disclaimer ----------------------------- */}
        <div className="mt-14 border-t border-line-soft pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-faint">
            AI estimates are preliminary and may change after technical review,
            material availability and project requirements are confirmed. We
            provide engineering development, fabrication and technical support —
            you remain responsible for your own academic submission.
          </p>

          <div className="mt-8 flex flex-col gap-3 border-t border-line-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="tech">
              © {new Date().getFullYear()} {siteConfig.legalName}
            </p>
            <a href="#top" className="tech transition-colors hover:text-signal">
              Back to top ↑
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="tech">{title}</p>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-signal"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
