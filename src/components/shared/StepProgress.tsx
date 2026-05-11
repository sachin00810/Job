import { Check } from "lucide-react";

interface StepProgressProps {
  steps: string[];
  current: number; // 0-based
  color?: "indigo" | "amber";
}

export function StepProgress({ steps, current, color = "indigo" }: StepProgressProps) {
  const accent = color === "amber" ? "bg-amber-500" : "bg-indigo-600";
  const accentText = color === "amber" ? "text-amber-600" : "text-indigo-600";
  const accentBorder = color === "amber" ? "border-amber-500" : "border-indigo-600";

  return (
    <div className="mb-8">
      {/* Step labels */}
      <div className="flex items-start justify-between relative">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  done
                    ? `${accent} border-transparent text-white`
                    : active
                    ? `bg-white ${accentBorder} ${accentText}`
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`mt-1.5 text-xs font-medium text-center leading-tight ${active ? accentText : done ? "text-slate-600" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
          );
        })}

        {/* Connecting lines */}
        <div className="absolute top-4 left-0 right-0 h-px -z-10 px-4">
          <div className="relative h-full">
            {steps.slice(0, -1).map((_, i) => (
              <div
                key={i}
                className={`absolute h-0.5 transition-all ${i < current ? accent : "bg-slate-200"}`}
                style={{
                  left: `${((i + 0.5) / (steps.length - 1)) * 100}%`,
                  width: `${(1 / (steps.length - 1)) * 100}%`,
                  top: "-0.5px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Percentage label */}
      <p className="text-xs text-slate-400 mt-4 text-right">
        Step {current + 1} of {steps.length}
      </p>
    </div>
  );
}
