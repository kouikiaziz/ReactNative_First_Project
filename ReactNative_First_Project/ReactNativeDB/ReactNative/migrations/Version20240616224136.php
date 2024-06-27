<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240616224136 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE paticipant DROP FOREIGN KEY FK_FC91741A9D86650F');
        $this->addSql('ALTER TABLE paticipant_conversation DROP FOREIGN KEY FK_6B287CB49AC0396');
        $this->addSql('ALTER TABLE paticipant_conversation DROP FOREIGN KEY FK_6B287CB4BBABFC4A');
        $this->addSql('DROP TABLE conversation');
        $this->addSql('DROP TABLE paticipant');
        $this->addSql('DROP TABLE paticipant_conversation');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE conversation (id INT AUTO_INCREMENT NOT NULL, last_message_id INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE paticipant (id INT AUTO_INCREMENT NOT NULL, user_id_id INT NOT NULL, messages_read_at DATETIME NOT NULL, INDEX IDX_FC91741A9D86650F (user_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE paticipant_conversation (paticipant_id INT NOT NULL, conversation_id INT NOT NULL, INDEX IDX_6B287CB49AC0396 (conversation_id), INDEX IDX_6B287CB4BBABFC4A (paticipant_id), PRIMARY KEY(paticipant_id, conversation_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE paticipant ADD CONSTRAINT FK_FC91741A9D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE paticipant_conversation ADD CONSTRAINT FK_6B287CB49AC0396 FOREIGN KEY (conversation_id) REFERENCES conversation (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE paticipant_conversation ADD CONSTRAINT FK_6B287CB4BBABFC4A FOREIGN KEY (paticipant_id) REFERENCES paticipant (id) ON DELETE CASCADE');
    }
}
