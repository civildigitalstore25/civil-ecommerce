import type { LucideIcon } from "lucide-react";
import { Shield } from "lucide-react";

export interface CategoryTabConfig {
  id: string;
  label: string;
  company: string;
  category: string;
  image?: string;
  color: string;
  icon?: LucideIcon;
}

export const CATEGORY_TABS: CategoryTabConfig[] = [
  {
    id: "autocad",
    label: "AutoDesk",
    company: "autodesk",
    category: "",
    image: "/mobilelogo/autocad.png",
    color: "#f59e0b",
  },
  {
    id: "microsoft",
    label: "Microsoft",
    company: "microsoft",
    category: "",
    image: "/mobilelogo/Microsoft_Logo.png",
    color: "#3b82f6",
  },
  {
    id: "antivirus",
    label: "Antivirus",
    company: "antivirus",
    category: "",
    icon: Shield,
    color: "#10b981",
  },
  {
    id: "adobe",
    label: "Adobe",
    company: "adobe",
    category: "",
    image: "/mobilelogo/adobe.png",
    color: "#ec4899",
  },
  {
    id: "corel",
    label: "Corel",
    company: "corel",
    category: "",
    image: "/mobilelogo/corel.jpg",
    color: "#06b6d4",
  },
];
