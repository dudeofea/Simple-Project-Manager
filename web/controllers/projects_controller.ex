defmodule TicketSystem.ProjectsController do
	use TicketSystem.Web, :controller

	#get all projects
	def get(conn, _params) do
		rows = Repo.all(Project)
		render conn, "projects.html", api: rows
	end

	#get all projects
	def index(conn, _params) do
		rows = Repo.all(Project)
		render conn, "get.json", rows: rows
	end

	#create a new project
	def create(conn, new_obj) do
		IO.puts "obj: #{inspect(new_obj)}"
		changeset = Project.changeset(%Project{}, new_obj)
		case Repo.insert(changeset) do
		{:ok, obj} ->
			render conn, "insert.json", id: obj
		{:error, changeset} ->
			render conn, "error.json", changeset: changeset
		end
	end

	#TODO: update something other than the name of a project

	#TODO: delete a project

	#return the data types of all model fields
	def schema(conn, _params) do
		render conn, "schema.json", model: Project
	end
end
