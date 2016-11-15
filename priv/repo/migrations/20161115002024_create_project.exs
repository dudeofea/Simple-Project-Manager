defmodule TicketSystem.Repo.Migrations.CreateProject do
  use Ecto.Migration

  def change do
    create table(:projects) do

      timestamps()
    end

  end
end
