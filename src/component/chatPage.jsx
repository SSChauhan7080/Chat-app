import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessagess } from '../service/RoomService';
import { timeAgo } from '../config/helper';

// create state to store messagese


export const ChatPage = () => {
    
    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser}=useChatContext();
    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);
    // stay after refresh work here
     const navigate=useNavigate();
     useEffect(()=>{
        if(!connected){
            navigate("/");
        }
     },[connected, roomId, currentUser])

    const [messages, setMessages] = useState([
        {
            content:'hello ?',
            sender:'Saurabh',
        },
        {
            content:'hello jjhdj akh?',
            sender:'chauhan ',
        },
        {
            content:'hello jjhdj akh?',
            sender:'chauhan ',
        }, {
            content:'hello jjhdj akh?',
            sender:'chauhan ',
        }, {
            content:'hello jjhdj akh?',
            sender:'Saurabh',
        },
    ]);
    const[input, setInput]=useState("");
    const inputRef=useRef(null);
    const chatBoxRef=useRef(null);
    const [stompClient, setStompClient]=useState(null);

    // page init
    //old message ko load kren
    useEffect(()=>{
        async function loadMessages() {
            try {
                const messages=await getMessagess(roomId);
                
                setMessages(messages);
                
            } catch (error) {
                
            }
        }
       if(connected){
        loadMessages()
       }
    },[])


    //scroll down for scrolling automatic
    useEffect(()=>{
        if(chatBoxRef.current){
            chatBoxRef.current.scroll({
             top: chatBoxRef.current.scrollHeight,
             behavior: "smooth",
            });
        }

    },[messages])

    //stompclint ko init kaeren
      // subscribe
      useEffect(()=>{
        //stomp client 
        const connectWebSocket=()=>{
             // socket JS
             const sock=new SockJS(`${baseURL}/chat`)
             const client=Stomp.over(sock)

             client.connect({}, ()=>{
               setStompClient(client);
               toast.success("connected");
               client.subscribe(`/topic/room/${roomId}`, (message)=>{
                console.log(message);
                const newMessage = JSON.parse(message.body);
                setMessages((prev)=> [...prev, newMessage]);
               });
             });

        };
       if(connected){
        connectWebSocket();
       }
      },[roomId])

    //send message handle
    const sendMessage=async()=>{
        if(stompClient && connected && input.trim()){
         console.log(input);
         const message={
            sender:currentUser,
            content:input,
            roomId:roomId
         }
         stompClient.send(`/app/sendMessage/${roomId}`,
            {}, 
            JSON.stringify(message));
         setInput("")
        }
    }

    // logout
    function handleLogout(){
        stompClient.disconnect();
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate('/');
        
    }
  
  return (
    <div className=''>
        <header className='dark:border-gray-700 border h-20 fixed w-full dark:bg-gray-900 py-5shadow flex justify-around items-center'>
            {/* room name container  */}
            <div >
                <h1 className='text-xl font-semibold'>
                     Room : <span>{roomId}</span>
                     </h1>

            </div>
            {/* user name container */}
            <div>
            <h1 className='text-xl font-semibold'>
            User : <span>{currentUser}</span></h1>

            </div>
            {/* button leave room  */}
            <div>
               <button onClick={handleLogout} className='dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-full'>
                Leave Room</button>
            </div>
        </header>

        <main ref={chatBoxRef}
        className='py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto'>
            {
                messages.map((message, index)=>(
                   <div key={index} className={`flex ${message.sender==currentUser? "justify-end":"justify-start" }`}>
                     <div  className={`my-2  ${  message.sender==currentUser? "bg-green-800":"bg-gray-800"} p-2 max-w-xs rounded`}>
                       <div className='flex flex-row gap-2'>
                        <img className=" h-10 w-10" src={"https://avatar.iran.liara.run/public/8"} alt="" />
                       <div className=' flex flex-col gap-1'>
                            <p className='text-sm font-bold'>{message.sender}</p>
                            <p>{message.content}</p>
                            <p className='text-xs text-gray-400'>{timeAgo(message.timeStamp)}</p>
                        </div>
                       </div>

                    </div>
                   </div>
                ))
            }
      
        </main>


        {/* Input message container */}
        <div className='fixed bottom-2 bottom-4 w-full h-16 '>
            <div className='h-full pr-10 gap-4 flex items-center justify-between border w-1/2 dark:bg-gray-900 rounded-full mx-auto'> 
            <input 
            value={input}
            onChange={(e)=>{
                setInput(e.target.value)}}
            onKeyDown={(e)=>{
                if(e.key==="Enter"){
                    sendMessage();
                }
            }}
            type="text" 
            placeholder="Type Your mesaage here...." 
            className='dark:border-gray-600 w-full px-5 dark:bg-gray-800 py-2 rounded-full  h-full focus:outline-none' />
           <div className='flex gap-1'>
           <button className='dark:bg-purple-600 h-10 w-10 flex justify-center items-center rounded-full'>
                <MdAttachFile size={20}/>
            </button>
           <button 
           onClick={sendMessage}
           className='dark:bg-green-600 h-10 w-10 flex justify-center items-center rounded-full'>
                <MdSend size={20}/>
            </button>
           </div>
            </div>
         
        </div>
    </div>
  )
}
export default ChatPage; // Change to default export
