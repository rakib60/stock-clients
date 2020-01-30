import axios from 'axios'
export var baseURL = 'http://localhost:3001'

export default axios.create({
    baseURL: baseURL,
    headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}
})
