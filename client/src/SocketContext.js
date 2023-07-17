import {createContext, useState, useRef, useEffect} from 'react';
import {Socket, io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext= createContext();

const socket= io('http://localhost:2000');

const ContextProvider =({children})=>{
    const [stream,setStream] =useState(null);
    const [me, setMe] = useState('');
    const [call, setCall]= useState();
    const [callAccepted, setCallAccepted]= useState(false);
    const [callEnded, setCallEnded]= useState(false);
    const [name,setName]= useState('');
    const myVideo =useRef();
    const userVideo =useRef(); 
    const connectionRef =useRef(); 
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
            setCall({isReceivedCall:true, data,from,name});
        });


    },[]);
    const answerCall= () =>{
        setCallAccepted(true);

        const peer = new Peer({ initiator:false, trickle:false, stream});

        peer.on('data', (data)=>{
            socket.emit('answerCall',{data,to:call.from});
        });

        peer.on('stream', (currentStream) =>{
            userVideo.current.srcObject= currentStream;
        });

        peer.signal(call.data);

        connectionRef.current = peer;
    }

    const callUser=(id,) =>{
        const peer = new Peer({ initiator:true, trickle:false, stream});

        peer.on('data', (data)=>{
            socket.emit('callUser',{id,data, me, name});
        });

        peer.on('stream', (currentStream) =>{
            userVideo.current.srcObject= currentStream;
        });

        peer.on('stream', (currentStream) =>{
            userVideo.current.srcObject= currentStream;
        });

        socket.on('callaccepted',(data)=>{
            setCallAccepted(true);

            peer.signal(data);

        });

        connectionRef.current = peer;
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
            answerCall
        }}>
            {children}
        </SocketContext.Provider>
    )

}

export {ContextProvider, SocketContext};