// assets
import { LoginOutlined, ProfileOutlined,FormOutlined,ShrinkOutlined,ClockCircleOutlined, CameraOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,FormOutlined,ShrinkOutlined,ClockCircleOutlined,CameraOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  title: 'Mains',
  type: 'group',
  children: [
    {
      id: '',
      title: 'Projects',
      type: 'item',
      url: '/projects',
      icon: icons.FormOutlined,
      target: false
    },
    {
      id: '',
      title: 'Requisition ',
      type: 'item',
      url: '/color',
      icon: icons.ShrinkOutlined,
      target: true
    },
    {
      id: 'register1',
      title: 'To Do',
      type: 'item',
      url: '/shadow',
      icon: icons.ClockCircleOutlined,
      target: true
    },
    {
      id: 'register1',
      title: 'Attandance',
      type: 'item',
      url: '/register',
      icon: icons.CameraOutlined,
      target: true
    },
  ]
};

export default pages;
