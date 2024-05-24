// noinspection DuplicatedCode

import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';

export const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

export const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  salary: getIcon('ic_ecommerce'),
  customer: getIcon('ic_customer'),
  saleAndMarketing: getIcon('ic_kanban'),
  detail: getIcon('ic_booking'),
};

export const adminNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
      // { title: 'Lương theo doanh thu', path: PATH_DASHBOARD.general.salaryBySale, icon: ICONS.salary },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // USER
      {
        title: 'Người dùng, nhân viên',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.user.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.user.new },
          // { title: 'Cập nhật', path: PATH_DASHBOARD.user.demoEdit },
        ],
      },
      // Khách hàng
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.customer.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.customer.new },
          // { title: 'Cập nhật', path: PATH_DASHBOARD.customer.demoEdit },
        ],
      },
      // product
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.product.list },
          { title: 'Danh sách dạng lưới', path: PATH_DASHBOARD.product.shop },
          { title: 'Chi tiết', path: PATH_DASHBOARD.product.demoView },
          { title: 'Tạo SP mới', path: PATH_DASHBOARD.product.new },
          { title: 'Sửa SP', path: PATH_DASHBOARD.product.demoEdit },
          // { title: 'checkout', path: PATH_DASHBOARD.product.checkout },
        ],
      },
    ],
  },
  {
    subheader: 'Kinh doanh',
    items: [
      { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.list, icon: ICONS.invoice },
      { title: 'Chi tiết', path: PATH_DASHBOARD.saleAndMarketing.demoView, icon: ICONS.detail },
      { title: 'Tạo đơn hàng mới', path: PATH_DASHBOARD.saleAndMarketing.new, icon: ICONS.saleAndMarketing },
      // { title: 'Chỉnh sửa đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.demoEdit, icon: ICONS.saleAndMarketing },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'Vận tải',
  //   items: [
  //     {
  //       title: 'Lệnh xuất hàng',
  //       path: PATH_DASHBOARD.deliveryOrder.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'Danh sách', path: PATH_DASHBOARD.deliveryOrder.list },
  //         { title: 'Cập nhật', path: PATH_DASHBOARD.deliveryOrder.demoEdit },
  //       ],
  //     },
  //     {
  //       title: 'Xe, Phương tiện',
  //       path: PATH_DASHBOARD.transportation.root,
  //       icon: ICONS.cart,
  //       children: [
  //         { title: 'Danh sách', path: PATH_DASHBOARD.transportation.list },
  //         { title: 'Tạo mới', path: PATH_DASHBOARD.transportation.new },
  //         { title: 'Cập nhật', path: PATH_DASHBOARD.transportation.demoEdit },
  //       ],
  //     },
  //     {
  //       title: 'Lái xe, phụ xe',
  //       path: PATH_DASHBOARD.driver.root,
  //       icon: ICONS.customer,
  //       children: [
  //         { title: 'Danh sách', path: PATH_DASHBOARD.driver.list },
  //         { title: 'Tạo mới', path: PATH_DASHBOARD.driver.new },
  //         { title: 'Cập nhật', path: PATH_DASHBOARD.driver.demoEdit },
  //       ],
  //     },
  //     { title: 'Tổng hợp hàng tháng', path: '#', icon: ICONS.analytics },
  //   ],
  // },
  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'Chức năng',
  //   items: [
  //     {
  //       title: 'Forum',
  //       path: PATH_DASHBOARD.blog.root,
  //       icon: ICONS.blog,
  //       children: [
  //         { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
  //         { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
  //         { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
  //       ],
  //     },
  //     { title: 'Lịch làm việc', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
  //   ],
  // },
];

export const directorNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // USER
      {
        title: 'Người dùng, nhân viên',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.user.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.user.new },
          // { title: 'Cập nhật', path: PATH_DASHBOARD.user.demoEdit },
        ],
      },
      // Khách hàng
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.customer.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.customer.new },
          { title: 'Cập nhật', path: PATH_DASHBOARD.customer.demoEdit },
        ],
      },
      // product
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.cart,
        children: [
          { title: 'shop', path: PATH_DASHBOARD.product.shop },
          { title: 'Chi tiết', path: PATH_DASHBOARD.product.demoView },
          { title: 'list', path: PATH_DASHBOARD.product.list },
          { title: 'create', path: PATH_DASHBOARD.product.new },
          { title: 'edit', path: PATH_DASHBOARD.product.demoEdit },
          { title: 'checkout', path: PATH_DASHBOARD.product.checkout },
        ],
      },
    ],
  },
  {
    subheader: 'Kinh doanh',
    items: [
      { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.list, icon: ICONS.invoice },
      { title: 'Chi tiết', path: PATH_DASHBOARD.saleAndMarketing.demoView, icon: ICONS.detail },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.cart,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.deliveryOrder.list }],
      },
      {
        title: 'Xe, Phương tiện',
        path: PATH_DASHBOARD.transportation.root,
        icon: ICONS.cart,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.transportation.list }],
      },
      {
        title: 'Lái xe, phụ xe',
        path: PATH_DASHBOARD.driver.root,
        icon: ICONS.customer,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.driver.list }],
      },
      { title: 'Tổng hợp hàng tháng', path: '#', icon: ICONS.analytics },
    ],
  },
  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Chức năng',
    items: [
      {
        title: 'Forum',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
          { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
          { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
        ],
      },
    ],
  },
];

