import { useRef, useContext, useEffect, useCallback } from "react";
import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";

import AppContext from "../GlobalStore/Context";

import GiffIcon from "./icons/GiffIcon";

//
import { Grid, SearchBar, SearchContext } from "@giphy/react-components";
import { SearchContextManager } from "@giphy/react-components";

//

import { Button, HStack, Input, Container, Stack, useColorModeValue } from "@chakra-ui/react";
import useDevice from "../Custom_hooks/useDevice";

// Prop is related to receiving ref for empty div to scroll to down

export default function MsgSendUI(props) {
  // init
  const context = useContext(AppContext);
  const DEVICE = useDevice();

  // hooks
  const NewMsgRef = useRef();
  const typingTimeoutRef = useRef();

  // Typing indicator functions
  const updateTypingStatus = useCallback(
    async (isTyping) => {
      if (!context.activeChatInit?.ChatID || !context.Current_UserID) return;

      const chatCollection =
        context.activeChatInit.ChatType === "DM"
          ? "Private_Chat_init"
          : "Group_Chat_init";
      const chatRef = doc(db, chatCollection, context.activeChatInit.ChatID);

      try {
        if (isTyping) {
          // Use a consistent object structure without timestamp for array operations
          const userTypingObj = {
            userId: context.Current_UserID,
            nickname: context.Current_UserData?.NickName || "User",
          };

          // First remove any existing entry for this user, then add new one with timestamp
          await updateDoc(chatRef, {
            typingUsers: arrayRemove(userTypingObj),
          });

          // Add with current timestamp
          await updateDoc(chatRef, {
            typingUsers: arrayUnion({
              ...userTypingObj,
              timestamp: Date.now(),
            }),
          });
        } else {
          // Remove using the consistent object structure
          await updateDoc(chatRef, {
            typingUsers: arrayRemove({
              userId: context.Current_UserID,
              nickname: context.Current_UserData?.NickName || "User",
            }),
          });
        }
      } catch (error) {
        console.log("Error updating typing status:", error);
      }
    },
    [context.activeChatInit, context.Current_UserID, context.Current_UserData]
  );

  // Track if user is currently marked as typing
  const isTypingRef = useRef(false);

  const handleTyping = useCallback(() => {
    // Only start typing status if not already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      updateTypingStatus(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to remove typing status after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      updateTypingStatus(false);
    }, 2000);
  }, [updateTypingStatus]);

  const handleStopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      updateTypingStatus(false);
    }
  }, [updateTypingStatus]);

  // Cleanup on unmount or chat change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        isTypingRef.current = false;
        updateTypingStatus(false);
      }
    };
  }, [context.activeChatInit?.ChatID, updateTypingStatus]);

  // Function
  const OpenGif = () => {
    context.setshowGifDiv((state) => !state);
  };

  const SendMsg = (data) => {
    let Message;
    if (data.type === "text") {
      data.event?.preventDefault();
      Message = NewMsgRef.current.value;
      NewMsgRef.current.value = "";
      if (Message === "") {
        return;
      }
      // Stop typing indicator when sending message
      handleStopTyping();
    }
    const id = Date.now().toString();
    let LocRef;
    if (context.activeChatInit.ChatType === "DM") {
      LocRef = doc(
        db,
        "Messages",
        "Private_Chats",
        context.activeChatInit.ChatID,
        id
      );
    }
    if (context.activeChatInit.ChatType === "Group") {
      LocRef = doc(
        db,
        "Messages",
        "Group_Chats",
        context.activeChatInit.ChatID,
        id
      );
    }
    //

    const MsgObj = {
      ChatID: context.activeChatInit.ChatID,
      id: id,
      Sender: context.Current_UserID,
      createdAt: serverTimestamp(),
      seenBy :[],
      isSeen:false
    };
    if (data.type === "text") {
      setDoc(LocRef, {
        ...MsgObj,
        text: Message,
        Message: "Normal",
      });
    }
    if (data.type === "Gif") {
      setDoc(LocRef, {
        ...MsgObj,
        Message: "Gif",
        Gif: data.GifID,
      });
    }

    // props.emptydiv.current.scrollIntoView({ smooth: true });
  };
const bgColor = useColorModeValue(
  "brand.primaryLight", // light theme background
  "brand.primary" // dark theme background
);

const inputBg = useColorModeValue(
  "brand.sideBarBackgroundLight", // light input background
  "brand.sideBarBackground" // dark input background
);

const inputTextColor = useColorModeValue(
  "brand.primarytext", // light text
  "brand.primarytextDark" // dark text
);

const sendBtnBg = useColorModeValue(
  "brand.telegramBtn", // same for both, but keeping theme consistency
  "brand.telegramBtn"
);

return (
  <HStack
    w="full"
    padding="1"
    pos="sticky"
    bottom="0"
    bg={bgColor}
    spacing={2}
  >
    <Container id="GifDiv" p="0" w={DEVICE === "Mobile" ? "10vw" : "2vw"}>
      <GiffsDiv MsgSendHandler={SendMsg} show={context.showGifDiv} />
      <Container onClick={OpenGif} p="0">
        <GiffIcon />
      </Container>
    </Container>

    <Stack w="full">
      <form
        onSubmit={(e) => {
          SendMsg({ type: "text", event: e });
        }}
      >
        <Input
          placeholder="Type your message.."
          ref={NewMsgRef}
          onChange={handleTyping}
          onBlur={handleStopTyping}
          bg={inputBg}
          color={inputTextColor}
          border="none"
          _focus={{ outline: "none", boxShadow: "none" }}
        />
      </form>
    </Stack>

    <Button
      onClick={() => SendMsg({ type: "text" })}
      bg={sendBtnBg}
      color="white"
      _hover={{ opacity: 0.8 }}
    >
      Send
    </Button>
  </HStack>
);
}

function GiffsDiv({ MsgSendHandler, show }) {

  return (
    <SearchContextManager apiKey={process.env.REACT_APP_GIPHY_API_KEY}>
      <Container p="0" pos="absolute" style={{ display: show ? "block" : "none" }}>
        <GiffComponent MsgSendHandler={MsgSendHandler} />
      </Container>
    </SearchContextManager>
  );
}

const GiffComponent = ({ MsgSendHandler }) => {
  const DEVICE = useDevice();
  const { fetchGifs, searchKey } = useContext(SearchContext);
  const context = useContext(AppContext);

  const GifClick = (gif, e) => {
    e.preventDefault();
    MsgSendHandler({
      type: "Gif",
      GifID: gif.id,
    });
    context.setshowGifDiv(false);
  };

  const gifWidth = DEVICE === "Desktop" ? "450" : "320";

  return (
    <Container
      p="0"
      pos="absolute"
      h="50vh"
      width={gifWidth}
      bottom="5vh"
      left={DEVICE === "Desktop" ? "5vw" : "0"}
      zIndex="40"
      overflowY="scroll"
      css={{ "&::-webkit-scrollbar": { display: "none" } }}
      borderWidth="3px"
    >
      <Grid
        key={searchKey}
        fetchGifs={fetchGifs}
        width={gifWidth}
        columns={1}
        onGifClick={GifClick}
      />
      <Container p="0" pos="sticky" bottom="0">
        <SearchBar />
      </Container>
    </Container>
  );
};
