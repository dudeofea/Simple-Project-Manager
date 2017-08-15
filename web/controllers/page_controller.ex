defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, params) do
		path = params["path"] |> Enum.join("/")
		render conn, "app.html"
	end
end
