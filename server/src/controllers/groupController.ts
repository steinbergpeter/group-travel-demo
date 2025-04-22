import { Request, Response } from 'express';
import prisma from '../services/prisma';

// Get all groups
export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

// Get group by ID
export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        itineraries: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

// Create new group
export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, destination, startDate, endDate, creatorId } =
      req.body;

    // Validate required fields
    if (!name || !creatorId) {
      return res
        .status(400)
        .json({ error: 'Name and creator ID are required' });
    }

    // Check if creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Create group and add creator as a member
    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
        destination,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        creatorId,
        members: {
          create: {
            userId: creatorId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// Update existing group
export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, destination, startDate, endDate } = req.body;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Update group
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(destination !== undefined && { destination }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.json(updatedGroup);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
};

// Delete group
export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Delete group (cascade deletes will handle members, itineraries, etc.)
    await prisma.group.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

// Get group members
export const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Get members with their preferences
    const members = await prisma.groupMember.findMany({
      where: { groupId: id },
      include: {
        user: {
          include: {
            preferences: true,
          },
        },
      },
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Failed to fetch group members' });
  }
};

// Add member to group
export const addGroupMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: id,
        },
      },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ error: 'User is already a member of this group' });
    }

    // Add user to group
    const newMember = await prisma.groupMember.create({
      data: {
        userId,
        groupId: id,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error adding group member:', error);
    res.status(500).json({ error: 'Failed to add group member' });
  }
};

// Remove member from group
export const removeGroupMember = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    // Check if group member exists
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: id,
        },
      },
    });

    if (!existingMember) {
      return res.status(404).json({ error: 'Group member not found' });
    }

    // Check if user is the creator
    const group = await prisma.group.findUnique({
      where: { id },
    });

    if (group?.creatorId === userId) {
      return res.status(400).json({ error: 'Cannot remove the group creator' });
    }

    // Remove user from group
    await prisma.groupMember.delete({
      where: {
        userId_groupId: {
          userId,
          groupId: id,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error removing group member:', error);
    res.status(500).json({ error: 'Failed to remove group member' });
  }
};
