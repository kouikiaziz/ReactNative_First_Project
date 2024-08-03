<?php

namespace App\Repository;

use App\Entity\Conversation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Conversation>
 */
class ConversationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Conversation::class);
    }

    //    /**
    //     * @return Conversation[] Returns an array of Conversation objects
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

    //    public function findOneBySomeField($value): ?Conversation
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

       public function GetAllConversationsWhereUserIdExists($value): array
       {
           return $this->createQueryBuilder('c')
               ->andWhere('c.user_1 = :val OR c.user_2 = :val')
               ->setParameter('val', $value)
               ->orderBy('c.id', 'ASC')
               ->getQuery()
               ->getResult()
           ;
       }



       public function LookforConversationbettweentwousers($value1,$value2): array
       {
           return $this->createQueryBuilder('c')
               ->andWhere('(c.user_1 = :val1 AND c.user_2 = :val2 ) OR (c.user_1 = :val2 AND c.user_2 = :val1)')
               ->setParameter('val1', $value1)
               ->setParameter('val2', $value2)
               ->orderBy('c.id', 'ASC')
               ->getQuery()
               ->getResult()
           ;
       }
}
