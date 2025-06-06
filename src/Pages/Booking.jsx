import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import { api } from '../api';
import { 
  CalendarDaysIcon, 
  UserIcon, 
  PhoneIcon, 
  MoonIcon, 
  MapPinIcon, 
  HomeIcon, 
  ArrowLongRightIcon 
} from '@heroicons/react/24/outline';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4">
        <h5 className="mt-8 text-xl font-medium">
          No booking details found. Please select a property first.
        </h5>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const { propertyDetails, bookingInfo } = bookingDetails;

  const handlePayment = async () => {
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    try {
      // Format dates properly in ISO format
      const formattedCheckin = new Date(bookingInfo.checkin).toISOString().split('T')[0];
      const formattedCheckout = new Date(bookingInfo.checkout).toISOString().split('T')[0];

      // Test Mode Razorpay Configuration
      const options = {
        key: "rzp_test_b80nHUA7hmlKJ3",
        amount: bookingInfo.totalPrice * 100,
        currency: "INR",
        name: "HomyWay",
        description: `Booking for ${propertyDetails.name}`,
        handler: async function (response) {
          try {
            // Verify payment and create booking
            const bookingResponse = await axios.post(`${api}/Bookings`, {
              userId: bookingInfo.userId,
              propertyId: propertyDetails.id,
              checkkin: formattedCheckin,
              checkout: formattedCheckout,
              guests: bookingInfo.guests,
              nights: bookingInfo.nights,
              name: bookingInfo.name,
              phone: bookingInfo.phone,
              amount: bookingInfo.totalPrice,
              homywayCharges: bookingInfo.homywayCharges,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              createdDate: new Date().toISOString().split('T')[0],
              isTestPayment: true
            });
            console.log(bookingInfo.checkin);

            if (bookingResponse.data) {
              toast.success("Test Payment Successful! Booking confirmed.");
              navigate('/profile');
            }
          } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error("Test Payment Failed. Please try again.");
            navigate('/');
          }
        },
        prefill: {
          name: bookingInfo.name,
          contact: 8141451738,
          email: "test@example.com" // Test email
        },
        notes: {
          isTestMode: true
        },
        theme: {
          color: "#0288d1"
        },
        modal: {
          ondismiss: function() {
            toast.info("Test Payment cancelled");
            navigate('/');
          }
        }
      };

      // Test Card Details (shown in toast)
      toast.info(
        "Test Mode: Use these card details:\n" +
        "Card: 4111 1111 1111 1111\n" +
        "Expiry: Any future date\n" +
        "CVV: Any 3 digits\n" +
        "Name: Any name\n" +
        "OTP: 1111",
        { autoClose: 10000 }
      );

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error("Failed to initiate test payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-500 text-center mb-8">
            Confirm Your Booking
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Property Details */}
            <div className="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <img
                src={propertyDetails.image}
                alt={propertyDetails.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-blue-500 text-xl font-bold">
                    <HomeIcon className="w-6 h-6 mr-2" />
                    <h3>{propertyDetails.name}</h3>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-gray-200">
                      <MapPinIcon className="w-5 h-5 mr-2 text-blue-500" />
                      <span>{propertyDetails.address}</span>
                    </div>
                    <p className="text-gray-400 ml-7">{propertyDetails.city}</p>
                  </div>

                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-blue-500">
                    <p className="text-gray-400 text-sm">Price per night</p>
                    <p className="text-2xl font-bold text-blue-500">₹{propertyDetails.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Booking Details */}
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold text-blue-500 mb-6">Booking Details</h3>

              <div className="space-y-6">
                {/* Stay Duration */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex items-center text-blue-500 font-semibold mb-4">
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    <span>Stay Duration</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Check-in</p>
                      <p className="text-gray-200">
                        {format(new Date(bookingInfo.checkin), 'PPP')}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <ArrowLongRightIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 text-sm">Check-out</p>
                      <p className="text-gray-200">
                        {format(new Date(bookingInfo.checkout), 'PPP')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guest Info */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex items-center text-blue-500 font-semibold mb-4">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <span>Guest Information</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Guest Name</p>
                      <p className="text-gray-200">{bookingInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                      <p className="text-gray-200">{bookingInfo.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
                  <div className="flex items-center text-blue-500 font-semibold mb-4">
                    <MoonIcon className="w-5 h-5 mr-2" />
                    <span>Stay Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Number of Guests</p>
                      <p className="text-gray-200">{bookingInfo.guests} guests</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Duration</p>
                      <p className="text-gray-200">{bookingInfo.nights} nights</p>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-4 bg-blue-500 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total Amount</span>
                    <span className="text-2xl font-bold">₹{bookingInfo.totalPrice}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePayment}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Confirm and Pay
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
