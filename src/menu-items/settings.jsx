// assets
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';

// icons
const icons = {
  LogoutOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const settings = {
  id: 'authentication',
  title: 'Settings & Others',
  type: 'group',
  children: [
    {
      id: '',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      target: false
    },
    {
      id: '',
      title: 'Logout ',
      type: 'item',
      url: '/login',
      icon: icons.LogoutOutlined,
      target: true
    }
  ]
};

export default settings;
