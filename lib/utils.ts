export function formatDate(date: string | null | undefined) {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
