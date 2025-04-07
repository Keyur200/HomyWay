import React, { useContext, useEffect, useState } from 'react';
import SectionGrid from 'components/SectionGrid/SectionGrid';
import { PostPlaceholder } from 'components/UI/ContentLoader/ContentLoader';
import useDataApi from 'library/hooks/useDataApi';
import { SINGLE_POST_PAGE } from 'settings/constant';
import axios from 'axios';
import { api } from '../../../api';
import {AuthContext} from '../../../context/AuthProvider'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const AgentItemLists = () => {
  const { data, loadMoreData, loading, total } = useDataApi('/data/agent.json');
  const listed_post = +data[0] && data[0].listed_post ? data[0].listed_post : [];

   const [property, setProperty] = useState([]);
   const {user} = useContext(AuthContext);
  
    const allProperties = async () => {
      const res = await axios.get(`${api}Property/Host/${user?.id}`);
      if (res) {
        setProperty(res.data);
        console.log(res.data);
      }
    };
  
    useEffect(() => {
      allProperties();
    }, [user?.id]);

    const handleDelete = async (id) => {
      const res = await axios.delete(`${api}Property/${id}`)
      if(res){
        toast("Property deleted successfully.")
        allProperties()
      }
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
          {property && property?.map((p, i) => (
            <div 
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={
                    p.imagesNavigation[0]?.imageUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={p.propertyName || "Property Image"}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
    
              <div className="p-4">
                <Link to={`/PropertyDetails/${p?.propertyId}`}>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {p.propertyName || "Untitled Property"}
                </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{p.location || "Unknown Location"}</p>
                <p className="text-gray-700 font-medium">
                  ₹{p.propertyPrice || 0}/Night <span className="text-sm text-gray-400">- Free Cancellation</span>
                </p>
    
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, idx) => (
                    <i key={idx} className="fas fa-star text-yellow-400 text-sm mr-1" />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(8)</span>
                </div>
              </div>
              <div className="p-4">
                <button onClick={()=>handleDelete(p?.propertyId)}><i className="fa fa-trash"/></button>
              </div>
            </div>
          ))}
        </div>
  );
};

export default AgentItemLists;
