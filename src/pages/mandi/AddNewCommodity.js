import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { addDocument } from "../../firebase/services/addServices";
import { collections } from "../../firebase/collections";
import { useToaster } from "../../hooks";
import { toastMessages, toastTypes } from "../../constants/keywords";

const formSchema = yup
  .object({
    commodityName: yup
      .string("Enter valid name")
      .trim("Enter valid name")
      .required("Commodity name is required")
      .min(3, "Commodity name must be at least 3 character long")
      .max(100, "Commodity name must be at most 100 characters long"),
    mandiName: yup
      .string("Enter valid name")
      .trim("Enter valid name")
      .required("Mandi name is required")
      .min(3, "Mandi name must be at least 3 character long")
      .max(100, "Mandi name must be at most 100 characters long"),
    variety: yup
      .string("Enter valid variety")
      .trim("Enter valid variety")
      .required("variety is required")
      .min(3, "variety must be at least 3 character long")
      .max(100, "variety must be at most 100 characters long"),
    maxPrice: yup
      .string("Max price must be a number")
      .required("Max price is required"),
    minPrice: yup
      .string("Min price must be a number")
      .required("Min price is required"),
    averagePrice: yup
      .string("Average price must be a number")
      .required("Average price is required"),
  })
  .strict()
  .required();

const AddNewCommodity = ({ isOpen, onClose }) => {
  // Init
  const initialValues = {
    commodityName: "",
    mandiName: "",
    maxPrice: "",
    minPrice: "",
    averagePrice: "",
  };

  // States

  // Hooks
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema),
  });
  const { toaster } = useToaster();

  // Constants
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  const selectedMinPrice = watch("minPrice");
  const selectedMaxPrice = watch("maxPrice");

  // Handlers Method

  const onCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmitCommodity = async (formData) => {
    try {
      const res = await addDocument(
        {
          ...formData,
          createdAt: new Date(),
        },
        collections.commodities
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res?.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.CREATE_COMMODITY_SUCCESS);
        onCloseDialog();
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseDialog}>
      <DialogTitle>Add Commodity Details</DialogTitle>
      <DialogContent>
        <FormProvider
          onSubmit={handleSubmit(onSubmitCommodity)}
          methods={methods}
        >
          <RHFTextField
            name="commodityName"
            label="Commodity Name"
            placeholder="Commodity Name"
            fullWidth
            required
            margin="normal"
          />
          <RHFTextField
            name="mandiName"
            label="Mandi Name"
            placeholder="Mandi Name"
            required
            margin="normal"
          />
          <RHFTextField
            name="variety"
            label="Variety"
            placeholder="Variety"
            required
            margin="normal"
          />
          <RHFTextField
            name="maxPrice"
            label="Max Price"
            placeholder="Max Price"
            type="number"
            required
            margin="normal"
            InputProps={{
              inputProps: {
                min: selectedMinPrice ? selectedMinPrice : "",
              },
            }}
          />
          <RHFTextField
            name="minPrice"
            label="Min Price"
            placeholder="Min Price"
            type="number"
            required
            margin="normal"
            InputProps={{
              inputProps: { max: selectedMaxPrice ? selectedMaxPrice : "" },
            }}
          />
          <RHFTextField
            name="averagePrice"
            label="Average Price"
            placeholder="Average Price"
            type="number"
            required
            margin="normal"
            InputProps={{
              inputProps: {
                min: selectedMinPrice ? selectedMinPrice : "",
                max: selectedMaxPrice ? selectedMaxPrice : "",
              },
            }}
          />
          <br></br>
          <Button onClick={onCloseDialog}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </FormProvider>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AddNewCommodity;
