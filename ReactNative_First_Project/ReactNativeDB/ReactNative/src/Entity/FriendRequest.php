<?php

namespace App\Entity;

use App\Repository\FriendRequestRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FriendRequestRepository::class)]
class FriendRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $id_sender = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $id_recv = null;

    #[ORM\Column]
    private ?bool $Accepted = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdSender(): ?user
    {
        return $this->id_sender;
    }

    public function setIdSender(?user $id_sender): static
    {
        $this->id_sender = $id_sender;

        return $this;
    }

    public function getIdRecv(): ?user
    {
        return $this->id_recv;
    }

    public function setIdRecv(?user $id_recv): static
    {
        $this->id_recv = $id_recv;

        return $this;
    }

    public function isAccepted(): ?bool
    {
        return $this->Accepted;
    }

    public function setAccepted(bool $Accepted): static
    {
        $this->Accepted = $Accepted;

        return $this;
    }
}
