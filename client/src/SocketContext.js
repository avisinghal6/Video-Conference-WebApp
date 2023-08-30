import {createContext, useState, useRef, useEffect} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext= createContext();

const socket= io('http://localhost:2000');

const ContextProvider =({children})=>{
    const [stream,setStream] =useState(null);
    const [me, setMe] = useState('');
    const [call, setCall]= useState({});
    const [callAccepted, setCallAccepted]= useState(false);
    const [callEnded, setCallEnded]= useState(false);
    const [name,setName]= useState('');
    const myVideo =useRef();
    const userVideo =useRef(); 
    const connectionRef =useRef(); 
    const screenStream=useRef();
    useEffect(() =>{
        navigator.mediaDevices.getUserMedia({video:true, audio: true})
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });
        
        socket.on('me',(id)=>{
            setMe(id);
        });

        socket.on('callUser',({data, from, name})=>{
            setCall({isReceivedCall:true, data: data,from : from,name: name});
        });


    },[]);
    const answerCall= () =>{
        setCallAccepted(true);
        
        const peer = new Peer({ initiator:false, trickle:false, stream});

        peer.on('signal', (data)=>{
            console.log("answering")
            socket.emit('answercall',{data: data,to:call.from, name: name});
        });

        peer.on('stream', (currentStream) =>{
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
            console.log("user")

        });
    
        peer.signal(call.data);

        connectionRef.current = peer;
    }

    const callUser=(id) =>{
        const peer = new Peer({ initiator:true, trickle:false, stream});
        peer.on('signal', (data)=>{
            socket.emit('calluser',{toUser: id,data: data, from: me, name: name});
        });

        peer.on('stream', (currentStream) =>{

            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });


        socket.on('callaccepted',(data, name)=>{
            setCallAccepted(true);
            setCall({isReceivedCall:false, data: data,from : me,name: name});
            peer.signal(data);

        });
  
        connectionRef.current = peer;
    }

    const screenShare=() =>{
        navigator.mediaDevices.getDisplayMedia()
            .then((currentStream) => {
                setStream(currentStream);
                if (screenStream.current) {
                    screenStream.current.srcObject = currentStream;
                }
            });
    }

    const leaveCall= () =>{
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            setStream,
            connectionRef,
            screenShare,
            screenStream
        }}>
            {children}
        </SocketContext.Provider>
    )

}

export {ContextProvider, SocketContext};