<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ExpoNotificationService;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Date;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Cloudinary\Cloudinary;
use phpDocumentor\Reflection\Types\Boolean;



class AuthController extends AbstractController
{
    #[Route('/Register', name: 'app_Register')]
    public function Register(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    {      
        
        $uploadedFile = $request->files->get('image');
        $email = $request->request->get('email');
        $username = $request->request->get('username');
        $phone = $request->request->get('phone');
        $password = $request->request->get('password');
        $cpassword = $request->request->get('cpassword');
        $DeviceToken = $request->request->get('Device_Token');
   
  
        $user = $rp->findBy(['email' => $email]);

        if($user!=null){
            return $this->json(['error' => 'User Already Registred'], Response::HTTP_BAD_REQUEST);
        }




        if (!$username || !$email || !$phone || !$password || !$cpassword ) {
            return $this->json(['error' => 'Missing required fields username : '.$username.' email : '.$email .' phone : '. $phone . ' password : '.$password.' cpassword : '.$cpassword .'\nRecived Request : '.$request], Response::HTTP_BAD_REQUEST);
        }
        if ($password !== $cpassword) {
            return $this->json(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);
        }
        
        $user = new User();
        $user->setName($username);
        $user->setEmail($email);
        $user->setPhone($phone);
         $user->setPassword($password);
        $user->setPassword($hasher->hashPassword($user,$user->getPassword()));
         // to change into userDeviceToken for notifications
        $user->setAccountCreationDate(new DateTime());
        $user->setLastLogin(new DateTime());
        if($DeviceToken!= null){
            $user->setDeviceToken($DeviceToken);
        }else{
            $user->setDeviceToken(null);
        }
        $result=null;
        if($uploadedFile){
        $result = $this->uploadImageCloudinary($uploadedFile);
        $user->setImage($result);
        }else{
        $user->setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
        }
        
        $test = false;
        $userToken = "";
        while ($test == false) { //make sure is unique in db
            $userToken = bin2hex(random_bytes(32)); 
            $users = $rp->findBy(["token" => $userToken]);
            if ($users == NULL) {
                $test = true;
            }
        }

        $user->setToken($userToken);
 
        try{
        $em = $mr->getManager();
        $em->persist($user);
        $em->flush();
        }catch(Exception $e){
            return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        return $this->json(['Token' => $userToken,'username'=>$username,'email' => $email,'DeviceToken'=>$DeviceToken,'image'=>$result,'phone'=>$phone], Response::HTTP_ACCEPTED);
        
    }


    #[Route('/Login', name: 'app_login')]
    public function Login(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    {      
        
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if($email == null || $password == null){
            return $this->json(['error' => 'Invalid Email AND/OR Password'], Response::HTTP_BAD_REQUEST);
        }


        $user = $rp->findBy(['email' => $email]);

        if($user==null){ // user not found
            return $this->json(['error' => 'User Dosent Exist'], Response::HTTP_CONFLICT);
        }
        $user = $user[0];
        $Device_Token = $data['Device_Token'] ?? null;

        if(!$hasher->isPasswordValid($user, $password)){
             return $this->json(['error' => 'Wrong Email AND/OR Password'], Response::HTTP_CONFLICT);
        }
        if($Device_Token != null){
            $user->setDeviceToken($Device_Token);
        }else{
            $user->setDeviceToken(null);

        }
        //generating a new Token !
        $test = false;
        $userToken = "";
        while ($test == false) { //make sure is unique in db
            $userToken = bin2hex(random_bytes(32)); 
            $users = $rp->findBy(["token" => $userToken]);
            if ($users == NULL) {
                $test = true;
            }
        }

        $user->setToken($userToken);
        //updating lastLogin
        $user->setLastLogin(new DateTime());
        
        //updating in db
        try{
            $em = $mr->getManager();
            $em->persist($user);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }

        return $this->json(['Token' => $userToken,'username'=>$user->getName(),'email' => $email,'DeviceToken'=>$Device_Token,'image'=>$user->getImage(),'phone'=>$user->getPhone()], Response::HTTP_ACCEPTED);
        
    }



    #[Route('/Recover', name: 'app_recover')]
    public function Recover(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    {      
        
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $email = $data['email'] ?? null;
        
        if($email == null){
            return $this->json(['error' => 'Invalid Email AND/OR Password'], Response::HTTP_BAD_REQUEST);
        }


        $user = $rp->findBy(['email' => $email]);

        if($user==null){ // user not found
            return $this->json(['error' => 'User Dosent Exist'], Response::HTTP_CONFLICT);
        }
        $user = $user[0];
        //updating user with a random Code
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $Code = '';
        for ($i = 0; $i < 5; $i++) {
            $Code .= $characters[rand(0, strlen($characters) - 1)];
        }
        $user->setRecoveryCode($Code);
        try{ // trying to send email to that user
            // should put this inside a thread!! asap
            $this->sendMail($user, 0); // 
        }catch(Exception $e){
        
        }

        //updating in db
        try{
            $em = $mr->getManager();
            $em->persist($user);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }

        return $this->json(['Email Sent!'], Response::HTTP_ACCEPTED);
        
    }


    #[Route('/RecoverVerif', name: 'app_recover_verif')]
    public function VerifRecover(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    {      
        
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);
   
        
        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $email = $data['email'] ?? null;
        $code = $data['code'] ?? null;
        
        if($email == null|| $code == null){
            return $this->json(['error' => 'Invalid Email AND/OR Code'], Response::HTTP_BAD_REQUEST);
        }


        $user = $rp->findBy(['email' => $email]);

        if($user==null){ // user not found
            return $this->json(['error' => 'User Dosent Exist'], Response::HTTP_CONFLICT);
        }
        $user = $user[0];
        //verif
        if($code!=$user->getRecoveryCode()){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_CONFLICT);
        }

        $user->setRecoveryCode(null);
       //"login"
       $test = false;
       $userToken = "";
       while ($test == false) { //make sure is unique in db
           $userToken = bin2hex(random_bytes(32)); 
           $users = $rp->findBy(["token" => $userToken]);
           if ($users == NULL) {
               $test = true;
           }
       }

       $user->setToken($userToken);
        //updating in db
        try{
            $em = $mr->getManager();
            $em->persist($user);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        
        return $this->json(['Token' => $userToken,'username'=>$user->getName(),'email' => $email,'DeviceToken'=>'NextPhase','image'=>$user->getImage(),'phone'=>$user->getPhone()], Response::HTTP_ACCEPTED);
    }


    #[Route('/PasswordReset', name: 'app_passowrd_Reset')]
    public function RequestPasswordReset(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    { 

        $jsonContent = $request->getContent();
        
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $Token = $data['Token'] ?? null;
        $password = $data['password'] ?? null;
        $Device_Token = $data['Device_Token'] ?? null;

        if($Token == null || $password == null){
            return $this->json(['error' => 'Something Went Wrong']);
        }

        $user = $rp->findBy(['token'=>$Token]);

        if($user == null){
            return $this->json(['error' => 'Something Went Wrong']);
        }

        $user = $user[0];
        $user->setPassword($password);
        $user->setPassword($hasher->hashPassword($user,$user->getPassword()));
        if($Device_Token != null){
            $user->setDeviceToken($Device_Token);
        }

        try{
            $em = $mr->getManager();
            $em->persist($user);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }

        return $this->json(['Success'=>'Password Changed Successfully'], Response::HTTP_ACCEPTED);
    }


    #[Route('/LogOut', name: 'app_logout')]
    public function LogOut(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    { 

        $jsonContent = $request->getContent();
        
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $Token = $data['Token'] ?? null;

        if($Token== null)
        return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        
        $users = $rp->findBy(['token'=>$Token]);

        if($users == null){
        return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $user = $users[0];

        $user->setToken(null);
        $user->setDeviceToken(null);

        try{
            $em = $mr->getManager();
            $em->persist($user);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }

        return $this->json(['Success'=>'LoggedOut Successfully'], Response::HTTP_ACCEPTED);
    }

    private function sendMail($myuser, $type): void
    {
        if ($type == 0) { // send recovery code mail
            $from = "coolandbnin@gmail.com";
            $to = $myuser->getEmail();
            $transport = Transport::fromDsn('smtp://coolandbnin@gmail.com:nnijwlklduqjcivf@smtp.gmail.com:587');
            $mailer = new Mailer($transport);
            $email = new Email();
            $email->from($from);
            $email->to($to);
            $email->subject("Account Restoration Password");
            //$email->cc('test');
            //$email->text("Hey ".$myuser[0]->getUsername()." Your Account Restoration Code is :");
            $email->html('
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Account Recovery</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                    padding: 0;
                                    background-color: #f4f4f4;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 50px auto;
                                    background-color: #ffffff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                }
                                h1 {
                                    color: #333333;
                                }
                                p {
                                    color: #666666;
                                }
                                .recovery-code {
                                    background-color: #3498db;
                                    color: #ffffff;
                                    padding: 10px;
                                    text-align: center;
                                    font-size: 24px;
                                    border-radius: 5px;
                                    margin-top: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Account Recovery</h1>
                                <p>Hello ' . $myuser->getName() . ',</p>
                                <p>We received a request to recover your account. Please use the following recovery code:</p>
                                <div class="recovery-code">
                                    ' . $myuser->getRecoveryCode() . '
                                </div>
                                <p>If you did not request this, please ignore this email or contact support.</p>
                                <p>Thank you,</p>
                                <p>NF</p>
                            </div>
                        </body>
                        </html>
                        
                        ');

            $mailer->send($email);
        } 
    }
    
    private function uploadImageCloudinary($img) : string
    {
        $cloudinary = new Cloudinary([
            'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
            'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
            'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
        ]);
        if ($img) {
            $img =  $img->getRealPath();

            // Upload to Cloudinary
            $cloudinaryResponse = $cloudinary->uploadApi()->upload($img);

            // Cloudinary response will contain details about the uploaded image
            $publicId = $cloudinaryResponse['public_id'];
            $imageUrl = $cloudinaryResponse['secure_url'];
           return $imageUrl;
            
        }
    }

    private function deleteImageCloudinary($url)
    {
        if($url == '' || $url== null){
            return;
        }
        $cloudinary = new Cloudinary([
            'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
            'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
            'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
        ]);
        $parsedUrl = parse_url($url);
        // Extract the public ID from the path 
        $pathParts = explode('/', $parsedUrl['path']);
        $oldpublicidwithextension = $pathParts[count($pathParts) - 1];
        $oldpublicidwithoutextension = pathinfo($oldpublicidwithextension, PATHINFO_FILENAME);
        $cloudinary->uploadApi()->destroy($oldpublicidwithoutextension);
    }

    private $expoNotificationService;

    public function __construct(ExpoNotificationService $expoNotificationService)
    {
        $this->expoNotificationService = $expoNotificationService;
    }


    #[Route('/send-notification', name: 'send_notification')]
    public function sendNotification(Request $request, UserRepository $rp): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $token = $data['token'] ?? null;
        $title = $data['title'] ?? null;
        $body = $data['body'] ?? null;
        

        // Validate the required fields
        if (!$token || !$title || !$body) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        // Find the user by their Expo token (Device Token)
        $user = $rp->findOneBy(['deviceToken' => $token]);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        try {
            $response = $this->expoNotificationService->sendNotification($token, $title, $body);
            return $this->json($response, Response::HTTP_OK);
        } catch (Exception $e) {
            return $this->json(['error' => 'Failed to send notification', 'details' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }





    #[Route('/UpdateClient', name: 'app_UpdateClient')]
    public function UpdateClient(UserRepository $rp,ManagerRegistry $mr,Request $request,UserPasswordHasherInterface $hasher): JsonResponse
    {      
        
        $uploadedFile = $request->files->get('image');
        $email = $request->request->get('email');
        $username = $request->request->get('username');
        $phone = $request->request->get('phone');
        $password = $request->request->get('password');
        $cpassword = $request->request->get('cpassword');
        $oldpassword = $request->request->get('Oldpassword');
        $Token = $request->request->get('Token');
        $ischanged = $request->request->get('ischanged');

       

  
        $user = $rp->findBy(['token' => $Token]);

        if($user==null){
            return $this->json(['error' => 'User Dosent Exist'], Response::HTTP_BAD_REQUEST);
        }



        if (!$username || !$email || !$phone) {
            return $this->json(['error' => 'Missing required fields username : '.$username.' email : '.$email .' phone : '. $phone . ' password : '.$password.' cpassword : '.$cpassword .'\nRecived Request : '.$request], Response::HTTP_BAD_REQUEST);
        }
        if($password == null && ($cpassword != null || $oldpassword!= null) ){
            return $this->json(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);

        }else if(($password != null || $cpassword != null) && $oldpassword== null ){
            return $this->json(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);

        }else if(($password != null || $oldpassword != null) && $cpassword== null){
            return $this->json(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);

        }
        if ($password !== $cpassword) {
            return $this->json(['error' => 'Passwords do not match'], Response::HTTP_BAD_REQUEST);
        }
        $user = $user[0];

        if($password != '' && $password == $cpassword){
            if(!$hasher->isPasswordValid($user[0], $oldpassword)){
                return $this->json(['error' => 'Wrong  OLD PASSWORD Password'], Response::HTTP_CONFLICT);
           }else{
        $user->setPassword($password);
        $user->setPassword($hasher->hashPassword($user,$user->getPassword()));

           }
        }
        
        $user->setName($username);
        $user->setEmail($email);
        $user->setPhone($phone);
        if($uploadedFile != $user->getImage()){
        $result=null;
        if($uploadedFile){
        $result = $this->uploadImageCloudinary($uploadedFile);
        $user->setImage($result);
        }else{// == null
            if($user->getImage()!= null || $user->getImage() != ''){
                //do nothing
                if($ischanged == "true"){
                    $user->setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
                }
            }else{
                $user->setImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");

            }
        }
        }
 
        try{
        $em = $mr->getManager();
        $em->persist($user);
        $em->flush();
        }catch(Exception $e){
            return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        return $this->json(['Token' => $user->getToken(),'username'=>$user->getName(),'email' => $user->getEmail(),'DeviceToken'=>$user->getDeviceToken(),'image'=>$user->getImage(),'phone'=>$user->getPhone()], Response::HTTP_ACCEPTED);
        
    }
    
}
