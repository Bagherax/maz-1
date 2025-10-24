import React from 'react';
import { Ad, User } from '../../../../types';

interface AdPDFLayoutProps {
  ad: Ad;
  seller: User;
}

const AdPDFLayout: React.FC<AdPDFLayoutProps> = ({ ad, seller }) => {
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap');
    
    .pdf-body {
        font-family: 'Roboto', sans-serif;
        color: #333;
        background-color: #fff;
        line-height: 1.6;
    }
    .pdf-container {
        padding: 15mm;
        width: 210mm;
        box-sizing: border-box;
    }
    .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    .pdf-header .maz-logo {
        font-size: 28px;
        font-weight: 900;
        color: #333;
        letter-spacing: -1px;
    }
    .pdf-header h1 {
        font-size: 24px;
        color: #555;
    }
    .pdf-main-image {
        width: 100%;
        max-height: 250px;
        object-fit: contain;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
    }
    .pdf-title {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #1a1a1a;
    }
    .pdf-price {
        font-size: 24px;
        font-weight: 700;
        color: #4F46E5;
        margin-bottom: 20px;
    }
    .pdf-section {
        margin-bottom: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 15px;
        background: #f9f9f9;
        page-break-inside: avoid;
    }
    .pdf-section-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
    }
    .pdf-description {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .pdf-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    .pdf-detail-item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        padding: 5px 0;
        border-bottom: 1px dotted #ccc;
    }
    .pdf-detail-item strong {
        color: #666;
    }
    .pdf-image-gallery {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 15px;
    }
    .pdf-gallery-image {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid #ddd;
    }
    .pdf-seller-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .pdf-seller-avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
    }
    .pdf-footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 10px;
    }
  `;

  return (
    <div className="pdf-body">
      <style>{styles}</style>
      <div className="pdf-container">
        <div className="pdf-header">
          <div className="maz-logo">MAZ</div>
          <h1>Ad Details</h1>
        </div>
        
        <h2 className="pdf-title">{ad.title}</h2>
        <p className="pdf-price">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: ad.currency }).format(ad.price)}
        </p>

        <img src={ad.images[0]} className="pdf-main-image" alt={ad.title} />

        <div className="pdf-section">
            <h3 className="pdf-section-title">Description</h3>
            <p className="pdf-description">{ad.description}</p>
        </div>

        <div className="pdf-section">
            <h3 className="pdf-section-title">Details</h3>
            <div className="pdf-details-grid">
                <div className="pdf-detail-item"><strong>Category:</strong> <span>{ad.category}</span></div>
                <div className="pdf-detail-item"><strong>Condition:</strong> <span style={{textTransform: 'capitalize'}}>{ad.condition}</span></div>
                <div className="pdf-detail-item"><strong>Brand:</strong> <span>{ad.specifications.brand}</span></div>
                <div className="pdf-detail-item"><strong>Model:</strong> <span>{ad.specifications.model}</span></div>
                {ad.specifications.color && <div className="pdf-detail-item"><strong>Color:</strong> <span>{ad.specifications.color}</span></div>}
                {ad.specifications.size && <div className="pdf-detail-item"><strong>Size:</strong> <span>{ad.specifications.size}</span></div>}
            </div>
        </div>

        <div className="pdf-section">
            <h3 className="pdf-section-title">Seller Information</h3>
            <div className="pdf-seller-info">
                <img src={seller.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.name}`} className="pdf-seller-avatar" alt={seller.name}/>
                <div>
                    <p><strong>Name:</strong> {seller.name}</p>
                    <p><strong>Email:</strong> {seller.email}</p>
                    <p><strong>Phone:</strong> {seller.phone || 'Not Provided'}</p>
                    <p><strong>Rating:</strong> {seller.rating.toFixed(1)}/5.0 ({seller.reviewCount} reviews)</p>
                </div>
            </div>
        </div>

        {ad.images.length > 1 && (
            <div className="pdf-section">
                <h3 className="pdf-section-title">Image Gallery</h3>
                <div className="pdf-image-gallery">
                    {ad.images.map((img, index) => (
                        <img key={index} src={img} className="pdf-gallery-image" alt={`Gallery image ${index + 1}`} />
                    ))}
                </div>
            </div>
        )}

        <div className="pdf-footer">
            <p>Generated from MAZDADY Marketplace | Ad ID: {ad.id}</p>
        </div>
      </div>
    </div>
  );
};

export default AdPDFLayout;