import {
  HStack,
  Container,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import AppContext from "./GlobalStore/Context";
import useDevice from "./Custom_hooks/useDevice";
import SideBar from "./SideBar";
// import { useContext } from "react";
// import { AppContext } from "../context/AppContext"; // adjust the path as needed
// import useDevice from "../hooks/useDevice"; // adjust if your custom hook lives elsewhere
// import SideBar from "./SideBar"; // your sidebar component
import ChatRoom from "./ChatRoom";
import UserSettings from "./UI/UserSettings";
// import UserSettings from "./UserSettings";

export default function ChatComponent() {
  // Inits
  const context = useContext(AppContext);
  const DEVICE = useDevice();

  // Background that adapts to theme
  const bgColor = useColorModeValue("brand.secondaryLight", "brand.secondary");

  if (context.firstTimeLogin && !context.Loading) {
    return <UserSettings firstTime={true} />;
  }

  return (
    <HStack spacing="0" bgColor={bgColor}>
      <SideBar />
      {context.activeChatInit === undefined && DEVICE === "Desktop" && (
        <InActiveChatComponent />
      )}
      {context.activeChatInit && <ChatRoom />}

      {context.DisplayUserSettings && <UserSettings firstTime={false} />}
    </HStack>
  );
}

// =======================
const InActiveChatComponent = () => {
  // Theme-aware background + text
  const bg = useColorModeValue("brand.chatBackgroundLight", "brand.chatBackground");
  const textColor = useColorModeValue("brand.primarytext", "brand.primarytextDark");

  return (
    <Container
      maxW="full"
      w="85vw"
      h="100vh"
      m="0"
      p="0"
      justifyContent="center"
      centerContent
      backgroundColor={bg}
      color={textColor}
      transition="background-color 0.3s ease, color 0.3s ease"
    >
      <Heading size="2xl" mb={2}>
        Welcome to Ctrix Chats
      </Heading>
      <Text fontSize="lg">Select one of the chats</Text>
    </Container>
  );
};
