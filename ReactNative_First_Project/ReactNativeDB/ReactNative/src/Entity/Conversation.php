<?php

namespace App\Entity;

use App\Repository\ConversationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ConversationRepository::class)]
class Conversation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $user_1 = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $user_2 = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser1(): ?user
    {
        return $this->user_1;
    }

    public function setUser1(?user $user_1): static
    {
        $this->user_1 = $user_1;

        return $this;
    }

    public function getUser2(): ?user
    {
        return $this->user_2;
    }

    public function setUser2(?user $user_2): static
    {
        $this->user_2 = $user_2;

        return $this;
    }
}
