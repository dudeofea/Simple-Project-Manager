defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, _) do
		require IEx; IEx.pry
		view_path = case conn.section_page do
			true -> Enum.join(conn.params["path"], "/")
			false -> "app"
		end
		render conn, view_path <> ".html"
	end
end
