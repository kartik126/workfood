import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Avatar,
  ListItemText,
  IconButton,
  List,
  ListItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect } from "react";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { addDocument } from "../../firebase/services/addServices";
import { updateDocument } from "../../firebase/services/updateServices";
import { collections } from "../../firebase/collections";
import { useToaster } from "../../hooks";
import { toastMessages, toastTypes } from "../../constants/keywords";
import { getUniqueId, isValidFileType } from "../../utils/helper";
import RHFUpload from "../../components/hook-form/RHFUpload";
import { uploadFile, updateFile } from "../../firebase/services/storage";
import { Delete } from "@mui/icons-material";

const AddNewBlog = ({ isOpen, onClose, isEdit, editBlog }) => {
  const initialValues = {
    title: isEdit ? editBlog?.title : "",
    content: isEdit ? editBlog?.content : "",
    tags: isEdit ? editBlog?.tags : [],
    featuredImage: null,
    adminName: isEdit ? editBlog?.adminName : "",
    categories: isEdit ? editBlog?.categories : [],
  };

  const formSchema = yup
    .object({
      title: yup
        .string("Enter valid name")
        .trim("Enter valid name")
        .required("Commodity name is required")
        .min(3, "Commodity name must be at least 3 character long")
        .max(100, "Commodity name must be at most 100 characters long"),
      content: yup
        .string("Enter valid name")
        .trim("Enter valid name")
        .required("Mandi name is required")
        .min(3, "Mandi name must be at least 3 character long")
        .max(10000, "Mandi name must be at most 10000 characters long"),
      tags: yup.array(),
      featuredImage: isEdit
        ? yup.mixed().nullable()
        : yup
            .mixed()
            .required("Image is required")
            .test("is-valid-type", "Not a valid image type", (value) => {
              return isValidFileType(
                value && value.name.toLowerCase(),
                "image"
              );
            }),
      // .test(
      //   "is-valid-size",
      //   "Max allowed size is 100KB",
      //   (value) => value && value.size <= 102400
      // ),
      adminName: yup.string().required("Admin name is required"),
      categories: yup.array().min(1, "At least one category is required"),
    })
    .strict()
    .required();

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema),
  });

  const { toaster } = useToaster();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const selectedImage = watch("featuredImage");

  useEffect(() => {
    if (isEdit) {
      setValue("title", editBlog.title);
      setValue("content", editBlog.content);
      setValue("tags", editBlog?.tags || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editBlog]);

  const onCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmitBlog = async (formData) => {
    const { featuredImage, ...restData } = formData;
    try {
      if (isEdit) {
        let updatedImage = "";
        if (featuredImage) {
          const updateRes = await updateFile(
            featuredImage,
            editBlog.identifier
          );
          if (updateRes.status) {
            updatedImage = updateRes;
          }
        }
        const res = await updateDocument(
          {
            id: editBlog.id,
            ...restData,
            ...(updatedImage
              ? {
                  identifier: updatedImage.identifier,
                  imgUrl: updatedImage.url,
                }
              : {}),
          },
          collections.blogs
        );
        if (!res.status) {
          return toaster(
            toastTypes.ERROR,
            res.error?.message || toastMessages.GENERAL_ERROR
          );
        }
        if (res.status) {
          toaster(toastTypes.SUCCESS, toastMessages.UPDATE_BLOG_SUCCESS);
          onCloseDialog();
        }
      } else {
        const uuid = getUniqueId();
        const imgRes = await uploadFile(featuredImage, uuid);
        if (imgRes?.status) {
          const res = await addDocument(
            {
              ...restData,
              createdAt: new Date(),
              imgUrl: imgRes.url,
              identifier: imgRes.identifier,
              comments: [],
            },
            collections.blogs
          );
          if (!res.status) {
            return toaster(
              toastTypes.ERROR,
              res.error.message || toastMessages.GENERAL_ERROR
            );
          }
          if (res.status) {
            toaster(toastTypes.SUCCESS, toastMessages.CREATE_BLOG_SUCCESS);
            onCloseDialog();
          }
        } else {
          toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
        }
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  const onDeleteComment = async (currIndex) => {
    try {
      const updatedComments = editBlog.comments.filter(
        (_, index) => index !== currIndex
      );
      const res = await updateDocument(
        {
          id: editBlog.id,
          comments: updatedComments,
        },
        collections.blogs
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.COMMENT_DELETED_SUCCESS);
        onCloseDialog();
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? "Update" : "Add"} Blog Details</DialogTitle>
      <DialogContent>
        <FormProvider onSubmit={handleSubmit(onSubmitBlog)} methods={methods}>
          <RHFTextField
            name="title"
            label="Title"
            placeholder="Title"
            required
            margin="normal"
            fullWidth
          />
          <RHFTextField
            name="adminName"
            label="Admin Name"
            placeholder="Admin Name"
            required
            margin="normal"
            fullWidth
          />
          <Controller
            name="categories"
            control={methods.control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Categories</InputLabel>
                <Select
                  {...field}
                  multiple
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {/* Replace with your actual category options */}
                  <MenuItem value="category1">Category 1</MenuItem>
                  <MenuItem value="category2">Category 2</MenuItem>
                  {/* Add more categories as needed */}
                </Select>
              </FormControl>
            )}
          />
          <div style={{ marginTop: "14px" }}>
            <Stack direction="row" gap={1}>
              {isEdit && editBlog.imgUrl && !selectedImage && (
                <Avatar src={editBlog.imgUrl} alt="blog-image" size="large" />
              )}
              <label>Featured Image</label>
              <RHFUpload
                name="featuredImage"
                label="Featured Image"
                placeholder="Featured Image"
                required
                margin="normal"
                fullWidth
                type="file"
                btnText={isEdit ? "Update Image" : "Upload"}
              />
            </Stack>
          </div>
          {/* <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                freeSolo
                onChange={(event, newValue) => field.onChange(newValue)}
                options={[]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                      label={option}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField label="Tags" {...params} margin="normal" />
                )}
              />
            )}
          /> */}
          <RHFTextField
            name="content"
            label="Blog Content"
            placeholder="Blog Content"
            required
            margin="normal"
            fullWidth
            multiline
          />
          <Stack gap={1}>
            <Typography variant="subtitle1">Comments</Typography>
            {isEdit &&
              editBlog?.comments &&
              editBlog?.comments.length > 0 &&
              editBlog?.comments.map((item, index) => (
                <List dense key={index}>
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" gap={1}>
                        <Typography variant="subtitle1">{item.time}</Typography>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => onDeleteComment(index)}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemText primary={item.text} secondary={item.userId} />
                  </ListItem>
                </List>
              ))}
          </Stack>

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
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default AddNewBlog;
