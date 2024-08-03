<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240628074924 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE friend_request CHANGE conversation_id_id conversation_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE friend_request ADD CONSTRAINT FK_F284D946B92BD7B FOREIGN KEY (conversation_id_id) REFERENCES conversation (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F284D946B92BD7B ON friend_request (conversation_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE friend_request DROP FOREIGN KEY FK_F284D946B92BD7B');
        $this->addSql('DROP INDEX UNIQ_F284D946B92BD7B ON friend_request');
        $this->addSql('ALTER TABLE friend_request CHANGE conversation_id_id conversation_id_id INT NOT NULL');
    }
}
