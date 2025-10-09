import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// 1. Import from react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Important: Import the CSS

import FormContainer from "../components/Form/FormContainer";
import { VStack, Button, HStack } from "@chakra-ui/react";
import TextField from "../components/Form/TextField";
import { Formik, Form } from "formik";
import YupValidation, { initialValues } from "../components/Form/YupSignUp";

export default function SignUp() {
  // Init
  const auth = getAuth();
  const Navigate = useNavigate();

  const SignUp = (values, actions) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        // 3. Call the success toast
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        actions.setSubmitting(false);
        // Navigate after a short delay to let the user see the toast
        setTimeout(() => {
          Navigate("/signin");
        }, 2000); // 2-second delay
      })
      .catch((error) => {
        // 3. Call the error toast
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        actions.setSubmitting(false);
      });
  };

  const navToSignIn = () => {
    Navigate("/signin");
  };

  return (
    <FormContainer title="Sign up for an account!">
      {/* 2. Add the ToastContainer component here */}
      <ToastContainer />
      <Formik
        initialValues={initialValues}
        validationSchema={YupValidation}
        onSubmit={SignUp}
      >
        {(props) => (
          <Form>
            <TextField
              name="email"
              type="email"
              title="Email"
              YupValidation={YupValidation}
            />
            <TextField
              name="password"
              type="password"
              title="Password"
              YupValidation={YupValidation}
            />
            <TextField
              name="confirmPassword"
              type="password"
              title="Confirm Password"
              YupValidation={YupValidation}
            />

            <VStack w={"full"} marginTop="2">
              <HStack w={"full"}>
                <Button type="submit" isLoading={props.isSubmitting} w={"full"}>
                  Sign Up
                </Button>
                <Button type="reset" w="full" bgColor="red.800">
                  Reset
                </Button>
              </HStack>
            </VStack>
          </Form>
        )}
      </Formik>
      <Button onClick={navToSignIn} w={"full"}>
        Sign In
      </Button>
    </FormContainer>
  );
}