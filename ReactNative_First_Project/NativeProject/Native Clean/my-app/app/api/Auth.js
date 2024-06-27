import client from './client'

async function uriToBase64(uri) {
    try {
        // Fetch the image data
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Read the blob data as a base64 string
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
            reader.onerror = reject;
        });
    } catch (error) {
        console.error('Error converting URI to base64:', error);
        throw error;
    }
}//works



const Register = (data) =>  client.post("/Register",data);
const Register2 = async (data) =>  {
    const d = new FormData();
    d.append('username',data.username);
    d.append('phone',data.phone);
    d.append('password',data.password);
    d.append('cpassword',data.cpassword);
    d.append('email',data.email);
    if(data.image){
    d.append('image',{
        name:'image',
        type: 'image/jpeg',
        uri: data.image
    });
}
d.append('Device_Token',data.Device_Token);
    
 
   return client.post("/Register",d,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
   });}

const Login = (data) =>  client.post("/Login",data);
const Recover = (data) => client.post("/Recover",data);
const VerifRecoveryCode = (data)=> client.post('/RecoverVerif',data);
const Logout = (data)=> client.post('/LogOut',data);
const RequestPasswordChange = (data) => client.post('/PasswordReset',data);
export default {Logout,RequestPasswordChange,Register,Register2,Login,Recover,VerifRecoveryCode};

    // Upload images to Cloudinary and append the URLs to the form data
    // for (let i = 0; i < data.images.length; i++) {
    //     const image = data.images[i];
    //     d.append('Image'+i ,cloudinaryUpload(image.uri));
    //     console.log(image.uri);
    // }
