import { PATH_DOCS } from '../../routes/paths';
import { PATH_AFTER_LOGIN } from '../../config';
import Iconify from '../../components/Iconify';
import { Dashboard } from '../../constant';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Trang chủ',
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
  },
  {
    title: 'Chức năng',
    path: '/pages',
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Tin tức',
        items: [
          { title: 'Bảng tin nội bộ', path: '' },
          { title: 'Quy định, Quy chế', path: '#' },
          { title: 'Tuyển dụng', path: '' },
          { title: 'Khen thưởng, Kỷ Luật', path: '#' },
        ],
      },
      {
        subheader: 'Tài liệu',
        items: [
          { title: 'Hướng dẫn bán hàng', path: '#' },
          { title: 'Hồ sơ năng lực', path: '#' },
          { title: 'Hồ sơ nhân viên', path: '#' },
          { title: 'Tài liệu khác', path: '#' },
        ],
      },
      {
        subheader: Dashboard,
        items: [{ title: Dashboard, path: PATH_AFTER_LOGIN }],
      },
    ],
  },
  {
    title: 'Hướng dẫn bán hàng',
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: PATH_DOCS,
  },
];

export default menuConfig;
