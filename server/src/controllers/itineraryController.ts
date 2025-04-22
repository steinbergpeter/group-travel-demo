import { Request, Response } from 'express';
import prisma from '../services/prisma';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get all itineraries (with optional group filter)
export const getItineraries = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;

    const whereCondition = groupId ? { groupId: String(groupId) } : {};

    const itineraries = await prisma.itinerary.findMany({
      where: whereCondition,
      include: {
        group: {
          select: {
            id: true,
            name: true,
            destination: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(itineraries);
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
};

// Get itinerary by ID
export const getItineraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            destination: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
};

// Create new itinerary
export const createItinerary = async (req: Request, res: Response) => {
  try {
    const { groupId, title, description, content } = req.body;

    // Validate required fields
    if (!groupId || !title || !content) {
      return res
        .status(400)
        .json({ error: 'Group ID, title, and content are required' });
    }

    // Check if group exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Create itinerary
    const newItinerary = await prisma.itinerary.create({
      data: {
        groupId,
        title,
        description,
        content,
      },
    });

    res.status(201).json(newItinerary);
  } catch (error) {
    console.error('Error creating itinerary:', error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
};

// Update existing itinerary
export const updateItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, content, isFinalized } = req.body;

    // Check if itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!existingItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Update itinerary
    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(isFinalized !== undefined && { isFinalized }),
      },
    });

    res.json(updatedItinerary);
  } catch (error) {
    console.error('Error updating itinerary:', error);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
};

// Delete itinerary
export const deleteItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!existingItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Delete itinerary (cascade deletes will handle votes, comments, etc.)
    await prisma.itinerary.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
};

// Vote on itinerary
export const voteOnItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, value } = req.body;

    // Validate required fields
    if (!userId || value === undefined) {
      return res
        .status(400)
        .json({ error: 'User ID and vote value are required' });
    }

    // Check if itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!existingItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_itineraryId: {
          userId,
          itineraryId: id,
        },
      },
    });

    let vote;

    if (existingVote) {
      // Update existing vote
      vote = await prisma.vote.update({
        where: {
          userId_itineraryId: {
            userId,
            itineraryId: id,
          },
        },
        data: { value },
      });
    } else {
      // Create new vote
      vote = await prisma.vote.create({
        data: {
          userId,
          itineraryId: id,
          value,
        },
      });
    }

    res.json(vote);
  } catch (error) {
    console.error('Error voting on itinerary:', error);
    res.status(500).json({ error: 'Failed to vote on itinerary' });
  }
};

// Comment on itinerary
export const commentOnItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;

    // Validate required fields
    if (!userId || !content) {
      return res
        .status(400)
        .json({ error: 'User ID and comment content are required' });
    }

    // Check if itinerary exists
    const existingItinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!existingItinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        userId,
        itineraryId: id,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error commenting on itinerary:', error);
    res.status(500).json({ error: 'Failed to comment on itinerary' });
  }
};

// Generate itinerary with AI
export const generateItinerary = async (req: Request, res: Response) => {
  try {
    const { groupId, destination, startDate, endDate } = req.body;

    // Validate required fields
    if (!groupId || !destination) {
      return res
        .status(400)
        .json({ error: 'Group ID and destination are required' });
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              include: {
                preferences: true,
              },
            },
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Extract user preferences
    const userPreferences = group.members
      .filter((member) => member.user.preferences)
      .map((member) => ({
        userName: member.user.name,
        preferences: member.user.preferences,
      }));

    if (userPreferences.length === 0) {
      return res.status(400).json({
        error:
          'No user preferences found for this group. At least one user needs to set their preferences.',
      });
    }

    // Format data for the AI prompt
    const promptData = {
      destination,
      dateRange:
        startDate && endDate
          ? `${new Date(startDate).toLocaleDateString()} to ${new Date(
              endDate
            ).toLocaleDateString()}`
          : 'Flexible',
      groupSize: group.members.length,
      userPreferences,
    };

    // Construct the prompt for OpenAI
    const prompt = constructItineraryPrompt(promptData);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are a travel planning assistant that specializes in creating group itineraries that balance everyone's preferences. Your output should be well-structured JSON that includes days, activities, meals, and accommodations.",
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    // Check if content exists before parsing
    if (!completion.choices[0].message.content) {
      throw new Error('No content returned from OpenAI API');
    }

    const itineraryContent = JSON.parse(completion.choices[0].message.content);

    // Create new itinerary in the database
    const newItinerary = await prisma.itinerary.create({
      data: {
        groupId,
        title: `${destination} Itinerary`,
        description: `AI-generated itinerary for ${destination}`,
        content: itineraryContent,
      },
    });

    res.status(201).json(newItinerary);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
};

// Helper function to construct the AI prompt
function constructItineraryPrompt(data: any): string {
  const { destination, dateRange, groupSize, userPreferences } = data;

  let prompt = `Create a detailed travel itinerary for a group of ${groupSize} people to ${destination} during ${dateRange}.\n\n`;

  prompt += 'Group members and their preferences:\n';

  userPreferences.forEach((user: any) => {
    const prefs = user.preferences;
    prompt += `- ${user.userName}: `;

    if (prefs.travelStyle && prefs.travelStyle.length > 0) {
      prompt += `Travel style: ${prefs.travelStyle.join(', ')}. `;
    }

    if (prefs.budget) {
      prompt += `Budget: $${prefs.budget}. `;
    }

    if (prefs.mustHaves && prefs.mustHaves.length > 0) {
      prompt += `Must-haves: ${prefs.mustHaves.join(', ')}. `;
    }

    if (prefs.avoidList && prefs.avoidList.length > 0) {
      prompt += `Wants to avoid: ${prefs.avoidList.join(', ')}. `;
    }

    if (prefs.foodPrefs && prefs.foodPrefs.length > 0) {
      prompt += `Food preferences: ${prefs.foodPrefs.join(', ')}. `;
    }

    if (prefs.activityLevel) {
      prompt += `Activity level: ${prefs.activityLevel}. `;
    }

    if (prefs.additionalNotes) {
      prompt += `Additional notes: ${prefs.additionalNotes}`;
    }

    prompt += '\n';
  });

  prompt +=
    "\nPlease create a balanced itinerary that tries to accommodate everyone's preferences. When there are conflicts, suggest compromises or optional activities that people can choose. Structure the itinerary by day, with activities, meals, and accommodations.\n\n";

  prompt +=
    'Format the response as a structured JSON object with the following format:\n';
  prompt += `{
    "destination": "${destination}",
    "days": [
      {
        "day": 1,
        "date": "YYYY-MM-DD",
        "activities": [
          {
            "time": "Morning",
            "activity": "Visit X attraction",
            "description": "Description of activity",
            "suitableFor": ["Person1", "Person2"],
            "optionalFor": ["Person3"],
            "estimatedCost": "$XX"
          }
        ],
        "meals": [
          {
            "type": "Breakfast/Lunch/Dinner",
            "suggestion": "Restaurant or meal type",
            "accommodates": ["dietary preferences"]
          }
        ],
        "accommodation": {
          "name": "Hotel/Airbnb name",
          "description": "Brief description",
          "estimatedCost": "$XX"
        }
      }
    ],
    "summary": {
      "highlights": ["Highlight 1", "Highlight 2"],
      "compromises": ["Compromise made for X and Y preferences"],
      "estimatedTotalCost": "$XXX per person"
    }
  }`;

  return prompt;
}
