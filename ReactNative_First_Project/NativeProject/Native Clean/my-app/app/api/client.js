import {create} from 'apisauce'; // axios upgraded

const apiClient = create({
 baseURL:'http://192.168.1.186:8000',
})
// 192.168.0.53/api/listings

export default apiClient;
// apiClient.get('/listings').then(r => {
//     if(!r.ok){
//        console.log(r.problem);
//     }
// })