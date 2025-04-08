import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import { api } from '../../api';
import './style.css';


const DemoListing = () => {
    const { user } = useContext(AuthContext);

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
    const [category, setCategory] = useState([]);
    const [cid,setcid] = useState(0)

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const getCategories = async () => {
        const res = await axios.get(`${api}PropertyCategoryTbls`)
        if(res){
            setCategory(res.data)
        }
    }

    useEffect(()=>{
        getCategories()
    },[])

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("hostId", user?.id);
        formData.append("propertyName", name);
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
        formData.append("categoryId", cid);
        files.forEach((file) => formData.append("files", file));

        try {
            const res = await axios.post(`${api}Property`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(res.data);
            alert("Upload successful!");
        } catch (err) {
            console.error(err);
            alert("Upload failed!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Upload a Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input" type="text" placeholder="Property Name" onChange={(e) => setName(e.target.value)} />
                <input className="input" type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                <input className="input" type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
                <input className="input" type="text" placeholder="City" onChange={(e) => setCity(e.target.value)} />
                <input className="input" type="text" placeholder="State" onChange={(e) => setState(e.target.value)} />
                <input className="input" type="text" placeholder="Country" onChange={(e) => setCountry(e.target.value)} />
                <input className="input" type="number" placeholder="Guests" onChange={(e) => setGuests(e.target.value)} />
                <input className="input" type="number" placeholder="Bedroom" onChange={(e) => setBedroom(e.target.value)} />
                <input className="input" type="number" placeholder="Bed" onChange={(e) => setBed(e.target.value)} />
                <input className="input" type="number" placeholder="Bathroom" onChange={(e) => setBathroom(e.target.value)} />
                <input className="input" type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
                <select className='input' value={cid} onChange={(e)=>setcid(e.target.value)}>
                    <option value="">Select Category</option>
                    {
                        category.map((c,i)=>(
                            <option value={c.categoryId}>{c.categoryName}</option>
                        ))
                    }
                </select>
                <input className="input" type="file" multiple onChange={handleFileChange} />
            </div>
            <div className="text-center">
                <button onClick={handleUpload} className="px-6 py-2 bg-[#008489] text-white font-semibold rounded-lg hover:bg-white hover:border-2 border-[#008489] transition duration-300">
                    Upload Property
                </button>
            </div>
        </div>
    );
};

export default DemoListing;
