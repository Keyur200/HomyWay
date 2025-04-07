import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import { api } from '../../api';

const DemoListing = () => {
    const {user} = useContext(AuthContext)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [guests, setGuests] = useState("");
    const [bedroom, setBedroom] = useState("");
    const [bed, setBed] = useState("");
    const [bathroom, setBathroom] = useState("");
    const [price, setPrice] = useState("");
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const formData = new FormData();
    formData.append("hostId", user?.id);
    formData.append("propertyName", description);
    formData.append("propertyDescription", description);
    formData.append("propertyAdderss", address);
    formData.append("propertyCity", city);
    formData.append("propertyState", state);
    formData.append("propertyCountry", country);
    formData.append("maxGuests", guests);
    formData.append("bedRoom", bedroom);
    formData.append("bed", bed);
    formData.append("bathroom", bathroom);
    formData.append("status", "Pending");
    formData.append("propertyPrice", price);
    formData.append("categoryId", 2);
    files.forEach((file) => formData.append("files", file));

    const handleUpload = async () => {
        const res = await axios.post(`${api}Property`, formData, {headers : {"Content-Type":"multipart/form-data"}})
        console.log(res.data)
    }
    return (
        <div>
            <input type="text" placeholder="Property Name" onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="address" onChange={(e) => setAddress(e.target.value)} />
            <input type="text" placeholder="city" onChange={(e) => setCity(e.target.value)} />
            <input type="text" placeholder="state" onChange={(e) => setState(e.target.value)} />
            <input type="text" placeholder="country" onChange={(e) => setCountry(e.target.value)} />
            <input type="text" placeholder="guests" onChange={(e) => setGuests(e.target.value)} />
            <input type="text" placeholder="bedroom" onChange={(e) => setBedroom(e.target.value)} />
            <input type="text" placeholder="bed" onChange={(e) => setBed(e.target.value)} />
            <input type="text" placeholder="bathroom" onChange={(e) => setBathroom(e.target.value)} />
            <input type="text" placeholder="price" onChange={(e) => setPrice(e.target.value)} />
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Property</button>
        </div>
    )
}

export default DemoListing