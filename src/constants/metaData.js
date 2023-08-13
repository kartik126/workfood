import {
  BorderColor,
  Dns,
  Folder,
  ModeOfTravel,
  ReceiptLong,
  RequestQuote,
} from "@mui/icons-material";

export const productTableHeaders = [
  {
    id: "products",
    numeric: false,
    disablePadding: true,
    label: "Product",
  },
  {
    id: "last_modified",
    numeric: true,
    disablePadding: false,
    label: "Last Modified",
  },
  {
    id: "product_id",
    numeric: true,
    disablePadding: false,
    label: "Product Id",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "categories",
    numeric: true,
    disablePadding: false,
    label: "Categories",
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "action",
  },
];

export const mandiTableHeaders = [
  {
    id: "createdAt",
    numeric: false,
    disablePadding: true,
    label: "Id",
  },
  {
    id: "CompanyName",
    numeric: false,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "Email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },

];

export const blogTableHeaders = [
  {
    id: "products",
    numeric: false,
    disablePadding: true,
    label: "Blog Title",
  },
  {
    id: "last_modified",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },

  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Edit",
  },
];

export const userTableHeaders = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  // {
  //   id: "joined",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Joined",
  // },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
];

export const listTableHeaders = [
  {
    id: "orderNo",
    numeric: false,
    disablePadding: false,
    label: "Order No.",
  },
  {
    id: "companyname",
    numeric: false,
    disablePadding: false,
    label: "Company Name",
  },
  {
    id: "day",
    numeric: false,
    disablePadding: false,
    label: "Day",
  },

  {
    id: "customerName",
    numeric: false,
    disablePadding: true,
    label: "Customer Name",
  },
  {
    id: "orderTiming",
    numeric: false,
    disablePadding: false,
    label: "Order Timing",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Order Status",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Price",
  },
  // {
  //   id: "status",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Status",
  // },
];

export const userNavItems = [
  { label: "Orders", path: "/dashboard/users/id", icon: <BorderColor /> },
  { label: "Listing", path: "/dashboard/users/id/listings", icon: <Dns /> },
  {
    label: "Challan",
    path: "/dashboard/users/id/challans",
    icon: <ReceiptLong />,
  },
  {
    label: "Storage Request",
    path: "/dashboard/users/id/storageRequest",
    icon: <Folder />,
  },
  {
    label: "Transport Request",
    path: "/dashboard/users/id/transportRequest",
    icon: <ModeOfTravel />,
  },
  {
    label: "Orchard Request",
    path: "/dashboard/users/id/orchardRequest",
    icon: <RequestQuote />,
  },
];

export const userListingHeadingItems = [
  {
    id: "phoneno",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Variety",
  },
  {
    id: "min",
    numeric: false,
    disablePadding: false,
    label: "Price Range",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
];

export const usersOrdersHeadingItems = [
  {
    id: "phoneno",
    numeric: false,
    disablePadding: true,
    label: "User",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "paymentId",
    numeric: false,
    disablePadding: false,
    label: "Order ID",
  },
  {
    id: "orderTotal",
    numeric: false,
    disablePadding: false,
    label: "Order Amount",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "",
    numeric: true,
    disablePadding: false,
    label: "Edit Order",
  },
];

export const usersChallenHeadingItems = [
  {
    id: "currentChallan",
    numeric: false,
    disablePadding: false,
    label: "Challan No.",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "Date Created",
  },
  {
    id: "paymentId",
    numeric: false,
    disablePadding: false,
    label: "Billed By",
  },
  {
    id: "orderTotal",
    numeric: false,
    disablePadding: false,
    label: "Billed To",
  },
  {
    id: "more",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];
export const usersOrchardRequestHeadingItems = [
  {
    id: "phoneno",
    numeric: false,
    disablePadding: true,
    label: "Request DATE",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "location",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "Complete Address",
  },
  {
    id: "paymentId",
    numeric: false,
    disablePadding: false,
    label: "Size (IN Canel)",
  },
  {
    id: "orderTotal",
    numeric: false,
    disablePadding: false,
    label: "Remarks",
  },
];

export const usersTransportRequestHeadingItems = [
  {
    id: "phoneno",
    numeric: false,
    disablePadding: true,
    label: "Request DATE",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "From",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "To",
  },
  {
    id: "paymentId",
    numeric: false,
    disablePadding: false,
    label: "Quantity of Boxes",
  },
  {
    id: "orderTotal",
    numeric: false,
    disablePadding: false,
    label: "Remarks",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Insurance Opted",
  },
];

export const usersStorageRequestHeadingItems = [
  {
    id: "phoneno",
    numeric: false,
    disablePadding: true,
    label: "Request DATE",
  },
  {
    id: "productName",
    numeric: false,
    disablePadding: false,
    label: "From DATE",
  },
  {
    id: "product_id",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "paymentId",
    numeric: false,
    disablePadding: false,
    label: "To DATE",
  },
  {
    id: "orderTotal",
    numeric: false,
    disablePadding: false,
    label: "Quantity of Boxes",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Remarks",
  },
  {
    id: "",
    numeric: true,
    disablePadding: false,
    label: "View",
  },
];

export const productCategoriesHeadings = [
  {
    id: "categoryName",
    numeric: false,
    disablePadding: false,
    label: "Product Name",
  },
  {
    id: "subCategories",
    numeric: false,
    disablePadding: false,
    label: "VARIETY",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

export const bannerHeadings = [
  {
    id: "image",
    numeric: false,
    disablePadding: false,
    label: "Image",
  },
  {
    id: "uploadedAt",
    numeric: false,
    disablePadding: false,
    label: "Uploaded At",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];

export const categoriesHeadings = [
  {
    id: "image",
    numeric: false,
    disablePadding: false,
    label: "Image",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
  },
];
