defmodule TicketSystem.PageController do
	use TicketSystem.Web, :controller

	#get the requested section
	def get(conn, _) do
		view_path = case Map.has_key?(conn, :section_page) and conn.section_page do
			true -> Enum.join(conn.params["path"], "/")
			false -> "app"
		end
		render conn, view_path <> ".html"
	end
end
