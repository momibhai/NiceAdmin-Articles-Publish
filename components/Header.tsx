import { useRouter } from 'next/navigation';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {

  const router = useRouter();

    function Signout(e:any){
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user_role');
      // Show the success toast message immediately
      toast.success('Successfully Logged Out', {
        position: "top-right",
        autoClose: 2000, // Toast stays visible for 2 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Delay the redirect by 2 seconds, giving time for the toast to display
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    }
  return (
    <div>
      {/* <!-- ======= Header ======= --> */}
      <header id="header" className="header fixed-top d-flex align-items-center">

        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="" />
            <span className="d-none d-lg-block">NiceAdmin</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn"></i>
        </div>

        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i className="bi bi-search"></i></button>
          </form>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">

            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>

            <li className="nav-item dropdown pe-3">

              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Kevin Anderson</h6>
                  <span>Web Designer</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-person"></i>
                    <span>My Profile</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item d-flex align-items-center" >
                    <i className="bi bi-box-arrow-right"></i>
                    <span><button onClick={Signout}>Sign Out</button></span>
                  </a>
                </li>

              </ul>
            </li>

          </ul>
        </nav>

      </header>
    </div>
  )
}

export default Header
