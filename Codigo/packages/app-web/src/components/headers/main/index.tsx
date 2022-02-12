import React from 'react';
import { NavLink } from 'react-router-dom';
import { MainHeaderType } from './types';
import SLogo from '~/assets/img/s-logo.png';

const MainHeader: React.FunctionComponent<MainHeaderType> = ({ centerMenus, leftMenus }) => {
  return (
    <header className='navbar fixed-top flex-md-nowrap p-0 my-2 mx-3 bg-white rounded-md shadow-lg'>
      <div className='navbar-brand col-md-3 col-lg-2 me-0 px-3' style={{fontSize: '14pt'}}>
        <img className='me-1' src={SLogo} alt='Logo' />
        Open Source
      </div>

      <div className='float-left ms-3 nav-input-search d-md-block on-large'>
        <i className='fas fa-search start' />
        <input
          className='form-control bg-grey border-0 py-2 ps-5 pe-3 rounded-lg no-border-focus'
          type='text'
          placeholder='Pesquisar'
          aria-label='Pesquisar'
        />
      </div>

      <span className='ms-3' />
      {centerMenus.map((menu) => (
        <NavLink
          key={`center_menu_${menu.href}`}
          className={({ isActive }) => `px-1 py-2 text-center position-relative ${isActive ? 'active' : ''}`}
          to={menu.href}
        >
          <i className={`menu-icon background ${menu.iconClass}`} title={menu.label}></i>
        </NavLink>
      ))}

      <span className='ms-auto' />
      {leftMenus.map((menu) => (
        <></>
      ))}

      <button
        className='d-md-none collapsed no-border-focus ms-2 me-3 p-0 btn btn-link text-dark'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#nav-input-search'
        aria-expanded='false'
      >
        <i className='fas fa-search' />
      </button>

      <button
        className='d-md-none collapsed nav-icon no-border-focus ms-2 me-3'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#sidebarMenu'
        aria-expanded='false'
      />

      <div id='nav-input-search' className='float-left mx-3 nav-input-search on-small expanded d-md-none position-absolute collapse'>
        <i className='fas fa-search start' />
        <input
          className='form-control bg-grey border-0 py-2 ps-5 pe-4 rounded-lg no-border-focus'
          type='text'
          placeholder='Pesquisar'
          aria-label='Pesquisar'
        />
        <i className='fas fa-times end' data-bs-toggle='collapse' data-bs-target='#nav-input-search' aria-expanded='false' />
      </div>
    </header>
  );
};

export default MainHeader;
