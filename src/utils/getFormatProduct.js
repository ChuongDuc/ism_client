export const formatUnit = (product) => {
  switch (product?.unit) {
    case 'pipe':
      return 'Cây';
    case 'plate':
      return 'Tấm';
    case 'cai':
      return 'Cái';
    case 'chiec':
      return 'Chiếc';
    case 'm':
      return 'Mét';
    case 'm2':
      return 'M2';
    case 'kg':
      return 'kg';
    case 'cuon':
      return 'Cuộn';
    case 'md':
      return 'md';
    default:
      return '';
  }
};

export const formatType = (product) => {
  switch (product?.type) {
    case 'plate':
      return 'Thép tấm';
    case 'shape':
      return 'Thép hình';
    default:
      return '';
  }
};

export const formatFormType = (product) => {
  switch (product?.formType) {
    case 'VAT':
      return 'Thuế VAT';
    case 'tonnage':
      return 'Đơn trọng';
    default:
      return '';
  }
};

export const reverseFormatFormType = (type) => {
  switch (type) {
    case 'Thép hình':
      return 'shape';
    case 'Thép tấm':
      return 'plate';
    default:
      return '';
  }
};

export const formatIdToFileName = (categoryId) => {
  switch (categoryId) {
    case 1:
      return 'Thep_hinh_I';
    case 2:
      return 'Thep_hinh_U';
    case 3:
      return 'Thep_hinh_H';
    case 4:
      return 'Thep_hinh_V';
    case 5:
      return 'Thep_tam';
    case 6:
      return 'Thep_la';
    case 7:
      return 'Thep_Hoa_Phat';
    case 8:
      return 'Thep_tron_dac';
    case 9:
      return 'Thep_tam_nham';
    case 10:
      return 'Thep_ray';
    case 11:
      return 'Thep_hinh';
    case 12:
      return 'Ban_ma';
    case 13:
      return 'Ma_kem_nhung_nong';
    case 14:
      return 'Thep_luoi';
    case 15:
      return 'Ton_lop';
    case 16:
      return 'Phu_kien';
    case 17:
      return 'Thep_INOX';
    default:
      return '';
  }
};
