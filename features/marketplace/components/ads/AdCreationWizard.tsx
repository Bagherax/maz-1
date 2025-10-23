import React, { useState, ChangeEvent, FormEvent, useRef, useEffect, ReactNode } from 'react';
import { Ad, Category, AuctionDetails } from '../../../../types';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';
import { useLocalStorage } from '../../../../hooks/usePersistentState';
import AuctionSettingsForm from '../auction/AuctionSettingsForm';

// --- HELPER COMPONENTS ---

const Modal: React.FC<{ title: string; onClose: () => void; children: ReactNode }> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b dark:border-gray-700 shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Icon name="close" className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <main className="flex-grow p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

const ImageUploadModalContent: React.FC<{ onSave: (images: string[]) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const { t } = useLocalization();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    useEffect(() => {
        const fileReaders: FileReader[] = [];
        let isCancel = false;
        if (files.length) {
            const newPreviews: string[] = [];
            files.forEach(file => {
                const fileReader = new FileReader();
                fileReaders.push(fileReader);
                fileReader.onload = (e) => {
                    const { result } = e.target as FileReader;
                    if (result) {
                        newPreviews.push(result as string);
                    }
                    if (newPreviews.length === files.length && !isCancel) {
                        setPreviews(newPreviews);
                    }
                }
                fileReader.readAsDataURL(file);
            });
        }
        return () => {
            isCancel = true;
            fileReaders.forEach(fileReader => {
                if (fileReader.readyState === 1) {
                    fileReader.abort();
                }
            });
        }
    }, [files]);
    
    const handleSave = () => {
        // In a real app, compression would happen here
        onSave(previews);
        onClose();
    }

    return (
        <div className="space-y-4">
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <Icon name="photo" className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="image-upload-modal" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                            <span>{t('ad.create.upload_photos')}</span>
                            <input id="image-upload-modal" name="image-upload-modal" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" multiple />
                        </label>
                    </div>
                </div>
            </div>
             {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {previews.map((src, index) => <img key={index} src={src} className="w-full h-24 object-cover rounded" alt="preview"/>)}
                </div>
            )}
            <div className="flex justify-end pt-4">
                 <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-md">{t('ad.create.add_photos')}</button>
            </div>
        </div>
    );
};

const VideoUploadModalContent: React.FC<{ onSave: (videoUrl: string) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [url, setUrl] = useState('');
    const { t } = useLocalization();

    const handleSave = () => {
        if (url.trim()) {
            onSave(url);
            onClose();
        }
    };
    
    return (
        <div className="space-y-4">
            <label htmlFor="video-url" className="block text-sm font-medium">{t('ad.create.video_url_label')}</label>
            <input 
                id="video-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('ad.create.video_url_placeholder')}
                className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"
            />
             <div className="flex justify-end pt-4">
                 <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-md">{t('ad.create.add_video')}</button>
            </div>
        </div>
    )
};

const DocumentUploadModalContent: React.FC<{ onSave: (doc: Ad['documents'][0]) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const { t } = useLocalization();

    const handleSave = () => {
        if (name.trim() && url.trim()) {
            onSave({ name, url, previewUrl: '' }); // Preview URL would be generated on the backend
            onClose();
        }
    };
    
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="doc-name" className="block text-sm font-medium">{t('ad.create.doc_name_label')}</label>
                <input id="doc-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('ad.create.doc_name_placeholder')} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
            </div>
            <div>
                <label htmlFor="doc-url" className="block text-sm font-medium">{t('ad.create.doc_url_label')}</label>
                <input id="doc-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('ad.create.doc_url_placeholder')} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
            </div>
             <div className="flex justify-end pt-4">
                 <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-md">{t('ad.create.add_document')}</button>
            </div>
        </div>
    )
};

// --- WIZARD COMPONENT ---

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
    documents: [],
    delivery: { available: false, cost: 0, time: '', type: 'pickup', instructions: '' },
    location: { city: 'Metropolis', country: 'USA' },
    isAuction: false,
};


