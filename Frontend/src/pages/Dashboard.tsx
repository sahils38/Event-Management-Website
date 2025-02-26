import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import axios from 'axios';

// Define TypeScript interface for event data
interface Event {
  _id: string;
  eventName: string;
  description: string;
  date: string;
  category: string;
  organiser: string; // ✅ Fixed: Removed incorrect 'creator'
  attendees: string[];
  image: string;
}

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://event-management-website-qaje.onrender.com/api/events');
      console.log('Events:', response.data); // ✅ Debugging: Log API response
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events.');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Refresh when redirected from CreateEvent page
  useEffect(() => {
    if (location.state?.refresh) {
      fetchEvents();
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const handleDelete = async (eventId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not logged in!');
        return;
      }
  
      await axios.delete(`https://event-management-website-qaje.onrender.com/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Event deleted successfully!');
      setEvents((prevEvents) => prevEvents.filter(event => event._id !== eventId));
    } catch (error) {
      toast.error('Failed to delete event. Make sure you are the organiser.');
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {events.length > 0 ? (
          events.map(event => {
            const isCreator = event.organiser === user?.id; // ✅ Fixed: Check `organiser`, not `creator`

            return (
              <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={event.image}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.eventName}</h3>
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
                      {event.attendees.length} attendees
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/events/${event._id}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      View Details
                    </Link>
                    {isCreator && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/events/${event._id}/edit`)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
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
