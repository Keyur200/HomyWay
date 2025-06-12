import React, { useContext } from 'react';
import { Card, CardContent, Typography, Container } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import axios from 'axios';
import { api } from '../api';
import { AuthContext } from '../Context/AuthProvider';
import CustomTooltip from './CustomTooltip';
import '../App.css'


const getBookingCountsByProperty = (bookings) => {
    const map = new Map();
    bookings.forEach((b) => {
        const name = b.property?.propertyName || "Unknown";
        map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map, ([propertyName, bookings]) => ({ propertyName, bookings }));
};



const BookingPerPropertyChart = () => {


    const { user } = useContext(AuthContext)
    const [bookings, setBooking] = React.useState([])

    const getAllBookings = async () => {
        const res = await axios.get(`${api}/Bookings/host/${user?.id}`)
        if (res?.data) {
            setBooking(res?.data)
            console.log(res?.data)
        }
    }

    React.useEffect(() => {
        getAllBookings()
    }, [user?.id])

    const data = getBookingCountsByProperty(bookings);

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ width: '100%', height: 400 }}>
                <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                        Bookings per Property
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data}>
                            <XAxis dataKey="propertyName" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                content={<CustomTooltip />}
                                wrapperStyle={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    boxShadow: 'none',
                                    padding: 0,
                                    margin: 0,
                                    outline: 'none',
                                }}
                            />

                            <Legend />
                            <Bar
                                dataKey="bookings"
                                fill="black"
                                stroke="red"
                                style={{ transition: 'none' }}
                                isAnimationActive={false}
                            />

                        </BarChart>
                    </ResponsiveContainer>

                </CardContent>
            </Card>
        </Container>
    );
};

export default BookingPerPropertyChart;
