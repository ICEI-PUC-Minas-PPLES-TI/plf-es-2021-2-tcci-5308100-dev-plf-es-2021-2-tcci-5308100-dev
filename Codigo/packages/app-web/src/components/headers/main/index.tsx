import React, { Fragment, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MainHeaderType } from './types';
import SLogo from '~/assets/img/s-logo.png';
import { AuthContext } from '~/context/AuthContext';
import HeaderSearchInput from './HeaderSearchInput';

const MainHeader: React.FunctionComponent<MainHeaderType> = ({ centerMenus }) => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const notifications: string[] = ['Notificação 01', 'Notificação 02', 'Notificação 03'];

  return (
    <header className='navbar fixed-top flex-md-nowrap p-0 my-2 mx-3 bg-white rounded-md shadow-lg px-3'>
      <div className='navbar-brand col-md-3 col-lg-2 me-0 justify-content-start w-auto' style={{ fontSize: '14pt' }}>
        <img className='me-1' src={SLogo} alt='Logo' />
        <span className='d-none d-md-block'>Open Source</span>
      </div>

      <div className='float-left ms-3 nav-input-search d-lg-block on-large'>
        <i className='fas fa-search start' style={{ top: '22px', zIndex: 1 }} />
        <HeaderSearchInput />
      </div>

      <span className='ms-3' />
      <div>
        {centerMenus.map((menu) => (
          <NavLink
            key={`center_menu_${menu.href}`}
            className={({ isActive }) => `px-1 py-2 text-center position-relative ${isActive ? 'active' : ''}`}
            to={menu.href}
          >
            <i className={`menu-icon background ${menu.iconClass}`} title={menu.label}></i>
          </NavLink>
        ))}
      </div>

      <div className='d-flex flex-row ms-auto'>
        <div className='dropdown'>
          <button className='btn dropdown-toggle' type='button' data-bs-toggle='dropdown'>
            <i className='far fa-bell' />
          </button>
          <ul className='dropdown-menu dropdown-menu-end'>
            {notifications.map((notification, i) => (
              <Fragment key={`header_notification_${notification}`}>
                {i !== 0 && (
                  <li>
                    <hr className='dropdown-divider' />
                  </li>
                )}
                <li>
                  <a className='dropdown-item' href='#'>
                    {notification}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>

        <div className='dropdown'>
          <button className='btn dropdown-toggle' type='button' data-bs-toggle='dropdown'>
            <i className='fas fa-cog' />
          </button>
          <ul className='dropdown-menu dropdown-menu-end'>
            <li>
              <a className='dropdown-item clickable' onClick={() => navigate('/explorador/perfil')}>
                <i className='far fa-user pe-2' />
                Perfil
              </a>
            </li>
            <li>
              <hr className='dropdown-divider' />
            </li>
            <li>
              <a className='dropdown-item clickable' onClick={signOut}>
                <i className='fas fa-power-off pe-2' />
                Sair
              </a>
            </li>
          </ul>
        </div>

        <button
          className='d-lg-none collapsed no-border-focus ms-2 me-3 p-0 btn btn-link text-dark'
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
      </div>

      <div
        id='nav-input-search'
        className='float-left me-3 nav-input-search on-small expanded d-lg-none position-absolute collapse'
        style={{ top: '10px', marginLeft: '-5px' }}
      >
        <i className='fas fa-search start' style={{ top: '29.5px', zIndex: 1 }} />
        <HeaderSearchInput onSmall />
        <i
          className='fas fa-times end'
          data-bs-toggle='collapse'
          data-bs-target='#nav-input-search'
          aria-expanded='false'
          style={{ top: '32.5px' }}
        />
      </div>
    </header>
  );
};

export default MainHeader;
