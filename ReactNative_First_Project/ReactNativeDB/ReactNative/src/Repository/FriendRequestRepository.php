<?php

namespace App\Repository;

use App\Entity\FriendRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FriendRequest>
 */
class FriendRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FriendRequest::class);
    }

    //    /**
    //     * @return FriendRequest[] Returns an array of FriendRequest objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('f.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?FriendRequest
    //    {
    //        return $this->createQueryBuilder('f')
    //            ->andWhere('f.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function FindFriendRequest($id_sender, $id_recv): array
{
    return $this->createQueryBuilder('f')
        ->andWhere('(f.id_sender = :sender AND f.id_recv = :recv) OR (f.id_sender = :recv AND f.id_recv = :sender)')
        ->setParameter('sender', $id_sender)
        ->setParameter('recv', $id_recv)
        ->orderBy('f.id', 'ASC')
        ->setMaxResults(10)
        ->getQuery()
        ->getResult();
}



public function GetUserFriendRequests($id_recv): array
{
    return $this->createQueryBuilder('f')
        ->andWhere('f.id_recv = :recv AND f.Accepted = FALSE')
        ->setParameter('recv', $id_recv)
        ->orderBy('f.id', 'ASC')
        ->getQuery()
        ->getResult();
}


public function FindSpecefic($id_sender, $id_recv): array
{
    return $this->createQueryBuilder('f')
        ->andWhere('f.id_sender = :sender AND f.id_recv = :recv')
        ->setParameter('sender', $id_sender)
        ->setParameter('recv', $id_recv)
        ->orderBy('f.id', 'ASC')
        ->setMaxResults(10)
        ->getQuery()
        ->getResult();
}

public function GetFriends($id_user): array
{
    return $this->createQueryBuilder('f')
        ->andWhere('((f.id_sender = :sender AND f.id_recv != :recv) OR (f.id_sender != :recv AND f.id_recv = :sender)) AND f.Accepted = TRUE')
        ->setParameter('sender', $id_user)
        ->setParameter('recv', $id_user)
        ->orderBy('f.id', 'ASC')
        ->getQuery()
        ->getResult();
}



public function FindFriendRequestAccepted($id_sender, $id_recv): array
{
    return $this->createQueryBuilder('f')
        ->andWhere('((f.id_sender = :sender AND f.id_recv = :recv) OR (f.id_sender = :recv AND f.id_recv = :sender)) AND f.Accepted = TRUE')
        ->setParameter('sender', $id_sender)
        ->setParameter('recv', $id_recv)
        ->orderBy('f.id', 'ASC')
        ->getQuery()
        ->getResult();
}



}
