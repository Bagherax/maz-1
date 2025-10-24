import React, { useState, ChangeEvent, FormEvent, ReactNode, useEffect, useMemo } from 'react';
import { Ad, Category, AuctionDetails } from '../../../../types';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useLocalStorage } from '../../../../hooks/usePersistentState';
import AuctionSettingsForm from '../auction/AuctionSettingsForm';
import AdvancedMediaUploader, { MediaItem } from './AdvancedMediaUploader';
import { useAuth } from '../../../../hooks/useAuth';
import Icon from '../../../../components/Icon';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { useNotification } from '../../../../hooks/useNotification';
import { generateAdDetails, generateAdImages, AISuggestions as AIGeneratedData } from '../../../../utils/aiHelper';


const Section: React.FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
    <div className="p-6 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

interface AdCreationWizardProps {
  onAdCreated: (adId: string) => void;
  onCancel: () => void;
}

type AdFormData = Omit<Ad, 'id' | 'seller' | 'rating' | 'reviews' | 'comments' | 'reports' | 'status' | 'bannedReason' | 'stats'>;

const initialFormData: Partial<AdFormData> = {
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: '',
    condition: 'used',
    availability: { quantity: 1, inStock: true },
    images: [],
    videos: [],
    delivery: { available: false, cost: 0, time: '', type: 'pickup', instructions: '' },
    location: { city: 'Metropolis', country: 'USA' },
    isAuction: false,
    specifications: {
        brand: '',
        model: '',
        warranty: false,
    },
};

// Define a new local type with stable IDs for images
type AISuggestionsWithIds = Omit<AIGeneratedData, 'images'> & {
  images: { id: string; url: string }[];
};

