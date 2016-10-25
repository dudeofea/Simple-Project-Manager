defmodule TicketSystem.UserController do
	use TicketSystem.Web, :controller

	def index(conn, _params) do
		users = Repo.all(User)
		render conn, users: users
	end
end
