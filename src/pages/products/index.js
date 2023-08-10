import { useState } from "react";
import { Box, Paper, Button } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { useFireStore, useToaster } from "../../hooks";
import { collections } from "../../firebase/collections";
import { productTableHeaders } from "../../constants/metaData";
import { ProductListing } from "./ProductsListing";
import { deleteDocument } from "../../firebase/services/deleteServices";
import AddUpdateProduct from "./AddUpdateProduct";
import {
  confirmationMessages,
  toastMessages,
  toastTypes,
} from "../../constants/keywords";
import { Confirmation } from "../../components";
import { deleteFile } from "../../firebase/services/storage";
import AddCategory from "./AddCategory";

const Products = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Hooks
  const { data, isFetching } = useFireStore(collections.products);
  const { toaster } = useToaster();

  const onDelete = async (itemId) => {
    if (!itemId) return;
    setIsConfirmationOpen(itemId);
  };

  const onDeleteProductConfirmed = async (itemId) => {
    if (!itemId) return;
    try {
      setIsDeleting(true);
      const images = data?.find(({ id }) => id === itemId)?.images;
      const res = await deleteDocument(itemId, collections.products);
      setIsDeleting(false);
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.status?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        images.forEach(async ({ identifier }) => await deleteFile(identifier));
        toaster(toastTypes.SUCCESS, toastMessages.DELETED_PRODUCT_SUCCESS);
        setIsConfirmationOpen(false);
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  const handleEditProduct = (id) => {
    if (!id) return;
    const selected = data.find((item) => item.id === id);
    if (selected) {
      setEditProduct(selected);
      setIsOpen(true);
    }
  };

  // Handlers
  const onSelectItems = (checked, isAll = false, id) => {
    if (isAll) {
      checked
        ? setSelectedItems(data.map(({ id }) => id))
        : setSelectedItems([]);
    } else {
      checked
        ? setSelectedItems((prev) => [...prev, id])
        : setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const onCloseDialog = () => {
    setIsOpen(false);
    setEditProduct(null);
  };

  const onCloseConfirmation = (isConfirmed) => {
    if (isConfirmed) return onDeleteProductConfirmed(isConfirmationOpen);
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            p: 2,
            color: "primary",
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>Products ({data?.length || 0})</Box>
          <Box>
            <Button onClick={() => setIsCategoryDialogOpen(true)}>
              Add Category <AddCircle />
            </Button>
            <AddCategory
              isOpen={isCategoryDialogOpen}
              onClose={() => setIsCategoryDialogOpen(false)}
            />
            <Button onClick={() => setIsOpen(true)}>
              Add Product <AddCircle />
            </Button>
            <AddUpdateProduct
              isOpen={isOpen}
              onClose={onCloseDialog}
              isEdit={!!editProduct}
              editProduct={editProduct}
            />
          </Box>
        </Paper>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <ProductListing
            data={data && data.length > 0 ? data : []}
            handleEdit={handleEditProduct}
            handleDelete={onDelete}
            headingItems={productTableHeaders}
            isLoading={isFetching}
            selectedItems={selectedItems}
            onSelectItems={onSelectItems}
          />
          <Confirmation
            isOpen={isConfirmationOpen}
            onClose={onCloseConfirmation}
            onClickAction={onCloseConfirmation}
            actionMessage={confirmationMessages.PRODUCT}
            isLoading={isDeleting}
          />
        </Paper>
      </Box>
    </>
  );
};

export default Products;
