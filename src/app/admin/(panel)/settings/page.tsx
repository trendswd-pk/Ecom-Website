import { Settings } from "lucide-react";

const settingSections = [
  {
    title: "General",
    description: "Store name, contact details, and basic storefront information.",
    status: "Coming soon",
  },
  {
    title: "Navigation menu",
    description:
      "Choose which links appear in the header, their order, and labels — independent from collections.",
    status: "Coming soon",
  },
  {
    title: "Homepage",
    description: "Hero banner, featured collections, and homepage layout.",
    status: "Coming soon",
  },
  {
    title: "Checkout & orders",
    description: "Payment methods, shipping options, and order notifications.",
    status: "Coming soon",
  },
];

export default function WebsiteSettingsPage() {
  return (
    <div className="w-full min-w-0">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-indigo-400">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Website Settings</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Configure how your storefront looks and behaves. Menu, homepage, and checkout
            options will be managed from here.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {settingSections.map((section) => (
          <article
            key={section.title}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-medium text-white">{section.title}</h2>
              <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                {section.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {section.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
