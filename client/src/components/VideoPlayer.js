import {Button, Grid, Typography, Paper} from '@material-ui/core';
import {useState} from 'react';
import { VolumeMute , VideocamOff} from '@material-ui/icons';
import { SocketContext } from '../SocketContext';
import useStyles from '../styles/VideoPlayer';
import { useContext } from 'react';
const VideoPlayer = () => {
    const {name, callAccepted, myVideo, userVideo, callEnded, stream, call}= useContext(SocketContext);
    const classes = useStyles();
    const [mute,setMute] =useState(false);
    // const [video,setVideo] =useState(null);
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
                    <Button variant="contained" color="primary" sx={{ marginRight:5 }} startIcon= {< VolumeMute/>} onClick={() => setMute(true)}>
                        Mute
                    </Button>
                    <Button variant="contained" color="primary" sx={{ m: 2, marginLeft: 5  }} startIcon= {< VideocamOff/>} onClick={() => {
                        myVideo.current.srcObject=null
                        }}>
                        Video Off
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