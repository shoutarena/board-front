import Header from 'layouts/Header';
import Footer from 'layouts/Footer';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AUTH_PATH } from 'constant';

// * Component : Container Component
export default function Container() {

    // * State : 현재 페이지의 path name 상태
    const { pathname } = useLocation();

    // * Render : Container Rendering
    return (
       <>
           <Header />
           <Outlet />
           { pathname !== AUTH_PATH() && (<Footer />) }
       </>
    );
}
