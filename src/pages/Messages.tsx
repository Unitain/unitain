// import { useEffect, useRef, useState } from "react";
// import { supabase } from "../supabase";

// const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const [selectedUser, setSelectedUser] = useState()
//   const messagesEndRef = useRef(null);
//   const [userList, setUserList] = useState([])
//   const [searchQuery, setSearchQuery] = useState('')

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select('*')
//         .neq("user_id", user.id);

//       if (error) {
//         console.error("error while getting users", error);
//         return
//       }
//       console.warn(data[0].user_id, user.id);
//       setUserList(data)
      
//     };
//     fetchUsers(); 
//   }, []);

//   useEffect(() => {
//     if (!selectedUser) return;
  
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(`user_id.eq.${selectedUser.id},admin_id.eq.${selectedUser.id}`)
//         .order("created_at", { ascending: true });
  
//       if (!error) setMessages(data);
//     };
  
//     fetchMessages();
//   }, [selectedUser]);
  

//   const filteredUsers = userList.filter(user =>
//     user.user_email?.toLowerCase().includes(searchQuery?.toLowerCase())
//   );

//   useEffect(() => {
//     if (!selectedUser) return;
  
//     const channel = supabase
//       .channel(`messages-${user.id}`)
//       .on(
//         'postgres_changes',
//         {
//           event: 'INSERT',
//           schema: 'public',
//           table: 'messages',
//         },
//         (payload) => {
//           if (payload.new.user_id === selectedUser.user_id) {
//             setMessages((prev) => [...prev, payload.new]);
//           }
//         }
//       )
//       .subscribe();
  
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedUser]);

  
//   const handleSend = async (e: React.FormEvent, message: string | undefined) => {
//     e.preventDefault?.()
//     console.log("🚀 ~ handleSendMessage ~ message:", message)
//     if (message.trim() === '') return;

//     const {data, error } = await supabase
//     .from('messages')
//     .insert({
//        user_email: selectedUser?.email,  
//        user_id: selectedUser?.id,  
//        message: message,  
//        sender: 'admin'
//       })

//       if(error){
//         alert("error", error)
//         return
//       }
//     console.log("data", data);
//     console.log('messages', message);
//     setMessage(''); 
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//     <div className="container flex mx-auto">
//       {/* Sidebar */}
//       <div className="w-80 border-r border-gray-200 bg-white flex flex-col shadow-sm">
//         {/* Sidebar Header */}
//         <div className="p-5 bg-white border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
//           <p className="text-sm text-gray-500 mt-1">Chat with your users</p>
//         </div>
        
//         {/* Search Bar */}
//         <div className="p-4 border-b border-gray-100">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>
        
//         {/* User List */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user, index) => (
//               <div
//                 key={index}
//                 className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center ${
//                   selectedUser?.user_id === user.user_id ? "bg-primary-50" : ""
//                 }`}
//                 onClick={() => setSelectedUser(user)}
//               >
//                 <div className="relative">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-semibold text-lg mr-4">
//                     {user?.user_email?.charAt(0).toUpperCase()}
//                   </div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-baseline">
//                     <h3 className="font-medium text-gray-800 truncate">{user?.user_email}</h3>
//                     <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
//                       {new Date(user?.created_at).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-500 truncate mt-1">
//                     {user?.last_message}
//                   </p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full p-6 text-center">
//               <svg className="h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-700">No conversations found</h3>
//               <p className="text-gray-400 mt-1">Try adjusting your search query</p>
//             </div>
//           )}
//         </div>
//       </div>
  
//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedUser?.id ? (
//           <>
//         {/* Chat header */}
//             <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-semibold text-lg mr-4">
//                   {selectedUser?.user_email?.charAt(0).toUpperCase()}
//                 </div>
//                 <span className="absolute bottom-0 right-3 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-800">{selectedUser?.user_email}</h3>
//                 <p className="text-sm text-gray-500">Active now</p>
//               </div>
//               <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
//                 </svg>
//               </button>
//             </div>
  
//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-6 bg-white">
//               {messages.length > 0 ? (
//                 <div className="space-y-4">
//                   {messages.map((msg, index) => (
//                     <div
//                       key={index}
//                       className={`flex ${
//                         msg.sender === "admin" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[75%] rounded-2xl px-4 py-3 ${
//                           msg.sender === "admin"
//                             ? "bg-primary-500 text-white rounded-br-none"
//                             : "bg-white text-gray-800 rounded-bl-none shadow-md"
//                         }`}
//                       >
//                         <p className="text-sm">{msg.message}</p>
//                         <span className={`text-xs block mt-1 text-right ${
//                           msg.sender === "admin" ? "text-primary-100" : "text-gray-400"
//                         }`}>
//                           {new Date(msg.created_at).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <svg className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                   </svg>
//                   <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
//                   <p className="text-gray-400 mt-1">Start the conversation</p>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
  
//             {/* Message Input */}
//             <form
//               onSubmit={(e)=> handleSend(e, message)} 
//               className="p-4 border-t border-gray-200 bg-white"
//             >
//               <div className="flex items-center gap-2">
//                 <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
//                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
//                   </svg>
//                 </button>
//                 <input
//                   type="text"
//                   className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   placeholder="Write a message..."
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
//                 >
//                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                   </svg>
//                 </button>
//               </div>
//             </form>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
//             <div className="max-w-md text-center">
//               <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-primary-50 mb-4">
//                 <svg className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a conversation</h3>
//               <p className="text-gray-500 mb-6">
//                 Choose a chat from the sidebar to view messages or start a new conversation
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Messages;



