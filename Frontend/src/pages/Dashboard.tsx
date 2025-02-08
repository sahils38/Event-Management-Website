import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const events = [
    {
      id: '1',
      name: 'Sample Event',
      description: 'This is a sample event description.',
      date: '2025-02-12T10:00:00Z',
      category: 'Tech',
      creatorId: '1',
      attendeeCount: 5,
      attendees: ['1', '2', '3'],
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'Music Festival',
      description: 'An amazing music festival experience.',
      date: '2025-05-20T18:00:00Z',
      category: 'Music',
      creatorId: '2',
      attendeeCount: 10,
      attendees: ['4', '5', '6'],
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80'
    }
  ];

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // TODO: Implement actual API call
        toast.success('Event deleted successfully!');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete the event. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.length > 0 ? (
          events.map(event => {
            const isCreator = event.creatorId === user?.id;
            const isOwner = user?.role === 'owner';

            return (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Calendar className="h-5 w-5 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {event.category}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {event.attendeeCount} attendees
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/events/${event.id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View Details
                    </Link>
                    {isCreator && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No events available.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
