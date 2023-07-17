import { Typography, AppBar } from '@material-ui/core';
import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';
import useStyles from './styles/AppStyles';


function App() {
  const classes= useStyles();
  return (
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center"> Video Call</Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options> 
    </div>
    
  );
}

export default App;
