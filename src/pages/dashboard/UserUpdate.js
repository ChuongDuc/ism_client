import { useLocation, useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// ----------------------------------------------------------------------

const USER_BY_ID = loader('../../graphql/queries/user/getUserById.graphql');

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const [currentUser, setCurrentUser] = useState({});

  const { data } = useQuery(USER_BY_ID, {
    variables: {
      userId: parseInt(id.toString(), 10),
    },
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    onError(err) {
      console.error(err);
    },
  });

  const isEdit = pathname.includes('chinh-sua');

  useEffect(() => {
    if (data) {
      setCurrentUser(data?.getUserById);
    }
  }, [data]);

  return (
    <Page title="Người dùng: Sửa thông tin người dùng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {'Sửa thông tin người dùng'}
        </Typography>

        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
