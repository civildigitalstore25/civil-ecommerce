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

// Update menu
export const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, parentId, order, isActive, icon, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid menu ID',
      });
    }

    // Check if menu exists
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found',
      });
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== menu.slug) {
      const existingMenu = await Menu.findOne({ slug, _id: { $ne: id } });
      if (existingMenu) {
        return res.status(400).json({
          success: false,
          message: 'Menu with this slug already exists',
        });
      }
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parent menu ID',
      });
    }

    // Prevent circular reference
    if (parentId && parentId === id) {
      return res.status(400).json({
        success: false,
        message: 'Menu cannot be its own parent',
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

    // Update fields
    if (name !== undefined) menu.name = name;
    if (slug !== undefined) menu.slug = slug;
    if (parentId !== undefined) menu.parentId = parentId || null;
    if (order !== undefined) menu.order = order;
    if (isActive !== undefined) menu.isActive = isActive;
    if (icon !== undefined) menu.icon = icon;
    if (type !== undefined) menu.type = type;

    await menu.save();

    res.status(200).json({
      success: true,
      message: 'Menu updated successfully',
      data: menu,
    });
  } catch (error: any) {
    console.error('Error updating menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu',
      error: error.message,
    });
  }
};

// Delete menu
export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid menu ID',
      });
    }

    // Check if menu exists
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found',
      });
    }

    // Check if menu has children
    const childMenus = await Menu.find({ parentId: id });
    if (childMenus.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete menu with submenus. Delete submenus first.',
      });
    }

    await Menu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Menu deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting menu:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu',
      error: error.message,
    });
  }
};

// Reorder menus
export const reorderMenus = async (req: Request, res: Response) => {
  try {
    const { menuOrders } = req.body;

    if (!Array.isArray(menuOrders) || menuOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'menuOrders array is required',
      });
    }

    // Validate and update each menu's order
    const updatePromises = menuOrders.map(async ({ id, order }) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid menu ID: ${id}`);
      }
      return Menu.findByIdAndUpdate(id, { order }, { new: true });
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Menus reordered successfully',
    });
  } catch (error: any) {
    console.error('Error reordering menus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder menus',
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
