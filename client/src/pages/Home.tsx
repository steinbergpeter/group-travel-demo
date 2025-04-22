import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className='bg-teal-600 text-white py-16 text-center'>
        <div className='container mx-auto max-w-5xl px-4'>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-4'>
            Plan Group Trips Without the Hassle
          </h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            TripMeld makes it easy to plan trips with friends and family.
            Everyone's preferences, one perfect itinerary.
          </p>
          <div className='flex flex-col md:flex-row gap-4 justify-center items-center'>
            <Link to='/register'>
              <button className='bg-white text-teal-700 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition mb-2 md:mb-0'>
                Get Started - It's Free
              </button>
            </Link>
            <Link to='/dashboard'>
              <button className='border border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-teal-700 transition'>
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto max-w-5xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            How TripMeld Works
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
            <div className='bg-gray-50 rounded-lg shadow p-6 flex flex-col items-start'>
              <div className='text-3xl mb-4'>👥</div>
              <h3 className='font-semibold text-lg mb-2'>
                Gather Everyone's Input
              </h3>
              <p>
                Invite your group and collect everyone's preferences, from
                must-see sights to budget constraints.
              </p>
            </div>
            <div className='bg-gray-50 rounded-lg shadow p-6 flex flex-col items-start'>
              <div className='text-3xl mb-4'>🗺️</div>
              <h3 className='font-semibold text-lg mb-2'>
                AI Builds Perfect Itinerary
              </h3>
              <p>
                Our smart algorithm creates a trip plan that maximizes
                everyone's satisfaction and eliminates conflicts.
              </p>
            </div>
            <div className='bg-gray-50 rounded-lg shadow p-6 flex flex-col items-start'>
              <div className='text-3xl mb-4'>📅</div>
              <h3 className='font-semibold text-lg mb-2'>
                Vote, Refine & Finalize
              </h3>
              <p>
                Everyone can vote on options, make suggestions, and collaborate
                until you have the perfect plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='bg-gray-50 py-16'>
        <div className='container mx-auto max-w-5xl px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            What People Are Saying
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='bg-white rounded-lg shadow p-6 flex flex-col items-start'>
              <p className='italic mb-3'>
                "Planning our Tokyo trip with 8 friends used to be a nightmare.
                TripMeld turned it into a fun, collaborative process!"
              </p>
              <div>
                <div className='font-bold'>Alex Johnson</div>
                <div className='text-sm text-gray-500'>Group Trip to Japan</div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6 flex flex-col items-start'>
              <p className='italic mb-3'>
                "With family members aged 5-75, finding activities for everyone
                seemed impossible until we used TripMeld."
              </p>
              <div>
                <div className='font-bold'>Maya Patel</div>
                <div className='text-sm text-gray-500'>
                  Family Reunion Organizer
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6 flex flex-col items-start'>
              <p className='italic mb-3'>
                "Nobody could agree on anything until TripMeld helped us find
                the perfect compromise. Best weekend ever!"
              </p>
              <div>
                <div className='font-bold'>Carlos Rodriguez</div>
                <div className='text-sm text-gray-500'>
                  Bachelor Party Planner
                </div>
              </div>
            </div>
            <div className='bg-white rounded-lg shadow p-6 flex flex-col items-start'>
              <p className='italic mb-3'>
                "We saved hours of back-and-forth emails. The AI suggestions
                were spot on for what our group needed."
              </p>
              <div>
                <div className='font-bold'>Sarah Kim</div>
                <div className='text-sm text-gray-500'>
                  Annual Friends Getaway
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-20 text-center'>
        <div className='container mx-auto max-w-2xl px-4'>
          <h2 className='text-2xl font-bold mb-4'>
            Ready to Plan Your Perfect Group Trip?
          </h2>
          <p className='text-xl mb-8'>
            Join thousands of groups who have discovered the easier way to plan
            trips together.
          </p>
          <div className='flex flex-col gap-4 items-center'>
            <Link to='/register'>
              <button className='bg-teal-600 text-white font-semibold px-6 py-3 rounded hover:bg-teal-700 transition'>
                Create Your Free Account
              </button>
            </Link>
            <Link to='/groups/new'>
              <button className='border border-teal-600 text-teal-600 font-semibold px-6 py-3 rounded hover:bg-teal-600 hover:text-white transition'>
                Start a New Trip
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
