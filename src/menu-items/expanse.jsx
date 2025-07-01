// assets
import { LoginOutlined, ProfileOutlined,MinusOutlined, WalletOutlined, FilePdfOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  MinusOutlined,WalletOutlined,FilePdfOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const expanse = {
  id: 'expanse',
  title: 'Payments & Others',
  type: 'group',
  children: [
    {
      id: '',
      title: 'Expanses',
      type: 'item',
      url: '/login',
      icon: icons.WalletOutlined,
      target: true
    },
    {
      id: '',
      title: 'Report',
      type: 'item',
      url: '/login',
      icon: icons.FilePdfOutlined,
      target: true
    },
    
  ]
};

export default expanse;
