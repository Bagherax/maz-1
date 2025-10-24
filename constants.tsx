import React from 'react';
import { Feature } from './types';
import Icon from './components/Icon';

export const MAZ_LOGO_B64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAD8CAYAAADqg599AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGgAAA6OSURBVHhe7d3NbhvJFAbw/+v/EYwgA0E0SAKjSNYIcoBEE7xEEG8g5AhygDwQhJvEcYO0kKRJgmAQBEEQBMHgYVpWd+1x+7yP3Z0s68zQZp59enp6+vLp3d3dj4//393d/fnw7u7u/358+P/t7u7+5U/p/++3u7v7/fn+/w1/X/w1/F38Nfx9/Nfw9/FX8Pfx9/H38U/0/8k/pf8nf77/f43/+P+V/s/8+f7/Hf+X/l/5/5l/v//v+L/m/53/7/p/s//v+X/J/8v+f/N/7f8f+v/x/3f9//L/h/y/4f8v+f/D/t/y/5H/T/5/8v/P/5v+v/i/6/+X/D/8v+H/P/l/x/+v/B/x/+v/j/5/+P/r/4/+f/n/z/8v+H/H/l/wf9/+L/P/t/1v8//e/y/1P/H/6/8P+F/9f8f+L/Jf+X/B/+v+T/c/+f/b/sf5f+R/x/5H/H/nf8f+R/5H+n/3/+v+n/53+n/3/+f/p/9//J/0f+H/G/k/+L+7/z/4v7v/N/+f9P/1/2f/X/R/9v9n/x/6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of6H+h/of2H+h/of-...'

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
    icon: <Icon name="arrow-down-on-square" className="w-8 h-8 text-yellow-500" />,
    status: 'in_progress',
  },
  {
    id: 'real_time_messaging',
    icon: <Icon name="chat-bubble-left-right" className="w-8 h-8 text-teal-500" />,
    status: 'in_progress',
  },
  {
    id: 'performance_optimization',
    icon: <Icon name="bolt" className="w-8 h-8 text-amber-500" />,
    status: 'in_progress',
  },
  {
    id: 'offline_first',
    icon: <Icon name="arrow-down-tray" className="w-8 h-8 text-gray-500" />,
    status: 'in_progress',
  },
  {
    id: 'background_sync',
    icon: <Icon name="arrow-path-rounded-square" className="w-8 h-8 text-cyan-500" />,
    status: 'in_progress',
  },
  {
    id: 'conflict_resolution',
    icon: <Icon name="adjustments-horizontal" className="w-8 h-8 text-purple-500" />,
    status: 'in_progress',
  },
  {
    id: 'push_notifications',
    icon: <Icon name="bell" className="w-8 h-8 text-red-500" />,
    status: 'in_progress',
  },
  {
    id: 'local_notifications',
    icon: <Icon name="chat-bubble-bottom-center-text" className="w-8 h-8 text-blue-500" />,
    status: 'in_progress',
  },
  {
    id: 'unit_tests',
    icon: <Icon name="beaker" className="w-8 h-8 text-green-500" />,
    status: 'in_progress',
  },
  {
    id: 'integration_tests',
    icon: <Icon name="puzzle-piece" className="w-8 h-8 text-indigo-500" />,
    status: 'in_progress',
  },
  {
    id: 'e2e_tests',
    icon: <Icon name="cursor-arrow-rays" className="w-8 h-8 text-pink-500" />,
    status: 'in_progress',
  },
  {
    id: 'performance_testing',
    icon: <Icon name="chart-bar-square" className="w-8 h-8 text-lime-500" />,
    status: 'in_progress',
  },
  {
    id: 'security_auditing',
    icon: <Icon name="finger-print" className="w-8 h-8 text-rose-500" />,
    status: 'in_progress',
  },
  {
    id: 'app_store_deployment',
    icon: <Icon name="apple" className="w-8 h-8 text-slate-500" />,
    status: 'in_progress',
  },
  {
    id: 'play_store_deployment',
    icon: <Icon name="google" className="w-8 h-8 text-sky-500" />,
    status: 'in_progress',
  },
  {
    id: 'web_pwa',
    icon: <Icon name="globe-alt" className="w-8 h-8 text-fuchsia-500" />,
    status: 'in_progress',
  },
  {
    id: 'update_mechanism',
    icon: <Icon name="arrow-down-circle" className="w-8 h-8 text-teal-500" />,
    status: 'in_progress',
  },
  {
    id: 'analytics_monitoring',
    icon: <Icon name="chart-pie" className="w-8 h-8 text-orange-500" />,
    status: 'in_progress',
  },
];
