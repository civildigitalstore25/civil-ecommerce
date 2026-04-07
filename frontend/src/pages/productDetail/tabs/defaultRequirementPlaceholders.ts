export const PRODUCT_DETAIL_DEFAULT_REQUIREMENTS = [
  {
    icon: "Monitor",
    iconClass: "text-blue-400 w-6 h-6",
    title: "Operating System",
    description: "Windows 10/11 (64-bit) or macOS 10.15+",
  },
  {
    icon: "Cpu",
    iconClass: "text-green-400 w-6 h-6",
    title: "Processor",
    description:
      "Intel Core i5 or equivalent AMD processor (2.5GHz or higher)",
  },
  {
    icon: "MemoryStick",
    iconClass: "text-purple-400 w-6 h-6",
    title: "Memory (RAM)",
    description:
      "8 GB RAM minimum (16 GB recommended for optimal performance)",
  },
  {
    icon: "Gamepad2",
    iconClass: "text-orange-400 w-6 h-6",
    title: "Graphics Card",
    description:
      "DirectX 11 or DirectX 12 compatible graphics card with 1GB VRAM",
  },
  {
    icon: "HardDrive",
    iconClass: "text-yellow-400 w-6 h-6",
    title: "Storage Space",
    description: "7 GB free disk space for installation",
  },
  {
    icon: "Wifi",
    iconClass: "text-cyan-400 w-6 h-6",
    title: "Internet Connection",
    description:
      "Broadband internet connection required for activation and cloud features",
  },
] as const;
