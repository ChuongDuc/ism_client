import { useLocation, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

const PRODUCT_DETAIL = loader('../../graphql/queries/products/productDetail.graphql');

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { pathname } = useLocation();
  const { id } = useParams();

  const isEdit = pathname.includes('chinh-sua');

  const { data } = useQuery(PRODUCT_DETAIL, {
    variables: {
      input: {
        id: Number(id),
      },
    },
  });

  const currentProduct = data?.productDetail;
  return (
    <Page title="Sửa thông tin sản phẩm mới">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Bảng giá chung', href: PATH_DASHBOARD.priceList.root },
            { name: !isEdit ? 'Sản phẩm mới' : 'Sửa thông tin sản phẩm' },
          ]}
        />

        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
