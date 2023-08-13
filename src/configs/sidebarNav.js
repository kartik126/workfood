import { PATH_DASHBOARD } from "../routes/paths";

const sidebarNav = [
  {
    link: PATH_DASHBOARD.root,
    section: "dashboard",
    icon: <i className="bx bx-home-alt"></i>,
    text: "Home",
  },
  // {
  //     link: '/orders',
  //     section: 'orders',
  //     icon: <i className='bx bx-receipt' ></i>,
  //     text: 'Orders'
  // },
  {
    link: PATH_DASHBOARD.mandi,
    section: "domainName",
    icon: <i className="bx bx-line-chart"></i>,
    text: "Domain Name",
  },
  {
    link: PATH_DASHBOARD.listing,
    section: "Orders",
    icon: <i className="bx bx-receipt"></i>,
    text: "Orders",
  },
  {
    link: PATH_DASHBOARD.products,
    section: "products",
    icon: <i className="bx bx-cube"></i>,
    text: "Products",
  },
  {
    link: PATH_DASHBOARD.users.root,
    section: "users",
    icon: <i className="bx bx-user"></i>,
    text: "Users",
  },
  {
    link: PATH_DASHBOARD.blogs,
    section: "blogs",
    icon: <i className="bx bx-chat"></i>,
    text: "Blog",
  },
  {
    link: PATH_DASHBOARD.settings,
    section: "settings",
    icon: <i className="bx bx-cog"></i>,
    text: "Settings",
  },
];

export default sidebarNav;
