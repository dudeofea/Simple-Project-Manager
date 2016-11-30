defmodule TicketSystem.Repo.Migrations.ChangeUserModel do
  use Ecto.Migration

  def change do
	alter table(:users) do
		add :email, :string
		remove :username
	end
  end
end
