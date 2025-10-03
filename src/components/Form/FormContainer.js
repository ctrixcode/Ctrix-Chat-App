import React from "react";
import { Container, VStack, Heading, Box } from "@chakra-ui/react";
import { motion } from "motion/react";
import Threads from "../UI/Thread";
import BlurText from "../UI/TextAnimation";

const FormContainer = ({ children, title, Icon }) => {
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  return (
    <Container
      position="relative"
      overflow="hidden"
      maxWidth={"full"}
      minHeight={"100vh"}
      height={"100vh"}
      justifyContent={"center"}
      centerContent
      p={0}
      bgColor="#070a0f"
    >
      <Box position="absolute" inset={0} w="100%" h="100%" pointerEvents="none">
        <Threads
          amplitude={1.6}
          distance={0}
          enableMouseInteraction={false}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Box position="absolute" top={"8"} left="50%" transform="translateX(-50%)" zIndex={2} pointerEvents="none" display="flex" flexDirection="column" alignItems="center">
        <BlurText
          text="Ctrix"
          fontSize="56px"
          fontWeight={800}
          delay={100}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          style={{ color: '#ffffff' }}
        />
        <BlurText
          text="Conversations Made Simple"
          fontSize="20px"
          fontWeight={600}
          delay={250}
          animateBy="words"
          direction="top"
          onAnimationComplete={undefined}
          style={{ marginTop: 8, color: 'rgba(255,255,255,0.85)' }}
        />

      </Box>

      <VStack
        as={motion.div}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.8 }}
        padding={"6"}
        bgGradient={" #12c2e9, #c471ed, #f64f59"}
        border={"1px"}
        borderRadius={"md"}
        maxW={"lg"}
        bgColor="background"
        opacity="0.9"
        position="relative"
        zIndex={1}
        mt={{ base: 24, md: 28 }}
      >
        {Icon && (
          <VStack alignItems={"center"}>
            <Icon />
          </VStack>
        )}
        <VStack spacing={"2"} alignItems="flex-start">
          <Heading alignSelf={"center"} fontSize={"2xl"}>
            {title}
          </Heading>
          <VStack w="full"></VStack>

          {children}
        </VStack>
      </VStack>
    </Container>
  );
};
export default FormContainer;
