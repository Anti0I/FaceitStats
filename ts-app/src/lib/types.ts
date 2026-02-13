// ============================================================
// TypeScript Utilities & Types
// Demonstrates: Unions, Intersections, Utility Types,
// Function Overloads, Type Predicates, and Generic types
// ============================================================

// ---- Base Types ----

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer"; // [TS1] Union type for role
};

export type ContactInfo = {
  phone: string;
  address: string;
  city: string;
};

// [TS1] Intersection type: User combined with ContactInfo
export type UserWithContact = User & ContactInfo;

// ---- Form Types ----

// [TS1] Union type for form wizard steps
export type FormStep = "personal" | "contact" | "review";

export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  agreedToTerms: boolean;
  captchaVerified: boolean;
};

// ---- Chart & Order Types ----

export type ChartDataPoint = {
  month: string;
  revenue: number;
  expenses: number;
};

export type OrderStatus = "completed" | "pending" | "cancelled"; // [TS1] Union type

export type Order = {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
};

// ---- Stat Card Type ----

export type StatCard = {
  title: string;
  value: string;
  description: string;
  trend: "up" | "down" | "neutral"; // [TS1] Union type
};

// ============================================================
// [TS2] Built-in Utility Types
// ============================================================

// Readonly version of User — prevents mutation
export type ReadonlyUser = Readonly<User>;

// Pick only name and email from User
export type UserSummary = Pick<User, "name" | "email">;

// Partial form data for draft saving
export type PartialFormData = Partial<FormData>;

// Record mapping order status to display labels
export type StatusLabels = Record<OrderStatus, string>;

export const STATUS_LABELS: StatusLabels = {
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
};

// ============================================================
// [TS3] Function Overloads
// ============================================================

export function formatValue(val: string): string;
export function formatValue(val: number): string;
export function formatValue(val: string | number): string {
  if (typeof val === "string") {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(val);
}

// ============================================================
// [TS5] Custom Type Predicate
// ============================================================

export function isUser(val: unknown): val is User {
  return (
    typeof val === "object" &&
    val !== null &&
    "id" in val &&
    "name" in val &&
    "email" in val &&
    "role" in val &&
    typeof (val as User).id === "number" &&
    typeof (val as User).name === "string"
  );
}

// ============================================================
// [TS6] Generic List Props — used by GenericList component
// ============================================================

export type GenericListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
};
