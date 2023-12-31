import {Button, TextField, Grid, Typography, Container,Paper} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useStyles from '../styles/Options';
import { Assignment, Phone,PhoneDisabled} from '@material-ui/icons';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { SocketContext } from '../SocketContext';
import { useContext, useState } from 'react';

const Options = ({children}) => {
    const {me, callAccepted, name, setName, callEnded, leaveCall, callUser,screenShare } = useContext(SocketContext);
    const [idToCall, SetIdToCall] = useState('');
    const classes= useStyles();
    return(
        <Container className={classes.container}> 
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6"> Account Info</Typography>
                            <TextField label="Name" value={name} onChange={(e)=> setName(e.target.value)} fullWidth />
                            <CopyToClipboard text={me} className={classes.margin} >
                                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                                    Copy Your Id
                                </Button>
                            </CopyToClipboard>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6"> Make a call</Typography>
                            <TextField label="ID to call" value={idToCall} onChange={(e)=> SetIdToCall(e.target.value)} fullWidth />
                            {
                                callAccepted && !callEnded ? (
                                    <>
                                    <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                                        Hang Up
                                    </Button>

                                    <Button variant="contained" color="primary" startIcon={<ScreenShareIcon fontSize="large" />} fullWidth onClick={screenShare} className={classes.margin}>
                                    Screen Sharing
                                    </Button>
                                    </>
                                    
                                ):(
                                    <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)} className={classes.margin}>
                                        Call
                                    </Button>
                                )
                            }
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    )
}

export default Options;