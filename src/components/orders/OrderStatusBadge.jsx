import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL } from "@/constants/commerce";

const VARIANT = { processing: "muted", shipped: "accent", delivered: "success", cancelled: "outline" };

export default function OrderStatusBadge({ status }) {
  return <Badge variant={VARIANT[status] || "muted"}>{ORDER_STATUS_LABEL[status] || status}</Badge>;
}
