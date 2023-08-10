import { Box, Button, Paper } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import React, { useState } from "react";
import { MandiListing } from "./MandiListing";
import { useFireStore, useToaster } from "../../hooks";
import { collections } from "../../firebase/collections";
import { mandiTableHeaders } from "../../constants/metaData";
import AddNewCommodity from "./AddNewCommodity";
import { deleteDocument } from "../../firebase/services/deleteServices";
import { toastMessages, toastTypes } from "../../constants/keywords";

const MandiUpdate = () => {
  // States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Hooks
  const { data, isFetching } = useFireStore(collections.commodities);
  const { toaster } = useToaster();

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

  const onClose = () => {
    setIsOpen(false);
  };

  const onDelete = () => {
    if (!selectedItems.length) return;
    selectedItems.forEach(async (item) => {
      try {
        await deleteDocument(item, collections.commodities);
        setSelectedItems([]);
        toaster(toastTypes.SUCCESS, toastMessages.DELETED_COMMODITY_SUCCESS);
      } catch (error) {
        toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
      }
    });
  };

  return (
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
        <Box>Mandi ({data?.length || 0})</Box>
        <Button style={{ marginRight: -496 }} onClick={() => setIsOpen(true)}>
          Add New Commodity <AddCircle />
        </Button>
        <AddNewCommodity isOpen={isOpen} onClose={onClose} />
        <Button
          variant="contained"
          disabled={!selectedItems.length}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Paper>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <MandiListing
          data={data && data.length > 0 ? data : []}
          selectedItems={selectedItems}
          onSelectItems={onSelectItems}
          headingItems={mandiTableHeaders}
          isLoading={isFetching}
        />
      </Paper>
    </Box>
  );
};

export default MandiUpdate;
