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
    CompanyName: yup
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

const AddNewCompany = ({ Open, Close }) => {
  // Init
  const initialValues = {
    CompanyName: "",
    CompanyAddress: "",
    CompanyLocation: "",
    Gst: "",
  };

  // States

  // Hooks
  const methods = useForm({
    defaultValues: initialValues,
    // resolver: yupResolver(formSchema),
  });
  const { toaster } = useToaster();

  // Constants
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  const CloseDialog = () => {
    reset();
    Close();
  };

  const onSubmitCommodity = async (formData) => {
    console.log(`onSubmitCommodity`, formData);
    try {
      const res = await addDocument(
        {
          ...formData,
          createdAt: new Date(),
        },
        collections.CompanyDetails
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res?.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.CREATE_COMMODITY_SUCCESS);
        CloseDialog();
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <Dialog open={Open}>
      <DialogTitle>Add Company details</DialogTitle>
      <DialogContent>
        <FormProvider
          onSubmit={handleSubmit(onSubmitCommodity)}
          methods={methods}
        >
          <RHFTextField
            name="CompanyName"
            label="Company Name"
            placeholder="Company Name"
            fullWidth
            required
            margin="normal"
          />
          <RHFTextField
            name="CompanyAddress"
            label="Company address"
            placeholder="Company address"
            fullWidth
            required
            margin="normal"
          />
          <RHFTextField
            name="CompanyLocation"
            label="Google link of the location"
            placeholder="Google link of the location"
            fullWidth
            required
            margin="normal"
          />
          <RHFTextField
            name="Gst"
            label="GST no for the address"
            placeholder="GST no for the address"
            fullWidth
            required
            margin="normal"
          />

          <br></br>
          <Button onClick={CloseDialog}>Cancel</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Finsish
          </LoadingButton>
        </FormProvider>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AddNewCompany;
