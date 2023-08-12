const path = (root, subLink) => `${root}${subLink}`;

const BASE_PATH = "/";
const DASHBOARD_PATH = "/dashboard/";

export const PATH_AUTH = {
  login: path(BASE_PATH, "login"),
  forgotPassword: path(BASE_PATH, "forgotPassword"),
  signup: path(BASE_PATH, "signup"),
};

export const PATH_DASHBOARD = {
  root: DASHBOARD_PATH,
  orders: path(DASHBOARD_PATH, "orders"),
  products: path(DASHBOARD_PATH, "products"),
  listing: path(DASHBOARD_PATH, "listing"),
  customers: path(DASHBOARD_PATH, "customers"),
  settings: path(DASHBOARD_PATH, "settings"),
  blogs: path(DASHBOARD_PATH, "blogs"),
  mandi: path(DASHBOARD_PATH, "mandi"),
  users: {
    root: path(DASHBOARD_PATH, "users"),
    listings: path(DASHBOARD_PATH, "users/listings"),
    challans: path(DASHBOARD_PATH, "users/challans"),
    transportRequest: path(DASHBOARD_PATH, "users/transportRequest"),
    storageRequest: path(DASHBOARD_PATH, "users/storageRequest"),
    orchardRequest: path(DASHBOARD_PATH, "users/orchardRequest"),
  },
};
