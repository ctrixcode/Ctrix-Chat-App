import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Import from react-toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

import FormContainer from "../components/Form/FormContainer";
import { Button, VStack, HStack, useColorMode } from "@chakra-ui/react";
import YupValidation, { initialValues } from "../components/Form/YupSignIn";
import TextField from "../components/Form/TextField";
import { Formik, Form } from "formik";
import { IconContext } from "react-icons";
import { FiLogIn } from "react-icons/fi";

export default function Signin() {
  const Navigate = useNavigate();
  const { colorMode } = useColorMode();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // This will navigate the user to the main page after a successful login
        Navigate("/main");
      }
    });
    // eslint-disable-next-line
  }, []); // Note: The dependency array should likely be empty here

  const NavToSignUp = () => {
    Navigate("/signup");
  };

  const SignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        // 3. Add success toast for Google Sign-In
        toast.success("Successfully logged in!");
      })
      .catch((err) => {
        // 4. Add error toast for Google Sign-In
        toast.error(err.message);
      });
  };

  const SignInWithEmailPassword = (values, actions) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        // 3. Add success toast for Email/Password Sign-In
        toast.success("Successfully logged in!");
        actions.setSubmitting(false);
      })
      .catch((err) => {
        // 4. Add error toast for Email/Password Sign-In
        toast.error(err.message);
        actions.setSubmitting(false);
      });
  };

  return (
    <FormContainer Icon={LoginIcon} title="Sign in to your account!">
      {/* 2. Add the ToastContainer component */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Formik
        initialValues={initialValues}
        validationSchema={YupValidation}
        onSubmit={SignInWithEmailPassword}
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

            <VStack w={"full"} marginTop="2">
              <HStack w={"full"}>
                <Button type="submit" isLoading={props.isSubmitting} w={"full"}>
                  Log In
                </Button>
                <Button
                  type="reset"
                  w="full"
                  bgColor={colorMode === "light" ? "red.700" : "red.400"}
                >
                  Reset
                </Button>
              </HStack>
            </VStack>
          </Form>
        )}
      </Formik>
      <Button onClick={NavToSignUp} w={"full"}>
        Sign Up
      </Button>
      <Button onClick={SignInWithGoogle} w={"full"}>
        Sign in with Google
      </Button>
    </FormContainer>
  );
}

function LoginIcon() {
  return (
    <IconContext.Provider
      value={{ style: { color: "rgb(211, 127, 16)", fontSize: "4rem" } }}
    >
      <div>
        <FiLogIn />
      </div>
    </IconContext.Provider>
  );
}