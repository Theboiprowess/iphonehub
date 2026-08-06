interface VisualConditionIndicatorProps {
  condition: "Excellent" | "Very Good" | "Good" | "Fair" | "Damaged";
}

export function VisualConditionIndicator({ condition }: VisualConditionIndicatorProps) {
  const getDots = () => {
    switch (condition) {
      case "Excellent":
        return 5;
      case "Very Good":
        return 4;
      case "Good":
        return 3;
      case "Fair":
        return 2;
      case "Damaged":
        return 1;
      default:
        return 0;
    }
  };

  const dots = getDots();

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`h-2 w-2 rounded-full transition-all ${
            dot <= dots
              ? "bg-[#CDB586]"
              : "bg-[#CDB586]/30"
          }`}
        />
      ))}
    </div>
  );
}
