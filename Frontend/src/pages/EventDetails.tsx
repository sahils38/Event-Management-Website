import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Event } from '../types';
import { useAuthStore } from '../store/authStore';

const mockEvent: Event = {
  id: '1',
  name: 'Tech Conference 2025',
  description:
    'Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and learn about the latest technologies shaping our future.',
  date: '2025-03-15T09:00:00Z',
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
  creatorId: '1',
  attendeeCount: 120,
  category: 'Technology',
  attendees: [],
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [event, setEvent] = useState<Event | null>(null);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    // TODO: Fetch event data from API
    setEvent(mockEvent);
    // Check if user is attending
    setIsAttending(mockEvent.attendees.some((att) => att.id === user?.id));
  }, [id, user?.id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleJoinEvent = async () => {
    try {
      // TODO: Implement actual API call
      setIsAttending(true);
      toast.success('Successfully joined the event!');
    } catch (error) {
      toast.error('Failed to join the event. Please try again.');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      // TODO: Implement actual API call
      setIsAttending(false);
      toast.success('Successfully left the event.');
    } catch (error) {
      toast.error('Failed to leave the event. Please try again.');
    }
  };

  const handleDelete = async () => {
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

  const isCreator = user?.id === event.creatorId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96">
            <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {event.category}
                </span>
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {event.attendeeCount} attendees
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {isCreator && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Event
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Event
                  </button>
                </div>
              )}
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </div>

            {!isCreator && (
              <div className="mt-8">
                {isAttending ? (
                  <button
                    onClick={handleLeaveEvent}
                    className="w-full md:w-auto px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Leave Event
                  </button>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    className="w-full md:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Join Event
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
