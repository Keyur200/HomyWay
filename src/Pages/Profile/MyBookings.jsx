import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { differenceInCalendarDays, format } from 'date-fns'
import { api } from '../../api'
import { AuthContext } from '../../Context/AuthProvider'
import { FaStar } from 'react-icons/fa';

const MyBookings = () => {
    const [data, setdata] = useState([])
    const { user } = useContext(AuthContext)

    const getData = async () => {
        await axios.get(`${api}/Bookings/user/${user?.id}`)
            .then(({ data }) => {
                setdata(data)
                console.log(data)
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
                            {difference < 0 && (
                                <h2 className='absolute top-2 right-0 bg-[#FF385C] text-white py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                    Expired
                                </h2>
                            )}
                            <p hidden>{difference2 = differenceInCalendarDays(new Date(v?.checkkin), new Date(currentDate))}</p>
                            {difference2 > 0 && (
                                <h2 className='absolute top-2 right-0 bg-[#a2db12] text-white py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                    Upcoming
                                </h2>
                            )}

                            {difference < 0 && (
                                <button
                                    onClick={() => handleOpen(v?.propertyId)}
                                    className="absolute bottom-2 right-2 flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    <FaStar className="text-white text-xs md:text-sm" />
                                    Add Review
                                </button>
                            )}
                        </div>
                    ))
                }

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
                                            className={`cursor-pointer text-xl md:text-2xl mx-2 md:mx-3 ${
                                                starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-500'
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
                                    className='h-full outline-[#384fff] border border-[#256eec] rounded-lg py-1 px-2 text-xs md:text-sm' 
                                    required 
                                />
                                <p className='absolute bg-blue-500 bottom-6 right-2 text-white text-xs font-semibold px-1 rounded-md'>
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
                                    className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white text-xs md:text-sm rounded"
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