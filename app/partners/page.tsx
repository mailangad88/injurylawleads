import type { Metadata } from "next";
import { ProsePage } from "@/components/Prose";

export const metadata: Metadata = {
  title: "Participating Law Firms",
  description: "The independent law firms that may contact you after you request a free case review.",
  alternates: { canonical: "/partners" },
};

// The consent checkbox on the lead form points here. List every firm that may call or
// text someone who submits the form, so consent is tied to named sellers.
const partners: { name: string; states: string; website?: string }[] = [
  // { name: "Example Law Group, PLLC", states: "TX, OK", website: "https://example.com" },
];

export default function Partners() {
  return (
    <ProsePage title="Participating law firms">
      <p>
        When you request a free case review, your information may be shared with, and you may be contacted by, the
        following independent law firms. Each firm is solely responsible for its own legal services.
      </p>
      {partners.length ? (
        <ul>
          {partners.map((p) => (
            <li key={p.name}>
              <strong>{p.website ? <a href={p.website}>{p.name}</a> : p.name}</strong> ({p.states})
            </li>
          ))}
        </ul>
      ) : (
        <p><em>Our list of participating firms is being updated.</em></p>
      )}
    </ProsePage>
  );
}
