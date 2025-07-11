import React, { useEffect } from 'react';
import logo from '../assets/updated1.png';
import { Link } from 'react-router-dom';
import useOnlineStatus from '../utils/useOnlineStatus';
import { useAuth0 } from '@auth0/auth0-react';  // Import Auth0 hook
import { useSelector } from 'react-redux';


import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  } from '@headlessui/react';
  import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
  import { useState } from 'react';
  
  const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'Cart', href: '/cart', current: false },
    { name: 'Favourites', href: '/favourites', current: false },
    { name: 'About', href: '/about', current: false },
    { name: 'Orders', href: '/orders', current: false },    
    { name: 'Contacts', href: '/contact', current: false },
    { name: 'Admin', href: '/admin/uploads', current: false },
    
    { name: 'Status', href: '/', current: true}
  ];
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [profilePicture, setProfilePicture] = useState("");
    // Get online status
    const isOnline = useOnlineStatus();
    const cartItems = useSelector((store) => store.cart.items)
    const handleAuth = () => {
        if (isAuthenticated) {
            logout({ returnTo: window.location.origin });  // Log out if authenticated
        } else {
            loginWithRedirect();  // Log in if not authenticated
            console.log(user)
        }
    };
    useEffect (() => {
      if (isAuthenticated && user) {
        console.log('Logged-in user:', user);  // Logs full user info
        // Optional: console.log(user.name, user.email)
        setProfilePicture(user.picture)
      }
    }, [isAuthenticated, user]);
    return (
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
  
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center space-x-2">
                <img
                  alt="Logo"
                  src={logo}
                  className="h-8 w-auto"
                />
                <span className="text-white text-lg font-semibold hidden sm:block">Dashboard</span>
              </div>
  
              <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
  {navigation.map((item) => (
    <Link
      key={item.name}
      to={item.href}
      className={classNames(
        item.current
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
        'rounded-md px-3 py-2 text-sm font-medium'
      )}
    >
      {item.name === 'Cart' ? (
        <>
          Cart
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs w-5 h-5">
            {cartItems.length}
          </span>
        </>
      ) : item.name === 'Status' ? (
        <>
          Status:{" "}
          <span className={isOnline ? "text-green-400" : "text-red-400"}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </>
      ) : (
        item.name
      )}
    </Link>
  ))}
</div>


              </div>
            </div>
  
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>
  
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                        
                        onClick={handleAuth}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                        {isAuthenticated ? "SignOut " : "SignIn"}

                    </Link>
                    </MenuItem>

                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
  
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    );
  }
  