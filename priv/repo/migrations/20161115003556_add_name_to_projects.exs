defmodule TicketSystem.Repo.Migrations.AddNameToProjects do
  use Ecto.Migration

  def change do
	  alter table(:projects) do
		  add :name, :string
	end
  end
end
