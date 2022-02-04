import { RouteSettings } from '@GlobalTypes';
import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

export type MainSidebarType = {
  routes: RouteSettings[];
};

const MainSidebar: FunctionComponent<MainSidebarType> = ({ routes }) => {
  return (
    <nav id='sidebarMenu' className='col-md-3 col-lg-3 d-md-block sidebar collapse collapse-horizontal'>
      <div className='position-sticky mx-3 my-2 p-3 rounded-md bg-white shadow-lg'>
        {/* <h6 className='sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted'>
          <span>Saved reports</span>
          <a className='link-secondary' href='#' aria-label='Add a new report'>
            <span data-feather='plus-circle'></span>
          </a>
        </h6> */}

        <ul className='nav flex-column'>
          {routes.map((route) => (
            <li key={`menu_entry_${route.path}`} className='nav-item'>
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={route.path}>
                <i className={`btn-round-md bg-gradient me-3 ${route.iconClass} ${route.bgClass}`} />
                {route.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default MainSidebar;
