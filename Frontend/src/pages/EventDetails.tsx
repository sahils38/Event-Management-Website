import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Event } from '../types';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import { onEventUpdate } from '../services/socket';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { updateEventAttendees } = useEventStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://event-management-website-qaje.onrender.com/api/events/${id}`, { withCredentials: true });
        setEvent(response.data);
        setIsAttending(response.data.attendees.includes(user?.id || ''));
      } catch (error) {
        toast.error('Failed to fetch event details.');
        navigate('/'); // Redirect to home if event not found
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Listen for real-time updates
    onEventUpdate(({ eventId, attendeeCount }) => {
      if (eventId === id) {
        setEvent((prev) => prev ? { ...prev, attendeeCount } : null);
      }
    });
  }, [id, user?.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex items-center justify-center min-h-screen">Event not found</div>;
  }

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error('You must be logged in to join an event.');
      return;
    }
  
    if (!event?._id) {
      toast.error('Event ID is missing. Please refresh the page.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        toast.error('Unauthorized: Please log in.');
        return;
      }
  
      const response = await axios.post(
        `https://event-management-website-qaje.onrender.com/api/events/${event._id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensure cookies are sent for authentication
        }
      );
  
      // Update state to reflect the joined event
      setIsAttending(true);
      setEvent((prev) => prev ? { ...prev, attendeeCount: response.data.event.attendeeCount } : null);
  
      toast.success('Successfully joined the event!');
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error('You have already joined this event.');
            break;
          case 401:
            toast.error('Unauthorized: Please log in.');
            break;
          case 403:
            toast.error('Forbidden: You are not allowed to join this event.');
            break;
          case 500:
            toast.error('Server error. Please try again later.');
            break;
          default:
            toast.error('Failed to join the event. Please try again.');
        }
      } else {
        toast.error('Network error. Please check your connection.');
      }
    }
  };
  

  const isCreator = user?.id === event.organiser;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96">
            <img src={event.image} alt={event.eventName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{event.eventName}</h1>
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
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </div>

            {!isCreator && (
              <div className="mt-8">
                {isAttending ? (
                  <button
                    className="w-full md:w-auto px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    disabled
                  >
                    Already Joined
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
