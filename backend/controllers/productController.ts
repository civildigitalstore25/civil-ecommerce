import { Request, Response } from 'express';
import Product, { IProduct } from '../models/Product';

// Create new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = { ...req.body };

    if (productData.brand && !productData.company) {
      productData.company = productData.brand;
    }
    if (productData.imageUrl && !productData.image) {
      productData.image = productData.imageUrl;
    }

    if (productData.subscriptionDurations && productData.subscriptionDurations.length > 0) {
      productData.price1 = productData.subscriptionDurations[0].price;
      if (productData.subscriptionDurations.length > 1) {
        productData.price3 = productData.subscriptionDurations[1].price;
      }
    }

    if (productData.hasLifetime && productData.lifetimePrice) {
      productData.priceLifetime = Number(productData.lifetimePrice);
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products with search and filter
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, company, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { version: { $regex: search as string, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = { $regex: category as string, $options: 'i' };
    }

    if (company) {
      filter.company = { $regex: company as string, $options: 'i' };
    }

    const products: IProduct[] = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get products filtered by name
export const getProductsByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, page = 1, limit = 10 } = req.query;

    if (!name) {
      res.status(400).json({ message: 'Name query parameter is required' });
      return;
    }

    const filter = {
      name: { $regex: name as string, $options: 'i' }
    };

    const products: IProduct[] = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      filter: { name: name as string }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get products filtered by category
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

    if (!category) {
      res.status(400).json({ message: 'Category parameter is required' });
      return;
    }

    const filter = {
      category: { $regex: category as string, $options: 'i' }
    };

    const sortOption: any = {};
    sortOption[sort as string] = -1;

    const products: IProduct[] = await Product.find(filter)
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      filter: { category }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get products filtered by company/brand
export const getProductsByCompany = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

    if (!company) {
      res.status(400).json({ message: 'Company parameter is required' });
      return;
    }

    // Search in both company and brand fields for backward compatibility
    const filter = {
      $or: [
        { company: { $regex: company as string, $options: 'i' } },
        { brand: { $regex: company as string, $options: 'i' } }
      ]
    };

    const sortOption: any = {};
    sortOption[sort as string] = -1;

    const products: IProduct[] = await Product.find(filter)
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      filter: { company }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get products with multiple filters (advanced filter)
export const getProductsWithFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      category, 
      company, 
      minPrice, 
      maxPrice, 
      isBestSeller,
      status,
      page = 1, 
      limit = 10,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter: any = {};

    // Name filter
    if (name) {
      filter.name = { $regex: name as string, $options: 'i' };
    }

    // Category filter
    if (category) {
      filter.category = { $regex: category as string, $options: 'i' };
    }

    // Company/Brand filter
    if (company) {
      filter.$or = [
        { company: { $regex: company as string, $options: 'i' } },
        { brand: { $regex: company as string, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price1 = {};
      if (minPrice) filter.price1.$gte = Number(minPrice);
      if (maxPrice) filter.price1.$lte = Number(maxPrice);
    }

    // Best seller filter
    if (isBestSeller !== undefined) {
      filter.isBestSeller = isBestSeller === 'true';
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    const sortOption: any = {};
    sortOption[sort as string] = order === 'asc' ? 1 : -1;

    const products: IProduct[] = await Product.find(filter)
      .sort(sortOption)
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      filters: { name, category, company, minPrice, maxPrice, isBestSeller, status }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories.filter(cat => cat)); // Filter out null/undefined
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique companies
export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await Product.distinct('company');
    res.json(companies.filter(comp => comp)); // Filter out null/undefined
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get unique brands (for new structure)
export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await Product.distinct('brand');
    const companies = await Product.distinct('company');

    const allBrands = [...new Set([...brands.filter(b => b), ...companies])];
    res.json(allBrands);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get category with product count
export const getCategoriesWithCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } }
    ]);
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get companies with product count
export const getCompaniesWithCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await Product.aggregate([
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, company: '$_id', count: 1 } }
    ]);
    res.json(companies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update product by id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = { ...req.body };

    if (productData.brand && !productData.company) {
      productData.company = productData.brand;
    }
    if (productData.imageUrl && !productData.image) {
      productData.image = productData.imageUrl;
    }

    if (productData.subscriptionDurations && productData.subscriptionDurations.length > 0) {
      productData.price1 = productData.subscriptionDurations[0].price;
      if (productData.subscriptionDurations.length > 1) {
        productData.price3 = productData.subscriptionDurations[1].price;
      }
    }

    if (productData.hasLifetime && productData.lifetimePrice) {
      productData.priceLifetime = Number(productData.lifetimePrice);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product by id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};