defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, params) do
		render conn, "app.html"
	end
end
