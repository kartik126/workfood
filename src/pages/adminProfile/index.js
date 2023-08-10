import React, { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import AppLogo from "../../assets/images/appLogo.jpeg";
import { Stack } from "@mui/material";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../hooks";

function AdminProfile() {
  const formSchema = yup
    .object({
      name: yup.string("Enter valid name").trim("Enter valid name"),
      email: yup
        .string("Enter valid email")
        .email("Enter valid email")
        .required("Email is required"),
    })
    .strict()
    .required();

  const { user } = useAuth();

  const initialValues = useMemo(
    () => ({
      name: user?.displayName || "",
      email: user?.email || "",
    }),
    [user]
  );

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("name", user?.displayName || "");
      setValue("email", user?.email || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onResetPassword = ({ email }) => {};

  return (
    <>
      <h2 style={{ marginTop: "42px" }}>Admin Profile</h2>
      <hr style={{ marginTop: "25px" }}></hr>
      <Grid container sx={{ backgroundColor: "#fff", p: 3 }} spacing={3}>
        <Grid item xs={6}>
          <FormProvider
            onSubmit={handleSubmit(onResetPassword)}
            methods={methods}
          >
            <Stack gap={1}>
              <RHFTextField
                name="name"
                label="Full name"
                placeholder="Full name"
                margin="normal"
                disabled
              />
              <RHFTextField
                name="email"
                disabled
                label="Email"
                placeholder="Email"
                margin="normal"
                id="email"
              />
              <LoadingButton
                variant="contained"
                type="submit"
                loading={isSubmitting}
              >
                Reset Password
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Grid>
        <Grid item xs={6}>
          <img src={AppLogo} alt="logo" />
        </Grid>
      </Grid>
    </>
  );
}

export default AdminProfile;
