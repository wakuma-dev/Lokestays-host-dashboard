import { Badge } from "@/components/ui/badge";
import type { Properties } from "../types/properties.types";
interface PropertiesStatusBadgeProps {
  status: Properties["status"];
}
const STATUS_CONFIG: Record<Properties["status"],
  {
    label: string;
    className: string;
  }
> = {
  draft: {
    label: "Draft",
    className: "border-gray-500/30 bg-gray-500/10 text-gray-600",
  },
  pending: {
    label: "Pending",
    className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600",
  },
  approved: {
    label: "Approved",
    className: "border-green-500/30 bg-green-500/10 text-green-600",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-500/30 bg-red-500/10 text-red-600",
  },
};

export default function PropertiesStatusBadge({status,}: PropertiesStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
