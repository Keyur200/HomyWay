import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { differenceInCalendarDays, format } from 'date-fns'
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthProvider'
import { api } from '../api';

const AllBookings = () => {
    const [data, setdata] = useState([])
    const { user } = useContext(AuthContext)

    const getData = async () => {
        await axios.get(`${api}/Bookings/host/${user?.id}`)
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
    let difference3 = 0

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



    return (
        <div className='flex flex-col py-5 md:py-10 px-4 md:px-20 lg:px-40'>
            <h2 className='text-xl md:text-2xl font-semibold mb-4 md:mb-6'>All Bookings</h2>
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

                                if (checkoutDate < today) {
                                    return (
                                        <h2 className='absolute top-2 right-0 bg-[#ff5574] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Expired
                                        </h2>
                                    );
                                } else if (checkinDate > today) {
                                    return (
                                        <h2 className='absolute top-2 right-0 bg-[#17ddf7] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Upcoming
                                        </h2>
                                    );
                                } else {
                                    return (
                                        <h2 className='absolute top-2 right-0 bg-[#a2db12] text-black py-1 px-3 rounded-s-xl text-xs md:text-sm font-semibold'>
                                            Active
                                        </h2>
                                    );
                                }
                            })()}



                            {/* {difference < 0 && (
                                    <button
                                        onClick={() => handleOpen(v?.propertyId)}
                                    className="absolute bottom-2 right-2 flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                    <FaStar className="text-white text-xs md:text-sm" />
                                        Add Review
                                    </button>
                            )} */}
                        </div>
                    ))
                }


            </div>
        </div>
    )
}

export default AllBookings