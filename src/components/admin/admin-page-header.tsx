import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actionHref?: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  actionOnClick?: () => void;
  secondaryActionHref?: string;
  secondaryActionText?: string;
  secondaryActionIcon?: React.ReactNode;
  secondaryActionOnClick?: () => void;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  actionHref,
  actionText = "Add New",
  actionIcon,
  actionOnClick,
  secondaryActionHref,
  secondaryActionText,
  secondaryActionIcon,
  secondaryActionOnClick,
  children
}: AdminPageHeaderProps) {
  const defaultActionIcon = <Plus className="h-4 w-4 mr-2" />;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
      <div className="space-y-1.5 min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope leading-tight">{title}</h1>
        <p className="text-sm sm:text-base text-[#5F3C18]">{subtitle}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3 flex-wrap">
        {children}
        {(secondaryActionHref || secondaryActionOnClick) && (
          secondaryActionHref ? (
            <Link href={secondaryActionHref}>
              <Button
                variant="outline"
                className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0 h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base"
              >
                {secondaryActionIcon}
                {secondaryActionText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={secondaryActionOnClick}
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0 h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base"
            >
              {secondaryActionIcon}
              {secondaryActionText}
            </Button>
          )
        )}
        {(actionHref || actionOnClick) && (
          actionHref ? (
            <Link href={actionHref}>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0 h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base">
                {actionIcon || defaultActionIcon}
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={actionOnClick}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0 h-9 sm:h-10 px-3 sm:px-4 text-sm sm:text-base"
            >
              {actionIcon || defaultActionIcon}
              {actionText}
            </Button>
          )
        )}
      </div>
    </div>
  );
}