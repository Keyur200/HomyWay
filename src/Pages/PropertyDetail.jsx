import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../Context/AuthProvider";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { toast } from "react-toastify";
import { IoMdGrid } from "react-icons/io";
import { FaStar, FaRegStar } from "react-icons/fa";
import { RiCloseLargeFill, RiCloseLargeLine, RiArrowLeftSLine } from "react-icons/ri";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { GoogleMap, OverlayView, InfoWindow, LoadScript, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';

const BlockedDay = styled(PickersDay)(({ theme }) => ({
  backgroundColor: '#b0dcf3',
  color: 'white',
  '&:hover': {
    backgroundColor: '#b0dcf3',
  },
}));

const PropertyDetail = () => {
  const [checkin, setCheckin] = useState("");
  const [checkout, setcheckout] = useState("");
  const [numberofguests, setnumberofguests] = useState(1);
  const [name, setName] = useState();
  const [phone, setphone] = useState();
  const [bookedDates, setBookedDates] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { slug } = useParams();

  const [property, setProperty] = useState();
  const [photos, setPhotos] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // Fetch booked dates for the property
  const getBookedDates = async (propertyId) => {
    try {
      const response = await axios.get(`${api}/Bookings/property/${propertyId}`);
      if (response.data) {
        // Create array of all booked dates
        const allBookedDates = response.data.flatMap(booking => {
          const start = new Date(booking.checkkin);
          const end = new Date(booking.checkout);
          // Include both check-in and check-out dates in the range
          return eachDayOfInterval({
            start: start,
            end: end
          }).map(date => {
            // Format date to YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          });
        });
        setBookedDates(allBookedDates);
        console.log(allBookedDates);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  let numberOfdays = 0;
  if (checkin && checkout) {
    numberOfdays = differenceInCalendarDays(
      new Date(checkout),
      new Date(checkin)
    );
  }
  const today = new Date();
  const month = today.getUTCMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const currentDate = year + "-" + month + "-" + date;
  let homywayCharges = property?.propertyPrice * 0.10;
  let totalPrice = property?.propertyPrice * numberOfdays + 500 + homywayCharges;

  const getPropertyBySlug = async () => {
    const res = await axios.get(`${api}/Property/slugName/${slug}`);
    if (res?.data) {
      setProperty(res?.data);
      getBookedDates(res?.data?.propertyId);
    }
  };

  useEffect(() => {
    getPropertyBySlug();
  }, [slug]);

  useEffect(() => {
    getAllReviews()
  }, [property])

  // Function to check if a date is booked
  const isDateBooked = (dateStr) => {
    return bookedDates.includes(dateStr);
  };

  // Function to disable dates in the date picker
  const disableDates = () => {
    const today = new Date().toISOString().split('T')[0];
    let dateList = '';

    // Add all booked dates to the disabled list
    bookedDates.forEach(date => {
      dateList += `${date},`;
    });

    return dateList.slice(0, -1); // Remove last comma
  };

  // Custom styles for the date input to show booked dates
  const getDateInputStyle = (date) => {
    if (isDateBooked(date)) {
      return "bg-red-100 cursor-not-allowed opacity-50";
    }
    return "";
  };

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    if (!date) return false;

    // Check if date is in the past
    const today = dayjs().startOf('day');
    if (date.isBefore(today)) {
      return true;
    }

    // Check if date is in booked dates
    const dateStr = date.format('YYYY-MM-DD');
    return bookedDates.includes(dateStr);
  };

  // Check if selected range includes any blocked date
  const isRangeValid = (start, end) => {
    if (!start || !end) return true;

    // Check if start date is in the past
    const today = dayjs().startOf('day');
    if (start.isBefore(today)) {
      return false;
    }

    // Check each date in the range including start and end dates
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      if (isDateBlocked(current)) return false;
      current = current.add(1, 'day');
    }
    return true;
  };

  // Handle date range change
  const handleDateRangeChange = (newValue) => {
    const [start, end] = newValue;

    // Check if dates are in the past
    const today = dayjs().startOf('day');
    if (start && start.isBefore(today)) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    // Only allow if both dates are selected and range is valid
    if (start && end && !isRangeValid(start, end)) {
      toast.error("Some dates in this range are already booked");
      return;
    }

    setDateRange(newValue);
    setCheckin(start ? start.format('YYYY-MM-DD') : '');
    setcheckout(end ? end.format('YYYY-MM-DD') : '');
  };

  useEffect(() => {
    setName(user?.name);
    setphone(user?.phone);
  }, [user]);

  const booking = async () => {
    if (numberOfdays <= 0) {
      toast.error("Please select valid check-in and check-out dates.");
      return;
    }
    if (numberOfdays < 0 || difference < 0) {
      toast.error("Please choose the future dates.");
      return;
    }
    try {
      // Create booking details object
      const bookingDetails = {
        propertyDetails: {
          id: property?.propertyId,
          name: property?.propertyName,
          address: property?.propertyAddress,
          city: property?.propertyCity,
          price: property?.propertyPrice,
          image: property?.imagesNavigation?.[0]?.imageUrl
        },
        bookingInfo: {
          checkin,
          checkout,
          guests: numberofguests,
          nights: numberOfdays,
          name,
          phone,
          totalPrice,
          homywayCharges,
          userId: user?.id
        }
      };

      // Navigate to booking page with details
      navigate('/booking', {
        state: { bookingDetails }
      });

    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error("Failed to process booking.");
    }
  };

  let difference = differenceInCalendarDays(
    new Date(checkin),
    new Date(currentDate)
  );

  if (numberOfdays < 0 || difference < 0) {
    toast.error("Please choose the future dates.");
  }

  const handleReset = () => {
    setCheckin("");
    setcheckout("");
    setnumberofguests(1);
    numberOfdays = 0;
    totalPrice = 0;
  };

  const [reviews, setReviews] = useState([])
  const getAllReviews = async () => {
    const res = await axios.get(`${api}/Reviews/property/${property?.propertyId}`)
    if (res?.data) {
      setReviews(res?.data)
    }
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length ? totalRating / reviews.length : 0;
  const roundedRating = Math.floor(avgRating);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: parseFloat(property?.latitude),
    lng: parseFloat(property?.longitude)
  };

  useEffect(() => {
    handleLoad()
  }, [center])

  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLoad = () => {
    setMapLoaded(true);
  };


  return (
    <div className="w-full relative min-h-screen bg-[#f9f9f9] text-[#4f4f4f] mt-12">
      {/* Back Navigation */}
      <Link
        to="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-white bg-[#1e1e1e] px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-[#2a2a2a] transition-all duration-300 z-10 group text-sm md:text-base"
      >
        <RiArrowLeftSLine className="text-xl md:text-2xl text-[#b91c1c] group-hover:transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </Link>

      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-40 py-3 md:py-5 flex flex-col items-start">
        {/* Property Title */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 md:mb-3 text-[#b91c1c]">
            {property?.propertyName}
          </h2>
        </div>

        {/* Image Gallery */}
        {property?.imagesNavigation?.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 h-[250px] sm:h-[300px] md:h-[450px] gap-2 mt-2 md:mt-4 rounded-xl overflow-hidden relative">
            {/* Main Image */}
            <div className="overflow-hidden h-full">
              <img
                src={property.imagesNavigation[0]?.imageUrl}
                className="w-full h-full overflow-hidden hover:scale-110 transition-all duration-300 cursor-pointer object-cover"
                alt="Property"
              />
            </div>

            {/* Side Images Grid */}
            <div className="hidden md:grid grid-rows-2 gap-2 h-full overflow-hidden">
              <div className="grid grid-cols-2 gap-2 overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={property?.imagesNavigation[1]?.imageUrl}
                    className="h-full w-full hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden object-cover"
                    alt=""
                  />
                </div>
                <div className="overflow-hidden">
                  <img
                    src={property?.imagesNavigation[2]?.imageUrl}
                    className="h-full w-full hover:scale-110 transition-all duration-300 cursor-pointer object-cover"
                    alt=""
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={property?.imagesNavigation[3]?.imageUrl}
                    className="h-full w-full hover:scale-110 transition-all duration-300 cursor-pointer overflow-hidden object-cover"
                    alt=""
                  />
                </div>
                <div className="overflow-hidden">
                  <img
                    src={property?.imagesNavigation[4]?.imageUrl}
                    className="h-full w-full hover:scale-110 transition-all duration-300 cursor-pointer object-cover"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* Show All Photos Button */}
            <button
              onClick={() => setPhotos(!photos)}
              className="absolute flex gap-1 md:gap-2 items-center bottom-3 right-3 md:bottom-5 md:right-5 border-2 border-black rounded-lg md:rounded-xl bg-white hover:bg-gray-200 transition-all text-black duration-300 p-1.5 md:p-2 cursor-pointer font-medium md:font-semibold text-sm md:text-base"
            >
              <IoMdGrid className="text-lg md:text-xl" />
              <span className="hidden sm:inline">Show all photos</span>
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row w-full mt-4 md:mt-6 gap-4 md:gap-6">
          {/* Left Column - Property Details */}
          <div className="w-full lg:w-[65%] p-4 md:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col items-start">
              <span className="text-lg md:text-xl lg:text-2xl font-semibold text-[#b91c1c]">
                {property?.propertyAddress}
              </span>
              <span className="text-sm md:text-base lg:text-lg text-[#6b6b6b]">
                {property?.maxGuests} guests · {property?.bed} beds
              </span>
            </div>

            <hr className="border-[1px] w-full my-5 md:my-7" />

            {/* Host Info */}
            <div className="flex gap-3 md:gap-5 items-center">
              <div className="bg-black px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-white text-sm md:text-base lg:text-lg uppercase rounded-full font-bold">
                {property?.host?.name[0]}
              </div>
              <div>
                <span className="text-base md:text-lg lg:text-xl font-semibold">
                  Hosted By {property?.host?.name}
                </span>
              </div>
            </div>

            <hr className="border-[1px] w-full my-5 md:my-7" />

            {/* Description */}
            <div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6">Description</h2>
              <div
                className="text-justify ml-0 md:ml-6 text-sm md:text-base lg:text-lg"
                dangerouslySetInnerHTML={{
                  __html: property?.propertyDescription,
                }}
              ></div>
            </div>

            <hr className="border-[1px] w-full my-5 md:my-7" />

            {/* House Rules */}
            <div className="flex flex-col text-start">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6">Things to know</h2>
              <div className="flex flex-col pl-0 md:pl-6 gap-1">
                <h4 className="text-base md:text-lg font-semibold mb-2">House rules</h4>
                <h6 className="text-sm md:text-base font-light flex gap-1">
                  Check-in after{" "}
                  <p className="font-semibold"> {property?.bedRoom}</p>
                </h6>
                <h6 className="text-sm md:text-base font-light flex gap-1">
                  Check-out before{" "}
                  <p className="font-semibold"> {property?.bathroom}</p>
                </h6>
                <h6 className="text-sm md:text-base font-light flex gap-1">
                  <p className="font-semibold"> {property?.maxGuests}</p> guests maximum
                </h6>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="w-full lg:w-[35%] mt-4 lg:mt-0">
            {user ? (
              <div className="sticky top-6 border border-[#e1e1e1] rounded-xl p-4 md:p-6 shadow-xl bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg md:text-xl lg:text-2xl flex gap-1 font-semibold items-end">
                    ₹ {property?.propertyPrice}{" "}
                    <p className="text-sm md:text-base lg:text-lg font-light m-0">/ night</p>
                  </h2>
                  {checkin && checkout && numberofguests && numberOfdays > 0 && totalPrice > 0 && (
                    <button
                      onClick={handleReset}
                      className="bg-[#b91c1c] text-white font-semibold px-3 md:px-4 py-2 rounded-full hover:bg-[#b91c1c] transition-colors duration-200 text-sm md:text-base"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                {/* Booking Form */}
                <div className="flex flex-col mt-4 border border-[#B0B0B0] rounded-xl overflow-hidden">
                  {/* Date Inputs */}
                  <div className="grid grid-cols-1">
                    <div className="flex flex-col p-3">
                      <p className="text-xs pb-1 font-bold uppercase">Select Dates</p>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['MultiInputDateRangeField']}>
                          <DateRangePicker
                            slots={{ field: MultiInputDateRangeField }}
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            shouldDisableDate={isDateBlocked}
                            minDate={dayjs().startOf('day')}
                            localeText={{ start: 'Check-in', end: 'Check-out' }}
                            slotProps={{
                              day: (ownerState) => {
                                const isBlocked = isDateBlocked(ownerState.day);
                                if (isBlocked) {
                                  return {
                                    disabled: true,
                                    children: (
                                      <BlockedDay
                                        {...ownerState}
                                        day={ownerState.day}
                                        outsideCurrentMonth={ownerState.outsideCurrentMonth}
                                      />
                                    ),
                                  };
                                }
                                return {};
                              },
                              textField: {
                                className: "w-full px-3 py-2 text-sm text-white-800 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] transition-colors"
                              }
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </div>
                  </div>

                  {/* Guests Input */}
                  <div className="border-t border-[#B0B0B0] p-3">
                    <p className="text-xs pb-1 font-bold uppercase">Guests</p>
                    <input
                      type="number"
                      value={numberofguests}
                      onChange={(e) => setnumberofguests(e.target.value)}
                      min={1}
                      max={property?.maxGuests}
                      placeholder="Number of guests"
                      className="w-full px-3 py-2 text-sm text-gray-800 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] transition-colors"

                    />
                  </div>

                  {/* Guest Information */}
                  {checkin && checkout && (
                    <div className="border-t border-[#B0B0B0] p-3 space-y-3">
                      <div>
                        <p className="text-xs pb-1 font-bold uppercase">Your full name</p>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 text-sm text-gray-800 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-xs pb-1 font-bold uppercase">Phone number</p>
                        <input
                          type="number"
                          min={1111111111}
                          max={9999999999}
                          value={phone}
                          onChange={(e) => setphone(e.target.value)}
                          placeholder="Phone number"
                          className="w-full px-3 py-2 text-sm text-gray-800 border border-[#b91c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b91c1c] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Price Details */}
                  {checkin && checkout && (
                    <div className="border-t border-[#B0B0B0] p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-base">Cleaning fees</span>
                        <span className="font-bold text-[#b91c1c]">₹ 500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base">HomyWay Charges</span>
                        <span className="font-bold text-[#b91c1c]">₹ {homywayCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base">Total nights</span>
                        <span className="font-bold text-[#b91c1c]">
                          {numberOfdays > 0 && difference > -1 ? numberOfdays : "0"}
                        </span>
                      </div>
                      <hr className="border-[1px] my-2" />
                      <div className="flex justify-between">
                        <span className="text-base font-semibold">Total Price</span>
                        <span className="font-bold text-[#b91c1c]">
                          ₹ {numberOfdays > 0 && difference > -1 ? totalPrice : "0"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                {checkin && checkout && totalPrice > 0 ? (
                  <button
                    onClick={booking}
                    className="w-full bg-[#b91c1c] text-white font-semibold py-3 text-lg mt-4 rounded-full hover:bg-[#b91c1c] transition-colors flex gap-3 items-center justify-center"
                  >
                    Book Now
                    <span className="text-base">
                      {numberOfdays > 0 && difference > -1 ? "₹ " + totalPrice : ""}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-[#b91c1c] opacity-70 cursor-not-allowed text-white font-semibold py-3 text-lg mt-4 rounded-full flex gap-1 items-center justify-center"
                  >
                    Book Now
                    <span className="text-base">
                      {numberOfdays > 0 ? "₹" + totalPrice : ""}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-center flex-col items-center p-4 md:p-6 bg-white rounded-xl shadow-xl border border-[#e1e1e1]">
                <h2 className="text-lg md:text-xl lg:text-2xl text-red-500 font-bold text-center mb-4 md:mb-6">
                  Please login to book...
                </h2>
                <Link
                  to="/login"
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-full py-2 px-4 md:px-6 font-semibold text-base md:text-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        <hr className='border-[1px] w-full my-5 md:my-7' />

        {/* Reviews Section */}
        <div className='w-full flex flex-col'>
          <h2 className='text-xl md:text-2xl font-semibold flex gap-2 items-center'>
            <FaStar />{avgRating} Ratings • {reviews?.length} Reviews
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-6 mt-6 md:mt-8'>
            {reviews?.map((v) => (
              <div className='w-full flex flex-col mb-4 md:mb-0'>
                <div className='flex gap-2 md:gap-3 items-center'>
                  <div className='bg-black px-3 md:px-5 py-2 md:py-3 text-white text-base md:text-lg uppercase rounded-full font-bold'>
                    {v?.user?.name[0]}
                  </div>
                  <span className='text-lg md:text-xl font-semibold'>{v?.user?.name}</span>
                </div>
                <div className='flex flex-col mt-2 md:mt-3'>
                  <div>
                    {v?.rating !== undefined && (
                      <span className="flex items-center gap-2 text-base md:text-lg font-light">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) =>
                            i < v.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                          )}
                        </div>
                        • {v.star} {v.star === 1 ? 'star' : 'stars'}
                      </span>
                    )}
                  </div>
                  <span className='text-base md:text-lg text-[#404040] mt-1'>{v.review1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className='border-[1px] w-full my-5 md:my-7' />

        {/* Map Section */}
        <div className='w-full flex flex-col items-center'>
          <div className="w-full overflow-hidden rounded-xl md:rounded-2xl shadow-lg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              onLoad={handleLoad}
            >
              {property && center && (
                <OverlayView
                  position={center}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div className="transform -translate-x-1/2 -translate-y-full flex flex-col items-center">
                    {/* Info Box */}
                    <div className="w-[180px] md:w-[220px] p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg bg-white text-gray-800">
                      <img
                        src={property?.imagesNavigation[0]?.imageUrl}
                        alt={property?.propertyName}
                        className="w-full h-[80px] md:h-[100px] object-cover rounded-xl md:rounded-2xl mb-2"
                      />
                      <h2 className="text-base md:text-lg font-semibold truncate">
                        {property?.propertyName}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-600">Your Location</p>
                    </div>

                    {/* Down Arrow */}
                    <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white shadow-sm"></div>
                  </div>
                </OverlayView>


              )}
            </GoogleMap>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {photos && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex flex-col gap-2 md:gap-4">
              {property?.imagesNavigation?.map((image, index) => (
                <img
                  key={index}
                  src={image.imageUrl}
                  className="w-full h-auto object-contain"
                  alt={`Property image ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setPhotos(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl font-medium md:font-semibold flex items-center gap-1 md:gap-2 hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              <RiCloseLargeFill className="text-lg md:text-xl" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