export const salesNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
      { title: 'Lương theo doanh thu', path: PATH_DASHBOARD.general.salaryBySale, icon: ICONS.salary },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // Khách hàng
      {
        title: 'Khách hàng',
        path: PATH_DASHBOARD.customer.root,
        icon: ICONS.customer,
        children: [{ title: 'Danh sách', path: PATH_DASHBOARD.customer.list }],
      },
      // product
      {
        title: 'Sản phẩm',
        path: PATH_DASHBOARD.product.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách dạng lưới', path: PATH_DASHBOARD.product.shop },
          { title: 'Danh sách', path: PATH_DASHBOARD.product.list },
          { title: 'Chi tiết', path: PATH_DASHBOARD.product.demoView },
        ],
      },
    ],
  },
  {
    subheader: 'Kinh doanh',
    items: [
      { title: 'Danh sách đơn hàng', path: PATH_DASHBOARD.saleAndMarketing.list, icon: ICONS.invoice },
      { title: 'Chi tiết', path: PATH_DASHBOARD.saleAndMarketing.demoView, icon: ICONS.detail },
    ],
  },
  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Chức năng',
    items: [
      {
        title: 'Forum',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
          { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
          { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
        ],
      },
      { title: 'Lịch làm việc', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
    ],
  },
];

export const transporterManagerNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
      { title: 'Bảng Lương', path: PATH_DASHBOARD.general.salaryBySale, icon: ICONS.salary },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.deliveryOrder.list },
          { title: 'Cập nhật', path: PATH_DASHBOARD.deliveryOrder.demoEdit },
        ],
      },
      {
        title: 'Xe, Phương tiện',
        path: PATH_DASHBOARD.transportation.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.transportation.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.transportation.new },
          { title: 'Cập nhật', path: PATH_DASHBOARD.transportation.demoEdit },
        ],
      },
      {
        title: 'Lái xe, phụ xe',
        path: PATH_DASHBOARD.driver.root,
        icon: ICONS.customer,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.driver.list },
          { title: 'Tạo mới', path: PATH_DASHBOARD.driver.new },
          { title: 'Cập nhật', path: PATH_DASHBOARD.driver.demoEdit },
        ],
      },
      { title: 'Tổng hợp hàng tháng', path: '#', icon: ICONS.analytics },
    ],
  },
  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Chức năng',
    items: [
      {
        title: 'Forum',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
          { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
          { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
        ],
      },
      { title: 'Lịch làm việc', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
    ],
  },
];

export const driverNavConfig = [
  // Chung
  // ----------------------------------------------------------------------
  {
    subheader: 'Chung',
    items: [
      { title: 'Thông tin tổng hợp', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Tài khoản', path: PATH_DASHBOARD.userAccount, icon: ICONS.user },
      { title: 'Bảng lương', path: PATH_DASHBOARD.general.salaryBySale, icon: ICONS.salary },
    ],
  },
  // Vận tải
  // ----------------------------------------------------------------------
  {
    subheader: 'Vận tải',
    items: [
      {
        title: 'Lệnh xuất hàng',
        path: PATH_DASHBOARD.deliveryOrder.root,
        icon: ICONS.cart,
        children: [
          { title: 'Danh sách', path: PATH_DASHBOARD.deliveryOrder.list },
          { title: 'Cập nhật', path: PATH_DASHBOARD.deliveryOrder.demoEdit },
        ],
      },
      { title: 'Tổng hợp hàng tháng', path: '#', icon: ICONS.analytics },
    ],
  },
  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Chức năng',
    items: [
      {
        title: 'Forum',
        path: PATH_DASHBOARD.blog.root,
        icon: ICONS.blog,
        children: [
          { title: 'Tin tức', path: PATH_DASHBOARD.blog.posts },
          { title: 'Chi tiết', path: PATH_DASHBOARD.blog.demoView },
          { title: 'Tạo mới', path: PATH_DASHBOARD.blog.new },
        ],
      },
      { title: 'Lịch làm việc', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
    ],
  },
];
