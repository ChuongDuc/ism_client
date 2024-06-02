// noinspection DuplicatedCode

import PropTypes from 'prop-types';
import { Avatar, TableCell, TableRow, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import { useSnackbar } from 'notistack';

const UPDATE = loader('../../graphql/mutations/deliverOrder/updateDeliverOrder.graphql');
const LIST_ALL_DELIVER_ORDER = loader('../../graphql/queries/deliverOrder/listAllDeliverOrder.graphql');
// ----------------------------------------------------------------------

UserDialogTableRow.propTypes = {
  idx: PropTypes.number,
  row: PropTypes.object,
  deliverOder: PropTypes.object,
  selected: PropTypes.bool,
  selectRow: PropTypes.func,
};

export default function UserDialogTableRow({ row, idx, selected, selectRow, deliverOder }) {
  const { fullName, avatarURL, userName, email, phoneNumber, id } = row;
  const { enqueueSnackbar } = useSnackbar();

  const [updateFn] = useMutation(UPDATE, {
    onCompleted: async (res) => {
      if (res) {
        return res;
      }
      return null;
    },
    refetchQueries: () => [
      {
        query: LIST_ALL_DELIVER_ORDER,
        variables: {
          input: {
            // driverId: parseInt(id, 10),
          },
        },
      },
    ],
  });

  const onSubmit = async () => {
    try {
      await update(deliverOder.id, id, deliverOder.deliveryDate);
    } catch (error) {
      console.log(error);
    }
  };

  const update = async () => {
    const response = await updateFn({
      variables: {
        input: {
          deliverOrderId: deliverOder.id,
          driverId: parseInt(id, 10),
        },
      },
      onError(err) {
        enqueueSnackbar(err.message, {
          variant: 'warning',
        });
      },
    });

    if (!response.errors) {
      enqueueSnackbar('Cập nhật lái xe thành công', {
        variant: 'success',
      });
    }
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        onDoubleClick={() => {
          selectRow();
          onSubmit();
        }}
      >
        <TableCell align="left">{idx + 1}</TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={fullName} src={avatarURL} sx={{ mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {userName}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {email}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {phoneNumber}
        </TableCell>
      </TableRow>
    </>
  );
}
