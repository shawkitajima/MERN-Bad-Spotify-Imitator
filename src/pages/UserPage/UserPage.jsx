import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NavBar from '../../components/NavBar/NavBar'
import TrackTable from '../../components/TrackTable/TrackTable';
import spotifyService from '../../utils/spotifyService';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }));

const UserPage = (props) => {
    const classes = useStyles();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        spotifyService.refresh(props.user._id)
            
        spotifyService.getPlaylists(props.user._id).then(res => 
            setPlaylists(res.playlists))
    }, [])

    return (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar} style={{ background: 'darkGrey' }}>
          <Toolbar >
            <Typography variant="h6" noWrap>
                < NavBar
                    user={props.user} 
                    handleLogout={props.handleLogout}
                 />
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar}/>
          <List >
              <ListItem button component={Link} to="/">
                <ListItemText primary='Songs' />
              </ListItem>
              <ListItem button component={Link} to="/albums">
                <ListItemText primary='Albums' />
              </ListItem>
          </List>
          <Divider />
          <List>
            {playlists.map((playlist, idx) => (
              <ListItem button component={Link} to="/playListDetail" key={idx}>
                <ListItemText primary={playlist.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
            <h1>Your Saved Songs</h1>
            < TrackTable
                    user={props.user}
                />
        </main>
      </div>
        // <>
        //     <h1>Your Saved Songs</h1>
        //     <NavBar   
        //     user={props.user} 
        //     handleLogout={props.handleLogout}
        //     />
        //     < TrackTable
        //         user={props.user}
        //      />
        // </>
    )
}

export default UserPage;