defmodule TicketSystem.SectionController do
	use TicketSystem.Web, :controller

	plug :put_view, TicketSystem.PageView

	#get the requested section
	def get(conn, _params) do
		#remove /sections from path
		[ _ | path ] = conn.path_info
		conn = Map.put(conn, :path_info, path)
		#get template path
		template_path = path |> Enum.join("/")
		require IEx; IEx.pry
		render conn, template_path <> ".html"
	end
end
