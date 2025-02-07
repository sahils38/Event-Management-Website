import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Event } from '../types';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { onEventUpdate } from '../services/socket';

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference of the year',
    date: '2025-03-15T09:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    creatorId: '1',
    attendeeCount: 120,
    category: 'Technology',
    attendees: []
  },
  {
    id: '2',
    name: 'Music Festival',
    description: 'A day filled with amazing live performances',
    date: '2025-04-20T15:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80',
    creatorId: '2',
    attendeeCount: 500,
    category: 'Music',
    attendees: []
  }
];

const Dashboard = () => {
  const { events, setEvents, joinEvent, leaveEvent, updateEventAttendees } = useEventStore();
  const user = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Initialize events
    setEvents(mockEvents);

    // Listen for real-time updates
    onEventUpdate(({ eventId, attendeeCount }) => {
      updateEventAttendees(eventId, attendeeCount);
    });
  }, []);

  const categories = ['All', 'Technology', 'Music', 'Sports', 'Art', 'Business'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinEvent = async (eventId: string) => {
    try {
      await joinEvent(eventId);
      toast.success('Successfully joined the event!');
    } catch (error) {
      toast.error('Failed to join the event. Please try again.');
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      await leaveEvent(eventId);
      toast.success('Successfully left the event.');
    } catch (error) {
      toast.error('Failed to leave the event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => {
            const isAttending = event.attendees.includes(user?.id || '');
            const isCreator = event.creatorId === user?.id;

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
                    {!isCreator && (
                      <button
                        onClick={() => isAttending ? handleLeaveEvent(event.id) : handleJoinEvent(event.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          isAttending
                            ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isAttending ? 'Leave Event' : 'Join Event'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;