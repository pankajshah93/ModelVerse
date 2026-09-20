# Chat App — file structure

Standard separation used here: **api/** (talks to the server) →
**hooks/** (owns state + calls api/) → **components/** (renders state,
calls callbacks passed down). `App.jsx` is the only file that wires
hooks to components.

```
src/
├── App.jsx                     # top-level: composes hooks + pages, nothing else
├── api/
│   ├── client.js                # apiFetch() — one fetch wrapper, auth header, JSON, errors
│   ├── auth.js                  # login / signup / logout / fetchProfile
│   └── chats.js                 # fetchChats / createChat / fetchMessages / sendMessage
├── hooks/
│   ├── useAuth.js                # token, user, signIn/signUp/signOut
│   └── useChats.js               # chats, activeChatId, messages, startNewChat/openChat/send
├── constants/
│   └── models.js                 # MODEL_OPTIONS (was duplicated twice before)
└── components/
    ├── auth/
    │   └── AuthModal.jsx         # login/signup form, owns its own form state
    └── chat/
        ├── LandingPage.jsx       # logged-out screen
        ├── ChatPage.jsx          # logged-in screen, composes the rest
        ├── Sidebar.jsx           # chat list + account
        ├── MessageList.jsx       # scrollable messages + empty state
        ├── MessageBubble.jsx     # one message
        ├── MessageInput.jsx      # textarea + model picker + send (shared by both pages)
        └── ModelSelector.jsx     # model dropdown
```

## Data flow

`App.jsx` calls `useAuth()` and `useChats(auth.token)`, then hands the
returned values and functions down as props. Nothing below `App.jsx`
calls `fetch` or an `api/*` function directly — only the hooks do.

```
App.jsx
 ├─ useAuth()   → token, user, signIn(), signUp(), signOut()
 ├─ useChats(token) → chats, messages, send(), openChat(), startNewChat()
 │
 ├─ (not authed) → LandingPage  (+ AuthModal on demand)
 └─ (authed)     → ChatPage → Sidebar, MessageList, MessageInput
```

## Bugs fixed while splitting this up

- **Token wasn't persisted.** It only lived in `useState`, so refreshing
  the page logged you out. `useAuth` now saves it to `localStorage` and
  restores it on load.
- **Signup sent `age` as a string.** The number input's value is always
  a string in React; `useAuth.signUp` now converts it with `Number(age)`
  before it hits the API.
- **Model dropdown never closed on outside click** — only picking an
  option closed it. `ModelSelector` now closes on any click outside itself.
- **Switching login ⇄ signup didn't clear the error**, and — once the
  modal was split into its own component — reopening it could show
  whatever view/error was left over from last time, since the component
  doesn't unmount when hidden. Both are now reset whenever the modal opens.
- **The whole input+model-picker+send-button block was duplicated**
  between the logged-out and logged-in screens. It's now one
  `MessageInput` component used by both.

## Wiring this into your project

1. Drop `src/` into your project (merge with your existing `src/` if
   you have one).
2. Set `VITE_API_BASE` in your `.env` if your backend isn't at
   `http://localhost:5000` (see `api/client.js`).
3. Import and render `App.jsx` wherever `ChatApp` was rendered before
   — the default export name is unchanged.
