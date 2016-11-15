defmodule TicketSystem.ProjectController do
	use TicketSystem.Web, :controller
	alias TicketSystem.Project

	def index(conn, _params) do
		changeset = Project.changeset(%Project{})
		render conn, blank_project: changeset
	end

	#TODO: add endpoint for adding a new project
	def create(conn, %{"project" => project}) do
		changeset = Project.changeset(%Project{}, project)

		case Project.create(changeset, TicketSystem.Repo) do
			{:ok, _changeset} ->
				conn
				|> put_flash(:info, "Project created")
				|> redirect(to: "/")
			{:error, _changeset} ->
				conn
				|> put_flash(:info, "Unable to create project")
				|> render("index.html", changeset: changeset)
		end
	end
end
