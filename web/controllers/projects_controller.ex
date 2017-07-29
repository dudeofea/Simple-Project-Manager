defmodule TicketSystem.ProjectsController do
	use TicketSystem.Web, :controller

	plug :put_view, TicketSystem.JSONView

	#get all developers
	def index(conn, _params) do
		rows = Repo.all(Project)
		render conn, "get.json", rows: rows
	end

	#create a new dev
	def create(conn, new_obj) do
		changeset = Project.changeset(%Project{}, new_obj)
		case Repo.insert(changeset) do
		{:ok, obj} ->
			render conn, "insert.json", id: obj
		{:error, changeset} ->
			render conn, "error.json", changeset: changeset
		end
	end

	#TODO: update something other than the name of a dev

	#TODO: delete a dev

	#return the data types of all model fields
	def schema(conn, _params) do
		render conn, "schema.json", model: Project
	end
end
