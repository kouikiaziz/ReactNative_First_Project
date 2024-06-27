<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240616223950 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE paticipant_conversation (paticipant_id INT NOT NULL, conversation_id INT NOT NULL, INDEX IDX_6B287CB4BBABFC4A (paticipant_id), INDEX IDX_6B287CB49AC0396 (conversation_id), PRIMARY KEY(paticipant_id, conversation_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE paticipant_conversation ADD CONSTRAINT FK_6B287CB4BBABFC4A FOREIGN KEY (paticipant_id) REFERENCES paticipant (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE paticipant_conversation ADD CONSTRAINT FK_6B287CB49AC0396 FOREIGN KEY (conversation_id) REFERENCES conversation (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE paticipant DROP conversation_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE paticipant_conversation DROP FOREIGN KEY FK_6B287CB4BBABFC4A');
        $this->addSql('ALTER TABLE paticipant_conversation DROP FOREIGN KEY FK_6B287CB49AC0396');
        $this->addSql('DROP TABLE paticipant_conversation');
        $this->addSql('ALTER TABLE paticipant ADD conversation_id INT NOT NULL');
    }
}
