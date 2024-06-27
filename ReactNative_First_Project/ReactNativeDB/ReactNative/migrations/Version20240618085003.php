<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240618085003 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE comment (id INT AUTO_INCREMENT NOT NULL, userid_id INT NOT NULL, postid_id INT NOT NULL, content VARCHAR(255) NOT NULL, INDEX IDX_9474526C58E0A285 (userid_id), INDEX IDX_9474526CEB348947 (postid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C58E0A285 FOREIGN KEY (userid_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CEB348947 FOREIGN KEY (postid_id) REFERENCES post (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526C58E0A285');
        $this->addSql('ALTER TABLE comment DROP FOREIGN KEY FK_9474526CEB348947');
        $this->addSql('DROP TABLE comment');
    }
}
