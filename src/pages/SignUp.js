import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormContainer from "../components/Form/FormContainer";
import { VStack, Button, HStack } from "@chakra-ui/react";
import TextField from "../components/Form/TextField";
import { Formik, Form } from "formik";
import YupValidation, { initialValues } from "../components/Form/YupSignUp";

export default function SignUp() {
  const auth = getAuth();
  const Navigate = useNavigate();

  const SignUp = (values, actions) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        toast.success("Account created successfully!", {
          position: "top-right",
         
          autoClose: 2000,
          
          onClose: () => Navigate("/signin"),
          
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        actions.setSubmitting(false);
      
      })
      .catch((error) => {
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