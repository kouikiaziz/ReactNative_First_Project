<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240628074344 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE conversation (id INT AUTO_INCREMENT NOT NULL, user_1_id INT NOT NULL, user_2_id INT NOT NULL, INDEX IDX_8A8E26E98A521033 (user_1_id), INDEX IDX_8A8E26E998E7BFDD (user_2_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E98A521033 FOREIGN KEY (user_1_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE conversation ADD CONSTRAINT FK_8A8E26E998E7BFDD FOREIGN KEY (user_2_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE conversation DROP FOREIGN KEY FK_8A8E26E98A521033');
        $this->addSql('ALTER TABLE conversation DROP FOREIGN KEY FK_8A8E26E998E7BFDD');
        $this->addSql('DROP TABLE conversation');
    }
}
