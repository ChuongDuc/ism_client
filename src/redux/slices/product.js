import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  categories: [],
  isMultiCategory: false,
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET CATEGORIES
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },

    addIsMultiCate(state, action) {
      const val = action.payload;
      state.isMultiCategory = val;
    },

    addProducts(state, action) {
      const products = action.payload;

      const reducePrs = products.map((pr) => ({
        id: pr.id,
        name: pr.name,
        price: pr.price,
        quantity: 1,
        total: 0,
        weight: Number(pr.weight).toFixed(2),
        priceProduct: pr.price,
        description: pr.description,
        unit: pr.unit,
        weightProduct: Number(pr.weight).toFixed(2),
      }));
      reducePrs.forEach((pr) => {
        const isExisted = state.products.map((p) => p.product.id).includes(pr.id);
        if (isExisted) {
          state.products?.map((el, index) => {
            if (el.product.id === pr.id) {
              state.products[index].quantity += 1;
            }
            return state.products;
          });
        } else {
          state.products.push({
            product: {
              id: pr.id,
              name: pr.name,
              price: pr.price,
              weight: pr.weight,
              unit: pr.unit,
            },
            quantity: 1,
            total: 0,
            priceProduct: pr.price,
            description: pr.description,
            weightProduct: pr.weightProduct,
          });
        }
      });
    },

    addInitCategories(state, action) {
      const idx = action.payload;
      const category = {
        categoryId: idx,
        name: '',
        orderDetailList: [],
      };
      state.categories.push(category);
    },

    updateCategoryName(state, action) {
      const { idx, categoryName } = action.payload;

      state.categories[idx].name = categoryName;
    },

    addCategories(state, action) {
      const { products, idxCate } = action.payload;

      const reducePrs = products.map((pr) => ({
        id: pr.id,
        name: pr.name,
        price: pr.price,
        quantity: 1,
        total: 0,
        weight: Number(pr.weight).toFixed(2),
        priceProduct: pr.price,
        weightProduct: Number(pr.weight).toFixed(2),
        description: pr.description,
        unit: pr.unit,
      }));
      reducePrs.forEach((pr) => {
        const isExisted =
          state?.categories[idxCate]?.orderDetailList?.length > 0
            ? state?.categories[idxCate]?.orderDetailList?.map((p) => p?.product?.id).includes(pr?.id)
            : state?.categories?.map((p) => p?.orderDetailList?.map((order) => order?.product?.id)).includes(pr.id);
        if (isExisted) {
          state?.categories[idxCate]?.orderDetailList?.map((el, index) => {
            if (el?.product?.id === pr.id) {
              state.categories[idxCate].orderDetailList[index].quantity += 1;
            }
            return state.categories;
          });
        } else {
          state.products.push({
            product: {
              id: pr.id,
              name: pr.name,
              price: pr.price,
              weight: pr.weight,
              unit: pr.unit,
            },
            quantity: 1,
            total: 0,
            priceProduct: pr.price,
            weightProduct: pr.weight,
            indexCate: idxCate,
          });
          state.categories[idxCate]?.orderDetailList?.push({
            product: {
              id: pr.id,
              name: pr.name,
              price: pr.price,
              weight: pr.weight,
            },
            quantity: pr.quantity,
            total: 0,
            priceProduct: pr.price,
            weightProduct: pr.weight,
            description: pr.description,
          });
        }
      });
    },

    resetCart(state) {
      state.products = [];
      state.categories = [];
    },

    deleteProducts(state, action) {
      const updateProduct = state.products.filter((item) => item.product.id !== action.payload);

      state.products = updateProduct;
    },

    deleteCategories(state, action) {
      const { idx, categoryId } = action.payload;
      const updateCategory = state.categories.filter((item) => item.categoryId !== categoryId);

      state.categories = updateCategory;

      const updateProduct = state.products.filter((item) => item.indexCate !== idx);
      state.products = updateProduct;
    },

    deleteCategoriesProduct(state, action) {
      const { idx, index } = action.payload;
      state.categories[idx]?.orderDetailList?.splice(index, 1);

      const updateProduct = state.products.filter((item, index) => index !== idx * state.categories.length + index);
      state.products = updateProduct;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  addProducts,
  resetCart,
  deleteProducts,
  addCategories,
  addInitCategories,
  updateCategoryName,
  deleteCategories,
  deleteCategoriesProduct,
  addIsMultiCate,
  getCart,
  addCart,
  deleteCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products');
      dispatch(slice.actions.getProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/products/product', {
        params: { id },
      });
      dispatch(slice.actions.getProductSuccess(response.data.product));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
