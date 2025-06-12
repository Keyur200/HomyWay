import { Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: 'transparent',
                    border: '1px solid red',
                    color: 'red',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                }}
            >
                {`Bookings: ${payload[0].value}`}
            </div>
        );
    }

    return null;
};

export default CustomTooltip