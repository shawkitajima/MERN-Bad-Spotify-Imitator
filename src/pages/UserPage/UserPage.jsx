import React, {useState, useEffect} from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SongPage from '../SongPage/SongPage';
import PlaylistPage from '../PlaylistPage/PlaylistPage'
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
    }, [props.user._id])

    return (
        <div className={classes.root}>
        <CssBaseline />
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
              <ListItem button component={Link} to={{
                  pathname: "/playlistDetail",
                  playlist: playlist
                  }} key={idx}>
                <ListItemText primary={playlist.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
            <Switch>
                <Route exact path='/' render={() => (
                    <SongPage user={props.user} />
                )
                }/>
                <Route exact path='/playlistDetail' render={({history}) => (
                    < PlaylistPage user={props.user} history={history} />
                )
                }/>
            </Switch>
        </main>
      </div>
    )
}

export default UserPage;