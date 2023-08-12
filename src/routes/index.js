import { lazy, Suspense } from "react";
import { Outlet, useRoutes, Navigate } from "react-router-dom";
import { Loader } from "../components";
import AuthGuard from "../components/guards/AuthGuard";
import GuestGuard from "../components/guards/GuestGuard";
import MainLayout from "../layout/MainLayout";
import UserLayout from "../layout/UserLayout";
import { PATH_AUTH } from "./paths";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <Dashboard />,
          index: true,
        },
        { path: "orders", element: <Blank /> },
        { path: "products", element: <Products /> },
        { path: "listing", element: <Listing /> },
        { path: "settings", element: <AdminProfile /> },
        { path: "blogs", element: <Blog /> },
        { path: "mandi", element: <MandiUpdate /> },
        {
          path: "users",
          element: <Outlet />,
          children: [
            { index: true, element: <Users /> },
            {
              path: ":userId",
              element: <UserLayout />,
              children: [
                { index: true, element: <Orders /> },
                { path: ":orderId", element: <OrderDetail /> },
                { path: "listings", element: <UserListing /> },
                { path: "challans", element: <UserChallans /> },
                { path: "transportRequest", element: <UserTransportRequest /> },
                { path: "storageRequest", element: <UserStorageRequest /> },
                { path: "orchardRequest", element: <UserOrchardRequest /> },
                { path: "*", element: <Navigate to="/404" replace /> },
              ],
            },
            { path: "*", element: <Navigate to="/404" replace /> },
          ],
        },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: "/",
      element: <Outlet />,
      children: [
        { element: <Navigate to={PATH_AUTH.login} replace />, index: true },
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: "signup",
          element: (
            <GuestGuard>
              <Signup />
            </GuestGuard>
          ),
        },
        {
          path: "forgotPassword",
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
    { path: "404", element: <NotFound /> },
  ]);
}

const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const AdminProfile = Loadable(lazy(() => import("../pages/adminProfile")));
const Blank = Loadable(lazy(() => import("../pages/Blank")));
const Products = Loadable(lazy(() => import("../pages/products")));
const MandiUpdate = Loadable(lazy(() => import("../pages/mandi")));
const Blog = Loadable(lazy(() => import("../pages/blogs")));
const Users = Loadable(lazy(() => import("../pages/users")));
const Orders = Loadable(
  lazy(() => import("../pages/users/UserDetails/Orders"))
);
const OrderDetail = Loadable(
  lazy(() => import("../pages/users/UserDetails/Orders/OrderDetail"))
);
const UserListing = Loadable(
  lazy(() => import("../pages/users/UserDetails/Listings"))
);
const UserChallans = Loadable(
  lazy(() => import("../pages/users/UserDetails/Challans"))
);
const UserTransportRequest = Loadable(
  lazy(() => import("../pages/users/UserDetails/TransportRequest"))
);
const UserStorageRequest = Loadable(
  lazy(() => import("../pages/users/UserDetails/StorageRequest"))
);
const UserOrchardRequest = Loadable(
  lazy(() => import("../pages/users/UserDetails/OrchardRequest"))
);
const Listing = Loadable(lazy(() => import("../pages/listing")));

// AUTH
const ForgotPassword = Loadable(
  lazy(() => import("../pages/auth/forgotPassword"))
);

const Login = Loadable(lazy(() => import("../pages/auth/login")));
const Signup = Loadable(lazy(() => import("../pages/auth/signup")));

const NotFound = Loadable(lazy(() => import("../pages/notFound")));
