<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240616005528 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE friend_requests DROP FOREIGN KEY FK_EC63B01B76110FBA');
        $this->addSql('ALTER TABLE friend_requests_user DROP FOREIGN KEY FK_62AE87C2464C1717');
        $this->addSql('ALTER TABLE friend_requests_user DROP FOREIGN KEY FK_62AE87C2A76ED395');
        $this->addSql('DROP TABLE friend_requests');
        $this->addSql('DROP TABLE friend_requests_user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE friend_requests (id INT AUTO_INCREMENT NOT NULL, id_sender_id INT NOT NULL, INDEX IDX_EC63B01B76110FBA (id_sender_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE friend_requests_user (friend_requests_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_62AE87C2A76ED395 (user_id), INDEX IDX_62AE87C2464C1717 (friend_requests_id), PRIMARY KEY(friend_requests_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE friend_requests ADD CONSTRAINT FK_EC63B01B76110FBA FOREIGN KEY (id_sender_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend_requests_user ADD CONSTRAINT FK_62AE87C2464C1717 FOREIGN KEY (friend_requests_id) REFERENCES friend_requests (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE friend_requests_user ADD CONSTRAINT FK_62AE87C2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }
}
