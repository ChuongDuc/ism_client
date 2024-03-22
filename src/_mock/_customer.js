import _mock from './_mock';
import { randomNumberRange } from './funcs';

// ----------------------------------------------------------------------
export const _customerList = [...Array(18)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: _mock.image.avatar(index),
  cover: _mock.image.customerCover(98),
  name: _mock.name.fullName(index),
  phoneNumber: _mock.phoneNumber(index),
  email: `khach-hang-${index + 1}@gmail.com`,
  totalOrder: randomNumberRange(1, 20),
  nextOrder: randomNumberRange(0, 2),
  company: {
    companyName: _mock.company(index),
    companyPhoneNumber: _mock.phoneNumber(index),
    address: _mock.address.fullAddress(index),
  },
}));
