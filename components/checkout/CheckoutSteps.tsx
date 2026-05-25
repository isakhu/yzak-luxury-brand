const steps = ["Address", "Delivery", "Payment", "Review"];

interface CheckoutStepsProps {
  current: number;
}

export default function CheckoutSteps({ current }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i <= current
                  ? "bg-gold text-navy"
                  : "bg-card border border-gold/30 text-cream/50"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs mt-1 hidden sm:block ${
                i <= current ? "text-gold" : "text-cream/50"
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                i < current ? "bg-gold" : "bg-gold/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
