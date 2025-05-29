import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import {Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { AuthContext } from '../Context/AuthProvider'
import { differenceInCalendarDays } from 'date-fns'
import { toast } from 'react-toastify';
import { IoMdGrid } from 'react-icons/io'
import { RiCloseLargeFill, RiCloseLargeLine } from 'react-icons/ri'

const PropertyDetail = () => {
    const [checkin, setCheckin] = useState('')
    const [checkout, setcheckout] = useState('')
    const [numberofguests, setnumberofguests] = useState(1)
    const [name, setName] = useState()
    const [phone, setphone] = useState()
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const { slug } = useParams()

    const [property, setProperty] = useState()
    const [photos, setPhotos] = useState(false)

    let numberOfdays = 0;
    if (checkin && checkout) {
        numberOfdays = differenceInCalendarDays(new Date(checkout), new Date(checkin))
    }
    const today = new Date()
    const month = today.getUTCMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = year + "-" + month + "-" + date;
    let totalPrice = property?.propertyPrice * numberOfdays + 500

    const getPropertyBySlug = async () => {
        const res = await axios.get(`${api}/Property/slugName/${slug}`)
        if (res?.data) {
            setProperty(res?.data)
            console.log(res?.data)
        }
    }

    useEffect(() => {
        getPropertyBySlug()
    }, [slug])

    let difference = differenceInCalendarDays(new Date(checkin), new Date(currentDate))

    if (numberOfdays < 0 || difference < 0) {
        toast.error("Please choose the future dates.")
    }

    const handleReset = () => {
        setCheckin('')
        setcheckout('')
        setnumberofguests(1)
        numberOfdays = 0
        totalPrice = 0
    }

    useEffect(() => {
        setName(user?.name)
        setphone(user?.phone)
    }, [user])

    const booking = async () => {
        const res = await axios.post(`${api}/Bookings`, { userId: user?.id, propertyId: property?.propertyId, checkkin: checkin, checkout: checkout, guests: numberofguests, nights: numberOfdays, name: name, phone: phone, amount: totalPrice })
        if (res) {
            toast.success("Booking done.")
        }
    }
    return (
        <div className='w-full relative'>
            <div className='w-full px-40 py-5 flex flex-col items-start'>
                <div className='flex justify-between items-center w-full pr-6'>
                    <h2 className='text-3xl font-semibold mb-3'>{property?.propertyName}</h2>
                </div>
                {property?.imagesNavigation?.length > 0 && (
                    <div className=' w-full grid grid-cols-2 h-[450px] gap-2 mt-4 rounded-xl overflow-hidden relative'>
                        <div className='overflow-hidden'>
                            <img
                                src={property.imagesNavigation[0].imageUrl}
                                className='w-full overflow-hidden hover:scale-110 transition-all duration-300 cursor-pointer h-full object-cover'
                                alt="Property"
                            />
                        </div>
                        <div className='grid grid-rows-2 gap-2 h-full overflow-hidden'>
                            <div className='grid grid-cols-2 gap-2 overflow-hidden'>
                                <div className='overflow-hidden'>
                                    <img src={property?.imagesNavigation[1]?.imageUrl} className='h-full w-full hover:scale-110  transition-all duration-300 cursor-pointer overflow-hidden  object-cover' alt="" />
                                </div>
                                <div className='overflow-hidden'>
                                    <img src={property?.imagesNavigation[2]?.imageUrl} className='h-full w-full hover:scale-110  transition-all duration-300 cursor-pointer object-cover' alt="" />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-2 overflow-hidden'>
                                <div className='overflow-hidden'>
                                    <img src={property?.imagesNavigation[3]?.imageUrl} className='h-full w-full  hover:scale-110  transition-all duration-300 cursor-pointer overflow-hidden  object-cover' alt="" />
                                </div>
                                <div className='overflow-hidden'>
                                    <img src={property?.imagesNavigation[4]?.imageUrl} className='h-full w-full  hover:scale-110  transition-all duration-300 cursor-pointer object-cover' alt="" />
                                </div>
                            </div>
                        </div>
                        <div onClick={() => setPhotos(!photos)} className=' absolute flex gap-2 items-center bottom-5 right-5 border-2 border-black rounded-xl  bg-white hover:bg-gray-200 transition-all text-black duration-300 p-2 cursor-pointer font-semibold'><IoMdGrid className='text-xl' />Show all photos</div>
                    </div>
                )}
                <div className='flex'>
                    <div className='w-[800px]'>
                        <div className='flex flex-col mt-6 items-start'>
                            <span className='text-2xl font-semibold'>{property?.propertyAddress}</span>
                            <span className='text-[#6b6b6b] text-[18px] '>{property?.maxGuests} guests ꞏ {property?.bed} beds</span>
                        </div>
                        <hr className='border-[1px] w-full my-7' />
                        <div className='flex gap-5 items-center'>
                            <div className='bg-black px-6 py-4 text-white text-lg uppercase rounded-full font-bold'>{property?.host?.name[0]}</div>
                            <div>
                                <span className='text-xl font-semibold'>Hosted By {property?.host?.name}</span>
                            </div>
                        </div>
                        <hr className='border-[1px] w-[full] my-7' />
                        <div>
                            <h2 className='text-2xl font-semibold mb-6'>Description</h2>
                            <div className='text-justify ml-6' dangerouslySetInnerHTML={{ __html:  property?.propertyDescription}}></div>
                        </div>
                        {/* <hr className='border-[1px] w-full my-7' /> */}
                        {/* <div className='flex flex-col text-start'>
                            <h2 className='text-2xl font-semibold mb-8'>What this place offers</h2>
                            <div className='grid grid-cols-2 text-start gap-x-12 gap-y-5 ml-6'>
                                {
                                    data?.perks?.map((p) => (
                                        <div className=' text-start  '>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Wifi' ? <FaWifi className='text-3xl' /> : ''} {p === 'Wifi' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Car parking spot' ? <IoCarSport className='text-3xl' /> : ''} {p === 'Car parking spot' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Air conditioning' ? <TbAirConditioning className='text-3xl' /> : ''} {p === 'Air conditioning' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'TV with Prime video' ? <PiTelevisionSimpleBold className='text-3xl' /> : ''} {p === 'TV with Prime video' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Security cameras' ? <BiCctv className='text-3xl' /> : ''} {p === 'Security cameras' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Patio or balcony' ? <MdOutlineBalcony className='text-3xl' /> : ''} {p === 'Patio or balcony' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Private outdoor pool' ? <FaSwimmingPool className='text-3xl' /> : ''} {p === 'Private outdoor pool' && p}</span>
                                            <span className='flex gap-3 items-center text-lg'>{p === 'Pets allowed' ? <MdOutlinePets className='text-3xl' /> : ''} {p === 'Pets allowed' && p}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div> */}
                        <hr className='border-[1px] w-full my-7' />
                        <div className='flex flex-col text-start'>
                            <h2 className='text-2xl font-semibold mb-6'>Things to know</h2>
                            <div className='flex flex-col pl-6 gap-1'>
                                <h4 className='text-lg font-semibold mb-2'>House rules</h4>
                                <h6 className=' font-light flex gap-1 '>Check-in after <p className='font-semibold'> {property?.bedRoom}</p></h6>
                                <h6 className=' font-light flex gap-1'>Check-out before <p className='font-semibold'> {property?.bathroom}</p></h6>
                                <h6 className=' font-light flex gap-1'> <p className='font-semibold'> {property?.maxGuests}</p> guests maximum</h6>
                            </div>
                        </div>
                    </div>
                    <div className='w-[40%] py-10 pl-20'>
                        {
                            user && (
                                <div className='sticky top-6 border border-[#e1e1e1] rounded-xl p-6 shadow-xl'>
                                    <div className='flex justify-between'>
                                        <h2 className='text-2xl flex gap-1 font-semibold items-end'>₹ {property?.propertyPrice} <p className='text-lg font-light m-0'>/ night</p></h2>
                                        {
                                            checkin && checkout && numberofguests && numberOfdays > 0 && totalPrice > 0 && (
                                                <button onClick={handleReset} className='bg-[#ff385c] text-white font-semibold px-3 rounded-full hover:bg-pink-600'>Reset All</button>
                                            )
                                        }
                                    </div>
                                    <div className='flex flex-col mt-4 border border-[#B0B0B0] rounded-xl overflow-hidden'>
                                        <div className='grid grid-cols-2  cursor-pointer'>
                                            <div className='flex flex-col border-r border-r-[#B0B0B0] p-3'>
                                                <p className='text-xs pb-1 font-bold uppercase'>Check-in</p>

                                                <input type="date" value={checkin} defaultValue={currentDate} onChange={(e) => setCheckin(e.target.value)} className=' cursor-pointer text-black outline-none border rounded-lg' />
                                            </div>
                                            <div className='flex flex-col  p-3 cursor-pointer'>
                                                <p className='text-xs pb-1 font-bold uppercase'>Check-out</p>
                                                <input type="date" value={checkout} onChange={(e) => setcheckout(e.target.value)} className='cursor-pointer text-black outline-none border rounded-lg' />
                                            </div>
                                        </div>
                                        <div className='w-full'>

                                            <div className='flex flex-col border-t border-t-[#B0B0B0] px-3 py-3 '>
                                                <p className='text-xs pb-1 font-bold uppercase'>Guests</p>
                                                <input type="number" value={numberofguests} onChange={(e) => setnumberofguests(e.target.value)} min={1} max={property?.maxGuests} className='h-full text-black outline-[#ff385c] border border-[#e1e0e0]  rounded-lg py-1 px-2' placeholder='0 to 20' />
                                            </div>
                                        </div>
                                        {
                                            checkin && checkout && (
                                                <div className='w-full  border-t py-2 border-t-[#B0B0B0] '>
                                                    <div className='flex flex-col px-3 py-3 '>
                                                        <p className='text-xs pb-1 font-bold uppercase'>Your full name</p>
                                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='h-full outline-[#ff385c] border border-[#e1e0e0] text-black rounded-lg py-1 px-2' />
                                                    </div>
                                                    <div className='flex flex-col px-3 pt-1 pb-3 '>
                                                        <p className='text-xs pb-1 font-bold uppercase'>Phone number</p>
                                                        <input type="number" min={1111111111} max={9999999999} value={phone} onChange={(e) => setphone(e.target.value)} defaultValue={1111111111} className='h-full text-black outline-[#ff385c] border border-[#e1e0e0]  rounded-lg py-1 px-2' placeholder='7845128965' />
                                                    </div>
                                                </div>
                                            )
                                        }
                                        {
                                            checkin && checkout && (

                                                <div className='flex flex-col gap-1 px-3 py-2 border-t border-t-[#B0B0B0]'>
                                                    <div className='flex justify-between'>
                                                        <span className='text-base '>Cleaning fees </span>
                                                        <span className='font-bold text-[#ff385c]'>₹ 500</span>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <span className='text-base '>Total nights </span>
                                                        <span className='font-bold text-[#ff3358]'>{numberOfdays > 0 && difference > -1 ? numberOfdays : '0'}</span>
                                                    </div>
                                                    <hr className='border-[1px] w-full my-1' />
                                                    <div className='flex justify-between'>
                                                        <span className='text-base font-semibold '>Total Price </span>
                                                        <span className='font-bold text-[#ff385c]'>₹ {numberOfdays > 0 && difference > -1 ? totalPrice : '0'}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    {
                                        checkin && checkout && totalPrice > 0 ? (
                                            <button type='submit' onClick={booking} className=' magic bg-[#ff385c] cursor-pointer w-full text-black font-semibold py-3 text-lg my-3 rounded-full flex gap-3 items-center justify-center  ' >Book Now <p className='text-base m-0'> {numberOfdays > 0 && difference > -1 ? "₹ " + totalPrice : ''}</p></button>
                                        ) : (<button className=' magic bg-gradient-to-r from-[#E51D4E] to-[#D90865] cursor-not-allowed w-full text-white font-semibold py-3 text-lg my-3 rounded-full flex gap-1 items-center justify-center ' >Book Now <p className='text-base '> {numberOfdays > 0 ? "₹" + totalPrice : ''}</p></button>)
                                    }
                                </div>

                            )
                        }

                        {
                            !user && (
                                <div className='flex justify-center  flex-col items-center'>
                                    <h2 className='py-10 px-4 text-red-500 text-2xl font-bold'>Please login to checkout ...</h2>
                                    <Link to={'/login'} className='items-center bg-[#ff385c] hover:bg-[#fa244c]  text-white rounded-full py-2 px-5 font-semibold text-lg'>Login </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
                <hr className='border-[1px] w-full my-7' />
                {/* <div className='w-full flex flex-col'>
                    <h2 className='text-2xl font-semibold flex gap-2 items-center'><FaStar />{data?.totalratings} Ratings • {data?.rating?.length} Reviews</h2>
                    <div className='grid grid-cols-2 w-full mt-8'>
                        {
                            data?.rating?.map((v) => (
                                <div className='w-full flex flex-col'>
                                    <div className='flex gap-3 items-center'>
                                        <div className='bg-black px-5 py-3 text-white text-lg uppercase rounded-full font-bold'>{v?.reviewBy?.name[0]}</div>
                                        <span className='text-xl font-semibold'>{v?.reviewBy?.name}</span>
                                    </div>
                                    <div className='flex flex-col mt-3'>
                                        <div>
                                            {v?.star === 5 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 5 ? (<div className='flex gap-1'> <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar /> </div>) : ''} • {v?.star} stars</span>)}
                                            {v?.star === 4 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 4 ? (<div className='flex gap-1'> <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaRegStar /> </div>) : ''} • {v?.star} stars</span>)}
                                            {v?.star === 3 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 3 ? (<div className='flex gap-1'> <FaStar /> <FaStar /> <FaStar /> <FaRegStar /> <FaRegStar /></div>) : ''} • {v?.star} stars</span>)}
                                            {v?.star === 2 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 2 ? (<div className='flex gap-1'> <FaStar /> <FaStar /> <FaRegStar /> <FaRegStar /> <FaRegStar /> </div>) : ''} • {v?.star} stars</span>)}
                                            {v?.star === 1 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 1 ? (<div className='flex gap-1'> <FaStar /> <FaRegStar /> <FaRegStar /> <FaRegStar /> <FaRegStar /> </div>) : ''} • {v?.star} star</span>)}
                                            {v?.star === 0 && (<span className='flex items-center gap-2 text-lg font-light'>{v?.star === 0 ? (<div className='flex gap-1'> <FaRegStar /> <FaRegStar /><FaRegStar /><FaRegStar /> <FaRegStar /> </div>) : ''} • {v?.star} stars</span>)}
                                        </div>
                                        <span className=' text-lg text-[#404040] mt-1'>{v.review}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div> */}
            </div>
            {
                photos && (
                    <div className='absolute w-full bg-black  py-20 flex gap-4 flex-row justify-center top-0 bg-opacity-90 h-[720px]'>
                        <div className='flex flex-col gap-4 overflow-auto no-scrollbar'>
                            {
                                property?.imagesNavigation?.map((i) => (
                                    <img src={i.imageUrl} className='opacity-100 h-[500px] object-contain' alt="" />
                                ))
                            }
                        </div>
                        <button onClick={() => setPhotos(!photos)} className=' bg-white text-black  h-[50px] flex gap-2 items-center font-semibold text-right border-2 px-4 rounded-xl  hover:bg-gray-200 transition-all duration-300 border-black'><RiCloseLargeFill className='text-xl font-bold' /> Close</button>
                    </div>
                )
            }
        </div>
    )
}

export default PropertyDetail