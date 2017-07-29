defmodule TicketSystem.Repo.Migrations.CreateTickets do
  use Ecto.Migration

  def change do
    create table(:tickets) do
		add :name, :string
		add :description, :string
		add :uncertainty, :float
		add :size, :float
		add :difficulty, :float
		add :planning, :float
		add :group_id, :integer

		timestamps()
    end

	create table(:ticket_groups) do
		add :name, :string

		timestamps()
    end
  end
end