import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true)
  useEffect(() => {
    const fetchUsers = async () => {
      // Get unique users with their latest message
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("error while getting users", error);
        return;
      }

      // Process data to get unique users with their latest message
      const usersMap = data.reduce((acc, msg) => {
        if (!acc[msg.user_id]) {
          acc[msg.user_id] = {
            id: msg.user_id,
            user_id: msg.user_id,
            user_email: msg.user_email,
            last_message: msg.message,
            last_message_time: msg.created_at,
            last_sender: msg.sender
          };
        }
        return acc;
      }, {});

      setUserList(Object.values(usersMap));
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", selectedUser.user_id)
        .order("created_at", { ascending: true });

      if (!error) setMessages(data);
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;

    const channel = supabase
      .channel(`messages-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${selectedUser.user_id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          // Update user list with new message
          setUserList(prev => prev.map(u => 
            u.user_id === payload.new.user_id 
              ? { ...u, 
                  last_message: payload.new.message,
                  last_message_time: payload.new.created_at,
                  last_sender: payload.new.sender
                } 
              : u
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  const filteredUsers = userList.filter(user =>
    user.user_email?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const handleSend = async (e) => {
    e.preventDefault();
  
    // Agar message empty ho ya koi user select na ho, toh kuch na karo
    if (!message.trim() || !selectedUser) return;
  
    try {
      // Supabase ke through message database mein insert karo
      const { data, error } = await supabase.from('messages').insert({
        user_email: selectedUser.user_email,
        user_id: selectedUser.user_id,
        message: message,
        sender: "admin",
        created_at: new Date().toISOString(),
      });
  
      if (error) {
        console.error("Message bhejnay mein error:", error);
        return;
      }
  
      // Naya message object banayo
      const newMessage = {
        ...data[0],
        id: data[0]?.id || Date.now().toString(), // agar id na mile toh temp id
        message,
        sender: "admin",
        created_at: new Date().toISOString(),
      };
  
      // Input field clear karo
      setMessage('');
  
      // Message list update karo
      setMessages(prev => [...prev, newMessage]);
  
      // User list update karo us user ke latest message ke sath
      setUserList(prev => prev.map(user => {
        if (user.user_id === selectedUser.user_id) {
          return {
            ...user,
            last_message: message,
            last_message_time: new Date().toISOString(),
            last_sender: "admin"
          };
        }
        return user; // baaqi users waise ke waise raho
      }));
  
    } catch (error) {
      console.log('Error:', error);
    } finally {
      // Input clear karna safe hai yahan bhi
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button (only visible on small screens) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-primary-500 text-white rounded-full p-3 shadow-lg hover:bg-primary-600 transition-colors"
        >
          {showSidebar ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>
  
      {/* Sidebar - responsive behavior */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-80 border-r border-gray-200 bg-white flex flex-col shadow-sm fixed md:relative inset-0 z-10`}>
        {/* Close button for mobile */}
        <div className="md:hidden p-4 flex justify-end">
          <button 
            onClick={() => setShowSidebar(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar Header */}
        <div className="p-5 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
          <p className="text-sm text-gray-500 mt-1">Chat with your users</p>
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.user_id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center ${
                  selectedUser?.user_id === user.user_id ? "bg-primary-50" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setShowSidebar(false); // Close sidebar on mobile when selecting a user
                }}
              >
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-semibold text-lg mr-3 md:mr-4">
                    {user?.user_email?.charAt(0).toUpperCase()}
                  </div>
                  {user.last_sender === 'user' && (
                    <span className="absolute top-0 right-0 w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-gray-800 truncate text-sm md:text-base">
                      {user?.user_email}
                    </h3>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {new Date(user?.last_message_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm truncate mt-1 ${
                    user.last_sender === 'user' ? 'text-gray-800 font-medium' : 'text-gray-500'
                  }`}>
                    {user.last_sender === 'admin' && 'You: '}
                    {user?.last_message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <svg className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-base md:text-lg font-medium text-gray-700">No conversations found</h3>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>
  
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedUser && 'hidden md:flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat header with back button for mobile */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
              <button 
                onClick={() => {
                  setSelectedUser(null);
                  setShowSidebar(true);
                }}
                className="md:hidden mr-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 font-semibold text-lg mr-3 md:mr-4">
                  {selectedUser?.user_email?.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 md:right-3 w-2 h-2 md:w-3 md:h-3 bg-green-400 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                  {selectedUser?.user_email}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">Active now</p>
              </div>
            </div>
  
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
              {messages.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "admin" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                          msg.sender === "admin"
                            ? "bg-primary-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <p className="text-xs md:text-sm">{msg.message}</p>
                        <span className={`text-xs block mt-1 text-right ${
                          msg.sender === "admin" ? "text-primary-100" : "text-gray-500"
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg className="h-16 w-16 md:h-20 md:w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-base md:text-lg font-medium text-gray-700">No messages yet</h3>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">Start the conversation</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
  
            {/* Message Input */}
            <form
              onSubmit={handleSend}
              className="p-3 md:p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-200 rounded-full px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xs md:text-sm"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 md:p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
                >
                  <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4 md:p-6">
            <div className="max-w-md text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 md:h-24 md:w-24 rounded-full bg-primary-50 mb-3 md:mb-4">
                <svg className="h-8 w-8 md:h-12 md:w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">Select a conversation</h3>
              <p className="text-xs md:text-base text-gray-500 mb-4 md:mb-6">
                Choose a chat from the sidebar to view messages or start a new conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;