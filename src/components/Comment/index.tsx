import React from 'react';
import { CommentList } from 'types/interface';
import defaultProfileImage from 'assets/image/icon/default-profile-image.png'
import './style.css';

// * interface: Comment Component Properties
interface Props {
    commentList: CommentList;
}

// * Compponent: Comment List Component
export default function Comment({commentList}: Props) {

    // * State: Properties
    const { nickname, profileImage, content, regDt } = commentList;

    // * Render: Comment List Rendering
    return (
       <div className='comment-list-item'>
           <div className='comment-list-item-top'>
               <div className='comment-list-item-profile-box'>
                   <div  className='comment-list-item-profile-image' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
               </div>
               <div className='comment-list-item-nickname'>{nickname}</div>
               <div className='comment-list-item-divider'>{`\|`}</div>
               <div className='comment-list-item-time'>{regDt}</div>
           </div>
           <div className='comment-list-item-main'>
               <div className='comment-list-item-content'>{content}</div>
           </div>
       </div>
    );
}
