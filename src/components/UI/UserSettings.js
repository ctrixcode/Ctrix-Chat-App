import { useState, useRef, useContext } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import usePictures from "../Custom_hooks/usePictures";

import { doc, setDoc } from "firebase/firestore";
import AppContext from "../GlobalStore/Context";
import { db, storage } from "../../firebase";

import {
  Container,
  FormLabel,
  Input,
  Image,
  Radio,
  RadioGroup,
  HStack,
  VStack,
  Button,
  Heading,
  Text,
  useColorMode,
  CircularProgress,
  useColorModeValue,
} from "@chakra-ui/react";
import useDevice from "../Custom_hooks/useDevice";

export default function UserSettings(props) {
  // Initialise
  const [, boy, boy2, girl, girl2] = usePictures();
  const { colorMode } = useColorMode();
  const DEVICE = useDevice();

  const context = useContext(AppContext);

  const [inputName, setInputName] = useState("");
  const [image, setimage] = useState("");
  const [UserID, setUserID] = useState("");
  const [SelectedAvatar, setSelectedAvatar] = useState(() =>
    props.firstTime ? boy : "default"
  );
  const [CustomPicture, setCustomPicture] = useState();

  // Toggler
  const [clickUpload, setclickUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Ref
  const UploadRef = useRef(null);

  // Variables
  const ImageSize = DEVICE === "Desktop" ? "16" : "8";

  if (UserID === "") {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUserID(user.uid);
      }
    });
  }

  const UploadFile = () => {
    // e.preventDefault();
    setclickUpload(true);
    if (!image) return;
    setUploadSuccess(false);
    setclickUpload(false);
    setUploading(true);
    const storageRef = ref(storage, `profilepicture/${image.name}`);
    uploadBytesResumable(storageRef, image)
      .then(() => {
        setUploadSuccess(true);
        setUploading(false);
      })
      .then(() => {
        getDownloadURL(storageRef).then((url) => {
          setCustomPicture(url);
        });
      });
  };
  const CancelSettings = () => {
    context.setDisplayUserSettings(false);
  };

  const SendData = (e) => {
    e.preventDefault();
    if (SelectedAvatar === "other" && !CustomPicture && !uploadSuccess) {
      setclickUpload(true);
      return;
    }
    if (!uploadSuccess && SelectedAvatar === "other") {
      return;
    }
    if (SelectedAvatar === "default" && inputName === "") {
      context.setDisplayUserSettings(false);
      context.setFirstTimeLogin(false);
      return;
    }
    let ProfilePicture;
    if (props.firstTime) {
      ProfilePicture =
        SelectedAvatar === "other" ? CustomPicture : SelectedAvatar;
    }
    if (!props.firstTime) {
      if (SelectedAvatar !== "default") {
        ProfilePicture = SelectedAvatar;
      }
      if (SelectedAvatar === "other") {
        ProfilePicture = CustomPicture;
      }
      if (SelectedAvatar === "default") {
        ProfilePicture = context.Current_UserData.ProfilePicture;
      }
    }
    if (inputName) {
      setDoc(doc(db, "User_Data", UserID), {
        User_ID: UserID,
        NickName:
          inputName === "" ? context.Current_UserData.NickName : inputName,
        ProfilePicture: ProfilePicture,
      });
    }
    context.setCurrent_UserData({
      User_ID: UserID,
      NickName:
        inputName === "" ? context.Current_UserData.NickName : inputName,
      ProfilePicture:
        SelectedAvatar === "other" ? CustomPicture : SelectedAvatar,
    });
    context.setDisplayUserSettings(false);
    context.setFirstTimeLogin(false);
  };
const bgColor = useColorModeValue(
  "brand.sideBarBackgroundLight", // light mode
  "brand.sideBarBackground" // dark mode
);

const textColor = useColorModeValue(
  "brand.primarytext", // light mode
  "brand.primarytextDark" // dark mode
);

return (
  <Container
    pos="fixed"
    h="full"
    w="full"
    maxW="full"
    zIndex="500"
    justifyContent="center"
    centerContent
  >
    <VStack
      p="5"
      w={DEVICE === "Mobile" ? "100vw" : "initial"}
      borderRadius="3xl"
      boxShadow="0 0 0 400vmax rgb(0 0 0 / 0.4)"
      bg={bgColor}
      color={textColor}
    >
      {props.firstTime && (
        <Heading size="lg" color={textColor}>
          Welcome to the Ctrix Chats
        </Heading>
      )}

      <form onSubmit={SendData}>
        <VStack spacing="6">
          {props.firstTime ? (
            <FormLabel color={textColor}>Enter Your nickname:</FormLabel>
          ) : (
            <FormLabel color={textColor}>
              Enter Your nickname, if you want to change it:
            </FormLabel>
          )}

          <Input
            min="4"
            onChange={(e) => setInputName(e.target.value)}
            value={inputName}
            required={props.firstTime}
            bg={useColorModeValue("white", "gray.800")}
            color={textColor}
            border="1px solid"
            borderColor={useColorModeValue("gray.300", "gray.600")}
            _focus={{
              outline: "none",
              borderColor: "brand.telegramBtn",
              boxShadow: "0 0 0 1px brand.telegramBtn",
            }}
          />

          <FormLabel color={textColor}>Choose Avatar for your profile:</FormLabel>
          <RadioGroup
            onChange={setSelectedAvatar}
            value={SelectedAvatar}
            size="lg"
            defaultValue={props.firstTime ? boy : null}
          >
            {!props.firstTime && (
              <Radio value="default" flexDirection="column" color={textColor}>
                No Change
              </Radio>
            )}
            {[boy, boy2, girl, girl2].map((avatar, index) => (
              <Radio key={index} value={avatar} flexDirection="column" color={textColor}>
                <Image src={avatar} alt={`avatar${index}`} boxSize={ImageSize} />
              </Radio>
            ))}
            <Radio value="other" flexDirection="column" color={textColor}>
              <Text size="lg">Other</Text>
            </Radio>
          </RadioGroup>

          {SelectedAvatar === "other" && (
            <HStack>
              <Input
                type="file"
                accept=".png, .jpg, .jpeg"
                ref={UploadRef}
                onChange={(e) => setimage(e.target.files[0])}
                required
              />
              <Button onClick={UploadFile}>Upload</Button>
              {uploadSuccess && <Heading size="sm">Uploaded Successfully</Heading>}
              {uploading && <CircularProgress isIndeterminate size="10" />}
              {clickUpload && !uploadSuccess && (
                <Heading size="sm">Click upload to upload your picture.</Heading>
              )}
            </HStack>
          )}

          <HStack>
            <Button type="submit" bg="brand.telegramBtn" color="white">
              Submit
            </Button>
            {!props.firstTime && <Button onClick={CancelSettings}>Cancel</Button>}
          </HStack>
        </VStack>
      </form>
    </VStack>
  </Container>
);
}
