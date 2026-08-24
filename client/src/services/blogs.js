import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl, {
    headers: { Authorization: token }
  })
  return request.data
}

//get By id

// const get = async (id) =>{
//   const request = await axios.get(`${baseUrl}/${id}`, {
//     headers:{Authorization: token}
//   })
//   return request.data
// }

const create = async (newObject) => {
  const request = await axios.post(baseUrl, newObject, {
    headers: { Authorization: token }
  })
  return request.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject, {
    headers:{Authorization: token}
  })
  return request.data
}

//delete

const remove = async (id) =>{
  const request = await axios.delete(`${baseUrl}/${id}`,{
    headers: { Authorization: token}
  } )
  return request.status
}

export default { getAll,create, setToken, update, remove }