import { v4 as uuidv4 } from 'uuid';
import mockData from '../utils/mock-data';

const POSTS_TITLE = [
  'Thông số và kích thước thép hình chữ U',
  'Thép cuộn cán nguội dùng để làm gì?',
  'Tại sao nên sử dụng thép mạ kẽm?',
  'Các loại thép tấm cán nóng trên thị trường?',
  'Ưu điểm và ứng dụng của thép hình H',
  'Tìm hiểu về thép tấm? Đặc tính và ứng dụng của các loại thép tấm',
  'Tìm hiểu các đặc điểm của thép tấm chống trượt',
  'Đặc điểm của thép hộp vuông mạ kẽm',
  'Thép hộp mạ kẽm không thể thiếu trong các công trình hiện nay',
  'Thép tấm Hardox là gì?',
  'Thép hình I có những đặc điểm gì?',
  'Những nguồn gốc thép tấm phổ biến hiện nay',
  'Những đặc điểm về thép hình U',
  'Thép tấm sử dụng để làm gì?',
  'Thép tấm cán nguội là gì? Thép tấm cán nguội dùng để làm gì?',
];

const POST_DESCRIPTION = [
  'Thép U là vật liệu cần thiết và rất quan trọng',
  'Thép cuộn cán nguội dùng để làm gì là thắc mắc của rất nhiều người khi có nhu cầu sử dụng',
  'Thép mạ kẽm có hình dáng đa dạng như thép dạng cuộn, thép tấm, thép hình, thép hộp, thép ống…. được phủ trên bề mặt một lớp kẽm mạ với độ dày phù hợp',
  'Thép tấm cán nóng với tính ứng dụng cao của nó luôn rất được ưa chuộng',
  'Thép hình H được sử dụng phổ biến trong mọi công trình. Tuy nhiên những ứng dụng của thép hình H chưa được nhiều người biết đến',
  'Có thể nói thép tấm là một trong những nguyên vật liệu xây dựng không thể thiếu. Nó được ứng dụng trong rất nhiều những ngành công nghiệp khác nhau',
  'Thép tấm nhám còn được gọi là thép tấm chống trượt hoặc thép tấm gân được sản xuất bằng quy trình cán nóng nên bề mặt không có độ bóng đẹp như thép tấm trơn',
  'Thép hộp mạ kẽm bao gồm 2 loại là thép hộp vuông mạ kẽm và thép hộp chữ nhật mạ kẽm',
  'Thép hộp là một trong những vật liệu sắt thép quan trọng và không thể thiếu trong ngành công nghiệp xây dựng, giúp đảm bảo độ bền chắc cũng như nâng cao tính thẩm mỹ cho công trình',
  'Thép tấm Hardox hay còn gọi là thép tấm chống mài mòn, là nguyên liệu có tính chất đặc biệt nên cũng thường được sử dụng trong các công trình đặc biệt',
  'Thép hình I là một trong những nguyên liệu thép hình được nhiều khách hàng quan tâm, tìm kiếm và sử dụng nhiều nhất hiện nay',
  'Thép tấm hiện nay là nguyên liệu vô cùng quan trọng và đặc biệt có ý nghĩa rất lớn đối với các ngành công nghiệp cũng như xây dựng hiện nay',
  'Thép hình U có hai loại chính là thép U đúc và thép U sấn theo yêu cầu',
  'Thép tấm có rất nhiều ứng dụng thực tiến hiện nay. Thép tấm trên thị trường được sản xuất và có nhiều nguồn gốc khác nhau như: thép tấm Formosa (sản xuất theo dây chuyền của Trung Quốc nhưng nhà máy tại Việt Nam)',
  'Thép tấm hiện nay được chia thành thép tấm cán nóng và thép tấm cán nguội. Nếu như mọi người đã quá quen với thép tấm cán nóng và những ứng dụng của sản phẩm thì thép tấm cán nguội là gì',
];

const users = [...Array(12)].map((_, index) => ({
  id: mockData.id(index),
  name: mockData.name.fullName(index),
  avatarUrl: mockData.image.avatar(index),
}));

const COMMENTS = [
  {
    id: uuidv4(),
    name: users[0].name,
    avatarUrl: users[0].avatarUrl,
    message: 'Trông thật đẹp',
    postedAt: mockData.time(1),
    users: [],
    replyComment: [],
  },
  {
    id: uuidv4(),
    name: users[4].name,
    avatarUrl: users[4].avatarUrl,
    message: 'Thật hữu dụng',
    postedAt: mockData.time(5),
    users: [],
    replyComment: [],
  },
  {
    id: uuidv4(),
    name: users[8].name,
    avatarUrl: users[8].avatarUrl,
    message: 'Chất liệu rất tốt',
    postedAt: mockData.time(9),
    users: [],
    replyComment: [],
  },
  {
    id: uuidv4(),
    name: users[9].name,
    avatarUrl: users[9].avatarUrl,
    message: 'Rất hài lòng với sản phẩm',
    postedAt: mockData.time(10),
    users: [],
    replyComment: [],
  },
];

export const postsBlog = [...Array(15)].map((_, index) => ({
  title: POSTS_TITLE[index],
  description: POST_DESCRIPTION[index],
  cover: mockData.image.post(index),
  comment: COMMENTS,
}));
