import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { differenceInCalendarDays, format } from 'date-fns'
import { api } from '../../api'
import { AuthContext } from '../../Context/AuthProvider'
import { FaStar } from 'react-icons/fa';
import { MdCancel } from "react-icons/md";
import { toast } from 'react-toastify'

const MyBookings = () => {
    const [data, setdata] = useState([])
    const { user } = useContext(AuthContext)

    const getData = async () => {
        await axios.get(`${api}/Bookings/user/${user?.id}`)
            .then(({ data }) => {
                setdata(data)
            })
    }

    const today = new Date()
    const month = today.getUTCMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;
    let difference = 0
    let difference2 = 0

    useEffect(() => {
        getData()
    }, [])

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState('');
    const [propertyId, setPropertyId] = useState(0)

    const handleOpen = (id) => {
        setShowModal(true)
        setPropertyId(id)
    }

    const handleSubmit = async () => {
        const res = await axios.post(`${api}/Reviews`, { rating, review1: review, userId: user?.id, propertyId })
        if (res) {
            setShowModal(false);
            setRating(0);
            setReview('');
        }

    };

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const handleCancelTrip = async (id) => {
        const res = await axios.delete(`${api}/Bookings/${id}`)
        if(res){
            toast.info("Yo have cancelled your trip.")
            getData()
        } 
    }

    return (
        <div className='flex flex-col py-5 md:py-10 px-4 md:px-20 lg:px-40'>
            <h2 className='text-xl md:text-2xl font-semibold mb-4 md:mb-6'>My Bookings</h2>
            <div className='flex flex-col gap-4 md:gap-6'>
                {
                    data?.map((v) => (
                        <div className='group overflow-hidden relative rounded-xl flex flex-col md:flex-row gap-3 md:gap-5 border border-[#e9e8e8] cursor-pointer'>
                            <div className='overflow-hidden w-full md:w-auto md:h-full'>
                                <img
                                    src={v?.property?.imagesNavigation[0]?.imageUrl}
                                    alt=""
                                    className='h-[200px] md:h-[180px] w-full md:w-[250px] object-cover transition-all duration-300 hover:scale-110'
                                />
                            </div>

                            <div className='flex flex-col gap-1 p-3 md:py-2'>
                                <span className='text-base md:text-lg text-[#909090] font-semibold'>
                                    Booked by {v?.name}
                                </span>
                                <span className='text-sm md:text-base text-[#909090] font-light flex gap-1 items-center'>
                                    {v?.nights} night ꞏ {v?.guests} guests
                                </span>
                                <span className='text-base md:text-lg font-semibold flex gap-1 items-center'>
                                    ₹ {v?.amount}
                                    <p className='text-sm md:text-base font-bold text-[#FF385C] ml-1'> ✓</p>
                                </span>
                                <span className='text-sm md:text-base font-semibold text-[#959595] flex flex-wrap gap-1 items-center'>
                                    {format(v?.checkkin, 'dd/MM/yyyy')} » {format(v?.checkout, 'dd/MM/yyyy')}
                                </span>
                                <span className='text-sm md:text-base font-semibold break-words'>
                                    {v?.property?.propertyName} ꞏ
                                    <span className='text-xs md:text-sm font-semibold text-[#797979] ml-1'>
                                        {v?.property?.propertyAdderss}
                                    </span>
                                </span>
                            </div>

                            <p hidden>{difference = differenceInCalendarDays(new Date(v?.checkout), new Date(currentDate))}</p>
                            {(() => {
                                const checkinDate = new Date(v?.checkkin);
                                const checkoutDate = new Date(v?.checkout);
                                const today = new Date(currentDate);
                                const difference = checkoutDate - today;

                                let statusLabel = null;
                                let actionButton = null;

                                if (checkoutDate < today) {
                                    statusLabel = (
                                        <h2 className='absolute top-2 right-0 bg-[#ff5574] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Expired
                                        </h2>
                                    );
                                    actionButton = (
                                        <button
                                            onClick={() => handleOpen(v?.propertyId)}
                                            className="absolute bottom-2 right-2 flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:shadow-xl"
                                        >
                                            <FaStar className="text-white text-xs md:text-sm" />
                                            Add Review
                                        </button>
                                    );
                                } else if (checkinDate > today) {
                                    statusLabel = (
                                        <h2 className='absolute top-2 right-0 bg-[#17ddf7] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Upcoming
                                        </h2>
                                    );
                                    actionButton = (
                                        <button
                                            onClick={() => {
                                                setShowCancelModal(true);
                                                setSelectedBookingId(v?.id);
                                            }}
                                            className="absolute bottom-2 right-2 flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:shadow-xl"
                                        >
                                            <MdCancel className="text-white text-base md:text-lg" />
                                            Cancel Trip
                                        </button>
                                    );
                                } else {
                                    statusLabel = (
                                        <h2 className='absolute top-2 right-0 bg-[#a2db12] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Active
                                        </h2>
                                    );
                                }

                                return (
                                    <>
                                        {statusLabel}
                                        {actionButton}
                                    </>
                                );
                            })()}
                        </div>
                    ))
                }

                {showCancelModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
                        <div className="bg-black rounded-xl p-6 w-80 shadow-2xl text-center space-y-4">
                            <h2 className="text-lg font-semibold text-gray-300">Cancel this trip?</h2>
                            <p className="text-sm text-white">Are you sure you want to cancel this booking?</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={() => {
                                        handleCancelTrip(selectedBookingId);
                                        setShowCancelModal(false);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Review Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                        <div className="bg-[#121212] text-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-base md:text-lg font-semibold mb-4">Leave a Review</h2>

                            {/* Star Rating */}
                            <div className="flex justify-center mb-4">
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <span
                                            key={index}
                                            className={`cursor-pointer text-xl md:text-2xl mx-2 md:mx-3 ${starValue <= (hover || rating) ? 'text-[#ff4538]' : 'text-gray-500'
                                                }`}
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHover(starValue)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            ★
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Review Textarea */}
                            <div className='flex flex-col pb-4 relative'>
                                <p className='text-xs pb-1 font-bold uppercase'>Type your review</p>
                                <textarea
                                    type="text"
                                    rows={5}
                                    value={review}
                                    maxLength={300}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder='add review ...'
                                    className='h-full outline-[#ff4538] border border-[#ff4538] rounded-lg py-1 px-2 text-xs md:text-sm'
                                    required
                                />
                                <p className='absolute bg-[#ff4538] bottom-6 right-2 text-white text-xs font-semibold px-1 rounded-md'>
                                    {review ? review?.length : "0"} / 300
                                </p>
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-700 text-white text-xs md:text-sm rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white bg-[#ff4538]  text-xs md:text-sm rounded"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    )
}

export default MyBookings