# Massive CSV Processor – Mobile App (React Native)

This is a mobile application built with **React Native and Expo** that allows:

- Uploading CSV files containing products
- Real-time progress tracking via **WebSocket**
- Infinite scroll listing, search, and product detail visualization
- Editing product details including price and expiration date
- Deleting products

## Requirements

- Node.js (Recommended version: 20.x or higher)

## Setup

1. **Clone the repository:**

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_NAME>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the Expo server**

```bash
npx expo start
```

## Running the app

You can run the app in the following ways:

- Expo Go on your phone → **scan the QR code** shown in the terminal

- Android emulator (via Android Studio)

- iOS simulator (via Xcode)

- Web browser (web mode)

> [!NOTE]
> Make sure your phone and computer are connected to the same Wi-Fi network if you use Expo Go.

## Environment configuration

1.  Copy the <code>.env.example</code> file and rename it to <code>.env</code>

2.  Adjust the IP addresses according to your local network:

```bash
EXPO_PUBLIC_API_URL=http://192.168.3.78:3333
EXPO_PUBLIC_WEBSOCKET_URL=ws://192.168.3.78:3334
```

⚠️ Important: The **IP must be your local machine's IP address**, since localhost or 127.0.0.1 will not work on mobile devices through Expo Go.

### How to find your local IP address (macOS)

You can use the command below in your terminal to get your local IP:

On **macOS**:

```bash
ipconfig getifaddr en0
```

On **Windows** (Command Prompt):

```bash
ipconfig
```

Look for the IPv4 Address under your active network adapter.

On **Linux**:

```bash
hostname -I
```

The first IP shown is usually your local IP.

## Author

Created by **Gustavo Silveira** <br/>
[LinkedIn](https://www.linkedin.com/in/gustavo-silveira-06601b57/)
