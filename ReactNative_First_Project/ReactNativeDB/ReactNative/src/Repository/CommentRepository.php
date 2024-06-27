<?php

namespace App\Repository;

use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    //    /**
    //     * @return Comment[] Returns an array of Comment objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Comment
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function DeleteAllComments($post_id): void
       {
        $qb = $this->createQueryBuilder('c');

        $qb->delete()
           ->where('c.postid = :val')
           ->setParameter('val', $post_id);
    
        $query = $qb->getQuery();
        $query->execute();
       }

           public function finduserscommentinpostx($userid,$postid): array
       {
           return $this->createQueryBuilder('c')
               ->andWhere('c.userid = :val AND c.postid = :val2')
               ->setParameter('val', $userid)
               ->setParameter('val2', $postid)
               ->getQuery()
               ->getResult()
           ;
       }
}
