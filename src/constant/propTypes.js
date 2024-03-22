import PropTypes from 'prop-types';
import { DeliveryStatus } from './utilities';

export const userPropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    address: PropTypes.string,
    photoURL: PropTypes.string,
    status: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string,
  });

export const salePropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    address: PropTypes.string,
    photoURL: PropTypes.string,
    status: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string,
  });

export const driverPropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    address: PropTypes.string,
    photoURL: PropTypes.string,
    status: PropTypes.string,
    company: PropTypes.string,
    phone: PropTypes.string,
  });

export const customerPropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    avatarUrl: PropTypes.string,
    cover: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    totalOrder: PropTypes.number,
    nextOrder: PropTypes.number,
    company: PropTypes.shape({
      companyName: PropTypes.string,
      companyPhoneNumber: PropTypes.string,
      address: PropTypes.string,
    }),
  });

export const productPropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    cover: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    code: PropTypes.string,
    sku: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.string,
    weight: PropTypes.string,
    priceSale: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
    inventoryType: PropTypes.string,
    sizes: PropTypes.string,
    available: PropTypes.number,
    description: PropTypes.string,
    sold: PropTypes.number,
    createdAt: PropTypes.instanceOf(Date),
    category: PropTypes.string,
  });

export const orderPropTypes = () =>
  PropTypes.shape({
    id: PropTypes.string,
    invoiceNumber: PropTypes.string,
    taxes: PropTypes.number,
    subTotalPrice: PropTypes.number,
    discount: PropTypes.number,
    totalPrice: PropTypes.number,
    freightPrice: PropTypes.number,
    createDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    status: PropTypes.string,
    sale: salePropTypes().isRequired,
    driver: driverPropTypes(),
    customer: customerPropTypes().isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        cover: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string,
        code: PropTypes.string,
        sku: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        quantity: PropTypes.number,
        price: PropTypes.number,
        weight: PropTypes.number,
        priceSale: PropTypes.number,
        totalRating: PropTypes.number,
        totalReview: PropTypes.number,
        inventoryType: PropTypes.string,
        sizes: PropTypes.string,
        available: PropTypes.number,
        description: PropTypes.string,
        sold: PropTypes.number,
        category: PropTypes.string,
        createdAt: PropTypes.instanceOf(Date),
      })
    ),
    deliveryOrder: PropTypes.shape({
      id: PropTypes.number,
      customer: customerPropTypes().isRequired,
      customerDescription: PropTypes.string,
      papers: PropTypes.shape({
        id: PropTypes.number,
        file: PropTypes.string,
      }),
      deliveryDate: PropTypes.instanceOf(Date),
      status: PropTypes.oneOf([
        DeliveryStatus.new,
        DeliveryStatus.completed,
        DeliveryStatus.inProgress,
        DeliveryStatus.deliverySuccess,
        DeliveryStatus.confirmByAccProcessing,
      ]),
    }),
  });
