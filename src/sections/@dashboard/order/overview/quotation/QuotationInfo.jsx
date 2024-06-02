// noinspection DuplicatedCode,JSValidateTypes

import { useState } from 'react';
import PropTypes from 'prop-types';
import QuotationCardTmp from './QuotationCardTmp';
import CreateNewQuotationVer2 from '../../../../../pages/dashboard/CreateNewQuotationVer2';
import PdfQuotationAction from './PdfQuotationAction';
import QuotationNewEditForm from './create-edit';

// ----------------------------------------------------------------------

OrderDetailWithProductList.propTypes = {
  order: PropTypes.object,
  refetchData: PropTypes.func,
  deliverBillRefetch: PropTypes.func,
};

export default function OrderDetailWithProductList({ order, refetchData, deliverBillRefetch }) {
  const [isEdit, setIsEdit] = useState(false);
  const [formMethod, setFormMethod] = useState();

  const [isPaid, setIsPaid] = useState(false);

  if (!order) {
    return null;
  }

  const {
    // VAT,
    // createdAt,
    // deliverAddress,
    // deliverOrderList,
    // deliveryMethodDescription,
    // discount,
    // driver,
    // executionTimeDescription,
    // freightMessage,
    invoiceNo,
    // paymentList,
    // percentOfAdvancePayment,
    // remainingPaymentMoney,
    // reportingValidityAmount,
    sale,
    // status,
    // totalMoney,
    // updatedAt,
    freightPrice,
    customer,
    itemGroupList,
    orderId,
  } = order;

  const handleEditQuotation = () => {
    setIsEdit(true);
  };

  const handleDeniedEditQuotation = () => {
    setIsEdit(false);
  };

  const handleSetFormMethod = (value) => {
    setFormMethod(value);
  };

  const handlePaidQuotation = () => {
    setIsPaid(true);
  };
  const handleDeniedPaidQuotation = () => {
    setIsPaid(false);
  };

  const productMultiCate = [];
  itemGroupList.map((item) =>
    productMultiCate.push({
      ...item?.orderDetailList,
    })
  );

  if (!itemGroupList || itemGroupList.length < 1) {
    return (
      <CreateNewQuotationVer2
        sale={sale}
        orderId={orderId}
        isCreate
        customerFromDetail={customer}
        formMethod={formMethod}
        invoiceNo={invoiceNo}
      />
    );
  }

  return (
    <>
      {itemGroupList?.length > 0 && (
        <>
          {!isEdit && (
            <QuotationCardTmp
              order={order}
              isPaid={isPaid}
              handleClosePaid={handleDeniedPaidQuotation}
              refetchData={refetchData}
              deliverBillRefetch={deliverBillRefetch}
            />
          )}
          {isEdit &&
            (itemGroupList?.length > 1 ? (
              <QuotationNewEditForm
                currentProducts={productMultiCate}
                currentCategories={itemGroupList}
                isEdit
                customer={customer}
                freightPrice={freightPrice}
                order={order}
                isMultiCategories
                setFormMethod={handleSetFormMethod}
                handleDeniedEdit={handleDeniedEditQuotation}
              />
            ) : (
              itemGroupList.map((row, index) => (
                <QuotationNewEditForm
                  key={index}
                  currentProducts={row?.orderDetailList}
                  isEdit
                  order={order}
                  customer={customer}
                  freightPrice={freightPrice}
                  isMultiCategories={false}
                  setFormMethod={handleSetFormMethod}
                  handleDeniedEdit={handleDeniedEditQuotation}
                />
              ))
            ))}
        </>
      )}
      <PdfQuotationAction
        order={order}
        handlePaid={handlePaidQuotation}
        isPaid={isPaid}
        handleDeniedPaid={handleDeniedPaidQuotation}
        handleEdit={handleEditQuotation}
        isEdit={isEdit}
        handleDeniedEdit={handleDeniedEditQuotation}
        formMethod={formMethod}
      />
    </>
  );
}
