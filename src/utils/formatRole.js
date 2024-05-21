export const formatRole = (role) => {
  switch (role) {
    case 'Director':
      return 'Giám đốc';
    case 'Admin':
      return 'Quản lý hệ thống';
    case 'Accountant':
      return 'Kế toán';
    case 'Sales':
      return 'Bán hàng';
    case 'TransporterManager':
      return 'Quản lý phương tiện';
    case 'Driver':
      return 'Lái xe';
    case 'AssistantDriver':
      return 'Phụ xe';
    case 'Manager':
      return 'Quản lý';
    default:
      return '';
  }
};
export const formatRoleInput = (role) => {
  switch (role) {
    case 'Giám đốc':
      return 'Director';
    case 'Admin':
      return 'Admin';
    case 'Kế toán':
      return 'Accountant';
    case 'Bán hàng':
      return 'Sales';
    case 'Quản lý phương tiện':
      return 'TransporterManager';
    case 'Lái xe':
      return 'Driver';
    case 'Phụ xe':
      return 'AssistantDriver';
    case 'Quản lý':
      return 'Manager';
    default:
      return '';
  }
};

export const formatRoleByIdRole = (roleId) => {
  switch (roleId) {
    case 999:
      return 'Giám đốc';
    case 99:
      return 'Admin';
    case 9:
      return 'Quản lý';
    case 5:
      return 'Kế toán';
    case 1:
      return 'Kinh doanh';
    case 2:
      return 'Quản lý vận chuyển';
    case 3:
      return 'Lái xe';
    case 4:
      return 'Phụ xe';
    default:
      return '';
  }
};
