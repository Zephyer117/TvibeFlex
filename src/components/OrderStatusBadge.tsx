import { Clock, CheckCircle, Package, XCircle, Truck } from "lucide-react";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; Icon: React.ElementType }
> = {
  pending: { label: "Pending", color: "text-yellow-400", Icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-400", Icon: CheckCircle },
  delivered: { label: "Delivered", color: "text-green-500", Icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-400", Icon: XCircle },
  paid: { label: "Paid", color: "text-green-400", Icon: CheckCircle },
  processing: { label: "Processing", color: "text-blue-400", Icon: Package },
  shipped: { label: "Shipped", color: "text-purple-400", Icon: Truck },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-body font-semibold text-sm capitalize",
        cfg.color
      )}
    >
      <Icon size={14} />
      {cfg.label}
    </span>
  );
}
