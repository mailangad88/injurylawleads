export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
};

// Each category is a content hub at /guides/<slug> and an option on the lead form.
export const categories: Category[] = [
  {
    slug: "car-accidents",
    name: "Car Accidents",
    short: "Car accident",
    description: "What to do after a crash, how fault and insurance work, and what a car accident claim may be worth.",
  },
  {
    slug: "truck-accidents",
    name: "Truck Accidents",
    short: "Truck accident",
    description: "Crashes involving semis, delivery trucks and commercial vehicles, where more parties and more insurance are usually involved.",
  },
  {
    slug: "motorcycle-accidents",
    name: "Motorcycle Accidents",
    short: "Motorcycle accident",
    description: "Rider injuries, bias against motorcyclists, and how to protect a motorcycle injury claim.",
  },
  {
    slug: "slip-and-fall",
    name: "Slip and Fall",
    short: "Slip and fall",
    description: "Injuries on someone else's property, from stores and restaurants to apartments and parking lots.",
  },
  {
    slug: "medical-malpractice",
    name: "Medical Malpractice",
    short: "Medical malpractice",
    description: "When a doctor, hospital or other provider falls below the standard of care and a patient is harmed.",
  },
  {
    slug: "workplace-injuries",
    name: "Workplace Injuries",
    short: "Injury at work",
    description: "Workers' compensation, construction accidents, and when a third party can be held responsible.",
  },
  {
    slug: "dog-bites",
    name: "Dog Bites",
    short: "Dog bite",
    description: "Dog bite and animal attack injuries, owner liability, and how homeowners insurance comes into play.",
  },
  {
    slug: "wrongful-death",
    name: "Wrongful Death",
    short: "Wrongful death",
    description: "When a loved one dies because of someone else's negligence, and what families can recover.",
  },
  {
    slug: "claims-process",
    name: "The Claims Process",
    short: "Other injury",
    description: "Deadlines, insurance adjusters, settlements and lawyer fees, explained for any kind of injury claim.",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
