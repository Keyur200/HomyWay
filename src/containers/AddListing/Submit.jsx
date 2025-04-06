import React, { useState } from 'react'
import { addListingResetAction } from './AddListingAction';
import SaveHotelData from './SaveHotelData';
import { useStateMachine } from 'little-state-machine';
import axios from 'axios';
import { api } from '../../api';

const Submit = ({ setStep }) => {
    const { actions, state } = useStateMachine({ addListingResetAction });
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        try{
            await axios.post(`${api}Property`,state.data)
            actions.addListingResetAction();
            setStep(1);
        }catch{
            setError("Error submitting data. Please try again.");
        }
    }
    return (
        <div>
            <h2>Review & Submit</h2>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="button" onClick={() => setStep(2)}>Back</button>
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}

export default Submit