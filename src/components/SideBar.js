import { useContext, useState, useEffect } from "react";

import ChatModal from "./UI/ChatModal";

//
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { isMobile } from "react-device-detect";
//

import useDevice from "./Custom_hooks/useDevice";

import AppContext from "./GlobalStore/Context";
import GetNameForGroup from "./Functions/GetNameForGroup";

import {
  Container,
  HStack,
  Button,
  Heading,
  Image,
  Stack,
  List,
  ListItem,
  useColorMode,
  VStack,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";

import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import usePictures from "../components/Custom_hooks/usePictures";
import DotIcon from "../components/UI/icons/DotIcon";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function SideBar() {
  // Inits

  const DEVICE = useDevice();
  const context = useContext(AppContext);
  // Hooks
  const [nameGroupChat, setnameGroupChat] = useState(false);
  const [makeGroupChatToggler, setMakeGroupBtnToggler] = useState(false);

  const CloseOptionsInSideBarHeader = (event) => {
    window.addEventListener("mouseup", () => {
      if (event.target !== "dropdownmenu") {
        context.setsideBarOptions(false);
      }
    });
  };
  const makeGroupChat = () => {
    if (context.newGroupChatUserList.length === 0) return;
    setnameGroupChat(true);
  };

  const bg = useColorModeValue(
    "brand.sideBarBackgroundLight",
    "brand.sideBarBackground"
  );
  const border = useColorModeValue("1px solid #E2E8F0", "1px solid #2D3748"); // Light / Dark gray border
  const btnActiveColor = useColorModeValue("telegram", "red");
  const btnInactiveColor = useColorModeValue("red", "telegram");

  return (
    <Container
      h="100vh"
      w={DEVICE === "Mobile" ? "full" : "25vw"}
      display={context.openChat ? "none" : "flex"}
      flexDirection="column"
      borderRight={border}
      m="0"
      p="0"
      pos="relative"
      onClick={CloseOptionsInSideBarHeader}
      backgroundColor={bg}
      transition="background-color 0.3s ease"
    >
      {/* ===== Sidebar Header ===== */}
      <Container p="0" overflowY="hidden" h="20vh">
        {context.newPersonAddBtn ? (
          <SideBarHeader id="new" title="Add People" />
        ) : (
          <SideBarHeader title={context.Current_UserData?.NickName} />
        )}

        {/* ===== Chats / Contacts Toggle Buttons ===== */}
        <HStack
          pos="sticky"
          top={DEVICE === "Desktop" ? "9vh" : "6vh"}
          marginY="1"
        >
          <Button
            onClick={() => {
              context.setNewPersonAddBtn(false);
              setMakeGroupBtnToggler(false);
            }}
            w="full"
            colorScheme={
              !context.newPersonAddBtn ? btnActiveColor : btnInactiveColor
            }
            boxShadow="none"
          >
            Chats
          </Button>
          <Button
            onClick={() => context.setNewPersonAddBtn(true)}
            w="full"
            colorScheme={
              context.newPersonAddBtn ? btnActiveColor : btnInactiveColor
            }
            boxShadow="none"
          >
            Contacts
          </Button>

          {/* ===== Theme Toggle Button ===== */}
        </HStack>

        {/* ===== Chat or Add People List ===== */}
        {context.newPersonAddBtn ? (
          <Container
            p="0"
            h="85%"
            overflowY="scroll"
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            <AddChats groupBtnToggler={setMakeGroupBtnToggler} />
          </Container>
        ) : (
          <Container
            p="0"
            h="85%"
            overflowY="scroll"
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {context.chatInit?.length > 0 &&
              context.chatInit.map((data) => (
                <ChatModal key={data.ChatID} data={data} />
              ))}
          </Container>
        )}
      </Container>

      {/* ===== Group Creation ===== */}
      {context.newPersonAddBtn && makeGroupChatToggler && (
        <>
          <Button
            pos="absolute"
            bottom="0"
            width="100%"
            onClick={makeGroupChat}
          >
            Make Group
          </Button>
          {nameGroupChat && (
            <GetNameForGroup
              togglevis={setnameGroupChat}
              toggleGroupMakeBtn={setMakeGroupBtnToggler}
            />
          )}
        </>
      )}
    </Container>
  );
}

const SideBarHeader = (props) => {
  // init
  const [Placeholder] = usePictures();
  const { colorMode, toggleColorMode } = useColorMode();
  const Navigate = useNavigate();
  const context = useContext(AppContext);
  const auth = getAuth();
  const DEVICE = useDevice();

  const showDropDown = () => {
    context.setsideBarOptions((snap) => !snap);
  };

  const SignOut = () => {
    signOut(auth);

    Navigate("/");
  };
  const ShowSettingHandler = () => {
    context.setsideBarOptions((snap) => !snap);
    context.setDisplayUserSettings(true);
  };
  const menuItemBorder = colorMode === "dark" ? "1px solid black" : "1px solid white";
  return (
    <HStack
      justifyContent="space-between"
      p="1"
      pos="sticky"
      top="0"
      zIndex="100"
      boxShadow="sm"
      bgColor={
        colorMode === "light" ? "brand.chatHeaderLight" : "brand.chatHeader"
      }
    >
      <HStack>
        <Image
          alt="User profile"
          src={
            context?.Current_UserData?.ProfilePicture
              ? context?.Current_UserData?.ProfilePicture
              : Placeholder
          }
          boxSize={DEVICE === "Mobile" ? "55" : "75"}
          borderRadius="100"
          userSelect="none"
        />

        <Heading size="lg" userSelect="none">
          {props.title}
        </Heading>
      </HStack>
      <Stack onClick={showDropDown} pos="relative" zIndex="2000">
        <DotIcon />

        <Stack
          display={context.sideBarOptions ? "block" : "none"}
          pos="absolute"
          top="calc(100% + 8px)"
          right="0"
          zIndex="3000" 
          boxShadow="lg"
          bg={colorMode === "light" ? "white" : "gray.800"}
          borderRadius="md"
          border="1px solid"
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
          minW={{ base: "140px", md: "150px", lg: "180px" }}
          w="max-content"
        >
          <List id="dropdownmenu" width="full">
            <ListItem onClick={toggleColorMode}>
              <Button
                w="full"
                borderRadius="0"
                border={menuItemBorder}
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                {colorMode === "light" ? " Dark" : " Light"}
              </Button>
            </ListItem>
            <ListItem onClick={ShowSettingHandler}>
              <Button
                w="full"
                borderRadius="0"
                border={menuItemBorder}
              >
                Edit Profile
              </Button>
            </ListItem>
            <ListItem onClick={SignOut}>
              <Button
                w="full"
                borderRadius="0"
                border={menuItemBorder}
              >
                Logout
              </Button>
            </ListItem>
          </List>
        </Stack>
      </Stack>
    </HStack>
  );
};

function AddChats({ groupBtnToggler }) {
  // Init
  const context = useContext(AppContext);

  // Hooks
  const [groupAddMode, setgroupAddMode] = useState(false);

  const toggleGroupMode = () => {
    groupBtnToggler((val) => !val);
    setgroupAddMode((val) => !val);
  };

  return (
    <Container padding="0">
      <Button onClick={toggleGroupMode} w="full" size="lg">
        Make Group Chat
      </Button>
      <VStack alignItems="flex-start" spacing="0">
        {context.UsersData?.map((user) => (
          <AddChatPerson
            user={user}
            key={user.User_ID}
            GroupMode={groupAddMode}
          />
        ))}
      </VStack>
    </Container>
  );
}

function AddChatPerson(props) {
  // Inits
  const context = useContext(AppContext);
  const [Placeholder] = usePictures();

  // Hooks
  const [isChecked, setisChecked] = useState(false);

  useEffect(() => {
    // For group chat adding user id in list to make group chat later on
    if (isChecked) {
      context.setNewGroupChatUserList((list) => {
        if (list?.length > 0) {
          return [
            ...list,
            {
              ID: props.user.User_ID,
            },
          ];
        }
        return [
          {
            ID: props.user.User_ID,
          },
        ];
      });
    }
    if (!isChecked) {
      if (context.newGroupChatUserList.length > 0) {
        context.setNewGroupChatUserList((list) =>
          list.filter((val) => {
            if (val.ID === props.user.User_ID) {
              return false;
            }
            return true;
          })
        );
      }
    }
    // eslint-disable-next-line
  }, [isChecked]);

  const ClickEvent = async () => {
    if (props.GroupMode) return;

    const ID = uuid();
    const MsgRef = doc(db, "Private_Chat_init", ID);

    // We filter all the group chat inits
    const SecPersonNames = context.chatInit.filter(
      (data) => data.ChatType === "DM"
    );

    // Check if Chat with other person already exists

    const IfChatExist = SecPersonNames.findIndex(
      (data) =>
        data.User1.ID === props.user.User_ID ||
        data.User2.ID === props.user.User_ID
    );

    if (
      SecPersonNames.some(
        (data) =>
          data.User1.ID === props.user.User_ID ||
          data.User2.ID === props.user.User_ID
      )
    ) {
      const Chat = SecPersonNames[IfChatExist];
      console.log(props);

      if (isMobile) {
        context.setopenChat(true);
      }

      context.setActivePrivateChatOtherUserData(props.user);
      context.setNewPersonAddBtn(false);
      context.setActiveChatInit(Chat);
      return;
    }

    // Adding new chat
    const DATA = {
      ChatID: ID,
      ChatType: "DM",
      ChatUserID: [props.user.User_ID, context.Current_UserID],
      User1: { ID: props.user.User_ID },
      User2: { ID: context.Current_UserID },
    };
    setDoc(MsgRef, DATA);
    if (isMobile) {
      context.setopenChat(true);
    }
    context.setNewPersonAddBtn(false);
    context.setActivePrivateChatOtherUserData(props.user);
    context.setActiveChatInit(DATA);
  };

  return (
    <HStack onClick={ClickEvent} padding="3" w="full">
      {props.GroupMode && (
        <Checkbox
          checked={isChecked}
          onChange={() => setisChecked((val) => !val)}
          size="lg"
        />
      )}
      <Image
        src={
          props.user.ProfilePicture ? props.user.ProfilePicture : Placeholder
        }
        alt="user profile"
        boxSize="12"
        borderRadius="50%"
      />
      <Heading size="md">{props.user.NickName}</Heading>
    </HStack>
  );
}
