import { Request, Response } from 'express';
import Menu from '../models/Menu';
import mongoose from 'mongoose';

// Get all menus in hierarchical structure
export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    
    // Build query
    const query: any = {};
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    // Get all menus sorted by order
    const menus = await Menu.find(query).sort({ order: 1 }).lean();

    // Build hierarchical structure
    const menuMap = new Map();
    const rootMenus: any[] = [];

    // First pass: create map
    menus.forEach(menu => {
      menuMap.set(menu._id.toString(), { ...menu, children: [] });
    });

    // Second pass: build hierarchy
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu._id.toString());
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId.toString());
        if (parent) {
          parent.children.push(menuItem);
        } else {
          rootMenus.push(menuItem);
        }
      } else {
        rootMenus.push(menuItem);
      }
    });

    res.status(200).json({
      success: true,
      data: rootMenus,
    });
  } catch (error: any) {
    console.error('Error fetching menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menus',
      error: error.message,
    });
  }
};

// Get single menu by ID
export const getMenuById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid menu ID',
      });
    }

    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found',
      });
    }

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error: any) {
    console.error('Error fetching menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu',
      error: error.message,
    });
  }
};

// Create new menu
export const createMenu = async (req: Request, res: Response) => {
  try {
    const { name, slug, parentId, order, isActive, icon, type } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name and slug are required',
      });
    }

    // Check if slug already exists
    const existingMenu = await Menu.findOne({ slug });
    if (existingMenu) {
      return res.status(400).json({
        success: false,
        message: 'Menu with this slug already exists',
      });
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent menu ID',
      });
    }

    // If parentId provided, verify parent exists
    if (parentId) {
      const parentMenu = await Menu.findById(parentId);
      if (!parentMenu) {
        return res.status(404).json({
          success: false,
          message: 'Parent menu not found',
        });
      }
    }

    // Create menu
    const menu = new Menu({
      name,
      slug,
      parentId: parentId || null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      icon,
      type: type || 'category',
    });

    await menu.save();

    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: menu,
    });
  } catch (error: any) {
    console.error('Error creating menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu',
      error: error.message,
    });
  }
};

// Get menus by parent ID
export const getMenusByParent = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const { includeInactive } = req.query;

    let query: any = {};

    if (parentId === 'root') {
      query.parentId = null;
    } else {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent menu ID',
        });
      }
      query.parentId = parentId;
    }

    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    const menus = await Menu.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: menus,
    });
  } catch (error: any) {
    console.error('Error fetching menus by parent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menus',
      error: error.message,
    });
  }
};
