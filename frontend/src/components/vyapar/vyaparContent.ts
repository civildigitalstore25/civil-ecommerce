import type { LucideIcon } from "lucide-react";
import {
  Box,
  Calculator,
  FileText,
  Smartphone,
  Users,
  MonitorSmartphone,
} from "lucide-react";

export const VYAPAR_SHOP_HREF =
  "/category?brand=accounting-billing&category=vyapar";

export const vyaparFeatures: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Smartphone,
    title: "Free Mobile App",
    description:
      "Basic features free forever on Android. No credit card required.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multi-Device Access",
    description:
      "Use together on Mobile & Desktop with real-time sync across devices.",
  },
  {
    icon: Users,
    title: "Multi-User & Roles",
    description:
      "Add staff with role-based permissions for secure collaboration.",
  },
  {
    icon: Box,
    title: "Inventory Management",
    description:
      "Manage full stock inventory with alerts and barcode scanning.",
  },
  {
    icon: FileText,
    title: "Invoicing & GST Reports",
    description: "GST-compliant invoices and comprehensive business reports.",
  },
  {
    icon: Calculator,
    title: "Accounting for SMEs",
    description:
      "Complete accounting with expense tracking and cash flow management.",
  },
];

export type VyaparPlanFeature = { text: string; included: boolean };

export type VyaparPlan = {
  title: string;
  price: string;
  period: string;
  saveBadge?: string;
  highlighted?: boolean;
  features: VyaparPlanFeature[];
};

export const vyaparDesktopPlans: VyaparPlan[] = [
  {
    title: "1 Year",
    price: "₹3,799",
    period: "/year",
    features: [
      { text: "Sync data across devices", included: true },
      { text: "Create multiple companies (3)", included: true },
      { text: "Generate E-way Bills (10/mo)", included: true },
      { text: "Remove ads on invoices", included: true },
      { text: "Multiple pricing for items", included: true },
      { text: "Update items in bulk", included: true },
      { text: "Export data to Tally", included: false },
      { text: "Restore deleted (2 trans.)", included: false },
      { text: "Combine orders into sale", included: false },
      { text: "Accounting Module", included: false },
      { text: "Partywise P&L Report", included: false },
    ],
  },
  {
    title: "3 Years",
    price: "₹2,899",
    period: "/year",
    saveBadge: "Save 24%",
    highlighted: true,
    features: [
      { text: "Sync data across devices", included: true },
      { text: "Create multiple companies (5)", included: true },
      { text: "Generate E-way Bills (unlimited)", included: true },
      { text: "Remove ads on invoices", included: true },
      { text: "Multiple pricing for items", included: true },
      { text: "Update items in bulk", included: true },
      { text: "Export data to Tally", included: true },
      { text: "Restore deleted (unlimited)", included: true },
      { text: "Combine orders into sale", included: true },
      { text: "Accounting Module", included: true },
      { text: "Partywise P&L Report", included: true },
    ],
  },
];

export const vyaparMobilePlans: VyaparPlan[] = [
  {
    title: "1 Year",
    price: "₹699",
    period: "/year",
    features: [
      { text: "Sync data across devices", included: true },
      { text: "Create multiple companies (3)", included: true },
      { text: "Restore deleted transactions (2)", included: true },
      { text: "Remove ads on invoices", included: true },
      { text: "Multiple pricing for items", included: true },
      { text: "Add Fixed Assets", included: true },
      { text: "Create Multiple Firms (3)", included: true },
      { text: "Partywise P&L Report", included: false },
      { text: "Keep different rates per party", included: false },
    ],
  },
  {
    title: "3 Years",
    price: "₹499",
    period: "/year",
    saveBadge: "Save 29%",
    highlighted: true,
    features: [
      { text: "Sync data across devices", included: true },
      { text: "Create multiple companies (5)", included: true },
      { text: "Restore deleted transactions (∞)", included: true },
      { text: "Remove ads on invoices", included: true },
      { text: "Multiple pricing for items", included: true },
      { text: "Add Fixed Assets", included: true },
      { text: "Create Multiple Firms (5)", included: true },
      { text: "Partywise P&L Report", included: true },
      { text: "Keep different rates per party", included: true },
    ],
  },
];

export const vyaparTestimonials = [
  {
    quote:
      "Vyapar's been my accounting partner for four years now, and it's been a smooth ride. Their subscription model is clear-cut, and whenever I've needed help, their support team jumps in quickly. Plus, they're honest – no hidden fees or surprises.",
    name: "Kshirasagar Textiles",
    role: "Distributor",
    initials: "KT",
  },
  {
    quote:
      "Simple and powerful! I have been using this app on my desktop for one year. It's simple and can be easily learned by anyone. The app is continuously updated and there are many features added.",
    name: "Manu Rajeshwari",
    role: "Wholesaler",
    initials: "MR",
  },
  {
    quote:
      "Vyapar is my lifesaver! It's like having a mobile accounting office – everything I need is in one place, accessible anytime. No more switching between devices or waiting to get on my laptop.",
    name: "Keshav G",
    role: "Business Owner",
    initials: "KG",
  },
  {
    quote:
      "Creating invoices and managing inventory is very easy, and it integrates seamlessly with WhatsApp to share information effortlessly. It's the perfect all-in-one solution for Indian businesses.",
    name: "Abhishek S",
    role: "Retailer",
    initials: "AS",
  },
];

export const vyaparFaqs = [
  {
    question: "Is the Vyapar mobile app really free?",
    answer:
      "Yes. Vyapar offers core billing and invoicing features free on Android. Premium plans unlock advanced desktop sync, multi-user access, accounting modules, and more.",
  },
  {
    question: "What platforms does Vyapar support?",
    answer:
      "Vyapar runs on Android mobile and Windows desktop. Data syncs across devices so you can manage your business from anywhere.",
  },
  {
    question: "Does Vyapar work offline?",
    answer:
      "Yes. You can create invoices and manage inventory offline on mobile. Data syncs automatically when you're back online.",
  },
  {
    question: "How secure is my data on Vyapar?",
    answer:
      "Vyapar uses secure cloud backup and encryption to protect your business data. You can also export reports for your records.",
  },
  {
    question: "What kind of businesses can use Vyapar?",
    answer:
      "Retailers, wholesalers, distributors, manufacturers, and service businesses across India use Vyapar for GST billing, inventory, and accounting.",
  },
  {
    question: "What happens after the free trial?",
    answer:
      "After the trial you can continue on the free Android plan or purchase a paid desktop/mobile license through SoftZCart for full premium features.",
  },
];
