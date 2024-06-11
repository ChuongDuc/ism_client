import { useLocation, useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Page from '../../components/Page';
import TransportationNewEditForm from '../../sections/@dashboard/transportation/TransportationNewEditForm';

// ----------------------------------------------------------------------
const GET_LIST_VEHICLES = loader('../../graphql/queries/vehicle/listAllVehicle.graphql');

const GET_LIST_DRIVER = loader('../../graphql/queries/vehicle/listDriverUnselectedVehicle.graphql');

// ----------------------------------------------------------------------

export default function TransitCarCreate() {
  const { pathname } = useLocation();

  const { id } = useParams();

  const isEdit = pathname.includes('cap-nhat');

  const [currentTransportation, setCurrentTransportation] = useState(null);

  const [drivers, setDrivers] = useState([]);
  const { data: getVehicles } = useQuery(GET_LIST_VEHICLES, {
    variables: {
      input: {},
    },
  });
  const { data: getListDriver, refetch } = useQuery(GET_LIST_DRIVER, {
    variables: {
      input: {},
    },
  });

  useEffect(() => {
    if (getVehicles) {
      const dataVehicles = getVehicles?.listAllVehicle?.edges.find((edges) => edges.node.id === Number(id));
      setCurrentTransportation(id ? dataVehicles.node : null);
    }
  }, [id, getVehicles]);
  useEffect(() => {
    if (getListDriver) {
      setDrivers(getListDriver?.listDriverUnselectedVehicle);
    }
  }, [getListDriver]);

  return (
    <Page title={!isEdit ? 'Tạo Xe-phương tiện mới' : 'Sửa thông tin Xe-phương tiện'}>
      <Container maxWidth={false}>
        <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
          {!isEdit ? 'Tạo Xe-phương tiện mới' : 'Sửa thông tin Xe-phương tiện'}
        </Typography>
        <TransportationNewEditForm
          vehiclesId={id}
          isEdit={isEdit}
          currentTransportation={currentTransportation}
          drivers={drivers}
          refetchData={refetch}
        />
      </Container>
    </Page>
  );
}
