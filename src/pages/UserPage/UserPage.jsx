import React, {useState, useEffect} from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SongPage from '../SongPage/SongPage';
import PlaylistPage from '../PlaylistPage/PlaylistPage';
import AlbumPage from '../AlbumPage/AlbumPage';
import spotifyService from '../../utils/spotifyService';
import NavBar from '../../components/NavBar/NavBar';
import AlbumDetailPage from '../AlbumDetailPage/AlbumDetailPage';
import SpotifyLoginPage from '../SpotifyLoginPage/SpotifyLoginPage';
import SearchPage from '../SearchPage/SearchPage';
import ArtistPage from '../ArtistPage/ArtistPage';
import './UserPage.css';
import musicImage from './Music.png';
import music2Image from './Music2.png';
import albumImage from './Album.png';
import communityImage from './CommunityPlaylist.png'

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    body: {
      backgroundColor: '#181818',
      color: 'white'
    },
    root: {
      display: 'flex',
      backgroundColor: '#181818',
      color: 'white'
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: '#181818',
      color: 'white'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      backgroundColor: '#181818',
      color: 'white'
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#181818',
      color: 'white'
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: '#282828',
      color: 'white',
      padding: theme.spacing(3),
    },
  }));

const UserPage = (props) => {
    const classes = useStyles();
    const [playlists, setPlaylists] = useState([]);
    const [devices, setDevices] = useState([{id: '', name: ''}]);
    const [activeDevice, setActiveDevice] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        spotifyService.refresh(props.user._id).then(res => {
          res.json().then(data => props.handleUserUpdate(data.user)) 
        })

        spotifyService.getUserId(props.user._id).then(res => 
          props.handleUserUpdate(res.user))

        spotifyService.getPlaylists(props.user._id).then(res => 
          setPlaylists(res.playlists))
          
        spotifyService.getAvailableDevices(props.user._id).then(res => setDevices(res.devices))

        setActiveDevice(devices[0].id);

        spotifyService.getTopTracks(props.user._id)

    }, [props.user._id])

    return (
        <div className={classes.root} >
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
              <ListItem >
                < NavBar
                  user={props.user}
                  handleLogout={props.handleLogout}
                 />
              </ListItem>
              <ListItem >
                <TextField 
                  id="outlined-basic" label="search..." variant="outlined" color='white'
                  onChange={evt => setSearch(evt.target.value)}
                />
                <Link to='/search'><Button variant="contained" color="transparent" className='button'>Go</Button></Link>
              </ListItem>
              <ListItem>
                Select Your Device: <select onChange={evt => setActiveDevice(evt.target.value)}>
                  <option>...</option>
                  {devices.map((device, idx) => (
                    <option key={idx} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </ListItem>
              <ListItem button component={Link} to="/">
                <img src={musicImage} alt="sorry" className="image"/>
                <ListItemText primary='Songs' />
              </ListItem>
              <ListItem button component={Link} to="/albums">
                <img src={albumImage} alt="sorry" className="image"/>
                <ListItemText primary='Albums' />
              </ListItem>
              <ListItem button onClick={() => spotifyService.makePlaylist(props.user._id)}>
                <img src={communityImage} alt="sorry" className="image"/>
                <ListItemText primary='Make Community Playlist' />
              </ListItem>
          </List>
          <Divider />
          <List>
            {playlists.map((playlist, idx) => (
              <ListItem button component={Link} to={{
                  pathname: "/playlistDetail",
                  playlist: playlist
                  }} key={idx}>
                <img src={music2Image} alt="sorry" className="image"/>
                <ListItemText primary={playlist.title} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
            <Switch>
                <Route exact path='/' render={() => (
                  props.user.spotifyToken ?
                    <SongPage user={props.user} device={activeDevice} handlePageUpdate={props.handlePageUpdate}  />
                    :
                    <SpotifyLoginPage user={props.user} />
                )
                }/>
                <Route exact path='/playlistDetail' render={({history}) => (
                    < PlaylistPage user={props.user} history={history} device={activeDevice} />
                )
                }/>
                <Route exact path='/albums' render={() => (
                  < AlbumPage user={props.user} device={activeDevice} />
                  )
                }/>
                <Route exact path='/albumDetail' render={({history}) => (
                    < AlbumDetailPage user={props.user} history={history} device={activeDevice} />
                )
                }/>
                <Route exact path='/search' render={({history}) => (
                    < SearchPage user={props.user} history={history} search={search} device={activeDevice} />
                )
                }/>
                <Route exact path='/artistDetail' render={({history}) => (
                    < ArtistPage user={props.user} history={history} device={activeDevice} />
                )
                }/>
            </Switch>
        </main>
      </div>
    )
}

export default UserPage;