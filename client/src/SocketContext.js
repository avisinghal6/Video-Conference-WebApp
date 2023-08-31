import {createContext, useState, useRef, useEffect} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext= createContext();

const socket= io('http://localhost:2000');

const ContextProvider =({children})=>{
    const [stream,setStream] =useState(null);
    const [screenstream,setScreenStream] =useState(null);
    const [me, setMe] = useState('');
    const [call, setCall]= useState({});
    const [callAccepted, setCallAccepted]= useState(false);
    const [callEnded, setCallEnded]= useState(false);
    const [name,setName]= useState('');
    const [ScreenShare,setScreenShare]=useState({});
    const [screenShareAccepted,setScreenShareAccepted]=useState(false);
    const myVideo =useRef();
    const userVideo =useRef(); 
    const connectionRef =useRef(); 
    const connectionRef2 =useRef(); 
    const screenStream=useRef();
    const [identity, setIdentity] = useState(null);
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
            setIdentity(from);
            setCall({isReceivedCall:true, data: data,from : from,name: name});
        });

        socket.on('shareScreen',({data, from, name})=>{
            // console.log("sharing");
            setScreenShare({isSharing:true, data: data,from : from,name: name});
            // AcceptScreenShare();
        });

        if(screenstream!=null){
            console.log("printing")
            hostScreen();
        }


    },[screenstream]);

    const AcceptScreenShare= () => {
        setScreenShareAccepted(true);
        const peer = new Peer({ initiator:false, trickle:false, stream});

        peer.on('signal', (data)=>{
            // console.log("accepting sharing")
            socket.emit('sharingScreen',{data: data,to:ScreenShare.from, name: name});
        });

        peer.on('stream', (currentStream) =>{
            console.log("now streaming",currentStream);
            if (screenStream.current) {
                screenStream.current.srcObject = currentStream;
                console.log("streaming",currentStream);
            }
            // console.log("user")

        });
    
        peer.signal(ScreenShare.data);

        connectionRef2.current = peer;
    }
    const answerCall= () =>{
        setCallAccepted(true);
        
        const peer = new Peer({ initiator:false, trickle:false, stream});

        peer.on('signal', (data)=>{
            // console.log("answering")
            socket.emit('answercall',{data: data,to:call.from, name: name});
        });

        peer.on('stream', (currentStream) =>{
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
            // console.log("user")

        });
    
        peer.signal(call.data);

        connectionRef.current = peer;
    }

    const callUser=(id) =>{
        const peer = new Peer({ initiator:true, trickle:false, stream});
        // console.log("call peer",peer);
        setIdentity(id);
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
                setScreenStream(currentStream);
                if (screenStream.current) {
                    screenStream.current.srcObject = currentStream;
                    
                    // hostScreen();
                    console.log(connectionRef.current);
                }
            });
    }

    const hostScreen=() => {
        console.log(screenstream);
        const peer = new Peer({ initiator:true, trickle:false, stream:screenstream});
        
        peer.on('signal', (data)=>{
            socket.emit('shareScreen',{toUser: identity,data: data, from: me, name: name});
        });
        // console.log("func called");

        // peer.on('stream', (currentStream) =>{

        //     if (userVideo.current) {
        //         userVideo.current.srcObject = currentStream;
        //     }
        // });


        socket.on('screenShareAccepted',(data, name)=>{
            console.log("accepted");
            setScreenShareAccepted(true);
            setScreenShare({isSharing:false,data: data,from : me,name: name});
            peer.signal(data);
            // console.log(peer);

        });
  
        connectionRef2.current = peer;
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
            screenStream,
            ScreenShare,
            screenShareAccepted,
            AcceptScreenShare
        }}>
            {children}
        </SocketContext.Provider>
    )

}

export {ContextProvider, SocketContext};