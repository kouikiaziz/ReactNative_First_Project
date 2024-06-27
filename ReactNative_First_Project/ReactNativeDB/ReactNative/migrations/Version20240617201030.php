<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240617201030 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `like` (id INT AUTO_INCREMENT NOT NULL, userid_id INT NOT NULL, INDEX IDX_AC6340B358E0A285 (userid_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE like_post (like_id INT NOT NULL, post_id INT NOT NULL, INDEX IDX_83FFB0F3859BFA32 (like_id), INDEX IDX_83FFB0F34B89032C (post_id), PRIMARY KEY(like_id, post_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `like` ADD CONSTRAINT FK_AC6340B358E0A285 FOREIGN KEY (userid_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE like_post ADD CONSTRAINT FK_83FFB0F3859BFA32 FOREIGN KEY (like_id) REFERENCES `like` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE like_post ADD CONSTRAINT FK_83FFB0F34B89032C FOREIGN KEY (post_id) REFERENCES post (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `like` DROP FOREIGN KEY FK_AC6340B358E0A285');
        $this->addSql('ALTER TABLE like_post DROP FOREIGN KEY FK_83FFB0F3859BFA32');
        $this->addSql('ALTER TABLE like_post DROP FOREIGN KEY FK_83FFB0F34B89032C');
        $this->addSql('DROP TABLE `like`');
        $this->addSql('DROP TABLE like_post');
    }
}
