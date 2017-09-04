defmodule TicketSystem.Repo.Migrations.EditProjects do
  use Ecto.Migration

  def change do
	alter table(:projects) do
		add :git_link, :string
	end
  end
end
