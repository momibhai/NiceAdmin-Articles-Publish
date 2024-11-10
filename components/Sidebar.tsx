import React, { useState } from 'react'
import Link from 'next/link'

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(''); // To track the active list item

  const handleItemClick = (itemName:any) => {
    setActiveItem(itemName); // Update the active item
  };

  return (
    <div>
      
    <aside id="sidebar" className="sidebar">

      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <Link className="nav-link " href="/dashboard">
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
      <Link
        className="nav-link collapsed"
        data-bs-target="#components-nav"
        data-bs-toggle="collapse"
        href="#"
      >
        <i className="bi bi bi-person"></i><span>Users</span>
        <i className="bi bi-chevron-down ms-auto"></i>
      </Link>
      <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
        <li>
          <Link 
            href="create-user"
            className={activeItem === 'create-user' ? 'active nav-link' : 'nav-link'}
            onClick={() => handleItemClick('create-user')}
          >
            <i className="bi bi-circle"></i><span>Create User</span>
          </Link>
        </li>
        <li>
          <Link 
            href="user-permission"
            className={activeItem === 'user-permission' ? 'active nav-link' : 'nav-link'}
            onClick={() => handleItemClick('user-permission')}
          >
            <i className="bi bi-circle"></i><span>User Permissions</span>
          </Link>
        </li>
        <li>
          <Link 
            href="users"
            className={activeItem === 'users' ? 'active nav-link' : 'nav-link'}
            onClick={() => handleItemClick('users')}
          >
            <i className="bi bi-circle"></i><span>Users Records</span>
          </Link>
        </li>
      </ul>
    </li>

        <li className="nav-item">
          <Link className="nav-link collapsed" data-bs-target="#forms-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-journal-text"></i><span>Articles</span><i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul id="forms-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <Link href="create-articles"
              className={activeItem === 'create-articles' ? 'active nav-link' : 'nav-link'}
              onClick={() =>handleItemClick('create-articles')}
              >
                <i className="bi bi-circle"></i><span>Create Articles</span>
              </Link>


            </li>
            <li>
              <Link href="view-articles"
              className={activeItem === 'view-articles' ? 'active nav-link' : 'nav-link'}
              onClick={() =>handleItemClick('view-articles')}
              >
                <i className="bi bi-circle"></i><span>View Articles</span>
              </Link>
            </li>
          </ul>
        </li>

      </ul>

    </aside>
    </div>
  )
}

export default Sidebar
