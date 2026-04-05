import { Download, Loader2, CheckCircle2 } from "lucide-react";

const STYLES = {
  primary: {
    idle: "bg-black text-white hover:bg-zinc-800 hover:-translate-y-0.5 shadow-lg hover:shadow-xl",
    downloading: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
    success: "bg-green-500 text-white",
  },
  secondary: {
    idle: "bg-white text-black border-zinc-200 hover:border-black hover:bg-zinc-50 shadow-sm border",
    downloading: "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed border",
    success: "bg-green-500 text-white border-transparent",
  },
};

const ICONS = {
  idle: Download,
  downloading: Loader2,
  success: CheckCircle2,
};

export default function DownloadButton({
  status,
  onClick,
  idleLabel,
  downloadingLabel,
  successLabel = "Done",
  variant = "primary",
  idleIcon: IdleIcon,
}) {
  const Icon = IdleIcon && status === "idle" ? IdleIcon : ICONS[status];
  const label =
    status === "idle"
      ? idleLabel
      : status === "downloading"
        ? downloadingLabel
        : successLabel;

  return (
    <button
      onClick={onClick}
      disabled={status !== "idle"}
      className={`px-6 py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${STYLES[variant][status]}`}
    >
      <Icon
        className={`w-4 h-4 ${status === "downloading" ? "animate-spin" : ""}`}
      />
      {label}
    </button>
  );
}
