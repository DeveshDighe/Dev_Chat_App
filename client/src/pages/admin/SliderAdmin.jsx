import React from 'react'
import { Stack, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard as DashboardIcon, ManageAccounts as ManageAccountsIcon, Group as GroupsIcon, Message as MessageIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { primary } from '../../constants/color';

export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const SliderAdmin = ({ w = "100%" }) => {
  const location = useLocation();
  // const dispatch = useDispatch();

  const logoutHandler = () => {
    // dispatch(adminLogout());
  };

  return (
    <div className=' flex flex-col '>
      <p className=' py-4 text-center'> Chat App</p>
      <div>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}

          >
            <div className={` ${location.pathname === tab.path && ` bg-[#9f90f3] text-white`} flex hover:bg-[#d6cfff] py-2  gap-x-2 px-2`} >
              {tab.icon}
              <p>{tab.name}</p>
            </div>
          </Link>
        ))}

        <Link onClick={logoutHandler}>
          <div className=' flex py-2 gap-x-2 hover:bg-[#d6cfff] px-2'>
            <ExitToAppIcon />

            <p>Logout</p>
          </div>
        </Link>
      </div>
    </div>
  );
};



export default SliderAdmin;