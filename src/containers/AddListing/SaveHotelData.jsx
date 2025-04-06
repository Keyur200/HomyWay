import axios from 'axios'
import React from 'react'
import { api } from '../../api'

const SaveHotelData = async (data) => {
  return axios.post(`${api}/Property`,data);
}

export default SaveHotelData