import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormContainer from "../components/Form/FormContainer";
import { Button, VStack, HStack, useColorMode } from "@chakra-ui/react";
import YupValidation, { initialValues } from "../components/Form/YupSignIn";
import TextField from "../components/Form/TextField";
import { Formik, Form } from "formik";
import { IconContext } from "react-icons";
import { FiLogIn } from "react-icons/fi";

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later or reset your password.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The sign-in process was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up blocked. Please allow pop-ups for this site to sign in.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default function Signin() {
  const Navigate = useNavigate();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Navigate("/main");
      }
    });
    return () => unsubscribe();
  }, [Navigate]);

  const NavToSignUp = () => {
    Navigate("/signup");
  };

  const SignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success("Successfully logged in!");
      })
      .catch((err) => {
        const message = getAuthErrorMessage(err);
        toast.error(message);
        console.error("Firebase Google Auth Error:", err);
      });
  };

  const SignInWithEmailPassword = (values, actions) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        toast.success("Successfully logged in!");
        actions.setSubmitting(false);
      })
      .catch((err) => {
        const message = getAuthErrorMessage(err);
        toast.error(message);
        actions.setSubmitting(false);
        console.error("Firebase Email Auth Error:", err); 
      });
  };

  return (
    <FormContainer Icon={LoginIcon} title="Sign in to your account!">
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