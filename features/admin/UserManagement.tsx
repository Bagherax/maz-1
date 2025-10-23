import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLocalization } from '../../hooks/useLocalization';
import UserTierBadge from '../marketplace/components/users/UserTierBadge';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const { users, banUser, unbanUser } = useMarketplace();
  const { t } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // We need to use a state that forces re-renders when users are updated.
  // In a real app this would come from a server, here we can just use the context's state.
  const allUsers = users; 

  const handleBan = async (userId: string, name: string) => {
    const reason = prompt(t('admin.ban_prompt', { name }));
    if (reason !== null) { // Handle cancel
      await banUser(userId, reason || t('moderation.no_reason_provided'));
    }
  };
  
  const handleUnban = async (userId: string) => {
    await unbanUser(userId);
  }

  const filteredUsers = useMemo(() => allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ), [allUsers, searchTerm]);
  
  const handleSelectUser = (userId: string) => {
      setSelectedUserIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(userId)) {
              newSet.delete(userId);
          } else {
              newSet.add(userId);
          }
          return newSet;
      });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
      } else {
          setSelectedUserIds(new Set());
      }
  };
  
  const handleBulkAction = async (action: 'ban' | 'unban') => {
    if (action === 'ban') {
        const reason = prompt(t('admin.bulk_ban_prompt'));
        if (reason === null) return; // User cancelled prompt

        const promises = Array.from(selectedUserIds).map((userId: string) =>
            banUser(userId, reason || t('moderation.bulk_action_reason'))
        );
        await Promise.all(promises);
    } else { // 'unban'
        const promises = Array.from(selectedUserIds).map((userId: string) =>
            unbanUser(userId)
        );
        await Promise.all(promises);
    }

    setSelectedUserIds(new Set());
  }

  const isAllSelected = selectedUserIds.size > 0 && selectedUserIds.size === filteredUsers.length;

  return (
    <div className="space-y-4">
      <div className="sm:flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('admin.user_management')}</h3>
        {selectedUserIds.size > 0 && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2 sm:mt-0">
                <span className="text-sm">{selectedUserIds.size} selected</span>
                <select 
                    onChange={(e) => handleBulkAction(e.target.value as 'ban' | 'unban')}
                    value=""
                    className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
                >
                    <option value="" disabled>{t('admin.bulk_actions')}</option>
                    <option value="ban">{t('admin.ban_selected')}</option>
                    <option value="unban">{t('admin.unban_selected')}</option>
                </select>
            </div>
        )}
      </div>
      <input
        type="text"
        placeholder={t('admin.search_users')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="p-4">
                  <input type="checkbox" className="rounded" checked={isAllSelected} onChange={handleSelectAll} />
              </th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.user')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.ip_address')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.status')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.tier')}</th>
              <th scope="col" className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user: User) => (
              <tr key={user.id} className={selectedUserIds.has(user.id) ? 'bg-indigo-50 dark:bg-gray-900' : ''}>
                <td className="p-4">
                    <input type="checkbox" className="rounded" checked={selectedUserIds.has(user.id)} onChange={() => handleSelectUser(user.id)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt="" />
                    </div>
                    <div className="ms-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.ipAddress || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {t(`status.${user.status}`)}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <UserTierBadge tier={user.tier} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 rtl:space-x-reverse">
                  {user.status !== 'banned' ? (
                    <button onClick={() => handleBan(user.id, user.name)} className="text-red-600 hover:text-red-900 ripple rounded px-1">{t('moderation.ban_user')}</button>
                  ) : (
                    <button onClick={() => handleUnban(user.id)} className="text-green-600 hover:text-green-900 ripple rounded px-1">{t('moderation.unban_user')}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;