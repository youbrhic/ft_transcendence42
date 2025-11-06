
import React from "react";
import ContactList from "./ContactList";
import ContactList_Mobile from "./ContactList_Mobile";
import Conversation from "./Conversation";
import EmptyState from "../hooks/EmptyState";
import type { User } from "../types/User";

interface Props {
  isMobile: boolean;
  showContactList: boolean;
  setShowContactList: (value: boolean) => void;
  users: User[];
  filteredUsers: User[];
  selectedUser: User | null;
  handleUserSelect: (user: User) => void;
  messages: Record<number, any[]>;
  unreadCounts: Record<number, number>;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  loggedInUserId: number | null;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const ChatLayout: React.FC<Props> = ({
  isMobile,
  showContactList,
  setShowContactList,
  filteredUsers,
  selectedUser,
  handleUserSelect,
  messages,
  unreadCounts,   
  input,
  setInput,
  onSend,
  loggedInUserId,
  searchTerm,
  setSearchTerm,
}) => {
  const userMessages = selectedUser?.id ? messages[selectedUser.id] || [] : [];

  if (isMobile)
    return showContactList ? (
      <ContactList_Mobile
        users={filteredUsers}
        messages={messages}
        selectedUser={selectedUser}
        setSelectedUser={handleUserSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        unreadCounts={unreadCounts}
      />
    ) : (
      <Conversation
        user={selectedUser}
        messages={userMessages}
        input={input}
        setInput={setInput}
        onSend={onSend}
        onBack={() => setShowContactList(true)}
        loggedInUserId={loggedInUserId}
        setShowContactList={setShowContactList}
        />
      );
      
      return (
        <>
      <ContactList
        users={filteredUsers}
        messages={messages}
        selectedUser={selectedUser}
        setSelectedUser={handleUserSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        unreadCounts={unreadCounts}
        />
      {selectedUser ? (
        <Conversation
        user={selectedUser}
        messages={userMessages}
        input={input}
        setInput={setInput}
        onSend={onSend}
        loggedInUserId={loggedInUserId}
        setShowContactList={setShowContactList}
        />
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default ChatLayout;
