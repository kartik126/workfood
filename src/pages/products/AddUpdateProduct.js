import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Stack,
  List,
  ListItem,
  IconButton,
  ListItemText,
} from "@mui/material";
import { useFireStore, useToaster } from "../../hooks";
import { collections } from "../../firebase/collections";
import { addDocument } from "../../firebase/services/addServices";
import { updateDocument } from "../../firebase/services/updateServices";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUniqueId } from "../../utils/helper";
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
} from "../../components/hook-form";
import { RHFUploadMultiFile } from "../../components/hook-form/RHFUpload";
import { LoadingButton } from "@mui/lab";
import { PRODUCT_IMAGE_FILE_SIZE } from "../../config";
import { toastMessages, toastTypes } from "../../constants/keywords";
import { deleteFile, uploadFile } from "../../firebase/services/storage";
import { Delete, Edit } from "@mui/icons-material";

const AddUpdateProduct = ({ isOpen, onClose, isEdit, editProduct }) => {
  // States
  const [existingImages, setExistingImages] = useState(null);
  const [isVariationEdit, setIsVariationEdit] = useState(false);
  // Hooks
  const { data: categoriesList, isFetching } = useFireStore(
    collections.categories
  );

  const initValues = useMemo(
    () => ({
      name: isEdit ? editProduct.name : "",
      categorie: isEdit ? editProduct.categorie : "",
      description: isEdit ? editProduct.description : "",
      images: isEdit ? editProduct.images.map(({ url }) => url) : [],
      sku: isEdit ? (editProduct.sku ? editProduct.sku?.toString() : "") : "",
      totalQuantity: isEdit
        ? editProduct.totalQuantity
          ? editProduct.totalQuantity?.toString()
          : ""
        : "",
      variation: isEdit ? editProduct.variation : [],
    }),
    [editProduct, isEdit]
  );
  const subInitValues = useMemo(
    () => ({
      type: "",
      price: "",
    }),
    []
  );

  const formSchema = yup
    .object({
      name: yup
        .string("Enter valid name")
        .trim("Enter valid name")
        .required("Name is required")
        .min(3, "Name must be at least 3 character long")
        .max(100, "Name must be at most 100 characters long"),
      categorie: yup
        .string("Enter valid category")
        .required("category is required"),
      description: yup
        .string("Enter valid Description")
        .trim("Enter valid Description")
        .required("Description is required")
        .min(3, "Description must be at least 3 character long")
        .max(10000, "Description must be at most 10000 characters long"),

      sku: yup.string("Enter valid sku"),
      totalQuantity: yup
        .string("Enter valid total quantity")
        .required("Total quantity is required"),
      images: yup.array().min(3, "Product images must be 3"),
      variation: yup
        .array(
          yup.object().shape({
            id: yup.string(),
            type: yup.string().required("Variation type is required"),
            price: yup.string().required("Variation price is required"),
          })
        )
        .required("Variation is required"),
    })
    .strict()
    .required();

  const subFormSchema = yup
    .object({
      type: yup
        .string()
        .required("Variation type is required")
        .min(3, "Name must be at least 3 character long")
        .max(100, "Name must be at most 100 characters long"),
      price: yup.string().required("Variation price is required"),
    })
    .strict()
    .required();

  const methods = useForm({
    defaultValues: initValues,
    resolver: yupResolver(formSchema),
  });
  const subMethods = useForm({
    defaultValues: subInitValues,
    resolver: yupResolver(subFormSchema),
  });
  const { toaster } = useToaster();

  useEffect(() => {
    if (isEdit && editProduct) {
      reset({
        ...editProduct,
        images: editProduct.images.map(({ url }) => url),
      });
    } else {
      reset(initValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editProduct]);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    watch,
    control,
  } = methods;

  const {
    handleSubmit: subHandleSubmit,
    reset: subReset,
    setValue: subSetValue,
  } = subMethods;

  const fieldsArray = useFieldArray({
    control,
    name: "variation",
  });

  const { fields, append, remove, update } = fieldsArray;
  const values = watch();

  const onCloseDialog = () => {
    reset();
    subReset();
    onClose();
  };

  const onCreateProduct = async (formData) => {
    const { images, variation } = formData;
    if (!images || images.length !== 3) {
      return toaster(
        toastTypes.ERROR,
        toastMessages.PRODUCT_IMAGE_LENGTH_ERROR
      );
    }

    const updatedVariation =
      variation && variation.length > 0
        ? variation.map((item) => ({
            ...item,
            id: getUniqueId(),
          }))
        : [];

    const imagesUrls = await Promise.all(
      images.map(async (file) => {
        const uuid = getUniqueId();
        const imgRes = await uploadFile(file, uuid);
        if (imgRes.status) {
          return {
            url: imgRes.url,
            identifier: imgRes.identifier,
          };
        }
      })
    );
    try {
      const res = await addDocument(
        {
          ...formData,
          images: imagesUrls,
          variation: updatedVariation,
          qty: 0,
          totalQuantity: +formData.totalQuantity,
          sku: formData.sku ? +formData.sku : "",
        },
        collections.products
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.CREATE_PRODUCT_SUCCESS);
        onCloseDialog();
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  const onUpdateProduct = async (formData) => {
    const { images, variation } = formData;

    if (!images || images.length !== 3) {
      return toaster(
        toastTypes.ERROR,
        toastMessages.PRODUCT_IMAGE_LENGTH_ERROR
      );
    }

    const imagesUrls = await Promise.all(
      images.map(async (file) => {
        if (typeof file === "string") {
          return {
            url: file,
            identifier: editProduct?.images?.find(({ url }) => url === file)
              ?.identifier,
          };
        } else {
          const uuid = getUniqueId();
          const imgRes = await uploadFile(file, uuid);
          if (imgRes.status) {
            return {
              url: imgRes.url,
              identifier: imgRes.identifier,
            };
          }
        }
      })
    );

    const updatedVariation = variation.map((variation) => {
      if (
        variation.id &&
        editProduct.variation.some(({ id }) => id === variation.id)
      ) {
        return { ...variation };
      } else {
        return { id: getUniqueId(), ...variation };
      }
    });
    editProduct?.images?.forEach(async (item) => {
      if (!images.some((_file) => _file === item.url)) {
        await deleteFile(item.identifier);
      }
    });

    try {
      const res = await updateDocument(
        {
          ...formData,
          id: editProduct.id,
          images: imagesUrls,
          variation: updatedVariation,
          totalQuantity: +formData.totalQuantity,
          sku: formData.sku ? +formData.sku : "",
          updatedAt: new Date(),
        },
        collections.products
      );
      if (!res.status) {
        return toaster(
          toastTypes.ERROR,
          res.error?.message || toastMessages.GENERAL_ERROR
        );
      }
      if (res.status) {
        toaster(toastTypes.SUCCESS, toastMessages.UPDATE_PRODUCT_SUCCESS);
        onCloseDialog();
      }
    } catch (error) {
      toaster(toastTypes.ERROR, toastMessages.GENERAL_ERROR);
    }
  };

  const onSubmitProduct = async (formData) =>
    isEdit ? await onUpdateProduct(formData) : await onCreateProduct(formData);

  const onSubmitVariation = (formData) => {
    isVariationEdit
      ? update(isVariationEdit.subIndex, {
          ...formData,
          id: isVariationEdit.docId,
        })
      : append({ ...formData });
    subReset();
    setIsVariationEdit(false);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (
        isEdit &&
        existingImages &&
        existingImages.length > 0 &&
        existingImages
      ) {
        setValue("images", [
          ...(isEdit &&
            existingImages &&
            existingImages.length > 0 &&
            existingImages),
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      } else
        setValue("images", [
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
    },
    [setValue, existingImages, isEdit]
  );

  const handleRemoveAll = () => {
    setValue("images", []);
  };

  const handleRemove = (file) => {
    const filteredItems = values?.images?.filter((_file) => _file !== file);
    if (isEdit) setExistingImages(filteredItems);
    setValue("images", filteredItems);
  };

  const onEdit = (subIndex) => {
    const { type, price } = fields[subIndex];
    const docId = editProduct.variation.find(
      (item) => item.type === type && item.price === price
    )?.id;
    subSetValue("type", type);
    subSetValue("price", price);
    setIsVariationEdit({ subIndex, docId });
  };

  const onDelete = (subIndex) => remove(subIndex);

  return (
    <Dialog open={isOpen} onClose={onCloseDialog}>
      <DialogTitle>{isEdit ? "Update" : "Add"} Product Details</DialogTitle>
      <DialogContent>
        <FormProvider
          onSubmit={handleSubmit(onSubmitProduct)}
          methods={methods}
          {...fieldsArray}
        >
          <RHFTextField
            name="name"
            label="Enter the product name"
            required
            margin="normal"
            fullWidth
          />
          <RHFTextField
            name="sku"
            label="SKU"
            margin="normal"
            fullWidth
            type="number"
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
          <RHFTextField
            name="totalQuantity"
            label="Total Quantity"
            margin="normal"
            fullWidth
            type="number"
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
            required
          />
          <Stack gap={1} sx={{ mb: 1 }}>
            <FormProvider methods={subMethods}>
              <Stack direction="row" gap={1} alignItems="center">
                <RHFTextField
                  name={`type`}
                  label="Enter variation type"
                  margin="normal"
                  fullWidth
                />
                <RHFTextField
                  name={`price`}
                  label="Variation Price (in grams)"
                  margin="normal"
                  fullWidth
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={subHandleSubmit(onSubmitVariation)}
                >
                  {isVariationEdit ? "Update" : "Add"}
                </Button>
              </Stack>
            </FormProvider>
            <List dense={true}>
              {fields?.map((field, index) => (
                <ListItem
                  secondaryAction={
                    <Stack direction="row" gap={1}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => onEdit(index)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDelete(index)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={field?.type}
                    secondary={field?.price}
                  />
                </ListItem>
              ))}
            </List>
          </Stack>

          <RHFUploadMultiFile
            name="images"
            showPreview
            accept={{ "image/*": [] }}
            maxSize={PRODUCT_IMAGE_FILE_SIZE}
            maxFiles={3}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            sx={{ backgroundColor: "#eeeeee", mb: 1, borderRadius: 2 }}
          />
          <RHFSelect
            name="categorie"
            label="Select Category"
            sx={{ width: "100%" }}
            disabled={isFetching}
          >
            {categoriesList &&
              categoriesList.length > 0 &&
              categoriesList.map(({ name, id }) => (
                <MenuItem value={name} key={id}>
                  {name}
                </MenuItem>
              ))}
          </RHFSelect>
          <RHFTextField
            name="description"
            label="Description"
            required
            margin="normal"
            fullWidth
            multiline
            rows={3}
          />
          <Button onClick={onCloseDialog}>Cancel</Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </LoadingButton>
        </FormProvider>
      </DialogContent>
      <DialogActions />
    </Dialog>
  );
};

export default AddUpdateProduct;
