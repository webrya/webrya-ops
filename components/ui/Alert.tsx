import React from "react";

export function Alert({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "success" | "warning" | "info";
}) {
  const styles =
    type === "success"
      ? { bg: "#ecfdf5", br: "#a7f3d0", tx: "#065f46" }
      : type === "warning"
      ? { bg: "#fff7ed", br: "#fed7aa", tx: "#9a3412" }
      : { bg: "#eff6ff", br: "#bfdbfe", tx: "#1e40af" };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 10,
        background: styles.bg,
        border: `1px solid ${styles.br}`,
        color: styles.tx,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}
