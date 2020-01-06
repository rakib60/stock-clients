import axios from 'axios'
console.log(localStorage.getItem('accessToken'),'first assigned browser token')
export default axios.create({
    baseURL: 'http://localhost:3001',
    headers: {'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}
})
