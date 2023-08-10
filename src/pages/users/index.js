import { Box, Button, Paper } from "@mui/material";
import React, { useState } from "react";
import { UserListing } from "./UserListing";
import { useFireStore, useToaster } from "../../hooks";
import { collections } from "../../firebase/collections";
import { userTableHeaders } from "../../constants/metaData";
import { deleteDocument } from "../../firebase/services/deleteServices";
import { toastMessages, toastTypes } from "../../constants/keywords";
import { useNavigate } from "react-router-dom";

const User = () => {
  // States
  const [selectedItems, setSelectedItems] = useState([]);

  // Hooks
  const { data, isFetching } = useFireStore(collections.users);

  const { toaster } = useToaster();
  const navigate = useNavigate();

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

  const onDelete = () => {
    if (!selectedItems.length) return;
    selectedItems.forEach(async (item) => {
      try {
        await deleteDocument(item, collections.users);
        setSelectedItems([]);
        toaster(toastTypes.SUCCESS, toastMessages.DELETED_USER_SUCCESS);
      } catch (error) {
        toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
      }
    });
  };

  const onClickUser = async (userId) => {
    if (!userId) return;
    navigate(`/dashboard/users/${userId}`);
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
        <Box>Users({data?.length || 0})</Box>
        <Button
          onClick={onDelete}
          variant="contained"
          disabled={!selectedItems.length}
        >
          Delete
        </Button>
      </Paper>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <UserListing
          data={data && data.length > 0 ? data : []}
          headingItems={userTableHeaders}
          isLoading={isFetching}
          selectedItems={selectedItems}
          onSelectItems={onSelectItems}
          onClickRow={onClickUser}
        />
      </Paper>
    </Box>
  );
};

export default User;
