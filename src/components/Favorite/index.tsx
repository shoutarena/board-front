import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.webp';
import { FavoriteList } from 'types/interface';

// Props
interface Props{
    favoriteList: FavoriteList;
}

/**
 * Component: Favorite 컴포넌트
 */
export default function Favorite({favoriteList}: Props) {

    // Properties
    const {profileImage, nickname, email} = favoriteList;

    // Render: Favorite 컴포넌트 render
    return (
       <div className='favorite-list-item'>
            <div className='favorite-list-item-profile-box'>
                <div className='favorite-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
            </div>
            <div className='favorite-list-item-nickname'>{nickname}</div>
       </div>
    );
}
