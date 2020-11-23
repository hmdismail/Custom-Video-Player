import React from "react";

import {AppBar, Toolbar, Typography, Container, makeStyles, Grid, Button, IconButton, withStyles, Slider, Tooltip} from "@material-ui/core";
import {PlayArrow, Pause , Stop, FastForward, FastRewind, SkipNext} from "@material-ui/icons";

import ReactPlayer from "react-player";
import {useState, useRef} from "react";

// makeStyles helps us to style material-ui components using jss javascript in css
const useStyles = makeStyles({
 
  controlIcons : {
    color : '#777',
    fontSize : 50,
    transform : "scale(0.9)",
    "&:hover":{
      color : '#fff',
      transform : "scale(1)"
    }
  },

  bottomIcons : {
    color : '#999',
    "&:hover":{
      color : '#fff'
    }
  }
})

//to show the time value in the seek bar
function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

// reference from : https://material-ui.com/components/slider/
const PrettoSlider = withStyles({
  root: {
    height: 8
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

//show the time watched/played
const format = (seconds) => {
  if (isNaN(seconds)){
    return '00:00'
  }

  const date = new Date (seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart (2, '0');
  if (hh){
    return `${hh}:${mm.toString().padStart(2,'0')}:${ss}`;
  }

  return `${mm}:${ss}`;
};

function App() {
  

  const urls = [
    'https://youtube.com/watch?v=kS92I9Uybuk',
    'https://www.youtube.com/watch?v=3owqvmMf6No'
  ];

  const [currentUrlIndex, setCurrentUrlIndex] = React.useState(0);
  
  //need reactplayer to load image
  const classes = useStyles();
  // insert the controls in the playerwrapper class

  //add a variable and function of state to accept the state, all our controls will be inside this player object
  const [state, setState] = useState({
    playing : false,
    played : 0,
    seeking : false
  });

  const {playing, played} = state;


  //handler functions for state
  const handlePlayPause = () =>{
    setState ({...state, playing : !state.playing});
  };

  const playerRef = useRef(null);


  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime () + 10)
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime () - 10)
  };

  const handleStop = () =>{
    playerRef.current.seekTo(0);
    setState({playing:false});
  };

  const handleProgress =(changeState) => {
    console.log(changeState);

    if (!state.seeking){
    setState({...state, ...changeState});
    }
  };

  //defining the handler functions for seek bar
  const handleSeekChange = (e, newValue) => {
    setState({...state, played : parseFloat(newValue / 100 )})
  };

  const handleSeekMouseDown = (e) => {
    setState({...state, seeking:true})
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState ({...state, seeking:false});
    playerRef.current.seekTo(newValue / 100);
  };

  const currentTime = playerRef.current 
    ? playerRef.current.getCurrentTime() 
    : '00:00';

  const duration = playerRef.current
    ? playerRef.current.getDuration() 
    : '00:00';

  const elapsedTime = format(currentTime);

  const totalDuration = format (duration);
  /*
  const toggleFullScreen =() =>{
    screenfull.toggle(playerContainerRef.current);
  }
 */
  return (
    <>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography variant ="h5" >
            Video on reactplayer with material-ui components
          </Typography>
              
      
        </Toolbar>  
      </AppBar>

      <Toolbar/>
      
      <Container maxWidth="lg">
          <div className='playerWrapper' position='relative'>
            <ReactPlayer
              //padding-top = {"56.25%"}
              //width = '100%' height = '100%'
              width ={"100%"}
              height = {'450px'}
              playing = {playing}
              controls = {false}
              ref = {playerRef}
              onProgress={handleProgress}
              played = {played}
              //light = {true}
              url={urls[currentUrlIndex]}
              //url={[ 'https://youtube.com/watch?v=kS92I9Uybuk',
              //       'https://www.youtube.com/watch?v=3owqvmMf6No'
              //]}    
            />

            <div className='controlWrapper' style={{background : "rgba(0,0,0,1.5)"}} >

            {/* Middle controls */}

              <Grid container direction ='row' alignItems= 'center' justify= 'center'>
              
              
                <IconButton className ={classes.controlIcons} aria-label='reqind' onClick = {handleRewind}>
                  <FastRewind fontSize='small'/>
                </IconButton> 

                <IconButton className ={classes.controlIcons} aria-label='reqind' onClick={handlePlayPause}>
                  { playing ? 
                    ( <Pause fontSize = 'small'/>
                      ) : (
                      <PlayArrow fontSize= 'small'/>
                    ) }
                  </IconButton>

                <IconButton className ={classes.controlIcons} aria-label='reqind' onClick = {handleStop}>
                  <Stop fontSize='small'/>
                </IconButton>
                
                <IconButton className ={classes.controlIcons} aria-label='reqind' onClick = {handleFastForward}>
                  <FastForward fontSize='small'/>
                </IconButton>            
                
                <IconButton className ={classes.controlIcons} aria-label='reqind' onClick={ () => 
                                                                    { setCurrentUrlIndex(prevUrlIndex => (prevUrlIndex + 1) % urls.length)}
                                                                                          }>
                  <SkipNext fontSize='small'/>
                </IconButton>

              </Grid>

            {/* bottom controls */}
              <Grid container direction = 'row' justify = 'center' alignItems='center' style={{padding:1}}>
                <Grid item xs ={10}>
                  <PrettoSlider
                    min = {0}
                    max = {100}
                    // played is 0 to 1
                    value = {played *100 }
                    ValueLabelComponent = { 
                      (props) => <ValueLabelComponent {...props} value = {elapsedTime}/>
                     }
                    onChange = {handleSeekChange}
                    onMouseDown = {handleSeekMouseDown}
                    onChangeCommitted = {handleSeekMouseUp}
                  />

                </Grid>

                  <Grid item>
                    <Button variant='text' fontSize ='small' style={{color:'#999', marginLeft : 1}}>
                      <Typography>
                        {elapsedTime} / {totalDuration}
                      </Typography>
                    </Button>
                  </Grid>
              </Grid>

              
            </div>
          </div>
      </Container>
    </>
  );
}

export default App;
