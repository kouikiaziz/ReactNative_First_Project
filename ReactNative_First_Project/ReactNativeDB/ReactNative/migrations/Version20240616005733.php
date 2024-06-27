<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240616005733 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE friend_request (id INT AUTO_INCREMENT NOT NULL, id_sender_id INT NOT NULL, id_recv_id INT NOT NULL, INDEX IDX_F284D9476110FBA (id_sender_id), INDEX IDX_F284D9469F9C71A (id_recv_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D9476110FBA FOREIGN KEY (id_sender_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D9469F9C71A FOREIGN KEY (id_recv_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE friend_request DROP FOREIGN KEY FK_F284D9476110FBA');
        $this->addSql('ALTER TABLE friend_request DROP FOREIGN KEY FK_F284D9469F9C71A');
        $this->addSql('DROP TABLE friend_request');
    }
}
