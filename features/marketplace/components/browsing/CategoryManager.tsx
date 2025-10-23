import React, { useState } from 'react';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';
import { useLocalization } from '../../../../hooks/useLocalization';

const categoryIcons: { [key: string]: React.ComponentProps<typeof Icon>['name'] } = {
  'Electronics': 'bolt',
  'Fashion': 'user-circle',
  'Home & Garden': 'storefront',
  'Vehicles': 'truck',
  'Real Estate': 'building-storefront',
  'Services': 'wrench',
};

interface CategoryManagerProps {
  selectedCategory?: string;
  onSelectCategory: (categoryName: string) => void;
  isAdmin: boolean;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ 
    selectedCategory,
    onSelectCategory,
    isAdmin 
}) => {
  const { categories, addCategory, removeCategory } = useMarketplace();
  const { t } = useLocalization();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleAddCategory = () => {
      const name = prompt(t('controls.add_category_prompt'));
      if (name && name.trim()) {
          addCategory({ id: name.toLowerCase().replace(/\s+/g, '-'), name: name.trim() });
      }
  };
  
  const handleRemoveCategory = (e: React.MouseEvent, categoryId: string) => {
      e.stopPropagation(); // Prevent category selection when deleting
      if (window.confirm(t('controls.remove_category_confirm'))) {
          removeCategory(categoryId);
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('controls.categories')}</h3>
        {isAdmin && (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
             <button onClick={handleAddCategory} title={t('controls.add_category')} className="text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 ripple rounded-full p-1.5">
                <Icon name="plus" className="w-5 h-5" />
             </button>
             <button onClick={() => setIsEditMode(prev => !prev)} title={isEditMode ? t('admin.done') : t('controls.manage_categories')} className="text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 ripple rounded-full p-1.5">
                <Icon name={isEditMode ? 'check-badge' : 'pencil'} className="w-5 h-5" />
             </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => !isEditMode && onSelectCategory(category.name)}
            className={`relative flex flex-col items-center p-3 rounded-xl transition-colors group ${isEditMode ? 'cursor-default' : 'cursor-pointer'} ${selectedCategory === category.name ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${selectedCategory === category.name ? 'bg-indigo-500' : 'bg-green-100 dark:bg-green-900 group-hover:scale-110'}`}>
              <Icon name={categoryIcons[category.name] || 'squares-plus'} className={`w-6 h-6 ${selectedCategory === category.name ? 'text-white' : 'text-green-600 dark:text-green-400'}`} />
            </div>
            <span className="text-xs mt-2 text-center text-gray-600 dark:text-gray-300">
              {category.name}
            </span>
            {isEditMode && (
                <button 
                    onClick={(e) => handleRemoveCategory(e, category.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 z-10 ripple"
                    aria-label={`Remove ${category.name} category`}
                >
                    <Icon name="close" className="w-3 h-3" />
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;