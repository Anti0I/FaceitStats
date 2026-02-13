"use client";

// ============================================================
// [TS6] Generic React Component
// A reusable list component that accepts any type T
// ============================================================

import type { GenericListProps } from "@/lib/types";

export function GenericList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "No items to display.",
}: GenericListProps<T>) {
  if (items.length === 0) {
    return (
      <p className="text-center text-dark-blue/60 py-8">{emptyMessage}</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
