<?php

namespace App\Repository;

use App\Entity\Like;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Like>
 */
class LikeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Like::class);
    }

    //    /**
    //     * @return Like[] Returns an array of Like objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('l.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Like
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

       public function findoutwhetherlikedornot($user_id,$post_id): ?Like
       {
           return $this->createQueryBuilder('l')
               ->andWhere('l.userid = :val AND l.postid = :val2')
               ->setParameter('val', $user_id)
               ->setParameter('val2', $post_id)
               ->getQuery()
               ->getOneOrNullResult()
           ;
       }

       public function DeleteAllLikes($post_id): void
       {
        $qb = $this->createQueryBuilder('l');

        $qb->delete()
           ->where('l.postid = :val')
           ->setParameter('val', $post_id);
    
        $query = $qb->getQuery();
        $query->execute();
       }
}
