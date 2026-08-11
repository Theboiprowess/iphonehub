import { prisma } from '@/lib/prisma';

export interface ProductContext {
  id: string;
  name: string;
  model: string;
  condition: string;
  price: number;
  stock: number;
  image?: string;
  storage?: string;
  colour?: string;
  batteryHealth?: number;
  url: string;
}

export interface BusinessContext {
  name: string;
  email: string;
  phone: string;
  whatsappPrimary: string;
  whatsappSecondary?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  openingHours?: any;
}

export interface FAQContext {
  question: string;
  answer: string;
  category?: string;
}

export interface PolicyContext {
  name: string;
  content: string;
}

export interface SupportContext {
  products: ProductContext[];
  business: BusinessContext | null;
  faqs: FAQContext[];
  policies: PolicyContext[];
  knowledgeArticles: Array<{
    title: string;
    content: string;
    category: string;
  }>;
}

export async function getSupportContext(): Promise<SupportContext> {
  try {
    // Get active products with variants
    const products = await prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        isActive: true,
      },
      include: {
        variants: {
          where: {
            isActive: true,
          },
          take: 1,
        },
        images: {
          where: {
            type: 'MAIN',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const productContext: ProductContext[] = products.map((product) => {
      const variant = product.variants[0];
      const image = product.images[0];
      return {
        id: product.id,
        name: product.name,
        model: product.model,
        condition: product.condition,
        price: variant ? Number(variant.price) : 0,
        stock: variant ? variant.stock : 0,
        image: image?.url,
        storage: variant?.storage,
        colour: variant?.colour,
        batteryHealth: (product as any).batteryHealth,
        url: `/iphones/${product.id}`,
      };
    });

    // Get business settings
    const settings = await prisma.siteSettings.findFirst();
    const businessContext: BusinessContext | null = settings ? {
      name: settings.businessName,
      email: settings.businessEmail,
      phone: settings.businessPhone,
      whatsappPrimary: settings.whatsappNumber || settings.businessPhone,
      whatsappSecondary: settings.whatsappNumber2 || null || undefined,
      address: settings.address || null || undefined,
      city: settings.city || null || undefined,
      country: settings.country || null || undefined,
      openingHours: settings.openingHours,
    } : null;

    // Get FAQs
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    const faqContext: FAQContext[] = faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    }));

    // Get policies from settings
    const policies: PolicyContext[] = [];
    if (settings?.policies) {
      const policyData = settings.policies as any;
      if (policyData.warranty) {
        policies.push({ name: 'Warranty', content: policyData.warranty });
      }
      if (policyData.returns) {
        policies.push({ name: 'Returns', content: policyData.returns });
      }
      if (policyData.privacy) {
        policies.push({ name: 'Privacy', content: policyData.privacy });
      }
      if (policyData.terms) {
        policies.push({ name: 'Terms', content: policyData.terms });
      }
    }

    // Get published knowledge articles
    const knowledgeArticles = await prisma.knowledgeArticle.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        title: true,
        content: true,
        category: true,
      },
    });

    return {
      products: productContext,
      business: businessContext,
      faqs: faqContext,
      policies,
      knowledgeArticles,
    };
  } catch (error) {
    console.error('Error fetching support context:', error);
    return {
      products: [],
      business: null,
      faqs: [],
      policies: [],
      knowledgeArticles: [],
    };
  }
}

export function searchProducts(
  products: ProductContext[],
  query: string,
  filters?: {
    maxPrice?: number;
    minPrice?: number;
    condition?: string;
    storage?: string;
    inStock?: boolean;
  }
): ProductContext[] {
  const lowerQuery = query.toLowerCase();
  
  return products.filter((product) => {
    // Text search
    const matchesText =
      product.name.toLowerCase().includes(lowerQuery) ||
      product.model.toLowerCase().includes(lowerQuery) ||
      product.condition.toLowerCase().includes(lowerQuery);

    if (!matchesText) return false;

    // Apply filters
    if (filters?.maxPrice && product.price > filters.maxPrice) return false;
    if (filters?.minPrice && product.price < filters.minPrice) return false;
    if (filters?.condition && product.condition !== filters.condition) return false;
    if (filters?.storage && product.storage !== filters.storage) return false;
    if (filters?.inStock && product.stock <= 0) return false;

    return true;
  });
}

export function recommendProducts(
  products: ProductContext[],
  criteria: {
    budget?: number;
    storage?: string;
    condition?: string;
    priority?: 'camera' | 'gaming' | 'battery' | 'performance' | 'value';
  }
): ProductContext[] {
  let filtered = [...products];

  // Filter by budget
  if (typeof criteria.budget === 'number' && criteria.budget > 0) {
    filtered = filtered.filter((p) => p.price <= criteria.budget);
  }

  // Filter by storage
  if (criteria.storage) {
    filtered = filtered.filter((p) => p.storage === criteria.storage);
  }

  // Filter by condition
  if (criteria.condition) {
    filtered = filtered.filter((p) => p.condition === criteria.condition);
  }

  // Filter by stock
  filtered = filtered.filter((p) => p.stock > 0);

  // Sort based on priority
  switch (criteria.priority) {
    case 'value':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'performance':
      // Prioritize newer models (simple heuristic)
      filtered.sort((a, b) => {
        const aYear = parseInt(a.model.match(/\d{4}/)?.[0] || '0');
        const bYear = parseInt(b.model.match(/\d{4}/)?.[0] || '0');
        return bYear - aYear;
      });
      break;
    case 'camera':
    case 'gaming':
    case 'battery':
      // Prioritize Pro models (simple heuristic)
      filtered.sort((a, b) => {
        const aPro = a.model.toLowerCase().includes('pro');
        const bPro = b.model.toLowerCase().includes('pro');
        if (aPro && !bPro) return -1;
        if (!aPro && bPro) return 1;
        return 0;
      });
      break;
    default:
      filtered.sort((a, b) => a.price - b.price);
  }

  return filtered.slice(0, 5);
}
