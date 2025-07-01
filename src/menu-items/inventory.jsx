// assets
import { LoginOutlined, ProfileOutlined,MinusOutlined,UnorderedListOutlined,ArrowLeftOutlined,ArrowRightOutlined,SwapOutlined, HomeOutlined, HistoryOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  MinusOutlined,
  UnorderedListOutlined,ArrowLeftOutlined,ArrowRightOutlined,SwapOutlined,HomeOutlined,HistoryOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const inventory = {
  id: 'inventory',
  title: 'Inventory',
  type: 'group',
  children: [
    {
      id: '',
      title: 'Items',
      type: 'item',
      url: '/login',
      icon: icons.UnorderedListOutlined,
      target: true
    },
    {
      id: 'irv',
      title: 'Inventory receiving voucher',
      type: 'item',
      url: '/register',
      icon: icons.ArrowRightOutlined,
      target: true
    },
    {
      id: 'idv',
      title: 'Inventory delivery voucher',
      type: 'item',
      url: '/register',
      icon: icons.ArrowLeftOutlined,
      target: true
    },
    {
      id: 'internaldv',
      title: 'Internal delivery voucher',
      type: 'item',
      url: '/register',
      icon: icons.SwapOutlined,
      target: true
    },
    {
      id: 'internaldv',
      title: 'Warehouse',
      type: 'item',
      url: '/register',
      icon: icons.HomeOutlined,
      target: true
    },
    {
      id: 'internaldv',
      title: 'Inventory history',
      type: 'item',
      url: '/register',
      icon: icons.HistoryOutlined,
      target: true
    },
  ]
};

export default inventory;
