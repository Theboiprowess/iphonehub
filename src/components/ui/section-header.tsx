import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  subtitleClassName?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  subtitleClassName = "text-lg text-[#5F3C18] text-center",
  children,
  className = "" 
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0E161B] font-manrope mb-6">
        {title}
      </h2>
      <div className="flex justify-center mb-8">
        <div className="h-1 w-20 bg-[#CDB586] rounded-full"></div>
      </div>
      {subtitle && (
        <div className="text-center mb-10">
          <p className={`${subtitleClassName} leading-relaxed`}>
            {subtitle}
          </p>
        </div>
      )}
      {children && (
        <div className="mt-8 text-center">
          {children}
        </div>
      )}
    </div>
  );
}
