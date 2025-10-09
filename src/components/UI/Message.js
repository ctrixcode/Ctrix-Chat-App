import React, { useRef, useContext, useState, useEffect } from "react";
import AppContext from "../GlobalStore/Context";
import usePictures from "../Custom_hooks/usePictures";
import useDevice from "../Custom_hooks/useDevice";
import {
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Tooltip,
  useColorMode,
  useToken,
} from "@chakra-ui/react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Gif } from "@giphy/react-components";
import { CheckIcon } from "@chakra-ui/icons";

const Message = ({ data }) =>
{
  const context = useContext(AppContext);
  const [Placeholder] = usePictures();
  const { colorMode } = useColorMode();
  const DEVICE = useDevice();

  const UserObtain =
    context.allUsersData?.find((u) => u.User_ID === data.Sender) || {};
  const UserPic = UserObtain.ProfilePicture || Placeholder;
  const isCurrentUser = context.Current_UserID === data.Sender;

  // Pull theme colors from Chakra theme
  const [
    otherUserMessageBgLight,
    otherUserMessageBgDark,
    otherUserMessageTextColorLight,
    otherUserMessageTextColorDark,
    currentUserMessageBg,
    currentUserMessageBgLight,
    currentUserMessageTextColor,
    currentUserMessageTextColorLight,
  ] = useToken("colors", [
    "brand.otherUserMessageBgLight",
    "brand.otherUserMessageBg",
    "brand.otherUserMessageTextColorLight",
    "brand.otherUserMessageTextColor",
    "brand.currentUserMessageBg",
    "brand.currentUserMessageBgLight",
    "brand.currentUserMessageTextColor",
    "brand.currentUserMessageTextColorLight",
  ]);

  // Determine colors based on mode
  const bubbleBg = isCurrentUser
    ? colorMode === "light"
      ? currentUserMessageBgLight
      : currentUserMessageBg
    : colorMode === "light"
    ? otherUserMessageBgLight
    : otherUserMessageBgDark;

  const bubbleTextColor = isCurrentUser
    ? colorMode === "light"
      ? currentUserMessageTextColorLight
      : currentUserMessageTextColor
    : colorMode === "light"
    ? otherUserMessageTextColorLight
    : otherUserMessageTextColorDark;

  const timeTextColor = colorMode === "light" ? "blackAlpha.700" : "whiteAlpha.700";

  const isRead = data.isSeen;
  return (
    <VStack
      w="100%"
      alignSelf={isCurrentUser ? "flex-end" : "flex-start"}
      alignItems={isCurrentUser ? "flex-end" : "flex-start"}
      spacing="1"
      mb="2"
      
    >
      <HStack
        spacing={DEVICE === "Mobile" ? 1 : 2}
        alignItems="flex-end"
        w={"100%"}
      >
        {!isCurrentUser && (
          <Image
            src={UserPic}
            alt="User profile"
            boxSize={DEVICE === "Mobile" ? 8 : 10}
            borderRadius="full"
            userSelect="none"
          />
        )}

        {data.Message === "Gif" ? (
          <GifComp GIF={data.Gif} />
        ) : (
          <Box
            maxW={DEVICE === "Mobile" ? "70%" : "60%"}
            w="100%"
            px={4}
            py={2}
            borderRadius="20px"
            borderTopRightRadius={isCurrentUser ? "0" : "20px"}
            borderTopLeftRadius={isCurrentUser ? "20px" : "0"}
            bg={bubbleBg}
            color={bubbleTextColor}
            boxShadow="md"
            position="relative"
            _hover={{ opacity: 0.9 }}
          >
            <Text fontSize={"small"} fontWeight="bold">
              {UserObtain.NickName}
            </Text>
            <Text wordBreak="break-word">{data.text}</Text>

            {data.timestamp && (
              <Tooltip
                label={new Date(data.timestamp).toLocaleString()}
                fontSize="xs"
              >
                <Text
                  fontSize="xs"
                  color={timeTextColor}
                  position="absolute"
                  bottom="-16px"
                  right="4px"
                >
                  {timeAgo(data.timestamp)}
                </Text>
                
              </Tooltip>
            )}
            <CheckIcon style={{                       
              height:"25px",
              width:"25px",
              padding:"5px"
            }} color={isRead ? "blue": ""} />
          </Box>
        )}
      </HStack>
    </VStack>
  );
};

const timeAgo = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const GifComp = React.memo(({ GIF }) =>
{
  const DEVICE = useDevice();
  const [gif, setGif] = useState(null);
  const gifCache = useRef({});

  useEffect(() =>
  {
    if (gifCache.current[GIF])
    {
      setGif(gifCache.current[GIF]);
      return;
    }
    const giphyF = new GiphyFetch(process.env.REACT_APP_GIPHY_API_KEY);
    giphyF.gif(GIF).then(({ data }) => {
      gifCache.current[GIF] = data;
      setGif(data);
    });
  }, [GIF]);

  if (!gif) return null;

  return (
    <Box
      p="1"
      maxW={DEVICE === "Mobile" ? 200 : 300}
      borderRadius="16px"
      overflow="hidden"
      boxShadow="md"
    >
      <Gif gif={gif} width={DEVICE === "Mobile" ? 200 : 300} />
    </Box>
  );
});

export default Message;
