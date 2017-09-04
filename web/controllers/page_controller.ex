defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, _) do
		[view_path] = case conn.section_page do
			true -> conn.params["path"]
			false -> ["app"]
		end
		require IEx; IEx.pry
		render conn, view_path <> ".html"
	end
end
