'use client';

import { useState } from 'react';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    bookingDate: '',
    bookingTime: '',
  });
  
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  // Combine date and time into ISO format
  const fullBookingTime = `${form.bookingDate}T${form.bookingTime}`;

  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name,
      email: form.email,
      phone: form.phone,
      bookingTime: fullBookingTime,
    }),
  });

  setLoading(false);

  if (res.ok) {
    setMessage('Waiver signed and booking submitted!');
    setForm({ name: '', email: '', phone: '', bookingDate: '', bookingTime: '' });
  } else {
    setMessage('Something went wrong.');
  }
};

  



  return (
    <main className="min-h-screen bg-[#f4f4f4] p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl max-w-md w-full p-8 border-t-8 border-blue-700">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/logo.png" // place the logo in /public/logo.png
            alt="Austin Rental Boats Logo"
            width={100}
            height={100}
          />
          <h1 className="text-xl font-bold text-gray-800">
            Austin Rental Boats
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          Sign Your Waiver
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Booked a boat? Just fill out this quick form to receive your confirmation by text and email.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full p-3 border rounded"
            pattern="^(\+1)?[0-9]{10}$"
            title="Enter a valid U.S. phone number with or without +1"
            value={form.phone}
            onChange={handleChange}
            required
          />
          {/* Booking Date */}
          <label className="block w-full">
            <span className="block mb-1 text-sm font-medium text-gray-700">
              Select Booking Date
            </span>
            <div className="w-full">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setForm({
                    ...form,
                    bookingDate: date ? date.toISOString().split('T')[0] : '',
                  });
                }}
                className="w-full p-4 text-base border border-gray-300 rounded cursor-pointer hover:border-blue-500 focus:border-blue-600 focus:outline-none transition"
                placeholderText="Click to choose a date"
                dateFormat="eee, MMM d, yyyy"
              />
            </div>
          </label>


          {/* Booking Time */}
          <select
            name="bookingTime"
            className="w-full p-3 border rounded"
            value={form.bookingTime}
            onChange={handleChange}
            required
          >
            <option value="">Select Time</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
          </select>


          
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={() => setConsent(!consent)}
              className="mt-1"
              required
            />
            <label htmlFor="consent">
              I consent to receive booking-related updates via text and email from Austin Rental Boats.
            </label>
          </div>

          <button
            type="submit"
            className={`w-full py-3 font-semibold rounded transition ${
              consent
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!consent}
          >
            Submit Waiver
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-700 font-medium">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
