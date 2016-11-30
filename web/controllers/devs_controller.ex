defmodule TicketSystem.DevelopersController do
	use TicketSystem.Web, :controller
	require IEx

	#get all developers
	def index(conn, _params) do
		users = Repo.all(User)
		#TODO: use a global view for get / insert / update / delete
		render conn, "get.json", rows: users
	end

	#TODO: create a new dev
	def create(conn, new_user) do
		changeset = User.changeset(%User{}, new_user)
		case Repo.insert(changeset) do
		{:ok, user} ->
			render conn, "insert.json", id: user
		{:error, changeset} ->
			IEx.pry
			render conn, "error.json", changeset: changeset
		end
	end
	#TODO: - Add a user account with same name

	#TODO: update something other than the name of a dev

	#TODO: delete a dev
end
