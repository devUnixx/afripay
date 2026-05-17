import { clsx } from "clsx";

type Status = "DRAFT" | "PENDING" | "PAID" | "CANCELLED" | "OVERDUE" | "PROCESSING" | "COMPLETED" | "FAILED";

const statusConfig: Record<Status, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-600" },
  OVERDUE: { label: "Overdue", className: "bg-orange-100 text-orange-700" },
  PROCESSING: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700" },
  FAILED: { label: "Failed", className: "bg-red-100 text-red-600" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
