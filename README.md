# Artist Circle Prototype

Welcome to the Artist Circle Prototype. This application serves as a high-fidelity, interactive demonstration of a dating and networking platform tailored specifically for artists and creative professionals.

Live Deployment: https://artistscircle.yatintaneja.in/

## Application Overview

Artist Circle is designed to connect visual creatives, musicians, designers, and other artists through a sleek, dark-mode focused interface. The application is built as a Single Page Application (SPA) utilizing modern frontend frameworks and state-of-the-art interactive patterns, including complex navigation history management, real-time simulated chat, and floating media widgets.

As a prototype, the application relies on pre-populated mock data to simulate a live environment, ensuring that all UI/UX flows can be tested without the need for a backend database.

## Core Features and Modules

### 1. Discovery and Matchmaking
The primary discovery interface allows users to browse through potential connections. 
- Profile Filtering: Users can filter potential matches by geographic distance, age brackets, and specific artistic disciplines.
- Profile Interaction: The system supports standard matching interactions (like and pass). Matches trigger a dedicated notification overlay.
- Hidden and Incognito Profiles: Simulates premium privacy features where users can hide their profiles or browse incognito.

### 2. Likes and Connections
A dedicated view displaying users who have shown interest.
- Mutual Connections: Establishing a mutual like transitions the profile into the active chat roster.
- Pro Features: Integrates premium features such as sending "Sparks" (super likes) or "Uplifting" a profile for greater visibility.

### 3. Messaging and Communications
A comprehensive chat system that mimics real-time messaging.
- Chat History: Maintains simulated chat logs for various connections.
- Message Interactions: Supports read receipts, typing indicators, replying to specific messages, and message reactions.
- Connection Categories: Chats are organized into 'primary' and 'general' categories based on user preference and connection history.

### 4. Voice and Video Calling System
A standout feature of the prototype is the simulated communication layer.
- In-App Calling: Users can initiate mock voice and video calls directly from the chat interface.
- Picture-in-Picture (PiP): Active calls can be minimized into a floating, draggable widget that persists across different application views.
- Call Controls: Includes standard controls such as mute, speaker toggle, video disable, and hold.

### 5. Profile Management
A central hub for user customization and settings.
- Portfolio Integration: Users can upload and manage multiple images to serve as their creative portfolio.
- Biography and Interests: Detailed sections for standard bios, hidden 'easter egg' bios, and selectable artistic interests.
- Theme Customization: A built-in theme engine allows users to switch between various color palettes, with the application dynamically updating CSS variables.

## Technical Architecture

### Tech Stack
- Framework: React (v19)
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS combined with standard CSS variables for dynamic theming.

### State Management
The application utilizes React hooks (useState, useEffect, useRef) for local and global state management. The `App.tsx` file serves as the central state container, orchestrating the data flow between the various views (Discover, Likes, Chat, Profile).

### Navigation and Routing
Instead of utilizing a traditional routing library, the application implements a custom Tab-based navigation system integrated directly with the browser's History API. 
- The `window.history.pushState` method is used extensively to trap back-button events.
- This ensures that when a user presses the physical back button on their device (or browser), it dismisses overlays, modals, or active chats rather than abruptly exiting the application.

### Data Simulation
All profile and chat data is stored statically within the `src/data` directory.
- `data/profiles/discover/profiles.ts`: Contains the dataset for the discovery feed.
- `data/profiles/likes/profiles.ts`: Contains users who have already liked the main profile.
- `data/chats/connections.ts` & `history.ts`: Manages the active roster of chats and their respective message histories.

## Local Development and Deployment

### Prerequisites
Ensure you have Node.js and npm installed on your local environment.

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yatin-superintelligence/artists-connect-demo.git
   cd artists-connect-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Production Build

To compile the application for production deployment:

```bash
npm run build
```
This command bundles the application via Vite, optimizing the assets and outputting them to the `dist` directory. The prototype utilizes `vite-plugin-singlefile` to inline assets where applicable, streamlining the deployment process.

### Docker Support
The repository includes a `Dockerfile` and `nginx.conf` for containerized deployment, ensuring that the application can be served via Nginx in any Docker-compatible environment.
