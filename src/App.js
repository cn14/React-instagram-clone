import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import {Modal, Button, Input} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);
      }
      else{
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, userName])


  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>(
      setPosts(snapshot.docs.map(doc => ({ id:doc.id, post:doc.data()})))
    ))
  }, [])

  const signUp = (e) =>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((error) =>  alert(error.message))
    setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
 
  return (
    <div className="app">
    
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <div style={modalStyle} className= {classes.paper}>
      <form className = 'app_signup'>
        <center>
          <img  className = 'app_headerImg' 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="insta"/>
          </center>
          <Input type = 'text' placeholder = 'Username' value = {userName} onChange = {(e) => setUserName(e.target.value)}/>
          <Input type = 'text' placeholder = 'Email' value = {email} onChange = {(e) => setEmail(e.target.value)}/>
          <Input type = 'password' placeholder = 'Password' value = {password}  onChange = {(e) => setPassword(e.target.value)}/>
          <Button type = 'submit' onClick = {signUp}>Sign Up</Button>
        </form> 
      </div>
    </Modal>
    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}
    >
      <div style={modalStyle} className= {classes.paper}>
      <form className = 'app_signup'>
        <center>
          <img  className = 'app_headerImg' 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="insta"/>
          </center>
          <Input type = 'text' placeholder = 'Email' value = {email} onChange = {(e) => setEmail(e.target.value)} />
          <Input type = 'password' placeholder = 'Password' value = {password}  onChange = {(e) => setPassword(e.target.value)}/>
          <Button type = 'submit' onClick = {signIn}>Sign In</Button>
        </form> 
      </div>
    </Modal>
     <div className = 'app_header'>
        <img  className = 'app_headerImg' 
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="insta"/>
        {
          user ?
          (<Button onClick = {() => auth.signOut()}>Log Out</Button>):
          ( <div className="login_container">
              <Button onClick = {() => setOpen(true)}>Sign UP</Button>
              <Button onClick = {() => setOpenSignIn(true)}>Sign In</Button>
            </div>
            )
        }
        
     </div>
     <div className="app_posts">
     <div className="posts_left">
     {
      posts.map(({id, post}) => (
       <Post key = {id}  user = {user} postId = {id} username = {post.username} caption = {post.caption} imageUrl = {post.imageUrl} /> 
      ))
    }
     </div>
     
    <div className="posts_right">
    <InstagramEmbed
      url='https://instagr.am/p/Zw9o4/'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      injectScript
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
    />
    </div>
     
    </div>
     {
      user?
      ( 
      <ImageUpload username ={user.displayName}/>
      ):
      (
        <h3>Login to Upload</h3>
      )
    }
    </div>
  );
}

export default App;
