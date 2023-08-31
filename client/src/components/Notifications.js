import { Button } from "@material-ui/core";
import { SocketContext } from "../SocketContext";
import { useContext } from "react";

const Notifications = () => {
    const {answerCall, call, callAccepted, AcceptScreenShare,ScreenShare,screenShareAccepted} = useContext(SocketContext);
    return(
        <>
            {call.isReceivedCall && !callAccepted && (
                <div style= {{display: 'flex', justifyContent:'center'}}>
                    <h1>{call.name} is calling: </h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </div>  
            )}

            {ScreenShare.isSharing && !screenShareAccepted && (
                <div style= {{display: 'flex', justifyContent:'center'}}>
                    <h1>{ScreenShare.name} is Sharing: </h1>
                    <Button variant="contained" color="primary" onClick={AcceptScreenShare}>
                        Answer
                    </Button>
                </div>  
            )}
        </>
    )
}

export default Notifications;