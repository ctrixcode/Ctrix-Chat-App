// import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

// const config = {
//   initialColorMode: "dark",
//   useSystemColorMode: true,
// };

// const theme = extendTheme(
//   {
//     config,
//     colors: {
//       brand: {

//         primary: "#121212",
//         secondary: "#90969e",

//         // primary: "#1c1e21",
//         // secondary: "#F0F2F5",

//         primarytext: "#050505",
//         primarytextDark: "#050505",

//         sideBarHeader: "#17212B",
//         sideBarHeaderDark: "#17212B",

//         chatHeader: "#17212B",
//         chatHeaderDark: "#17212B",

//         // Telegram

//         chatBackground: "#0E1621",

//         sideBarBackground: "#17212B",

//         sideBarActiveChatBg: "#2B5278",

//         telegramBtn: "#50A7EA",

//         // Messages Color

//         currentUserMessageBg: "#2B5278",
//         currentUserMessageTextColor: "#E4ECF2",

//         otherUserMessageBg: "#182533",
//         otherUserMessageTextColor: "#E4ECF2"
        

//         // greyPrimary: "#38383d",
//         // greySecondary: "#42414d",
//       },
//     },
//   },
//   withDefaultColorScheme({
//     colorScheme: "facebook",
//     components: ["Button"],
//   })
  
// );

// export default theme;
// // #F0F2F5

import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme(
  {
    config,
    styles: {
      global: (props) => ({
        body: {
          bg: mode("#F0F2F5", "#0E1621")(props), // Light / Dark background
          color: mode("#050505", "#E4ECF2")(props),
        },
      }),
    },
    colors: {
      brand: {
        // ===== PRIMARY COLORS =====
        primary: "#121212", // Dark primary
        primaryLight: "#FFFFFF", // Light primary
        secondary: "#90969e", // Shared neutral tone
        secondaryLight: "#F0F2F5",

        // ===== TEXT COLORS =====
        primarytext: "#050505", // Light text
        primarytextDark: "#E4ECF2", // Dark text

        // ===== SIDEBAR HEADER =====
        sideBarHeader: "#17212B", // Dark
        sideBarHeaderLight: "#FFFFFF", // Light

        // ===== CHAT HEADER =====
        chatHeader: "#17212B", // Dark
        chatHeaderLight: "#FFFFFF", // Light

        // ===== CHAT BACKGROUND =====
        chatBackground: "#0E1621", // Dark
        chatBackgroundLight: "#F0F2F5", // Light

        // ===== SIDEBAR BACKGROUND =====
        sideBarBackground: "#17212B", // Dark
        sideBarBackgroundLight: "#FFFFFF", // Light

        // ===== ACTIVE CHAT BACKGROUND =====
        sideBarActiveChatBg: "#2B5278", // Dark
        sideBarActiveChatBgLight: "#E4E6EB", // Light

        // ===== TELEGRAM BUTTON =====
        telegramBtn: "#50A7EA", // Same for both modes

        // ===== MESSAGE COLORS =====
        currentUserMessageBg: "#2B5278",
        currentUserMessageBgLight: "#DCF8C6",

        currentUserMessageTextColor: "#E4ECF2",
        currentUserMessageTextColorLight: "#050505",

        otherUserMessageBg: "#182533",
        otherUserMessageBgLight: "#FFFFFF",

        otherUserMessageTextColor: "#E4ECF2",
        otherUserMessageTextColorLight: "#050505",
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "facebook",
    components: ["Button"],
  })
);

export default theme;

