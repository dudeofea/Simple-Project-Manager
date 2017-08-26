defmodule TicketSystem.DevelopersController do
	use TicketSystem.Web, :controller

	#get all developers
	def get(conn, _params) do
		users = Repo.all(User)
		render conn, "developers.html", api: users
	end

	#get all developers
	def index(conn, _params) do
		users = Repo.all(User)
		render conn, "get.json", rows: users
	end

	#create a new dev
	def create(conn, new_user) do
		changeset = User.changeset(%User{}, new_user)
		case Repo.insert(changeset) do
		{:ok, user} ->
			render conn, "insert.json", id: user
		{:error, changeset} ->
			render conn, "error.json", changeset: changeset
		end
	end

	#TODO: update something other than the name of a dev

	#TODO: delete a dev

	#return the data types of all model fields
	def schema(conn, _params) do
		render conn, "schema.json", model: User
	end
end
