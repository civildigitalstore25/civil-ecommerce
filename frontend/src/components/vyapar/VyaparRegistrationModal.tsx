import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1Data {
  fullName: string;
  mobile: string;
}

interface Step2Data {
  businessType: string;
  device: string;
  language: string;
  upgradeTimeline: string;
}

export interface VyaparRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Dropdown Options ─────────────────────────────────────────────────────────

const BUSINESS_TYPE_OPTIONS = [
  "Retail Shop",
  "Wholesale",
  "Manufacturing",
  "Services",
  "Other",
];

const DEVICE_OPTIONS = [
  "Mobile Phone",
  "Laptop/Desktop",
  "Tablet",
  "POS Machine",
];

const LANGUAGE_OPTIONS = [
  "Hindi",
  "English",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Telugu",
];

const UPGRADE_TIMELINE_OPTIONS = [
  "Immediate",
  "1-3 Months",
  "Just Exploring",
];

// ─── Sub-component: Custom Dropdown ──────────────────────────────────────────

interface CustomDropdownProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function CustomDropdown({
  placeholder,
  options,
  value,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: CustomDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all duration-150 focus:outline-none ${
          isOpen
            ? "border-[#ED1A3B] ring-2 ring-red-200/60 bg-white"
            : "border-[#E8D9B0] bg-white hover:border-[#F5A623]"
        }`}
      >
        <span
          className={value ? "text-gray-800 font-medium" : "text-gray-400"}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Floating dropdown list */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-[#E8D9B0] bg-white shadow-2xl">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                onClose();
              }}
              className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors duration-100 ${
                value === opt
                  ? "bg-[#F5A623] text-gray-900 font-semibold"
                  : "text-gray-700 hover:bg-[#F5A623]/70 hover:text-gray-900"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────

export function VyaparRegistrationModal({
  isOpen,
  onClose,
}: VyaparRegistrationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state — preserved when navigating back
  const [step1, setStep1] = useState<Step1Data>({ fullName: "", mobile: "" });
  const [step1Errors, setStep1Errors] = useState<Partial<Step1Data>>({});
  const [nameFocused, setNameFocused] = useState(false);

  // Step 2 state
  const [step2, setStep2] = useState<Step2Data>({
    businessType: "",
    device: "",
    language: "",
    upgradeTimeline: "",
  });

  // Single-active dropdown tracker
  const [activeDropdown, setActiveDropdown] = useState<
    keyof Step2Data | null
  >(null);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard: Escape closes dropdown first, then modal
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeDropdown) {
          setActiveDropdown(null);
        } else {
          onClose();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeDropdown, onClose]);

  // Reset to step 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setStep1Errors({});
      setActiveDropdown(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Step 1 validation ───────────────────────────────────────────────────

  function handleNext() {
    const errors: Partial<Step1Data> = {};
    if (!step1.fullName.trim()) errors.fullName = "Full name is required";
    if (!step1.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(step1.mobile.trim())) {
      errors.mobile = "Enter a valid 10-digit mobile number";
    }
    setStep1Errors(errors);
    if (Object.keys(errors).length === 0) {
      setActiveDropdown(null);
      setStep(2);
    }
  }

  // ── Step 2 submit ──────────────────────────────────────────────────────

  function handleSubmit() {
    // eslint-disable-next-line no-console
    console.log("Vyapar Registration:", { ...step1, ...step2 });
    onClose();
  }

  // ── Dropdown toggle ─────────────────────────────────────────────────────

  function toggleDropdown(key: keyof Step2Data) {
    setActiveDropdown((prev) => (prev === key ? null : key));
  }

  // ── Backdrop click ──────────────────────────────────────────────────────

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      if (activeDropdown) {
        setActiveDropdown(null);
      } else {
        onClose();
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15, 15, 20, 0.72)" }}
      onClick={handleBackdropClick}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-[480px] overflow-visible rounded-2xl bg-white"
        style={{
          boxShadow:
            "0 0 0 1.5px rgba(245,166,35,0.15), 0 28px 64px -12px rgba(0,0,0,0.38), 0 0 48px 0 rgba(237,26,59,0.07)",
        }}
      >
        {/* ════════ Header band (cream) ════════ */}
        <div className="rounded-t-2xl bg-[#FFFBF5] px-6 pb-5 pt-5">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Brand */}
          <div className="mb-3 flex items-center justify-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #ED1A3B 0%, #F5A623 100%)",
              }}
            >
              V
            </span>
            <span className="text-[1.05rem] font-bold text-[#ED1A3B] tracking-tight">
              Vyapar
            </span>
          </div>

          {/* Title */}
          <h2 className="text-center text-[1.35rem] font-extrabold leading-snug text-gray-900">
            <span
              style={{
                background:
                  "linear-gradient(90deg, #ED1A3B 0%, #F07830 55%, #F5A623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Start Using Vyapar
            </span>{" "}
            <span
              style={{
                color: "#1B1B2F",
                WebkitTextFillColor: "#1B1B2F",
              }}
            >
              – It's Free
            </span>
          </h2>

          {/* Stepper pills */}
          <div className="mt-3.5 flex items-center justify-center gap-2.5">
            <span
              className="h-[5px] w-12 rounded-full"
              style={{ background: "#ED1A3B" }}
            />
            <span
              className="h-[5px] w-12 rounded-full transition-colors duration-300"
              style={{
                background: step === 2 ? "#ED1A3B" : "#D1D5DB",
              }}
            />
            <span className="ml-0.5 text-sm font-semibold text-gray-500">
              Step {step} of 2
            </span>
          </div>
        </div>

        {/* ════════ Body ════════ */}
        <div className="px-6 pb-6 pt-5">
          {step === 1 ? (
            /* ───── STEP 1 ───── */
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Your Full Name{" "}
                  <span className="text-[#ED1A3B]">*</span>
                </label>
                <div
                  className="flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-150"
                  style={
                    nameFocused
                      ? {
                          borderColor: "transparent",
                          outline: "2px solid transparent",
                          boxShadow: "0 0 0 2px #ED1A3B55",
                          background: "white",
                        }
                      : step1Errors.fullName
                        ? { borderColor: "#EF4444" }
                        : { borderColor: "#E8D9B0" }
                  }
                >
                  <CircleUserRound
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: "#C8A96A" }}
                  />
                  <input
                    type="text"
                    placeholder="e.g., Rajesh Kumar"
                    value={step1.fullName}
                    onChange={(e) => {
                      setStep1((p) => ({
                        ...p,
                        fullName: e.target.value,
                      }));
                      if (step1Errors.fullName)
                        setStep1Errors((p) => ({
                          ...p,
                          fullName: undefined,
                        }));
                    }}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
                {step1Errors.fullName && (
                  <p className="mt-1 text-xs text-red-500">
                    {step1Errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-800">
                  Mobile Number{" "}
                  <span className="text-[#ED1A3B]">*</span>
                </label>
                <div
                  className="flex overflow-hidden rounded-xl border transition-colors duration-150"
                  style={
                    step1Errors.mobile
                      ? { borderColor: "#EF4444" }
                      : { borderColor: "#E8D9B0" }
                  }
                >
                  {/* Country code block */}
                  <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-[#E8D9B0] bg-[#F8F5EC] px-3.5 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      IN
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      +91
                    </span>
                  </div>
                  {/* Number input */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={step1.mobile}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setStep1((p) => ({ ...p, mobile: val }));
                      if (step1Errors.mobile)
                        setStep1Errors((p) => ({
                          ...p,
                          mobile: undefined,
                        }));
                    }}
                    className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>
                {step1Errors.mobile && (
                  <p className="mt-1 text-xs text-red-500">
                    {step1Errors.mobile}
                  </p>
                )}
              </div>

              {/* Next CTA */}
              <button
                type="button"
                onClick={handleNext}
                className="mt-1 w-full rounded-xl py-3.5 text-base font-bold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(90deg, #ED1A3B 0%, #F07830 52%, #F5C50A 100%)",
                  boxShadow: "0 6px 22px rgba(237,26,59,0.32)",
                }}
              >
                Next →
              </button>
            </div>
          ) : (
            /* ───── STEP 2 ───── */
            <div>
              {/* Success badge + subtitle */}
              <div className="mb-5 flex flex-col items-center gap-2.5">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{
                    background: "rgba(34,197,94,0.10)",
                    border: "2px solid rgba(34,197,94,0.35)",
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    <path
                      d="M5 10.5l3.5 3.5 6.5-7"
                      stroke="#22C55E"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="text-center text-[0.97rem] font-bold text-gray-900">
                  Tell Us More About Your Business
                </h3>
              </div>

              {/* Dropdowns */}
              <div className="space-y-3">
                <CustomDropdown
                  placeholder="What type of business do you run?"
                  options={BUSINESS_TYPE_OPTIONS}
                  value={step2.businessType}
                  onChange={(v) =>
                    setStep2((p) => ({ ...p, businessType: v }))
                  }
                  isOpen={activeDropdown === "businessType"}
                  onToggle={() => toggleDropdown("businessType")}
                  onClose={() => setActiveDropdown(null)}
                />

                <CustomDropdown
                  placeholder="Which device will you use Vyapar on?"
                  options={DEVICE_OPTIONS}
                  value={step2.device}
                  onChange={(v) =>
                    setStep2((p) => ({ ...p, device: v }))
                  }
                  isOpen={activeDropdown === "device"}
                  onToggle={() => toggleDropdown("device")}
                  onClose={() => setActiveDropdown(null)}
                />

                <CustomDropdown
                  placeholder="Preferred language for the demo call?"
                  options={LANGUAGE_OPTIONS}
                  value={step2.language}
                  onChange={(v) =>
                    setStep2((p) => ({ ...p, language: v }))
                  }
                  isOpen={activeDropdown === "language"}
                  onToggle={() => toggleDropdown("language")}
                  onClose={() => setActiveDropdown(null)}
                />

                <CustomDropdown
                  placeholder="When will you upgrade billing?"
                  options={UPGRADE_TIMELINE_OPTIONS}
                  value={step2.upgradeTimeline}
                  onChange={(v) =>
                    setStep2((p) => ({ ...p, upgradeTimeline: v }))
                  }
                  isOpen={activeDropdown === "upgradeTimeline"}
                  onToggle={() => toggleDropdown("upgradeTimeline")}
                  onClose={() => setActiveDropdown(null)}
                />
              </div>

              {/* Footer actions */}
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDropdown(null);
                    setStep(1);
                  }}
                  className="flex-1 rounded-xl border border-[#E8D9B0] bg-white py-3.5 text-sm font-semibold text-gray-700 transition-all duration-150 hover:border-[#F5A623] hover:text-gray-900 active:scale-[0.98]"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-[2] rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(90deg, #ED1A3B 0%, #F07830 52%, #F5C50A 100%)",
                    boxShadow: "0 6px 22px rgba(237,26,59,0.28)",
                  }}
                >
                  Get Free Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
