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
  actionIcon = <Plus className="h-4 w-4 mr-2" />,
  actionOnClick,
  secondaryActionHref,
  secondaryActionText,
  secondaryActionIcon,
  secondaryActionOnClick,
  children
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div className="space-y-2 min-w-0 flex-1">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">{title}</h1>
        <p className="text-[#5F3C18] text-base">{subtitle}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        {children}
        {(secondaryActionHref || secondaryActionOnClick) && (
          secondaryActionHref ? (
            <Link href={secondaryActionHref}>
              <Button
                variant="outline"
                className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0 min-h-[40px]"
              >
                {secondaryActionIcon}
                {secondaryActionText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              onClick={secondaryActionOnClick}
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0 min-h-[40px]"
            >
              {secondaryActionIcon}
              {secondaryActionText}
            </Button>
          )
        )}
        {(actionHref || actionOnClick) && (
          actionHref ? (
            <Link href={actionHref}>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0 min-h-[40px]">
                {actionIcon}
                {actionText}
              </Button>
            </Link>
          ) : (
            <Button
              onClick={actionOnClick}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0 min-h-[40px]"
            >
              {actionIcon}
              {actionText}
            </Button>
          )
        )}
      </div>
    </div>
  );
}