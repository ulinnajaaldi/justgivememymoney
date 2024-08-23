import {
  Captions,
  ChartBarStacked,
  ChartNoAxesGantt,
  ScanFace,
  Settings,
} from "lucide-react";

export const ROUTES_PATH = {
  dashboard: {
    accounts: "/dashboard/accounts",
    categories: "/dashboard/categories",
    overview: "/dashboard/overview",
    settings: "/dashboard/settings",
    transactions: "/dashboard/transactions",
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
  home: "/",
};

export const NAVIGATION_LIST = [
  {
    title: "Overview",
    href: ROUTES_PATH.dashboard.overview,
    icons: ChartNoAxesGantt,
  },
  {
    title: "Accounts",
    href: ROUTES_PATH.dashboard.accounts,
    icons: ScanFace,
  },
  {
    title: "Transactions",
    href: ROUTES_PATH.dashboard.transactions,
    icons: Captions,
  },
  {
    title: "Categories",
    href: ROUTES_PATH.dashboard.categories,
    icons: ChartBarStacked,
  },
  {
    title: "Settings",
    href: ROUTES_PATH.dashboard.settings,
    icons: Settings,
  },
];
