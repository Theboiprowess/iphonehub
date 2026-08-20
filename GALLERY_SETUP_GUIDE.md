# Gallery Setup Guide for Google Maps & Public Directory Indexing

## Overview
This guide explains how to set up your photo gallery to be indexed in Google Maps and public map directories for maximum local SEO visibility.

## What's Been Implemented

### 1. **Gallery Page Created**
- URL: https://iphonehubzimbabwe.co.zw/gallery
- Professional photo gallery with filtering by category
- Lightbox for viewing images
- Mobile-responsive design

### 2. **Structured Data (Schema.org)**
- ImageGallery schema added for SEO
- ImageObject schema for each image
- Location data for Google Maps indexing
- Provider information (LocalBusiness schema)

### 3. **Sitemap Updated**
- Gallery page added to XML sitemap
- Priority: 0.6 (high importance)
- Change frequency: weekly

### 4. **Image Categories**
- **Store & Team**: Store front, interior, team photos
- **Products**: iPhone displays, boxed phones, accessories
- **Customers**: Happy customers, testimonials
- **Services**: Delivery, quality checks, service photos

## Next Steps for You

### Step 1: Upload Your Actual Images

Place your photos in the `public/gallery/` folder with these exact filenames:

**Store Photos:**
- `store-front.jpg` - Your store front exterior
- `store-interior.jpg` - Store interior with displays
- `team.jpg` - Your team/staff photo

**Product Photos:**
- `iphone-display.jpg` - iPhone display case
- `iphone-boxed.jpg` - Boxed iPhones collection
- `iphone-preowned.jpg` - Pre-owned iPhones
- `iphone-accessories.jpg` - Accessories display

**Customer Photos:**
- `customer-1.jpg` - Happy customer with iPhone
- `customer-2.jpg` - Trade-in success story

**Service Photos:**
- `service.jpg` - Service/quality check
- `delivery.jpg` - Delivery service
- `quality-check.jpg` - Quality check process

**Image Requirements:**
- Resolution: 1200x1200px or higher (square aspect ratio recommended)
- Format: JPG or PNG
- File size: Under 2MB each
- Quality: High resolution, well-lit

### Step 2: Add Gallery Link to Navigation

Add the gallery link to your header navigation:

In `src/components/layout/header.tsx`, add:
```tsx
<Link href="/gallery" className="hover:text-[#CDB586] transition-colors">
  Gallery
</Link>
```

### Step 3: Upload Photos to Google Business Profile

1. Go to https://business.google.com/
2. Sign in to your business profile
3. Click "Photos" tab
4. Upload the same photos to your Google Business Profile
5. Add descriptions with keywords:
   - "iPhone Hub Zimbabwe store in Masvingo"
   - "Quality iPhones at iPhone Hub Zimbabwe"
   - "iPhone accessories Zimbabwe"
   - "Pre-owned iPhones Masvingo"

### Step 4: Add to Other Local Directories

Upload photos to these directories for maximum visibility:

- **ZimYellowPages**: https://www.zimyellowpages.co.zw/
- **ZimboLocal**: https://www.zimbolocal.com/
- **Facebook Business Page**: Upload to your page
- **Instagram Business Profile**: Upload to your profile

### Step 5: Optimize Image Alt Text

The gallery already has SEO-optimized alt text. Ensure your actual images match these descriptions:

- Include location: "Masvingo, Zimbabwe"
- Include business name: "iPhone Hub Zimbabwe"
- Include product names: "iPhone 15, iPhone 14, etc."
- Include services: "Trade-in, Delivery, Quality Check"

### Step 6: Add Gallery to Footer

Consider adding a gallery link in your footer for better internal linking.

## Google Maps Integration

### How Images Help Google Maps

1. **Local Pack Rankings**: Photos improve your position in local search results
2. **Business Profile Visibility**: Photos make your listing more attractive
3. **Click-Through Rate**: Businesses with photos get more clicks
4. **Trust**: Photos build trust with potential customers

### Best Practices for Google Maps Photos

1. **Consistent Branding**: Use your logo and brand colors
2. **Real Photos**: Use actual photos, not stock images
3. **Recent Photos**: Keep photos updated (within last 6 months)
4. **High Quality**: Use high-resolution, well-lit photos
5. **Variety**: Mix of store, products, team, and customer photos
6. **Geotagged**: If possible, geotag your photos with location data

### Image Categories for Google Maps

Google Business Profile accepts these photo types:

- **Logo**: Your business logo
- **Cover Photo**: 2120x1192px recommended
- **Storefront**: Exterior of your business
- **Interior**: Inside your store
- **At Work**: Team working
- **Products**: Your products (iPhones)
- **Food/Menu**: Not applicable
- **Common Areas**: Not applicable

## SEO Benefits

### What This Does for Your SEO

1. **Image Search Optimization**: Images appear in Google Image Search
2. **Local SEO**: Helps with "near me" searches
3. **Brand Visibility**: More places people see your brand
4. **Social Proof**: Customer photos build trust
5. **Engagement**: Galleries increase time on site

### Schema.org Implementation

The gallery includes:
- `ImageGallery` schema for the page
- `ImageObject` schema for each image
- `LocalBusiness` provider information
- `Place` schema for location data
- Location metadata for Google Maps

## Monitoring Performance

### Google Search Console

1. Go to https://search.google.com/search-console/
2. Navigate to "Images" report
3. Monitor which images are indexed
4. Check for any indexing issues

### Google Business Profile Insights

1. Go to your Google Business Profile
2. Check "Photos" section
3. Monitor photo views and engagement
4. See which photos perform best

## Timeline for Indexing

- **Website Gallery**: 1-3 days
- **Google Image Search**: 1-2 weeks
- **Google Maps Photos**: 1-2 weeks (after upload)
- **Local Directories**: 1-4 weeks

## Maintenance

### Regular Updates

- Add new photos monthly
- Remove outdated photos
- Update descriptions seasonally
- Add seasonal photos (holidays, promotions)

### Seasonal Content Ideas

- **January**: New Year resolutions, trade-ins
- **February**: Valentine's Day gifts
- **April**: Easter, school holidays
- **December**: Holiday gifts, year-end sales

## Troubleshooting

### Images Not Showing

- Check file names match exactly
- Verify images are in `public/gallery/` folder
- Clear browser cache
- Check console for 404 errors

### Google Maps Not Indexing

- Ensure photos are uploaded to Google Business Profile
- Check photo quality and size
- Verify business profile is verified
- Wait 1-2 weeks for indexing

### Slow Gallery Loading

- Compress images (use TinyPNG or similar)
- Use WebP format for better compression
- Lazy load images (already implemented)
- Consider using CDN for images

## Additional Resources

- **Google Business Profile Help**: https://support.google.com/business/
- **Schema.org ImageGallery**: https://schema.org/ImageGallery
- **Image SEO Guide**: https://developers.google.com/search/docs/appearance/image-carousel
- **Local SEO Guide**: https://developers.google.com/search/docs/appearance/local-search

## Summary

Your gallery is now set up for maximum visibility on Google Maps and public directories. The technical implementation is complete - you just need to:

1. Upload your actual photos to `public/gallery/`
2. Upload the same photos to Google Business Profile
3. Add gallery link to navigation
4. Monitor performance in Search Console

The gallery will help improve your local SEO, increase visibility on Google Maps, and provide social proof to potential customers!
