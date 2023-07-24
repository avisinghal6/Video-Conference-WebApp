import {Button, Grid, Typography, Paper} from '@material-ui/core';
import {useState} from 'react';
import { Mic as MicIcon, MicOff as MicOffIcon , VideocamOff, Videocam as VideocamIcon} from '@material-ui/icons';
import { SocketContext } from '../SocketContext';
import useStyles from '../styles/VideoPlayer';
import { useContext } from 'react';
const VideoPlayer = () => {
    const {name, callAccepted, myVideo, userVideo, callEnded, stream, call}= useContext(SocketContext);
    const classes = useStyles();
    const [mute,setMute] =useState(false);
    const [video,setVideo] =useState(true);
    return(
        <Grid container className={classes.gridContainer} spacing={2}>
            {
                stream && (
            
            <Paper className={classes.paper}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom> {name || 'Name'}</Typography>
                    <video playsInline muted= {mute} ref={myVideo} autoPlay className={classes.video}/>
                    
                </Grid>

                <Grid item xs={12} md={6}>
                    <Button variant="contained" color="primary" sx={{ marginRight:5 }} startIcon= {(mute && (< MicOffIcon/>)) ||  (!mute && (<MicIcon />))} onClick={() => {
                        mute?setMute(false):setMute(true)
                        }}>
                        {mute?"Unmute":"Mute"}
                    </Button>
                    <Button variant="contained" color="primary" sx={{ m: 2, marginLeft: 5  }} startIcon= {(video && < VideocamOff/>) || (!video && < VideocamIcon/>)} onClick={() => {
                        if(video){
                            myVideo.current.srcObject= new MediaStream(stream.getAudioTracks());
                            setVideo(false)
                        }else{
                            myVideo.current.srcObject=stream
                            setVideo(true)
                        }
                        }}>
                        {video?"Video Off":"Video On"}
                    </Button>
                </Grid>
            </Paper>
                )}

            {
                callAccepted && !callEnded && (
            
            <Paper className={classes.paper}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom> {call.name || 'Name'}</Typography>
                    <video playsInline ref={userVideo} autoPlay className={classes.video}/>
                </Grid>
            </Paper>
                )}

                
        </Grid>
    )
}

export default VideoPlayer;