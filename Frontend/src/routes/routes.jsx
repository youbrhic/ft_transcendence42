

import ProtectedRoute from "../features/userauth/protectauth";
import React, { lazy, Suspense } from 'react';


const Layout = lazy(() => import('../features/layout/Layout'));
const ChatApp = lazy(() => import('../features/Chat/Chat'));
const Home = lazy(() => import('../features/Home/Home'));
const Game = lazy(() => import('../features/Game/Game'));
const Settings = lazy(() => import('../features/Settings/Settings'));
const Logout = lazy(() => import('../features/Logout/Logout'));
const Profile = lazy(() => import('../features/Profile/Profile'));
const PingPong = lazy(() => import('../features/Game/PingPong'));
const TicTacToe = lazy(() => import('../features/Game/TicTacToe'));
const GameHome = lazy(() => import('../features/Game/GameHome'));
const Userauth = lazy(() => import('../features/userauth/userauth'));
const TwoFA = lazy(() => import('../features/userauth/twofa'));
const Signin = lazy(() => import('../features/userauth/signin'));
const Signup = lazy(() => import('../features/userauth/signup'));
const RemoteGame = lazy(() => import('../features/Game/Tic-Tac/Remote/RemoteGame'));//
const LocalGame = lazy(() => import('../features/Game/Tic-Tac/Local/LocalGame'));
const LocalPong = lazy(() => import('../features/Game/PingPong/Local/LocalPong'));
const RemotePong = lazy(() => import('../features/Game/PingPong/Remote/RemotePong'));
const GameSettings = lazy(() => import('../features/Settings/Game'));
const ProfileSetting = lazy(() => import('../features/Settings/Profile'));
const SecurtitySettings = lazy(() => import('../features/Settings/Security'));
const Friends = lazy(() => import('../features/Friends/Friends'));
const Notification = lazy(() => import('../features/Notifications/Notification'));
const TournamentPong = lazy(() => import('../features/Game/PingPong/Tournaments/TournamentPong'));
const TournamentCreate = lazy(() => import('../features/Game/PingPong/Tournaments/TournamentCreate'));
const TournamentJoin = lazy(() => import('../features/Game/PingPong/Tournaments/TournamentJoin'));
const TournamentBoard = lazy(() => import('../features/Game/PingPong/Tournaments/TournamentBoard'));
const TournamentGameStart = lazy(() => import('../features/Game/PingPong/Tournaments/TournamentGameStart'));
const InviteGame = lazy( () => import('../features/Game/PingPong/Invite/InviteGame'))
import NotFound from "../features/NotFound/NotFound";
export const routes = [
  {
    path: "/login",
    element: <Userauth />,
    children: [
      { path: "Signin", element: <Signin /> },
      { path: "Signup", element: <Signup /> },
      { path: "twofa", element: <TwoFA /> },
    ],
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "friends",
        element: <Friends />,
      },
      { path: "chat", element: <ChatApp /> },
      { path: "/chat/:username", element: <ChatApp /> },
      {
        path: "game",
        element: <Game />,
        children: [
          { index: true, element: <GameHome /> },
          { path: "ping-pong", element: <PingPong /> },
          { path: "ping-pong/local-game", element: <LocalPong /> },
          { path: "ping-pong/remote-game", element: <RemotePong /> },
          { path: "ping-pong/tournament-game", element: <TournamentPong /> },
          {
            path: "ping-pong/tournament-game/tournament-create",
            element: <TournamentCreate />,
          },
          {
            path: "ping-pong/tournament-game/tournament-join",
            element: <TournamentJoin />,
          },
          {
            path: "ping-pong/tournament-game/tournament/:tournamentId/view",
            element: <TournamentBoard />,
          },
          {
            path: "ping-pong/tournament-game/tournament/:tournamentId/game",
            element: <TournamentGameStart />,
          },
          { path: "ping-pong/invite/:roomId", element: <InviteGame /> },
          { path: "tic-tac-toe", element: <TicTacToe /> },
          { path: "tic-tac-toe/local-game", element: <LocalGame /> },
          { path: "tic-tac-toe/remote-game", element: <RemoteGame /> },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          { path: "profile", element: <ProfileSetting /> },
          { path: "game", element: <GameSettings /> },
          { path: "security", element: <SecurtitySettings /> },
        ],
      },
      { path: "notification", element: <Notification /> },
      { path: "logout", element: <Logout /> },
      { path: "profile/:user?", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
