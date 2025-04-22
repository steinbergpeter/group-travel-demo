import { Request, Response } from 'express';
import prisma from '../services/prisma';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update existing user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get user preferences
export const getUserPreferences = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userPreferences = await prisma.userPreference.findUnique({
      where: { userId: id },
    });

    if (!userPreferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    res.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch user preferences' });
  }
};

// Update user preferences
export const updateUserPreferences = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      travelStyle,
      budget,
      mustHaves,
      avoidList,
      foodPrefs,
      activityLevel,
      additionalNotes,
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if preferences already exist
    const existingPreferences = await prisma.userPreference.findUnique({
      where: { userId: id },
    });

    let userPreferences;

    if (existingPreferences) {
      // Update existing preferences
      userPreferences = await prisma.userPreference.update({
        where: { userId: id },
        data: {
          ...(travelStyle && { travelStyle }),
          ...(budget && { budget }),
          ...(mustHaves && { mustHaves }),
          ...(avoidList && { avoidList }),
          ...(foodPrefs && { foodPrefs }),
          ...(activityLevel && { activityLevel }),
          ...(additionalNotes !== undefined && { additionalNotes }),
        },
      });
    } else {
      // Create new preferences
      userPreferences = await prisma.userPreference.create({
        data: {
          userId: id,
          travelStyle: travelStyle || [],
          budget: budget || 0,
          mustHaves: mustHaves || [],
          avoidList: avoidList || [],
          foodPrefs: foodPrefs || [],
          activityLevel: activityLevel || 'medium',
          additionalNotes,
        },
      });
    }

    res.json(userPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
};
