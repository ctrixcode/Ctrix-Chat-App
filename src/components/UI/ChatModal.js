import { useContext, useState, useEffect } from "react";
import AppContext from "../GlobalStore/Context";
import useDevice from "../Custom_hooks/useDevice";
import usePictures from "../Custom_hooks/usePictures";
import useMsgFetch from "../Custom_hooks/useMsgFetch";
import {
  HStack,
  Image,
  Heading,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

export default function ChatModal(props) {
  // Custom hooks & context
  const [Placeholder] = usePictures();
  const [Messages, isLoadingMessages] = useMsgFetch(props.data);
  const DEVICE = useDevice();
  const context = useContext(AppContext);
  const { colorMode } = useColorMode();

  // Local state
  const [otherPersonData, setOtherPersonData] = useState();

  // === Derived values ===
  const UserPicObtain =
    otherPersonData &&
    context.allUsersData?.find?.(
      (data) => data.User_ID === otherPersonData.User_ID
    )?.ProfilePicture;

  const UserPic = UserPicObtain ? UserPicObtain : Placeholder;

  const chatModalName =
    props.data.ChatType === "Group"
      ? props.data.ChatName
      : otherPersonData?.NickName;

  // === Color mode adaptive values ===
  const activeBg = useColorModeValue(
    "brand.sideBarActiveChatBgLight",
    "brand.sideBarActiveChatBg"
  );

  const hoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

  const textColor = useColorModeValue(
    "brand.primarytext",
    "brand.primarytextDark"
  );

  // === Handlers ===
  const makeChatActive = () => {
    if (DEVICE === "Mobile") {
      context.setopenChat(true);
    }

    if (props.data.ChatType === "DM") {
      context.setActivePrivateChatOtherUserData(() => {
        return props.data.User1.ID === context.Current_UserID
          ? context.UsersData.find((val) => val.User_ID === props.data.User2.ID)
          : context.UsersData.find(
              (val) => val.User_ID === props.data.User1.ID
            );
      });
    }

    if (props.data.ChatType === "Group") {
      context.setActivePrivateChatOtherUserData(undefined);
    }

    context.setshowGifDiv(false);
    context.setActiveChatInit(props.data);
  };

  // === Effects ===
  useEffect(() => {
    if (props.data.ChatType === "DM") {
      setOtherPersonData(
        props?.data.User1.ID === context?.Current_UserID
          ? context?.UsersData?.find?.(
              (val) => val.User_ID === props.data.User2.ID
            )
          : context?.UsersData?.find?.(
              (val) => val.User_ID === props.data.User1.ID
            )
      );
    }

    if (props.data.ChatType === "Group") {
      setOtherPersonData(props.data.otherPersonData);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (context?.activeChatInit?.ChatID === props?.data?.ChatID) {
      context.setActiveChatInitMessages([...Messages]);
    }
    // eslint-disable-next-line
  }, [context.activeChatInit?.ChatID, Messages]);

  // === Render ===
  const isActive = context?.activeChatInit?.ChatID === props.data.ChatID;

  return (
    <HStack
      p={2}
      borderRadius="md"
      transition="background 0.2s ease"
      bg={isActive ? activeBg : "transparent"}
      _hover={{
        bg: !isActive ? hoverBg : activeBg,
        cursor: "pointer",
      }}
      onClick={makeChatActive}
      w="full"
      align="center"
      spacing={4}
    >
      {/* Profile Image */}
      <Image
        alt="User profile"
        src={UserPic}
        boxSize="14"
        borderRadius="full"
        loading="lazy"
        userSelect="none"
      />

      {/* Chat Info */}
      <VStack alignItems="flex-start" spacing={0.5}>
        <Heading
          size="md"
          userSelect="none"
          color={textColor}
          noOfLines={1}
        >
          {chatModalName}
        </Heading>

        {isLoadingMessages ? (
          <Text userSelect="none" opacity="0.6">
            Loading…
          </Text>
        ) : Messages?.[Messages?.length - 1]?.Message === "Gif" ? (
          <Text userSelect="none" color={textColor}>
            Gif
          </Text>
        ) : (
          <Text userSelect="none" color={textColor}>
            {Messages?.[Messages?.length - 1]?.text?.substring?.(0, 25) || ""}
          </Text>
        )}
      </VStack>
    </HStack>
  );
}
