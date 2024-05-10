import React from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/icon/default-profile-image.png';
import { FavoriteList } from 'types/interface';

// * interface: Favorite Component Properties
interface Props{
    favoriteList: FavoriteList;
}

// * Component: Favorite Component
export default function Favorite({favoriteList}: Props) {

    // * State: Properties
    const {profileImage, nickname} = favoriteList;

    // * Render: Favorite Rendering
    return (
       <div className='favorite-list-item'>
            <div className='favorite-list-item-profile-box'>
                <div className='favorite-list-item-profile-image' style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
            </div>
            <div className='favorite-list-item-nickname'>{nickname}</div>
       </div>
    );
}
