defmodule TicketSystem.TicketsController do
	use TicketSystem.Web, :controller

	#get all tickets
	def get(conn, _params) do
		rows = Ticket |> Repo.all() |> Repo.preload(:group)
		render conn, "tickets.html", rows: rows
	end

	#get all tickets
	def index(conn, _params) do
		rows = Ticket |> Repo.all() |> Repo.preload(:group)
		render conn, "get.json", rows: rows
	end

	#create a new ticket
	def create(conn, new_obj) do
		changeset = Ticket.changeset(%Ticket{}, new_obj)
		case Repo.insert(changeset) do
		{:ok, obj} ->
			render conn, "insert.json", id: obj
		{:error, changeset} ->
			render conn, "error.json", changeset: changeset
		end
	end

	#TODO: update something other than the name of a ticket

	#TODO: delete a ticket

	#return the data types of all model fields
	def schema(conn, _params) do
		render conn, "schema.json", model: Ticket
	end
end
