// noinspection JSValidateTypes,JSUnresolvedReference

import { Box, Button, Card, CardContent, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';
import { Role } from '../../constant';
import CommonBackdrop from '../../components/CommonBackdrop';
import { PATH_DASHBOARD } from '../../routes/paths';
import CreateCategory from '../../sections/@dashboard/category-product/CreateCategory';
import Image from '../../components/Image';
// ----------------------------------------------------------------------------------------------
const GET_ALL_CATEGORY = loader('../../graphql/queries/products/getAllCategory.graphql');
// ----------------------------------------------------------------------

export default function GeneralPriceList() {
  const { user } = useAuth();
  const [allCategories, setAllCategories] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const { data: getAllCategory, loading: loadingCategory } = useQuery(GET_ALL_CATEGORY);

  useEffect(() => {
    if (getAllCategory) {
      setAllCategories(getAllCategory.getAllCategory);
    }
  }, [getAllCategory]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Page title="Danh mục sản phẩm">
      <Container maxWidth={false}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={user?.role === Role.admin || user?.role === Role.director ? 'space-between' : 'left'}
        >
          <Typography variant="h6" gutterBottom textAlign="center" textTransform="none">
            Danh mục sản phẩm
          </Typography>

          {(user?.role === Role.admin || user?.role === Role.director) && (
            <Box sx={{ display: 'flex', justifyContent: 'left', mb: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<Iconify icon={'eva:plus-fill'} />}
                onClick={handleOpenDialog}
              >
                Thêm Mới
              </Button>
            </Box>
          )}
        </Stack>

        <Grid container spacing={2} alignItems="stretch">
          {allCategories?.map((tab, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={2} style={{ display: 'flex' }}>
              <Card
                sx={{ borderRadius: 1, bgcolor: '#c1e2ff' }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <CardContent sx={{ textAlign: 'center', paddingX: '6px' }}>
                  <Image
                    alt={`product_${idx + 1}.jpg`}
                    src={`/static/mock-images/steel-products/product_${idx + 1}.jpg`}
                    ratio="24/9"
                  />
                  <Link to={PATH_DASHBOARD.priceList.priceListProduct(tab.id)} color="inherit" component={RouterLink}>
                    <Typography fontWeight={500} variant="body2" sx={{ color: 'common.black' }}>
                      {tab.name}
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <CreateCategory onClose={handleCloseDialog} open={openDialog} />

        <CommonBackdrop loading={loadingCategory} />
      </Container>
    </Page>
  );
}
