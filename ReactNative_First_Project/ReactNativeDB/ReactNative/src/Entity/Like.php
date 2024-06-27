<?php

namespace App\Entity;

use App\Repository\LikeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LikeRepository::class)]
#[ORM\Table(name: '`like`')]
class Like
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $userid = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?post $postid = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserid(): ?user
    {
        return $this->userid;
    }

    public function setUserid(?user $userid): static
    {
        $this->userid = $userid;

        return $this;
    }

    public function getPostid(): ?post
    {
        return $this->postid;
    }

    public function setPostid(?post $postid): static
    {
        $this->postid = $postid;

        return $this;
    }
}
