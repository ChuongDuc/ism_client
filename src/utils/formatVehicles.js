export const formatVehicles = (vehicles) => {
  switch (vehicles) {
    case 'Xe Tải':
      return 'truck';
    case 'Xe Container':
      return 'container';
    case 'container':
      return 'Xe Container';
    case 'truck':
      return 'Xe Tải';
    default:
      return 'Chọn loại xe';
  }
};
