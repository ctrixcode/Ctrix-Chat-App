# Ctrix Chat App

Ctrix Chat is a real-time chat application built with React and Firebase. It allows users to sign in, create chat rooms, and communicate with each other instantly.

## Features

*   **User Authentication:** Sign up and sign in using Firebase Authentication.
*   **Real-time Chat:** Send and receive messages instantly in chat rooms.
*   **Create Chat Rooms:** Users can create new chat rooms to talk with friends.
*   **Giphy Integration:** Share GIFs in your conversations using the Giphy API.
*   **Responsive Design:** A clean and responsive UI built with Chakra UI.

## Tech Stack

*   **Frontend:** React, Chakra UI
*   **Backend:** Firebase (Authentication, Firestore)
*   **State Management:** React Context API
*   **Routing:** React Router
*   **GIFs:** Giphy API

## Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   `pnpm` (or `npm`/`yarn`)

### Installation

1.  **Fork the repository**

2.  **Clone your fork**
    ```sh
    git clone https://github.com/your-username/Ctrix-Chat-App.git
    ```

3.  **Navigate to the project directory**
    ```sh
    cd Ctrix-Chat-App
    ```

4.  **Install dependencies**
    This project uses `pnpm`. If you have `pnpm` installed, run:
    ```sh
    pnpm install
    ```
    Alternatively, you can use `npm` or `yarn`:
    ```sh
    npm install
    # or
    yarn install
    ```

5.  **Set up Firebase**
    *   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   Add a new web app to your Firebase project.
    *   Copy your Firebase configuration.
    *   Create a `.env` file in the root of the project and add your Firebase config. Make sure to use the correct variables for your environment (Development or Production).

        ### For Development
        ```
        REACT_APP_FIREBASE_DEV_API_KEY=your-dev-api-key
        REACT_APP_FIREBASE_DEV_AUTH_DOMAIN=your-dev-auth-domain
        REACT_APP_FIREBASE_DEV_PROJECT_ID=your-dev-project-id
        REACT_APP_FIREBASE_DEV_STORAGE_BUCKET=your-dev-storage-bucket
        REACT_APP_FIREBASE_DEV_MESSAGING_SENDER_ID=your-dev-sender-id
        REACT_APP_FIREBASE_DEV_APP_ID=your-dev-app-id
        ```

        ### For Production
        ```
        REACT_APP_FIREBASE_API_KEY=your-api-key
        REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
        REACT_APP_FIREBASE_PROJECT_ID=your-project-id
        REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
        REACT_APP_FIREBASE_APP_ID=your-app-id
        ```
    *   You will also need to get a Giphy API key from the [Giphy Developer Portal](https://developers.giphy.com/).
        ```
        REACT_APP_GIPHY_API_KEY=your-giphy-api-key
        ```

6.  **Run the development server**
    ```sh
    pnpm start
    ```
    The app will be available at `http://localhost:3000`.

make sure to check npm run build if it worke

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
