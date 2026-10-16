import { ReactNode } from "react";

interface AdminPageContainerProps {
  children: ReactNode;
  className?: string;
}

export function AdminPageContainer({ children, className = "" }: AdminPageContainerProps) {
  return (
    <div className={`w-full max-w-full admin-page-container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}