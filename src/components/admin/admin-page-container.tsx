import { ReactNode } from "react";

interface AdminPageContainerProps {
  children: ReactNode;
  className?: string;
}

export function AdminPageContainer({ children, className = "" }: AdminPageContainerProps) {
  return (
    <div className={`w-full max-w-full ${className}`}>
      {children}
    </div>
  );
}