import React, { Fragment, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MainHeaderType } from './types';
import SLogo from '~/assets/img/s-logo.png';
import { AuthContext } from '~/context/AuthContext';
import HeaderSearchInput from './HeaderSearchInput';
import { NotificationContext } from '~/context/NotificationContext';
import { Dropdown } from 'react-bootstrap';
import htmlParser from 'html-react-parser';
import { Notification, NotificationStatus, UserType } from '@sec/common';
import { markNotificationAsRead } from '@Services/notificationService';
import moment from 'moment';
import SpinLoading from '@Components/loading/SpinLoading';

const MainHeader: React.FunctionComponent<MainHeaderType> = ({ centerMenus }) => {
  const { signOut } = useContext(AuthContext);
  const { isLoading, notifications, setNotifications } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMarkNotificationAsRead = async (notification: Notification) => {
    try {
      const {
        payload: { notifications },
      } = await markNotificationAsRead(notification.id);

      setNotifications(notifications);
    } catch (error) {
      //
    }
  };

  return (
    <header className='navbar fixed-top flex-md-nowrap p-0 my-2 mx-3 bg-white rounded-md shadow-c-lg px-3'>
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
        <Dropdown drop='down' autoClose='outside'>
          <Dropdown.Toggle variant=''>
            <i className='far fa-bell' />
          </Dropdown.Toggle>

          <Dropdown.Menu
            className='p-4 shadow-c-lg custom-scrollbar-light custom-scrollbar-bg-white'
            style={{ width: '300px', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px' }}
          >
            {isLoading && (
              <Dropdown.Item disabled>
                <div className='dropdown-item d-flex flex-column w-100 text-center' style={{ whiteSpace: 'normal' }}>
                  <SpinLoading />
                </div>
              </Dropdown.Item>
            )}
            {!isLoading && !notifications.length && (
              <Dropdown.Item disabled>
                <div className='dropdown-item d-flex flex-column w-100 text-center' style={{ whiteSpace: 'normal' }}>
                  <small className='text-grey'>
                    Por enquanto, nada por aqui. <span className='fw-bold'>¯\_(ツ)_/¯</span>
                  </small>
                </div>
              </Dropdown.Item>
            )}
            {!isLoading &&
              notifications.map((notification, i) => (
                <Fragment key={`header_notification_${notification}`}>
                  {i !== 0 && <Dropdown.Divider />}
                  <Dropdown.Item
                    className='no-active'
                    disabled={notification.status === NotificationStatus.READ}
                    onClick={() => handleMarkNotificationAsRead(notification)}
                  >
                    <div
                      className='dropdown-item d-flex flex-column w-100 no-active position-relative'
                      style={{ whiteSpace: 'normal' }}
                    >
                      <span className='fw-bold'>{htmlParser(notification.title)}</span>
                      <small className='text-muted' style={{ fontSize: '0.75rem' }}>
                        {moment(notification.createdAt).format('DD/MM/YYYY')}
                      </small>
                      <small className='text-grey'>{htmlParser(notification.text)}</small>
                      {/* <i
                        className='fas fa-circle text-dark bg-grey p-1 position-absolute'
                        style={{
                          borderRadius: '50%',
                          width: 'fit-content',
                          fontSize: '6px',
                          top: '50%',
                          left: '-10px',
                        }}
                      /> */}
                      {notification.status === NotificationStatus.UNREAD && (
                        <i
                          className='fas fa-circle text-primary bg-grey position-absolute'
                          style={{
                            borderRadius: '50%',
                            width: 'fit-content',
                            fontSize: '10px',
                            top: '40%',
                            left: '-10px',
                          }}
                        />
                      )}
                    </div>
                  </Dropdown.Item>
                </Fragment>
              ))}
          </Dropdown.Menu>
        </Dropdown>

        <div className='dropdown'>
          <button className='btn dropdown-toggle' type='button' data-bs-toggle='dropdown'>
            <i className='fas fa-cog' />
          </button>
          <ul className='dropdown-menu dropdown-menu-end'>
            {user.type === UserType.EXPLORER && (
              <>
                <li>
                  <a className='dropdown-item clickable' onClick={() => navigate('/explorador/perfil')}>
                    <i className='far fa-user pe-2' />
                    Perfil
                  </a>
                </li>
                <li>
                  <hr className='dropdown-divider' />
                </li>
              </>
            )}
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
