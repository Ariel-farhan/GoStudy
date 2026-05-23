type ToggleItemProps = {
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
};

export default function ToggleItem({ label, icon, enabled, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)]">
      <div className="flex items-center gap-3 text-[var(--page-text)]">
        {icon}
        <span>{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}