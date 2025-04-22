import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'confirmed' | 'completed';
  members: number;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    name: 'Summer Getaway',
    destination: 'Bali, Indonesia',
    startDate: '2025-06-15',
    endDate: '2025-06-25',
    status: 'planning',
    members: 5,
  },
  {
    id: '2',
    name: 'Weekend City Break',
    destination: 'New York City, USA',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    status: 'confirmed',
    members: 3,
  },
  {
    id: '3',
    name: 'Ski Trip',
    destination: 'Aspen, Colorado',
    startDate: '2025-12-22',
    endDate: '2025-12-30',
    status: 'planning',
    members: 8,
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getStatusColor = (status: Trip['status']) => {
  switch (status) {
    case 'planning':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-gray-200 text-gray-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchTrips = async () => {
      setTimeout(() => {
        setTrips(mockTrips);
        setLoading(false);
      }, 800);
    };
    fetchTrips();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>My Trips</h1>
          <p className='mt-1 text-gray-600'>
            Welcome back, {user?.name || 'Traveler'}!
          </p>
        </div>
        <Link to='/trips/new'>
          <button className='flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition'>
            <span className='text-lg'>＋</span> New Trip
          </button>
        </Link>
      </div>
      {loading ? (
        <div className='flex justify-center p-12'>
          <span>Loading your trips...</span>
        </div>
      ) : trips.length === 0 ? (
        <div className='text-center p-12 border rounded-lg'>
          <h2 className='text-lg font-semibold mb-4'>
            You don't have any trips yet
          </h2>
          <p className='mb-6'>
            Create your first trip and invite your friends to start planning
            together!
          </p>
          <Link to='/trips/new'>
            <button className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition'>
              Create Your First Trip
            </button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {trips.map((trip) => (
            <div
              key={trip.id}
              className='border rounded-lg overflow-hidden flex flex-col h-full bg-white shadow'
            >
              <div className='bg-gray-50 px-4 py-3 flex justify-between items-center'>
                <h3 className='font-semibold text-lg'>{trip.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                    trip.status
                  )}`}
                >
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </span>
              </div>
              <div className='flex-1 px-4 py-3 flex flex-col gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>🗺️</span>
                  <span className='font-medium'>{trip.destination}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>📅</span>
                  <span>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>👥</span>
                  <span>{trip.members} travelers</span>
                </div>
              </div>
              <div className='px-4 py-3 border-t'>
                <Link to={`/trips/${trip.id}`} className='block w-full'>
                  <button className='w-full border border-teal-600 text-teal-600 rounded py-2 hover:bg-teal-50 transition'>
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
