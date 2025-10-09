import React, { useContext, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, CircularProgress, Heading } from "@chakra-ui/react";

import ChatComponent from "../components/ChatComponent";

import useInitialiseContextData from "../components/Functions/useInitialiseContextData";

import AppContext from "../components/GlobalStore/Context";
import useChatInitt from "../components/Custom_hooks/useChatInit";

export default function Home() {
  // init
  const context = useContext(AppContext);
  useInitialiseContextData();
  useChatInitt();

  const Navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        Navigate("/signin");
      }
    });
  });
  return (
    <>
      {context.Loading && <Loading />}
      {context?.allUsersData && <ChatComponent />}
    </>
  );
}


const Loading = () => {
  return (
    <Container
      justifyContent="center"
      h="100vh"
      maxW="full"
      pos="fixed"
      zIndex="600"
      bgColor="background"
      centerContent
    >
      <CircularProgress isIndeterminate size="20" />
      <Heading size="lg">Loading Messages</Heading>
    </Container>
  );
};
