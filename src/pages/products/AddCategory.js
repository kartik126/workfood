import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar,
} from "@mui/material";
import React, { lazy, Suspense } from "react";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { addDocument } from "../../firebase/services/addServices";
import { collections } from "../../firebase/collections";
import { useFireStore, useToaster } from "../../hooks";
import { toastMessages, toastTypes } from "../../constants/keywords";
import { getUniqueId, isValidFileType } from "../../utils/helper";
import RHFUpload from "../../components/hook-form/RHFUpload";
import { uploadFile } from "../../firebase/services/storage";
import { Loader } from "../../components";
import { deleteDocument } from "../../firebase/services/deleteServices";

const AddCategory = ({ isOpen, onClose, editBlog }) => {
  const initialValues = {
    name: "",
    image: null,
  };

  const formSchema = yup
    .object({
      name: yup
        .string("Enter valid name")
        .trim("Enter valid name")
        .required("Name is required")
        .min(3, "Name must be at least 3 characters long")
        .max(100, "Name must be at most 100 characters long"),
      image: yup
        .mixed()
        .required("Image is required")
        .test("is-valid-type", "Not a valid image type", (value) => {
          return isValidFileType(value && value.name.toLowerCase(), "image");
        }),
    })
    .strict()
    .required();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema),
  });

  const { toaster } = useToaster();
  const { data, isFetching } = useFireStore(collections.categories);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = methods;

  const selectedImage = watch("image");

  const onCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmitCategory = async (formData) => {
    const { image, ...restData } = formData;
    try {
      const uuid = getUniqueId();
      const imgRes = await uploadFile(image, uuid);
      if (imgRes?.status) {
        const res = await addDocument(
          {
            ...restData,
            image: imgRes.url,
            identifier: imgRes.identifier,
          },
          collections.categories
        );
        if (!res.status) {
          return toaster(
            toastTypes.ERROR,
            res.error.message || toastMessages.GENERAL_ERROR
          );
        }
        if (res.status) {
          toaster(toastTypes.SUCCESS, toastMessages.CREATE_CATEGORY_SUCCESS);
          onCloseDialog();
        }
      } else {
        toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  const onDelete = async (catId) => {
    if (!catId) return;
    try {
      const res = await deleteDocument(catId, collections.categories);
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.DELETE_CATEGORY_SUCCESS);
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <FormProvider
          onSubmit={handleSubmit(onSubmitCategory)}
          methods={methods}
        >
          <RHFTextField
            name="name"
            label="Name"
            placeholder="Name"
            required
            margin="normal"
            fullWidth
          />
          <div style={{ marginTop: "14px" }}>
            <Stack direction="row" gap={1}>
              {selectedImage && (
                <Avatar
                  src={URL.createObjectURL(selectedImage)}
                  alt="blog-image"
                  size="large"
                />
              )}
              <label>Image</label>
              <RHFUpload
                name="image"
                label="Image"
                placeholder="Image"
                required
                margin="normal"
                fullWidth
                type="file"
                btnText={"Upload"}
              />
            </Stack>
          </div>

          <div style={{ marginTop: "14px" }}>
            <Button onClick={onCloseDialog}>Cancel</Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </div>
        </FormProvider>
        <Suspense fallback={<Loader />}>
          <Categories data={data} isFetching={isFetching} onDelete={onDelete} />
        </Suspense>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AddCategory;

const Categories = lazy(() => import("./Categories"));
