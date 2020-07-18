import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';
import { db } from './firebase';
import firebase from 'firebase'
const Post = ({postId, user, username, caption, imageUrl}) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');



    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>{
                setComments(snapshot.docs.map((doc) => doc.data()));
            })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])
    return (
        <div className = 'post'>
            <div className="post_header">
                <Avatar className = 'post_avatar' alt="Chethan" src={imageUrl} />
                <h3>{username}</h3>
            </div>
           
            <img className = 'post_img' src={imageUrl} alt="abcd"/>
            <h4 className = 'post_text'><strong>Chethan</strong>{caption}</h4>

            <div className="post_comments">
            {
                comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> : {comment.text}
                    </p>
                ))
            }
            </div>
            {
                user ?
                (
                    <form className = 'comment_box'>
                        <input className = 'post_input'
                        type = 'text'
                        placeholder = 'Add a comment'
                        value = {comment}
                        onChange = {(e) => {setComment(e.target.value)}}
                        />
                    <button className = 'post_button'
                    type = 'submit' 
                    disabled = {!comment}
                    onClick = {postComment} >Post</button>
                    </form>
                ):
                ('')
            }
           
            
        </div>
    )
}

export default Post
