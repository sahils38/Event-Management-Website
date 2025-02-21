import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Image as ImageIcon, Clock, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { Event } from '../types';
import axios from 'axios';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Ensure we're using the correct parameter name
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    date: '',
    time: '',
    image: '',
    category: '',
  });

  const categories = ['Technology', 'Music', 'Sports', 'Art', 'Business'];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Unauthorized access. Please log in.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event: Event = response.data;

        const dateObj = new Date(event.date);
        setFormData({
          eventName: event.eventName,
          description: event.description,
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toTimeString().slice(0, 5),
          image: event.image, // Changed from event.imageUrl to event.image
          category: event.category,
        });
      } catch (error) {
        toast.error('Failed to fetch event details');
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not logged in!');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`, // Fixed eventId to id
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Event updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to update event. Make sure you are the organiser.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.eventName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => navigate('/')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Changes</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEvent;
