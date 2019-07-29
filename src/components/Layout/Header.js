import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component {

    render() {
        return (
            <header className="main-header">
                <Link to="/" className="logo">
                    <span className="logo-lg"><b>Admin</b>LTE</span>
                </Link>
                <Link to='/categories' className="categ" >
                    <span className="categ-lg">Categories</span>
                </Link>

                <Link to="/products" className="categ">
                    <span className="categ-lg">Products</span>
                </Link>
                <nav className="navbar navbar-static-top">
                    <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </a>

                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown user user-menu">
                                <Link to="/profile" className="dropdown-toggle" data-toggle="dropdown">
                                    <span className="hidden-xs">Profile</span>
                                </Link>
                            </li>
                            <li className="dropdown user user-menu">
                                <Link to="/logout" className="dropdown-toggle" data-toggle="dropdown">
                                    <span className="hidden-xs">Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>

        );
    }
}