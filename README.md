# Sandhyavandanam — React Native (Expo) App

A book-style React Native app for **Sandhyavandanam Vidhanam** and **Yagnopaveetam Change Vidhi**, built with Expo and the latest libraries.

## Features

- **Book-like experience**: Cover screen, table of contents, and chapter-style reading.
- **Sandhyavandanam Vidhanam**: Step-by-step procedure for the daily ritual (Pratah, Madhyahnika, Sayam) — Achamanam, Ganapati Dhyanam, Pranayamam, Sankalpa, Prokshanam, Arghya, Gayatri Japa, and Upasthaanam.
- **Yagnopaveetam Change Vidhi**: Procedure for removing the old sacred thread and wearing the new one (Upakarma / Avani Avittam), including sankalpa, dharana, and post-wearing steps.

## Tech Stack

- **Expo** ~52 (React Native 0.76, React 18.3)
- **React Navigation** 7 (native stack)
- **TypeScript**
- **Safe area** and **Screens** for layout

## Setup

```bash
npm install
npx expo start
```

Then:

- Press **i** for iOS Simulator  
- Press **a** for Android Emulator  
- Or scan the QR code with the **Expo Go** app on your device  

## Project Structure

```
App.tsx                 # Root with stack navigator
src/
  screens/
    BookCover.tsx       # Book cover (tap to open)
    TableOfContents.tsx # Chapter list
    SandhyavandanamVidhanam.tsx
    YagnopaveetamVidhi.tsx
  theme/
    colors.ts
  types/
    navigation.ts
assets/                 # App icon, splash, favicon
```

## Replacing Assets

Replace `assets/icon.png`, `assets/splash-icon.png`, `assets/adaptive-icon.png`, and `assets/favicon.png` with your own images (Expo expects these names). Content images: `assets/gayatri-mata.jpg` (book cover and Sandhyavandanam), `assets/dharana.jpg` (Yagnopaveetha Dharana Vidhi first page).

## License

For personal and devotional use.
