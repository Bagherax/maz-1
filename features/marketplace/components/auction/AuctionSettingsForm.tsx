import React from 'react';
import { AuctionDetails } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';

interface AuctionSettingsFormProps {
  details: AuctionDetails;
  onChange: (updatedDetails: Partial<AuctionDetails>) => void;
}

const AuctionSettingsForm: React.FC<AuctionSettingsFormProps> = ({ details, onChange }) => {
  const { t } = useLocalization();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.name]: new Date(e.target.value).toISOString() });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [e.target.name]: e.target.value === '' ? undefined : Number(e.target.value) });
  };
  
  // Helper to format date for datetime-local input
  const formatDateForInput = (date: string | Date) => {
    return new Date(date).toISOString().slice(0, 16);
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
      <h4 className="text-lg font-medium">{t('auction.create.settings_title')}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium">{t('auction.create.start_time')}</label>
          <input type="datetime-local" name="startTime" id="startTime" value={formatDateForInput(details.startTime)} onChange={handleDateChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium">{t('auction.create.end_time')}</label>
          <input type="datetime-local" name="endTime" id="endTime" value={formatDateForInput(details.endTime)} onChange={handleDateChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="startingBid" className="block text-sm font-medium">{t('auction.create.starting_bid')}</label>
          <input type="number" name="startingBid" id="startingBid" value={details.startingBid || ''} onChange={handleNumberChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
        </div>
        <div>
          <label htmlFor="reservePrice" className="block text-sm font-medium">{t('auction.create.reserve_price')}</label>
          <input type="number" name="reservePrice" id="reservePrice" value={details.reservePrice || ''} onChange={handleNumberChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
        </div>
        <div>
          <label htmlFor="buyNowPrice" className="block text-sm font-medium">{t('auction.create.buy_now_price')}</label>
          <input type="number" name="buyNowPrice" id="buyNowPrice" value={details.buyNowPrice || ''} onChange={handleNumberChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
        </div>
        <div>
          <label htmlFor="bidIncrement" className="block text-sm font-medium">{t('auction.create.bid_increment')}</label>
          <input type="number" name="bidIncrement" id="bidIncrement" value={details.bidIncrement || ''} onChange={handleNumberChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" placeholder="e.g. 1, 5, 10"/>
        </div>
      </div>
    </div>
  );
};

export default AuctionSettingsForm;