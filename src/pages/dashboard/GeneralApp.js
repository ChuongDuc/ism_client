import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import useAuth from '../../hooks/useAuth';
import Page from '../../components/Page';
import { DefaultRowsPerPage } from '../../constant';
import CommonNotificationList from '../../sections/@dashboard/general/app/CommonNotificationList';
import OrderMoneyCard from '../../sections/@dashboard/general/app/OrderMoneyCard';
// ----------------------------------------------------------------------
const NOTIFICATION = loader('../../graphql/queries/userNotification/listUserNotification.graphql');
const ARRAY_NOTIFICATION = loader('../../graphql/queries/userNotification/listArrayUserNotification.graphql');
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();

  const [getListUserNotification, setGetListUserNotification] = useState([]);

  const [getListArrUserNotification, setGetListArrUserNotification] = useState([]);

  const [page, setPage] = useState(0);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: 0,
  });

  const {
    data: listNotification,
    loading: loadingNotificationList,
    error: errorNotificationList,
  } = useQuery(NOTIFICATION, {
    variables: {
      input: {
        userId: Number(user.id),
        args: {
          first: 100,
          after: 0,
        },
      },
    },
  });

  const { data: listArrNotification, fetchMore } = useQuery(ARRAY_NOTIFICATION, {
    variables: {
      input: {
        userId: Number(user.id),
        event: 'Payment',
        args: {
          first: DefaultRowsPerPage,
          after: 0,
        },
      },
    },
  });

  useEffect(() => {
    if (listNotification) {
      setGetListUserNotification(listNotification?.listUserNotification?.edges.map((el) => el.node));
    }
  }, [listNotification]);

  useEffect(() => {
    if (listArrNotification) {
      setGetListArrUserNotification(listArrNotification.listArrayUserNotification?.edges.map((el) => el.node));
      setPageInfo((prevState) => ({
        ...prevState,
        hasNextPage: listArrNotification.listArrayUserNotification?.pageInfo.hasNextPage,
        endCursor: parseInt(listArrNotification.listArrayUserNotification?.pageInfo.endCursor, 10),
      }));
    }
  }, [listArrNotification]);

  const updateQuery = (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousResult;
    return {
      ...previousResult,
      listArrayUserNotification: {
        ...previousResult.listArrayUserNotification,
        edges: [...previousResult.listArrayUserNotification.edges, ...fetchMoreResult.listArrayUserNotification.edges],
        pageInfo: fetchMoreResult.listArrayUserNotification.pageInfo,
        totalCount: fetchMoreResult.listArrayUserNotification.totalCount,
      },
    };
  };

  const filteredMoneyOrders = useMemo(
    () => getListArrUserNotification.map((t) => t?.notification?.Order),
    [getListArrUserNotification]
  );

  const tableEl = useRef();
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const scrollListener = useCallback(() => {
    const bottom = tableEl.current?.scrollHeight - tableEl.current?.clientHeight;

    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }

    if (tableEl.current?.scrollTop > bottom - distanceBottom && pageInfo.hasNextPage && !loading) {
      setLoading(true);
      fetchMore({
        variables: {
          input: {
            userId: Number(user.id),
            event: 'Payment',
            args: {
              first: DefaultRowsPerPage,
              after: (page + 1) * DefaultRowsPerPage,
            },
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => updateQuery(previousResult, { fetchMoreResult }),
      }).then(() => {
        setLoading(false);
        setPage(page + 1);
      });
    }
  }, [setPage, fetchMore, pageInfo.hasNextPage, page, loading, distanceBottom, user.id]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return (
    <Page title="Thông tin tổng hợp">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <CommonNotificationList
              notificationList={getListUserNotification}
              errorNotificationList={errorNotificationList}
              loadingNotificationList={loadingNotificationList}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <CardHeader title="Thông tin thanh toán" />
              <CardContent>
                <div
                  ref={tableEl}
                  style={{ height: theme.breakpoints.up('sm') ? '75dvh' : '170px', overflowY: 'auto' }}
                >
                  {filteredMoneyOrders.length > 0 ? (
                    <Stack spacing={2}>
                      {filteredMoneyOrders.map((moneyOrder, idx) => (
                        <OrderMoneyCard key={idx} moneyOrder={moneyOrder} onDelete={() => console.log('DELETE', idx)} />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="subtitle2">Bạn chưa có thông tin đơn hàng thanh toán</Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
