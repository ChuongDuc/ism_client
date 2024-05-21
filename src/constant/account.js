// eslint-disable-next-line import/named
import { VietnameseRoleName, Role, RoleNumberList } from './role';

export const AdminAccount = {
  id: 'admin-01',
  email: 'admin-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Admin',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.admin,
};

export const DirectorAccount = {
  id: 'director-01',
  email: 'giamdoc-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Giám đốc',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.director,
};

export const ManagerAccount = {
  id: 'manager-01',
  email: 'quanly-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Quản lý',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.manager,
};

export const Sale1Account = {
  id: 'saleId-01',
  email: 'kinhdoanh1-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 1',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_46.jpg',
  status: 'Đang hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Sale2Account = {
  id: 'saleId-02',
  email: 'kinhdoanh2-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 2',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_47.jpg',
  status: 'Đang hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Sale3Account = {
  id: 'saleId-03',
  email: 'kinhdoanh3-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 3',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_40.jpg',
  status: 'Đang hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Sale4Account = {
  id: 'saleId-04',
  email: 'kinhdoanh4-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 4',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_41.jpg',
  status: 'Ngừng hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Sale5Account = {
  id: 'saleId-05',
  email: 'kinhdoanh5-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 5',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_42.jpg',
  status: 'Đang hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Sale6Account = {
  id: 'saleId-06',
  email: 'kinhdoanh6-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Kinh doanh 6',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_45.jpg',
  status: 'Đang hoạt động',
  role: Role.sales,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const TransporterManagerAccount = {
  id: 'transporterManagerId-01',
  email: 'dieuvan-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Điều vận',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.transporterManager,
};

export const Driver1ManagerAccount = {
  id: 'driverId-01',
  email: 'laixe1-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Lái xe 1',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_8.jpg',
  status: 'Đang hoạt động',
  role: Role.driver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Driver2ManagerAccount = {
  id: 'driverId-02',
  email: 'laixe2-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Lái xe 2',
  address: 'Hà Nội',
  photoURL: '/static/mock-images/avatars/user-avatar_2.jpg',
  status: 'Đang hoạt động',
  role: Role.driver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Driver3ManagerAccount = {
  id: 'driverId-03',
  email: 'laixe3-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Lái xe 3',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Ngừng hoạt động',
  role: Role.driver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const Driver4ManagerAccount = {
  id: 'driverId-04',
  email: 'laixe4-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Lái xe 4',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.driver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345678',
};

export const AssistantDriver1ManagerAccount = {
  id: 'assistantDriverId-01',
  email: 'phuxe1-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Phụ xe 1',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Ngừng hoạt động',
  role: Role.assistantDriver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345688',
};

export const AssistantDriver2ManagerAccount = {
  id: 'assistantDriverId-02',
  email: 'phuxe2-demo@tcn.com.vn',
  password: 'demo1234',
  displayName: 'Phụ xe 2',
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
  status: 'Đang hoạt động',
  role: Role.assistantDriver,
  company: 'Công ty CP Thép Công Nghiệp HN',
  phone: '0912345688',
};

export const saleUserList = [Sale1Account, Sale2Account, Sale3Account, Sale5Account, Sale6Account];
export const driverUserList = [
  Driver1ManagerAccount,
  Driver2ManagerAccount,
  Driver4ManagerAccount,
  AssistantDriver1ManagerAccount,
  AssistantDriver2ManagerAccount,
];

export const onlyDriverUserList = [Driver1ManagerAccount, Driver2ManagerAccount, Driver4ManagerAccount];

export const roleNumberToRole = (roleNumber) => {
  switch (roleNumber) {
    case RoleNumberList.director:
      return Role.director;
    case RoleNumberList.admin:
      return Role.admin;
    case RoleNumberList.manager:
      return Role.manager;
    case RoleNumberList.accountant:
      return Role.accountant;
    case RoleNumberList.sales:
      return Role.sales;
    case RoleNumberList.transporterManager:
      return Role.transporterManager;
    case RoleNumberList.driver:
      return Role.driver;
    case RoleNumberList.assistantDriver:
      return Role.assistantDriver;
    default:
      return '';
  }
};
export const roleTypeToVietnameseRoleName = (roleType) => {
  switch (roleType) {
    case Role.director:
      return VietnameseRoleName.director;
    case Role.admin:
      return VietnameseRoleName.admin;
    case Role.manager:
      return VietnameseRoleName.manager;
    case Role.accountant:
      return VietnameseRoleName.accountant;
    case Role.sales:
      return VietnameseRoleName.sales;
    case Role.transporterManager:
      return VietnameseRoleName.transporterManager;
    case Role.driver:
      return VietnameseRoleName.driver;
    case Role.assistantDriver:
      return VietnameseRoleName.assistantDriver;
    default:
      return '';
  }
};
