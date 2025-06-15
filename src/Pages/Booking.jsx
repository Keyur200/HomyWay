import React, { useEffect, useState } from 'react';
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
  ArrowLongRightIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TvIcon from '@mui/icons-material/Tv';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BalconyIcon from '@mui/icons-material/Balcony';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import HotTubIcon from '@mui/icons-material/HotTub';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SecurityIcon from '@mui/icons-material/Security';
import PetsIcon from '@mui/icons-material/Pets';
import SpaIcon from '@mui/icons-material/Spa';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ElevatorIcon from '@mui/icons-material/Elevator';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import Navbar2 from '../Components/Navbar2';
import Footer from '../Components/Footer';

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
  const [propertyAmenities, setPropertyAmenities] = useState([]);

  useEffect(() => {
    if (bookingDetails?.propertyDetails?.amenities) {
      getPropertyAmenities(bookingDetails.propertyDetails.amenities);
    }
  }, [bookingDetails]);

  const getPropertyAmenities = async (amenityIds) => {
    try {
      if (!amenityIds) return;

      // Parse the amenity IDs if they're in string format
      const ids = typeof amenityIds === 'string' ? JSON.parse(amenityIds) : amenityIds;

      if (!Array.isArray(ids) || ids.length === 0) return;

      // Fetch amenities for each ID
      const amenityPromises = ids.map(id =>
        axios.get(`${api}/Amenities/${id}`)
          .then(res => res.data)
          .catch(err => {
            console.error(`Error fetching amenity ${id}:`, err);
            return null;
          })
      );

      const results = await Promise.all(amenityPromises);
      setPropertyAmenities(results.filter(amenity => amenity !== null));
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    if (name.includes('wifi')) return <WifiIcon />;
    if (name.includes('parking')) return <LocalParkingIcon />;
    if (name.includes('pool')) return <PoolIcon />;
    if (name.includes('gym') || name.includes('fitness')) return <FitnessCenterIcon />;
    if (name.includes('restaurant') || name.includes('dining')) return <RestaurantIcon />;
    if (name.includes('tv') || name.includes('television')) return <TvIcon />;
    if (name.includes('ac') || name.includes('air') || name.includes('cooling')) return <AcUnitIcon />;
    if (name.includes('laundry') || name.includes('washer')) return <LocalLaundryServiceIcon />;
    if (name.includes('kitchen') || name.includes('refrigerator')) return <KitchenIcon />;
    if (name.includes('balcony') || name.includes('patio')) return <BalconyIcon />;
    if (name.includes('fireplace')) return <FireplaceIcon />;
    if (name.includes('hot tub') || name.includes('jacuzzi')) return <HotTubIcon />;
    if (name.includes('grill') || name.includes('bbq')) return <OutdoorGrillIcon />;
    if (name.includes('beach')) return <BeachAccessIcon />;
    if (name.includes('security') || name.includes('safe')) return <SecurityIcon />;
    if (name.includes('pet')) return <PetsIcon />;
    if (name.includes('spa')) return <SpaIcon />;
    if (name.includes('room') || name.includes('suite')) return <MeetingRoomIcon />;
    if (name.includes('elevator') || name.includes('lift')) return <ElevatorIcon />;
    if (name.includes('smoking')) return <SmokingRoomsIcon />;
    return <HomeIcon className="w-5 h-5" />; // default icon
  };

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar2 />
        <div className="container mx-auto px-4 py-16 text-center">
          <h5 className="text-2xl font-semibold text-gray-800 mb-6">
            No booking details found. Please select a property first.
          </h5>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#b91c1c] text-white rounded-lg hover:bg-[#991b1b] transition-all duration-300 font-medium"
          >
            Return to Home
          </button>
        </div>
        <Footer />
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

            const bookingId = bookingResponse.data.id;

            if (bookingResponse.data) {
              await axios.post(`${api}/PaymentInfoes`, {
                bookingId,
                paymentId : response.razorpay_payment_id,
                paymentMethod : response.razorpay_method || "razorpay online",
                createdDate: new Date().toISOString()
              });

              toast.success("Payment Successful! Booking confirmed.");
              navigate('/profile');
            }
          } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error("Payment Failed. Please try again.");
            navigate('/');
          }
        },
        prefill: {
          name: bookingInfo.name,
          contact: bookingInfo.phone,
          email: bookingInfo.email
        },
        notes: {
          isTestMode: true
        },
        theme: {
          color: "#0288d1"
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
            navigate('/');
          }
        }
      };

      // Test Card Details (shown in toast)
      // toast.info(
      //   "Test Mode: Use these card details:\n" +
      //   "Card: 4111 1111 1111 1111\n" +
      //   "Expiry: Any future date\n" +
      //   "CVV: Any 3 digits\n" +
      //   "Name: Any name\n" +
      //   "OTP: 1111",
      //   { autoClose: 10000 }
      // );

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error("Failed to initiate test payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-[#b91c1c]">
            <h2 className="text-3xl font-bold text-white text-center">
              Confirm Your Booking
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left - Property Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
                <div className="relative">
                  <img
                    src={propertyDetails.image}
                    alt={propertyDetails.name}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">{propertyDetails.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-2" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                    <div className="flex items-center text-gray-700">
                      <MapPinIcon className="w-5 h-5 text-[#b91c1c]" />
                      <span className="font-medium">{propertyDetails.address}</span>
                    </div>
                    <p className="text-gray-500 ml-2">{propertyDetails.city}</p>
                  </div>

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-[#b91c1c]" />
                      <div>
                        <p className="text-sm text-gray-500">Max Guests</p>
                        <p className="font-medium">{propertyDetails.maxGuests} guests</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HomeIcon className="w-5 h-5 text-[#b91c1c]" />
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium">{propertyDetails.bedRoom} rooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MeetingRoomIcon className="text-[#b91c1c]" />
                      <div>
                        <p className="text-sm text-gray-500">Beds</p>
                        <p className="font-medium">{propertyDetails.bed} beds</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LocalLaundryServiceIcon className="text-[#b91c1c]" />
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-medium">{propertyDetails.bathroom} bathrooms</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  {propertyAmenities.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Popular Amenities</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {propertyAmenities.map((amenity) => (
                          <div key={amenity.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                            <span className="text-[#b91c1c]">
                              {getAmenityIcon(amenity.name)}
                            </span>
                            <span className="text-gray-600 font-medium">{amenity.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-gray-600 text-sm font-medium">Price per night</p>
                    <p className="text-3xl font-bold text-[#b91c1c]">₹{propertyDetails.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Booking Details */}
            <div className="space-y-6">
              {/* Stay Duration */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-[#b91c1c] font-semibold mb-4">
                  <CalendarDaysIcon className="w-5 h-5 mr-2" />
                  <span>Stay Duration</span>
                </div>
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <p className="text-gray-500 text-sm font-medium">Check-in</p>
                    <p className="text-gray-800 font-medium">
                      {format(new Date(bookingInfo.checkin), 'PPP')}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowLongRightIcon className="w-6 h-6 text-[#b91c1c]" />
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-sm font-medium">Check-out</p>
                    <p className="text-gray-800 font-medium">
                      {format(new Date(bookingInfo.checkout), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-[#b91c1c] font-semibold mb-4">
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span>Guest Information</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Guest Name</p>
                    <p className="text-gray-800 font-medium">{bookingInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Phone Number</p>
                    <p className="text-gray-800 font-medium">{bookingInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-[#b91c1c] font-semibold mb-4">
                  <MoonIcon className="w-5 h-5 mr-2" />
                  <span>Stay Details</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Number of Guests</p>
                    <p className="text-gray-800 font-medium">{bookingInfo.guests} guests</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Duration</p>
                    <p className="text-gray-800 font-medium">{bookingInfo.nights} nights</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="flex items-center text-[#b91c1c] font-semibold mb-4">
                  <CreditCardIcon className="w-5 h-5 mr-2" />
                  <span>Price Details</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Charges ({bookingInfo.nights} nights)</span>
                    <span>₹{propertyDetails.price * bookingInfo.nights}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Cleaning Fee</span>
                    <span>₹500</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>HomyWay Service Fee</span>
                    <span>₹{bookingInfo.homywayCharges}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-[#b91c1c]">₹{bookingInfo.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePayment}
                  className="flex-1 py-4 bg-[#b91c1c] text-white rounded-xl font-semibold hover:bg-[#991b1b] transition-all duration-300"
                >
                  Confirm and Pay
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 py-4 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
