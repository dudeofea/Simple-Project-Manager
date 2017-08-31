defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, _) do
		render conn, "app.html"
	end
end
