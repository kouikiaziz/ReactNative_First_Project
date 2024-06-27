<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Entity\FriendRequest;
use App\Entity\Like;
use App\Entity\Post;
use App\Repository\CommentRepository;
use App\Repository\FriendRequestRepository;
use App\Repository\LikeRepository;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Exception;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\ExpoNotificationService;
use Cloudinary\Cloudinary;
use DateTime;

class PostsController extends AbstractController
{
    #[Route('/SearchUsers', name: 'app_SearchUsers')]
    public function SearchUsers(UserRepository $rp,Request $request): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $LookingFor = $data['Name'] ?? null;
        $CurrentUserToken = $data['Token'] ?? null;
        if($LookingFor == null || $CurrentUserToken == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $users = $rp->findBy(['token'=>$CurrentUserToken]);
        if($users == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $FoundUsers = $rp->FindUsersByName($LookingFor);

        $tableData = [];
        foreach ($FoundUsers as $user) {
            if($user->getId() != $users[0]->getId() ){
            $tableData[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'image'=>$user->getImage(),
            ];
        }
        }

        return $this->json(['Result'=>$tableData], Response::HTTP_ACCEPTED);


    }

    private $expoNotificationService;

    public function __construct(ExpoNotificationService $expoNotificationService)
    {
        $this->expoNotificationService = $expoNotificationService;
    }


    #[Route('/SendFriendRequest', name: 'app_SendFriendRequest')]
    public function SendFriendRequest(UserRepository $rp ,FriendRequestRepository $rp2,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $LookingFor_id = $data['id'] ?? null;
        $CurrentUserToken = $data['Token'] ?? null;
        if($LookingFor_id == null || $CurrentUserToken == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Sender = $rp->findBy(['token'=>$CurrentUserToken]);
        if($Sender == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $FoundUsers = $rp->find($LookingFor_id);
        if($FoundUsers == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        // we have to verfiy whether friendRequet Already Exists or not
        $FriendRequest = $rp2->FindFriendRequest($Sender[0]->getId(),$FoundUsers->getId());
        $bool = false;
        if($FriendRequest != []){ // exists alors on laccepte directement
            $FriendRequest = $FriendRequest[0];
            if($FriendRequest->isAccepted()==true){
                return $this->json(['Success' => 'Already Friends'], Response::HTTP_ACCEPTED);
            }
            if($FriendRequest->getIdSender()->getId() == $Sender[0]->getId()){
                return $this->json(['Success' => 'Friend Request Already Sent'], Response::HTTP_ACCEPTED);
            }else{
            
                $FriendRequest->setAccepted(true);
                $bool = true;
            }

        }else{
        $FriendRequest = new FriendRequest();
        $FriendRequest->setIdSender($Sender[0]);
        $FriendRequest->setIdRecv($FoundUsers);
        $FriendRequest->setAccepted(false);
    }
        try{
            $em = $mr->getManager();
            $em->persist($FriendRequest);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
            try{
                if($bool){
                    $this->expoNotificationService->sendNotification($FoundUsers->getDeviceToken(), "Friend Request Update", $Sender[0]->getName()." Accepted Your Friend Request",["REMOVE_FRIEND_IN_FRIEND_REQUEST_LIST"=>["id"=>$Sender[0]->getId(),"name"=>$Sender[0]->getName(),"image"=>$Sender[0]->getImage(),"onclicknavigate"=>"posts"]]);
                }else{
                    $this->expoNotificationService->sendNotification($FoundUsers->getDeviceToken(), "You Have A New Friend Request", "You Have Recieved A New Friend Request From ".$Sender[0]->getName(),["ADD_FRIEND_IN_FRIEND_REQUEST_LIST"=>["id"=>$Sender[0]->getId(),"name"=>$Sender[0]->getName(),"image"=>$Sender[0]->getImage(),"onclicknavigate"=>"posts"]]);

                }
            }catch(Exception $e){
                
            }

        return $this->json(['Success'=>'Friend Request Sent'], Response::HTTP_ACCEPTED);


    }


    #[Route('/GetFriendRequests', name: 'app_GetFriendRequest')]
    public function GetFriendRequest(UserRepository $rp ,FriendRequestRepository $rp2,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        
        $CurrentUserToken = $data['Token'] ?? null;
        if($CurrentUserToken == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $user = $rp->findBy(['token'=>$CurrentUserToken]);

        if($user == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $user = $user[0];
        // $FriendRequests = $rp2->findBy(['id_recv'=>$user->getId()]);
        $FriendRequests = $rp2->GetUserFriendRequests($user->getId());
        // return $this->json(['error' => $FriendRequests[0]], Response::HTTP_BAD_REQUEST);

        $tableData = [];
        foreach ($FriendRequests as $friendrequest) {
           
            $tableData[] = [
                'id' => $friendrequest->getIdSender()->getId(),
                'name' => $friendrequest->getIdSender()->getName(),
                'image'=>$friendrequest->getIdSender()->getImage(),
            ];
        }


        return $this->json(['Success'=>$tableData], Response::HTTP_ACCEPTED);


    }




    #[Route('/AcceptFr', name: 'app_AcceptFr')]
    public function AcceptFr(UserRepository $rp ,FriendRequestRepository $rp2,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $id_sender = $data['Sender'] ?? null;        
        $CurrentUserToken = $data['Token'] ?? null;
        if($CurrentUserToken == null || $id_sender == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Currentuser = $Currentuser[0];
        $fr = $rp2->FindSpecefic($id_sender,$Currentuser->getId());
        if($fr == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $fr = $fr[0];
        $fr->setAccepted(true);

        try{
            $em = $mr->getManager();
            $em->persist($fr);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        // notify the sender
        try{
        $this->expoNotificationService->sendNotification($fr->getIdSender()->getDeviceToken(), "Friend Reuqest Update", $Currentuser->getName()." Accepted Your Friend Request!",['none'=>'none']);
        }
        catch(Exception $e){

        }
        return $this->json(['Success'=>'Friend Request Accepted'], Response::HTTP_ACCEPTED);


    }




    #[Route('/RejectFr', name: 'app_RejectFr')]
    public function RejectFr(UserRepository $rp ,FriendRequestRepository $rp2,Request $request,ManagerRegistry $mr): JsonResponse
    {
        
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $id_sender = $data['Sender'] ?? null;        
        $CurrentUserToken = $data['Token'] ?? null;
        if($CurrentUserToken == null || $id_sender == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Currentuser = $Currentuser[0];
        $fr = $rp2->FindSpecefic($id_sender,$Currentuser->getId());
        if($fr == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $fr = $fr[0];
        

        try{
            $em = $mr->getManager();
            $em->remove($fr);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        // notify the sender
        // try{
        // $this->expoNotificationService->sendNotification($fr->getIdSender()->getDeviceToken(), "Friend Reuqest Update", $Currentuser->getName()." Rejected Your Friend Request!");
        // }
        // catch(Exception $e){

        // }
        return $this->json(['Success'=>'Friend Request Rejected'], Response::HTTP_ACCEPTED);


    }


    #[Route('/GetMyPosts', name: 'app_GetMyPosts')]
    public function GetMyPosts(LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
       
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     


        if($CurrentUserToken == null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Currentuser = $Currentuser[0];
        $myPosts = $rp3->getMyPosts($Currentuser->getId());
        $tableData = [];
        $bool=false;
        foreach ($myPosts as $post) {
            $isLiked = $rp4->findoutwhetherlikedornot($Currentuser->getId(),$post->getId());
            if($isLiked == []){
                $bool = false;
            }else{
                $bool = true;
            }
            $tableData[] = [
                'id' => $post->getId(),
                'userId' => $post->getUserid()->getId(),
                'username' => $post->getUserid()->getName(),
                'userimage' => $post->getUserid()->getImage(),
                'date' => $post->getDtime(),
                'content'=>$post->getContent(),
                'image'=>$post->getImageurl(),
                'liked'=>$bool,
            ];
        
        }
        return $this->json(['Success' => $tableData], Response::HTTP_ACCEPTED);


    }

    #[Route('/GetPosts', name: 'app_GetPosts')]
    public function getFeedPosts(LikeRepository $rp4 ,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     


        if($CurrentUserToken == null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $posts = $rp3->findAll();
        $tableData = [];
        $bool = false;
        foreach ($posts as $post) {
            $isLiked = $rp4->findoutwhetherlikedornot($Currentuser[0]->getId(),$post->getId());
            if($isLiked == []){
                $bool = false;
            }else{
                $bool = true;
            }
            $tableData[] = [
                'id' => $post->getId(),
                'userId' => $post->getUserid()->getId(),
                'username' => $post->getUserid()->getName(),
                'userimage' => $post->getUserid()->getImage(),
                'date' => $post->getDtime(),
                'content'=>$post->getContent(),
                'image'=>$post->getImageurl(),
                'liked'=>$bool
            ];
        
        }
        return $this->json(['Success' => $tableData], Response::HTTP_ACCEPTED);


    }

    #[Route('/AddPost', name: 'app_AddPost')]
    public function AddPost(UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $image = $request->files->get('image');
        $content = $request->request->get('content');
        $Token = $request->request->get('Token');

        if($Token==null || ($content == null && $image == null)){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $user = $rp->findBy(['token'=>$Token]);

        if($user == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $user = $user[0];
        $post = new Post();
        $post->setUserid($user);
        $post->setDtime(new DateTime());
        $post->setContent($content);
        $result = null;
        if($image != null){
            $result = $this->uploadImageCloudinary($image);
        }
        $post->setImageurl($result);



        try{
            $em = $mr->getManager();
            $em->persist($post);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }

                return $this->json(['Success' => "Post Uploaded Successfully"], Response::HTTP_ACCEPTED);
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


    #[Route('/DeleteMyPost', name: 'app_DeleteMyPost')]
    public function DeleteMyPost(CommentRepository $rp5,LikeRepository $rp4 ,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['postid'] ?? null; 

        if($CurrentUserToken == null || $postid == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $post = $rp3->find($postid);
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        if($post->getUserid()->getId() != $Currentuser[0]->getId()){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        //delete all likes
        $rp4->DeleteAllLikes($post->getId());
        //delete all comments
        $rp5->DeleteAllComments($post->getId());
        try{
            $em = $mr->getManager();
            $em->remove($post);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        
        return $this->json(['Success' => 'Post Removed Successfully'], Response::HTTP_ACCEPTED);


    }


    #[Route('/LikePost', name: 'app_LikePost')]
    public function LikePost(LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['id'] ?? null; 

        if($CurrentUserToken == null || $postid == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Currentuser = $Currentuser[0];

        $post = $rp3->find($postid);
        
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $like = $rp4->findoutwhetherlikedornot($Currentuser->getId(),$post->getId());
        if($like != null){ // unlike the post
            try{
                $em = $mr->getManager();
                $em->remove($like);
                $em->flush();
                }catch(Exception $e){
                    return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
                }
    
                return $this->json(['Success' => 'Post UnLiked Successfully'], Response::HTTP_ACCEPTED);
        }

        $like = new Like();
        $like->setUserid($Currentuser);
        $like->setPostid($post);


        try{
            $em = $mr->getManager();
            $em->persist($like);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
            //notify post owner here
            $owner = $post->getUserid();

            try{
                if($owner->getId()!=$Currentuser->getId())
                $this->expoNotificationService->sendNotification($owner->getDeviceToken(),"Like Notification" ,$Currentuser->getName() . ' Liked Your Post',['post_id'=>$post->getId()]);

                }catch(Exception $e){
                
            }
            return $this->json(['Success' => 'Post Liked Successfully'], Response::HTTP_ACCEPTED);


    }


    #[Route('/GetLikesPPL', name: 'app_GetLikesPPL')]
    public function GetLikesPPL(LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['id'] ?? null; 

        if($CurrentUserToken == null || $postid == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Currentuser = $Currentuser[0];

        $post = $rp3->find($postid);
        
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Likes = $rp4->findBy(['postid'=>$post->getId()]);

        

        $tableData = [];
        foreach ($Likes as $like) {
            $tableData[] = [
                'id' => $like->getUserid()->getId(),
                'name' => $like->getUserid()->getName(),
                'image'=>$like->getUserid()->getimage(),
            ];
        
        }

        return $this->json(['Success' => $tableData], Response::HTTP_ACCEPTED);

    }




    #[Route('/GetComments', name: 'app_GetComments')]
    public function GetComments(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['id'] ?? null; 

        if($CurrentUserToken == null || $postid == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $Currentuser = $Currentuser[0];

        $post = $rp3->find($postid);
        
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
       
        $Comments = $rp5->findBy(['postid' => $postid]);
        $MyComments = $rp5->finduserscommentinpostx($Currentuser,$post);


        $tableData2 = [];
        foreach ($MyComments as $comment) {
            $tableData2[] = [
                'id_c' => $comment->getId(),
                'id' => $comment->getUserid()->getId(),
                'name' => $comment->getUserid()->getName(),
                'image' => $comment->getUserid()->getImage(),
                'content'=>$comment->getContent(),
            ];
        
        }

        $tableData = [];
        foreach ($Comments as $comment) {
            $tableData[] = [
                'id_c' => $comment->getId(),
                'id' => $comment->getUserid()->getId(),
                'name' => $comment->getUserid()->getName(),
                'image' => $comment->getUserid()->getImage(),
                'content'=>$comment->getContent(),
            ];
        
        }

        return $this->json(['Success' => $tableData,'MyComments'=>$tableData2], Response::HTTP_ACCEPTED);

    }




    #[Route('/PostComment', name: 'app_PostComment')]
    public function PostComment(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['id'] ?? null; 
        $commentcontent = $data['comment_content'];

        if($CurrentUserToken == null || $postid == null || $commentcontent == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){

            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        
        }
        $Currentuser = $Currentuser[0];

        $post = $rp3->find($postid);
        
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
       
       $comment = new Comment();
       $comment->setContent($commentcontent);
       $comment->setUserid($Currentuser);
       $comment->setPostid($post);

        
       try{
        $em = $mr->getManager();
        $em->persist($comment);
        $em->flush();
        }catch(Exception $e){
            return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
        }
        // notify owner
        try{
            if($post->getUserid() != $Currentuser->getId() )
        $this->expoNotificationService->sendNotification($post->getUserid()->getDeviceToken(), "SomeOne Commented On Your Post", $Currentuser->getName()." Commented On One Of Your Posts",['post_id'=>$post->getId()]);
    }catch(Exception $e){

    }

        return $this->json(['Success' => "Comment Added Successfully"], Response::HTTP_ACCEPTED);

    }





    #[Route('/DeleteMyComment', name: 'app_DeleteMyComment')]
    public function DeleteMyComment(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $postid = $data['post_id'] ?? null; 
        $commentid = $data['id_comment'];

        if($CurrentUserToken == null || $postid == null || $commentid == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){

            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        
        }
        $Currentuser = $Currentuser[0];

        $post = $rp3->find($postid);
        
        if($post == null){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
       
       $comment = $rp5->find($commentid);
       if($comment == null){
        return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
       }

       if($comment->getUserid()->getId()!= $Currentuser->getId() || $comment->getPostid()->getId() != $post->getId()){
        return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
       }

        
       try{
        $em = $mr->getManager();
        $em->remove($comment);
        $em->flush();
        }catch(Exception $e){
            return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return $this->json(['Success' => "Comment Removed Successfully"], Response::HTTP_ACCEPTED);

    }




    #[Route('/GetFriends', name: 'app_GetFriends')]
    public function GetFriends(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     

        if($CurrentUserToken == null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
    
        }
        $Currentuser = $Currentuser[0];
        $FriendList = $rp2->GetFriends($Currentuser->getId());
        


        $tableData = [];
        foreach ($FriendList as $frq) {
        
            $tableData[] = [
                'friend_id' => $frq->getIdSender()->getId(),
                'name' => $frq->getIdSender()->getName(),
                'image'=>$frq->getIdSender()->getImage(),
            ];
       
        }


        return $this->json(['Success' => $tableData], Response::HTTP_ACCEPTED);

    }

    
    #[Route('/LoadPorfile', name: 'app_LoadPorfile')]
    public function LoadPorfile(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $profile_id = $data['id'] ?? null;     

        if($CurrentUserToken == null || $profile_id == null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }


        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
    
        }

        $checkuser = $rp->find($profile_id);
        if($checkuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }
        $areWeFriends = null;
        if($Currentuser[0] == $checkuser){
            $areWeFriends = null;
        }else{
            $test = $rp2->FindFriendRequest($profile_id,$Currentuser[0]->getId());
            if($test != []){
            if($test[0]->isAccepted() == true){
                $areWeFriends = true;
            }else{ // not accepted

                if( $test[0]->getIdSender()->getId() == $Currentuser[0]->getId()){// i am the sender and still on hold then i want to send 'waiting'
                    $areWeFriends = 'waiting';
                } else {
                    $areWeFriends = 'waitingAcceptance';
                }
            }
        }else{
            $areWeFriends=false;
        }
        }
        
       

        $tableData2 = [];
            $tableData2[] = [
                'id' => $checkuser->getId(),
                'name' => $checkuser->getName(),
                'image'=>$checkuser->getImage(),
                'friends'=>$areWeFriends,
            ];
      









        $Currentuser = $Currentuser[0];
        $profile_posts = $rp3->getMyPosts($checkuser->getId());
        $tableData = [];
        $bool=false;
        foreach ($profile_posts as $post) {
            $isLiked = $rp4->findoutwhetherlikedornot($Currentuser->getId(),$post->getId());
            if($isLiked == []){
                $bool = false;
            }else{
                $bool = true;
            }
            $tableData[] = [
                'id' => $post->getId(),
                'userId' => $post->getUserid()->getId(),
                'username' => $post->getUserid()->getName(),
                'userimage' => $post->getUserid()->getImage(),
                'date' => $post->getDtime(),
                'content'=>$post->getContent(),
                'image'=>$post->getImageurl(),
                'liked'=>$bool,
            ];

        }
        return $this->json(['Success' => $tableData2,'Posts'=>$tableData], Response::HTTP_ACCEPTED);

    }

   
    #[Route('/RemoveFriend', name: 'app_RemoveFriend')]
    public function RemoveFriend(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $profile_id = $data['id'] ?? null;     

        if($CurrentUserToken == null || $profile_id ==  null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
    
        }
        $Currentuser = $Currentuser[0];
        $fr = $rp2->FindFriendRequestAccepted($Currentuser->getId(),$profile_id);

        if($fr ==[]){
            return $this->json(['error' => 'Dosent exist'], Response::HTTP_BAD_REQUEST);
        }

        try{
            $em = $mr->getManager();
            $em->remove($fr[0]);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        


        return $this->json(['Success' => "Unfriend Successfull"], Response::HTTP_ACCEPTED);

    }


    #[Route('/CancelFR', name: 'app_CancelFR')]
    public function CancelFR(CommentRepository $rp5,LikeRepository $rp4,UserRepository $rp ,FriendRequestRepository $rp2,PostRepository $rp3,Request $request,ManagerRegistry $mr): JsonResponse
    {
        $jsonContent = $request->getContent();
        
        // Debugging: Log the raw JSON content
        file_put_contents('php://stderr', "Request Content: $jsonContent\n");
        $data = json_decode($jsonContent, true);


        if ($data === null) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }
        $CurrentUserToken = $data['Token'] ?? null;     
        $profile_id = $data['id'] ?? null;     

        if($CurrentUserToken == null || $profile_id ==  null ){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
        }

        $Currentuser = $rp->findBy(['token'=>$CurrentUserToken]);

        if($Currentuser == []){
            return $this->json(['error' => 'Something Went Wrong'], Response::HTTP_BAD_REQUEST);
    
        }
        $Currentuser = $Currentuser[0];
        
        $fr = $rp2->FindFriendRequest($Currentuser->getId(),$profile_id);

        if($fr == []){
            return $this->json(['error' => 'it dosent exist men 3and rabi'], Response::HTTP_BAD_REQUEST);
        }


        try{
            $em = $mr->getManager();
            $em->remove($fr[0]);
            $em->flush();
            }catch(Exception $e){
                return $this->json(['error' => 'ERROR Whilte inserting Into DataBase : '.$e], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        


        return $this->json(['Success' => "Friend Request Canceled Successfuly"], Response::HTTP_ACCEPTED);

    }


}