const AdCreationWizard: React.FC<AdCreationWizardProps> = ({ onAdCreated, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useLocalStorage<Partial<AdFormData>>('adCreationDraft', initialFormData);
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const { createAd, categories } = useMarketplace();
  const { t } = useLocalization();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const checked = e.target.checked;

    if (name === 'quantity') {
      setFormData(prev => ({ ...prev, availability: { ...prev!.availability, quantity: Number(value), inStock: Number(value) > 0 } }));
    } else if (name === 'isAuction') {
        setFormData(prev => ({...prev, isAuction: checked, price: checked ? 0 : prev!.price, auctionDetails: checked ? { startTime: new Date().toISOString(), endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), startingBid: 50, currentBid: 50, bids:[] } : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    }
  };

  const handleDeliveryInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, delivery: { ...prev!.delivery!, [name]: name === 'cost' ? Number(value) : value } }));
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
          
          return { ...prev, delivery: { ...delivery, type: newType, available: newOffersHome || newOffersPickup } };
      });
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

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const finalData = { ...formData };
        // If it's an auction, set the main price to the starting bid for consistency
        if (finalData.isAuction && finalData.auctionDetails) {
            finalData.price = finalData.auctionDetails.startingBid;
            finalData.auctionDetails.currentBid = finalData.auctionDetails.startingBid;
        }
      const newAdId = await createAd(finalData as AdFormData);
      setFormData(initialFormData); // Clear draft
      onAdCreated(newAdId);
    } catch (error) {
      console.error("Failed to create ad:", error);
      alert(t('ad.create.error'));
    }
  };

  const handleCancel = () => {
    if (window.confirm(t('ad.create.cancel_confirm'))) {
        setFormData(initialFormData); // Clear draft
        onCancel();
    }
  };
  
  const handleRemoveMedia = (type: 'images' | 'videos' | 'documents', index: number) => {
      setFormData(prev => {
          const newMedia = [...(prev![type] || [])];
          newMedia.splice(index, 1);
          return { ...prev, [type]: newMedia };
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Details
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">{t('ad.create.title_label')}</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">{t('ad.create.description_label')}</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium">{t('ad.create.category_label')}</label>
                    <select name="category" id="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required>
                        <option value="">{t('ad.create.select_category')}</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">{t('ad.create.condition_label')}</label>
                    <div className="flex space-x-4 rtl:space-x-reverse mt-2">
                        {(['new', 'used', 'refurbished'] as const).map(cond => (
                            <label key={cond} className="flex items-center">
                                <input type="radio" name="condition" value={cond} checked={formData.condition === cond} onChange={handleInputChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                                <span className="ms-2 capitalize">{t(`ad.create.condition_${cond}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        );
      case 2: // Media
        const mediaButtonClass = "w-full flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-indigo-500 hover:text-indigo-500 transition-colors";
        return (
             <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('ad.create.media_title')}</h3>
                    <p className="text-sm text-gray-500">{t('ad.create.media_prompt')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button type="button" onClick={() => setIsImageModalOpen(true)} className={mediaButtonClass}>
                        <Icon name="photo" className="w-8 h-8"/>
                        <span className="font-semibold text-sm">{t('ad.create.add_photos')}</span>
                    </button>
                    <button type="button" onClick={() => setIsVideoModalOpen(true)} className={mediaButtonClass}>
                        <Icon name="video" className="w-8 h-8"/>
                        <span className="font-semibold text-sm">{t('ad.create.add_video')}</span>
                    </button>
                    <button type="button" onClick={() => setIsDocModalOpen(true)} className={mediaButtonClass}>
                        <Icon name="document-text" className="w-8 h-8"/>
                        <span className="font-semibold text-sm">{t('ad.create.add_document')}</span>
                    </button>
                </div>

                {(formData.images?.length || 0) > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {formData.images?.map((src, i) => (
                            <div key={i} className="relative group">
                                <img src={src} className="w-full h-24 object-cover rounded" alt="upload preview" />
                                <button type="button" onClick={() => handleRemoveMedia('images', i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><Icon name="close" className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
      case 3: // Delivery & Auction
        const offersHome = formData.delivery?.type === 'delivery' || formData.delivery?.type === 'both';
        const offersPickup = formData.delivery?.type === 'pickup' || formData.delivery?.type === 'both';
        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-lg font-medium">{t('delivery.create_section_title')}</h4>
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
        );
      case 4: // Review
        return (
             <div className="space-y-4">
                <h3 className="text-xl font-bold">{t('ad.create.review_title')}</h3>
                {formData.images && formData.images.length > 0 && <img src={formData.images[0]} alt="Preview" className="w-1/2 mx-auto rounded-lg"/>}
                <p><strong>{t('ad.create.title_label')}:</strong> {formData.title}</p>
                {formData.isAuction ? (
                    <p><strong>{t('auction.create.starting_bid')}:</strong> {formData.auctionDetails?.startingBid} {formData.currency}</p>
                ) : (
                    <p><strong>{t('ad.create.price_label')}:</strong> {formData.price} {formData.currency}</p>
                )}
                <p><strong>{t('ad.create.category_label')}:</strong> {formData.category}</p>
                <p><strong>{t('ad.create.condition_label')}:</strong> {formData.condition}</p>
            </div>
        );
      default: return null;
    }
  };

  const steps = [t('ad.create.step1'), t('ad.create.step2'), t('ad.create.step3'), t('ad.create.step4')];

  return (
    <>
    <form onSubmit={handleSubmit}>
      {/* Stepper UI */}
      <div className="mb-8">
        <ol className="grid grid-cols-4 -mx-4">
          {steps.map((stepName, index) => (
            <li key={stepName} className={`relative flex justify-center items-center ${index + 1 < steps.length ? "after:content-[''] after:absolute after:start-1/2 after:top-5 after:w-full after:h-1 after:border-b after:border-4" : ''} ${index + 1 <= step ? 'after:border-indigo-600' : 'after:border-gray-200 dark:after:border-gray-700'}`}>
              <div className="z-10 flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${index + 1 <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {index + 1}
                </div>
                <p className={`mt-2 text-xs text-center font-semibold whitespace-nowrap ${index + 1 <= step ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}>{stepName}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-h-[300px]">
         {renderStep()}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-md">{t('ad.create.prev_step')}</button>
        ) : (
          <button type="button" onClick={handleCancel} className="px-6 py-2 border rounded-md">{t('ad.create.cancel')}</button>
        )}
        
        {step < 4 ? (
          <button type="button" onClick={nextStep} className="px-6 py-2 bg-indigo-600 text-white rounded-md">{t('ad.create.next_step')}</button>
        ) : (
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md">{t('ad.create.post_ad')}</button>
        )}
      </div>
    </form>
     {isImageModalOpen && (
        <Modal title={t('ad.create.upload_photos')} onClose={() => setIsImageModalOpen(false)}>
            <ImageUploadModalContent 
                onSave={(images) => setFormData(prev => ({...prev, images: [...(prev!.images || []), ...images]}))}
                onClose={() => setIsImageModalOpen(false)} 
            />
        </Modal>
    )}
    {isVideoModalOpen && (
        <Modal title={t('ad.create.upload_video')} onClose={() => setIsVideoModalOpen(false)}>
            <VideoUploadModalContent 
                onSave={(url) => setFormData(prev => ({ ...prev, videos: [...(prev!.videos || []), url] }))}
                onClose={() => setIsVideoModalOpen(false)}
            />
        </Modal>
    )}
    {isDocModalOpen && (
        <Modal title={t('ad.create.upload_document')} onClose={() => setIsDocModalOpen(false)}>
            <DocumentUploadModalContent
                 onSave={(doc) => setFormData(prev => ({ ...prev, documents: [...(prev!.documents || []), doc] }))}
                 onClose={() => setIsDocModalOpen(false)}
            />
        </Modal>
    )}
    </>
  );
};

export default AdCreationWizard;