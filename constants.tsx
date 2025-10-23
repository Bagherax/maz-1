import React from 'react';
import { Feature } from './types';
import Icon from './components/Icon';

export const CORE_FEATURES: Feature[] = [
  {
    id: 'react_shell',
    icon: <Icon name="react" className="w-8 h-8 text-sky-500" />,
    status: 'complete',
  },
  {
    id: 'ui_ux_system',
    icon: <Icon name="palette" className="w-8 h-8 text-purple-500" />,
    status: 'complete',
  },
  {
    id: 'localization_system',
    icon: <Icon name="globe" className="w-8 h-8 text-green-500" />,
    status: 'complete',
  },
  {
    id: 'user_registration',
    icon: <Icon name="user-plus" className="w-8 h-8 text-indigo-500" />,
    status: 'complete',
  },
  {
    id: 'pwa_config',
    icon: <Icon name="pwa" className="w-8 h-8 text-blue-500" />,
    status: 'complete',
  },
  {
    id: 'p2p_node_server',
    icon: <Icon name="share-network" className="w-8 h-8 text-gray-500" />,
    status: 'in_progress',
  },
  {
    id: 'dht_discovery',
    icon: <Icon name="magnifying-glass-circle" className="w-8 h-8 text-teal-500" />,
    status: 'in_progress',

  },
  {
    id: 'bootstrap_nodes',
    icon: <Icon name="rocket-launch" className="w-8 h-8 text-orange-500" />,
    status: 'in_progress',
  },
    {
    id: 'data_sync',
    icon: <Icon name="arrow-path" className="w-8 h-8 text-cyan-500" />,
    status: 'in_progress',
  },
  {
    id: 'tls_security',
    icon: <Icon name="shield-check" className="w-8 h-8 text-red-500" />,
    status: 'in_progress',
  },
  {
    id: 'local_database',
    icon: <Icon name="database" className="w-8 h-8 text-amber-500" />,
    status: 'in_progress',
  },
  {
    id: 'media_management',
    icon: <Icon name="photo" className="w-8 h-8 text-pink-500" />,
    status: 'in_progress',
  },
  {
    id: 'metadata_sync',
    icon: <Icon name="cloud-arrow-up" className="w-8 h-8 text-sky-500" />,
    status: 'in_progress',
  },
  {
    id: 'cache_management',
    icon: <Icon name="server-stack" className="w-8 h-8 text-lime-500" />,
    status: 'in_progress',
  },
  {
    id: 'media_compression',
    icon: <Icon name="arrows-pointing-in" className="w-8 h-8 text-rose-500" />,
    status: 'in_progress',
  },
  {
    id: 'marketplace',
    icon: <Icon name="storefront" className="w-8 h-8 text-blue-500" />,
    status: 'in_progress',
  },
  {
    id: 'search_discovery',
    icon: <Icon name="magnifying-glass" className="w-8 h-8 text-fuchsia-500" />,
    status: 'in_progress',
  },
  {
    id: 'profile_management',
    icon: <Icon name="user-circle" className="w-8 h-8 text-rose-500" />,
    status: 'in_progress',
  },
  {
    id: 'wallet_transactions',
    icon: <Icon name="wallet" className="w-8 h-8 text-green-500" />,
    status: 'in_progress',
  },
  {
    id: 'bottom_nav_routing',
    icon: <Icon name="squares-plus" className="w-8 h-8 text-violet-500" />,
    status: 'in_progress',
  },
  {
    id: 'api_integration',
    icon: <Icon name="arrows-right-left" className="w-8 h-8 text-slate-500" />,
    status: 'in_progress',
  },
  {
    id: 'chunked_transfer',
    icon: <Icon name="queue-list" className="w-8 h-8 text-orange-500" />,
    status: 'in_progress',
  },
  {
    id: 'lazy_loading',
    icon: <Icon name="arrow-down-on-square" className="w-8 h-8 text-purple-500" />,
    status: 'in_progress',
  },
  {
    id: 'real_time_messaging',
    icon: <Icon name="chat-bubble-left-right" className="w-8 h-8 text-cyan-500" />,
    status: 'in_progress',
  },
  {
    id: 'performance_optimization',
    icon: <Icon name="bolt" className="w-8 h-8 text-yellow-500" />,
    status: 'in_progress',
  },
  {
    id: 'offline_first',
    icon: <Icon name="arrow-down-tray" className="w-8 h-8 text-gray-500" />,
    status: 'in_progress',
  },
  {
    id: 'background_sync',
    icon: <Icon name="arrow-path-rounded-square" className="w-8 h-8 text-indigo-500" />,
    status: 'in_progress',
  },
  {
    id: 'conflict_resolution',
    icon: <Icon name="adjustments-horizontal" className="w-8 h-8 text-rose-500" />,
    status: 'in_progress',
  },
  {
    id: 'push_notifications',
    icon: <Icon name="bell" className="w-8 h-8 text-amber-500" />,
    status: 'in_progress',
  },
  {
    id: 'local_notifications',
    icon: <Icon name="chat-bubble-bottom-center-text" className="w-8 h-8 text-teal-500" />,
    status: 'in_progress',
  },
  {
    id: 'unit_tests',
    icon: <Icon name="beaker" className="w-8 h-8 text-fuchsia-500" />,
    status: 'in_progress',
  },
  {
    id: 'integration_tests',
    icon: <Icon name="puzzle-piece" className="w-8 h-8 text-cyan-500" />,
    status: 'in_progress',
  },
  {
    id: 'e2e_tests',
    icon: <Icon name="cursor-arrow-rays" className="w-8 h-8 text-indigo-500" />,
    status: 'in_progress',
  },
  {
    id: 'performance_testing',
    icon: <Icon name="chart-bar-square" className="w-8 h-8 text-orange-500" />,
    status: 'in_progress',
  },
  {
    id: 'security_auditing',
    icon: <Icon name="finger-print" className="w-8 h-8 text-red-500" />,
    status: 'in_progress',
  },
  {
    id: 'app_store_deployment',
    icon: <Icon name="building-storefront" className="w-8 h-8 text-sky-500" />,
    status: 'in_progress',
  },
  {
    id: 'play_store_deployment',
    icon: <Icon name="building-storefront" className="w-8 h-8 text-lime-500" />,
    status: 'in_progress',
  },
  {
    id: 'web_pwa',
    icon: <Icon name="globe-alt" className="w-8 h-8 text-blue-500" />,
    status: 'in_progress',
  },
  {
    id: 'update_mechanism',
    icon: <Icon name="arrow-down-circle" className="w-8 h-8 text-teal-500" />,
    status: 'in_progress',
  },
  {
    id: 'analytics_monitoring',
    icon: <Icon name="chart-pie" className="w-8 h-8 text-purple-500" />,
    status: 'in_progress',
  }
];