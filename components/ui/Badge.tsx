interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "success" | "warning" | "danger";
}

export default function Badge({ children, variant = "gold" }: BadgeProps) {
  const variants = {
    gold: "bg-gold/20 text-gold border-gold/40",
    success: "bg-green-500/20 text-green-400 border-green-500/40",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    danger: "bg-red-500/20 text-red-400 border-red-500/40",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