const AdCreationWizard: React.FC<AdCreationWizardProps> = ({ onAdCreated, onCancel }) => {
  const [formData, setFormData, clearDraft] = useLocalStorage<Partial<AdFormData>>('adCreationDraft', initialFormData);
  
  const { createAd, categories, getAdsBySellerId, userTiers } = useMarketplace();
  const { t } = useLocalization();
  const { user } = useAuth();
  const { addNotification } = useNotification();

  // State for AI feature
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionsWithIds | null>(null);
  const [selectedAIImages, setSelectedAIImages] = useState<string[]>([]);


  // Check ad limit
  const userAds = user ? getAdsBySellerId(user.id) : [];
  const currentUserTier = userTiers.find(t => t.level === user?.tier);
  const adLimit = currentUserTier?.benefits.maxAds || 0;
  const hasReachedLimit = user ? userAds.length >= adLimit : false;
  
  const handleGenerateDetails = async () => {
    if (!formData.title || formData.title.trim().length < 5) {
        addNotification("Please enter a descriptive title first (at least 5 characters).", 'warning');
        return;
    }
    setIsLoadingAI(true);
    setAiSuggestions(null);
    setSelectedAIImages([]);
    try {
        const [details, images] = await Promise.all([
            generateAdDetails(formData.title, categories),
            generateAdImages(formData.title)
        ]);
        setAiSuggestions({ 
            ...details, 
            images: images.map((url, i) => ({ id: `ai-img-${Date.now()}-${i}`, url })) 
        });
    } catch (error) {
        console.error("AI Generation failed:", error);
        addNotification(error instanceof Error ? error.message : "Failed to generate AI suggestions.", 'error');
    } finally {
        setIsLoadingAI(false);
    }
  };

  const handleAIImageSelection = (imageUrl: string) => {
    setSelectedAIImages(prev => 
        prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl) 
        : [...prev, imageUrl]
    );
  };
  
  const applyAISuggestions = () => {
    if (!aiSuggestions) return;
    
    const suggestedCategory = categories.find(c => c.name.toLowerCase() === aiSuggestions.category?.toLowerCase());

    setFormData(prev => ({
        ...prev,
        description: aiSuggestions.description || prev.description,
        category: suggestedCategory ? suggestedCategory.name : prev.category,
        condition: aiSuggestions.condition || prev.condition,
        specifications: {
            ...prev!.specifications!,
            brand: aiSuggestions.specifications?.brand || prev!.specifications?.brand,
            model: aiSuggestions.specifications?.model || prev!.specifications?.model,
        },
        images: Array.from(new Set([...(prev!.images || []), ...selectedAIImages]))
    }));

    setAiSuggestions(null);
    setSelectedAIImages([]);
  };


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const checked = e.target.checked;
    
    if (name.startsWith('specifications.')) {
        const specKey = name.split('.')[1] as keyof Ad['specifications'];
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev!.specifications!,
                [specKey]: isCheckbox ? checked : value,
            }
        }));
    } else if (name === 'quantity') {
      setFormData(prev => ({ ...prev, availability: { ...prev!.availability!, quantity: Number(value), inStock: Number(value) > 0 } }));
    } else if (name === 'isAuction') {
        setFormData(prev => ({...prev, isAuction: checked, price: checked ? 0 : prev!.price, auctionDetails: checked ? { startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), startingBid: 50, currentBid: 50, bids:[] } : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    }
  };

   const handleDeliveryAvailableToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
        ...prev,
        delivery: {
            cost: checked ? prev?.delivery?.cost || 0 : 0,
            time: checked ? prev?.delivery?.time || '' : '',
            instructions: checked ? prev?.delivery?.instructions || '' : '',
            type: checked ? prev?.delivery?.type || 'pickup' : 'pickup',
            available: checked,
        }
    }));
  };

  const handleDeliveryTypeChange = (option: 'home' | 'pickup') => {
      setFormData(prev => {
          const delivery = prev!.delivery!;
          const offersHome = delivery.type === 'delivery' || delivery.type === 'both';
          const offersPickup = delivery.type === 'pickup' || delivery.type === 'both';

          let newOffersHome = offersHome;
          let newOffersPickup = offersPickup;

          if (option === 'home') newOffersHome = !newOffersHome;
          if (option === 'pickup') newOffersPickup = !newOffersPickup;

          let newType: Ad['delivery']['type'] = 'pickup';
          if (newOffersHome && newOffersPickup) newType = 'both';
          else if (newOffersHome) newType = 'delivery';
          else if (newOffersPickup) newType = 'pickup';
          
          return { ...prev, delivery: { ...delivery, type: newType } };
      });
  };

  const handleDeliveryInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, delivery: { ...prev!.delivery!, [name]: name === 'cost' ? Number(value) : value } }));
  };

    const handleAuctionDetailsChange = (details: Partial<AuctionDetails>) => {
        setFormData(prev => ({
            ...prev,
            auctionDetails: {
                ...prev!.auctionDetails!,
                ...details
            }
        }))
    }
    
    const mediaItems = useMemo(() => [
        ...(formData.images || []).map(url => ({ type: 'image' as const, url })),
        ...(formData.videos || []).map(url => ({ type: 'video' as const, url }))
    ], [formData.images, formData.videos]);

    const handleMediaItemsChange = (newMediaItems: MediaItem[]) => {
        const images = newMediaItems.filter(item => item.type === 'image').map(item => item.url);
        const videos = newMediaItems.filter(item => item.type === 'video').map(item => item.url);
        setFormData(prev => ({ ...prev, images, videos }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const finalData = { ...formData };
        if (finalData.isAuction && finalData.auctionDetails) {
            finalData.price = finalData.auctionDetails.startingBid;
            finalData.auctionDetails.currentBid = finalData.auctionDetails.startingBid;
        }
      const newAdId = await createAd(finalData as AdFormData);
      clearDraft(); // Clear draft on successful submission
      setFormData(initialFormData); 
      onAdCreated(newAdId);
    } catch (error) {
      console.error("Failed to create ad:", error);
      alert(t('ad.create.error'));
    }
  };

  const handleCancel = () => {
    if (window.confirm(t('ad.create.cancel_confirm'))) {
        clearDraft();
        setFormData(initialFormData);
        onCancel();
    }
  };
  
  if (hasReachedLimit && user && !user.isAdmin) {
      return (
          <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">{t('ad.create.limit_reached_title')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('ad.create.limit_reached_message', { adCount: userAds.length, limit: adLimit, tier: user.tier })}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('ad.create.limit_reached_suggestion')}
              </p>
              <button onClick={onCancel} className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700">
                  {t('ad.create.back_to_marketplace')}
              </button>
          </div>
      )
  }

  const offersHome = formData.delivery?.type === 'delivery' || formData.delivery?.type === 'both';
  const offersPickup = formData.delivery?.type === 'pickup' || formData.delivery?.type === 'both';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ad Details Section */}
        <Section title={t('ad.create.section.details')}>
            <div className="relative">
                <label htmlFor="title" className="block text-sm font-medium">{t('ad.create.title_label')}</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm pr-32" required />
                <button 
                    type="button" 
                    onClick={handleGenerateDetails} 
                    disabled={!formData.title || isLoadingAI}
                    className="absolute right-1 top-7 rtl:right-auto rtl:left-1 flex items-center gap-1 px-2 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                >
                    <Icon name="sparkles" className="w-4 h-4" />
                    <span>Generate with AI</span>
                </button>
            </div>

            {isLoadingAI && (
                <div className="text-center p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col items-center justify-center">
                    <LoadingSpinner />
                    <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Generating ad details and images...</p>
                </div>
            )}
            
            {aiSuggestions && !isLoadingAI && (
                <div className="p-4 border-2 border-dashed border-indigo-400 rounded-lg bg-indigo-50 dark:bg-gray-900 space-y-4 animate-fade-in-fast">
                    <h4 className="font-bold text-lg text-indigo-800 dark:text-indigo-300">AI Suggestions</h4>
                    <p className="text-sm"><strong>Description:</strong> {aiSuggestions.description}</p>
                    <p className="text-sm"><strong>Category:</strong> {aiSuggestions.category}</p>
                    <p className="text-sm"><strong>Condition:</strong> {aiSuggestions.condition}</p>
                    <p className="text-sm"><strong>Brand:</strong> {aiSuggestions.specifications.brand}</p>
                    <p className="text-sm"><strong>Model:</strong> {aiSuggestions.specifications.model}</p>
                    
                    <h5 className="font-semibold pt-2 border-t dark:border-gray-700">Select images to add:</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {aiSuggestions.images.map((image) => (
                            <div key={image.id} className="relative cursor-pointer aspect-square" onClick={() => handleAIImageSelection(image.url)}>
                                <img src={image.url} className="w-full h-full object-cover rounded-md" alt="AI generated" />
                                {selectedAIImages.includes(image.url) && (
                                    <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                                        <Icon name="check-badge" className="w-8 h-8 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setAiSuggestions(null)} className="px-3 py-1 border rounded-md text-sm">Discard</button>
                        <button type="button" onClick={applyAISuggestions} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Apply Suggestions</button>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="description" className="block text-sm font-medium">{t('ad.create.description_label')}</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!formData.isAuction && (
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium">{t('ad.create.price_label')}</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                    </div>
                )}
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium">{t('ad.create.quantity_label')}</label>
                    <input type="number" name="quantity" id="quantity" value={formData.availability?.quantity} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium">{t('ad.create.category_label')}</label>
                    <select name="category" id="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required>
                        <option value="">{t('ad.create.select_category')}</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">{t('ad.create.condition_label')}</label>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                        {(['new', 'used', 'refurbished'] as const).map(cond => (
                            <label key={cond} className="flex items-center">
                                <input type="radio" name="condition" value={cond} checked={formData.condition === cond} onChange={handleInputChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                                <span className="ms-2 capitalize">{t(`ad.create.condition_${cond}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
             <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300">{t('ad.specifications')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="specifications.brand" className="block text-sm font-medium">{t('ad.details.brand')}</label>
                        <input type="text" name="specifications.brand" id="specifications.brand" value={formData.specifications?.brand || ''} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="specifications.model" className="block text-sm font-medium">{t('ad.details.model')}</label>
                        <input type="text" name="specifications.model" id="specifications.model" value={formData.specifications?.model || ''} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                    </div>
                    <div className="sm:col-span-2">
                            <label className="flex items-center">
                            <input type="checkbox" name="specifications.warranty" checked={formData.specifications?.warranty || false} onChange={handleInputChange} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"/>
                            <span className="ms-2">Has Warranty</span>
                            </label>
                    </div>
                </div>
            </div>
        </Section>
        
        {/* Media Section */}
        <Section title={t('ad.create.section.media')}>
             <p className="text-sm text-gray-500 -mt-4">{t('ad.create.media_prompt')}</p>
             <AdvancedMediaUploader 
                mediaItems={mediaItems}
                onMediaChange={handleMediaItemsChange}
                maxFiles={24}
            />
        </Section>

        {/* Delivery & Auction Section */}
        <Section title={t('ad.create.section.delivery_auction')}>
            <div className="space-y-6">
                 <div>
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" name="deliveryAvailable" checked={formData.delivery?.available} onChange={handleDeliveryAvailableToggle} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                        <span className="ms-3 font-medium">{t('delivery.create_offer_delivery_services')}</span>
                    </label>
                </div>

                {formData.delivery?.available && (
                    <div className="space-y-4 ps-7 border-s-2 border-gray-200 dark:border-gray-700 animate-fade-in-fast">
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="checkbox" checked={offersHome} onChange={() => handleDeliveryTypeChange('home')} className="h-4 w-4 rounded text-indigo-600" />
                                <span className="ms-2">{t('delivery.create_home_delivery_label')}</span>
                            </label>
                            {offersHome && (
                                <div className="ps-6 space-y-2">
                                    <input type="number" name="cost" placeholder={t('delivery.create_cost_placeholder')} value={formData.delivery?.cost} onChange={handleDeliveryInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                                    <input type="text" name="time" placeholder={t('delivery.create_days_placeholder')} value={formData.delivery?.time} onChange={handleDeliveryInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="checkbox" checked={offersPickup} onChange={() => handleDeliveryTypeChange('pickup')} className="h-4 w-4 rounded text-indigo-600" />
                                <span className="ms-2">{t('delivery.create_pickup_label')}</span>
                            </label>
                            {offersPickup && (
                                <div className="ps-6">
                                <textarea name="instructions" placeholder={t('delivery.create_instructions_placeholder')} value={formData.delivery?.instructions} onChange={handleDeliveryInputChange} rows={3} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="border-t dark:border-gray-700 pt-6 space-y-4">
                     <label className="flex items-center">
                        <input type="checkbox" name="isAuction" checked={formData.isAuction} onChange={handleInputChange} className="h-4 w-4 rounded text-indigo-600" />
                        <span className="ms-2 font-medium">{t('ad.create.list_as_auction')}</span>
                    </label>
                    {formData.isAuction && formData.auctionDetails && (
                        <AuctionSettingsForm details={formData.auctionDetails} onChange={handleAuctionDetailsChange} />
                    )}
                </div>
            </div>
        </Section>
      
      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
          <button type="button" onClick={handleCancel} className="px-6 py-2 border rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">{t('ad.create.cancel')}</button>
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700">{t('ad.create.post_ad')}</button>
      </div>
    </form>
  );
};

export default AdCreationWizard;