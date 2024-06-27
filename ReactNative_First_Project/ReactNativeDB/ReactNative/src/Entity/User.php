<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(length: 255,nullable:true)]
    private ?string $deviceToken = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $token = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $AccountCreationDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $LastLogin = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $RecoveryCode = null;

    #[ORM\Column(length: 255,nullable: true)]
    private ?string $image = null;

   

    public function __construct()
    {
    }

 
   

   


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getDeviceToken(): ?string
    {
        return $this->deviceToken;
    }

    public function setDeviceToken(?string $deviceToken): static
    {
        $this->deviceToken = $deviceToken;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $Token): static
    {
        $this->token = $Token;

        return $this;
    }

    public function getAccountCreationDate(): ?\DateTimeInterface
    {
        return $this->AccountCreationDate;
    }

    public function setAccountCreationDate(\DateTimeInterface $AccountCreationDate): static
    {
        $this->AccountCreationDate = $AccountCreationDate;

        return $this;
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->LastLogin;
    }

    public function setLastLogin(\DateTimeInterface $LastLogin): static
    {
        $this->LastLogin = $LastLogin;

        return $this;
    }

    public function getRecoveryCode(): ?string
    {
        return $this->RecoveryCode;
    }

    public function setRecoveryCode(?string $RecoveryCode): static
    {
        $this->RecoveryCode = $RecoveryCode;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }



   
   
}
