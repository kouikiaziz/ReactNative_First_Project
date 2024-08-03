<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240628080423 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, conversation_id_id INT NOT NULL, sender_id_id INT NOT NULL, content VARCHAR(255) NOT NULL, INDEX IDX_B6BD307F6B92BD7B (conversation_id_id), INDEX IDX_B6BD307F6061F7CF (sender_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F6B92BD7B FOREIGN KEY (conversation_id_id) REFERENCES conversation (id)');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F6061F7CF FOREIGN KEY (sender_id_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F6B92BD7B');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY FK_B6BD307F6061F7CF');
        $this->addSql('DROP TABLE message');
    }
}
