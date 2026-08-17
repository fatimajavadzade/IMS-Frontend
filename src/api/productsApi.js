import api from "./axios";

const buildProductFormData = ({
  name,
  sku,
  price,
  brandId,
  categoryId,
  image,
}) => {
  const formData = new FormData();

  const product = {
    name,
    sku,
    price,
    brandId,
    categoryId,
  };

  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" }),
  );

  if (image instanceof File) {
    formData.append("image", image);
  }

  return formData;
};

export const getProducts = () => api.get("/products");

export const getProductsPage = (params) => api.get("/products/page", { params });

export const getProductById = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post("/products", buildProductFormData(data));

export const updateProduct = (id, data) => api.put(`/products/${id}`, buildProductFormData(data));

export const deleteProduct = (id) => api.delete(`/products/${id}`);