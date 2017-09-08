defmodule TicketSystem.PageView do
	use TicketSystem.Web, :view

	def router(assigns, template \\ nil) do
		#get template name
		current_path = case Map.has_key?(assigns, :scoped_path) do
			true -> assigns.scoped_path
			false ->
				#remove /sections/<section_name> from path info if we're on a section page
				case Map.has_key?(assigns.conn, :section_page) and assigns.conn.section_page do
					true -> Enum.take(assigns.conn.path_info, 2 - length(assigns.conn.path_info))
					false -> assigns.conn.path_info
				end
		end
		#remove head as router_path, tail become nested scoped_path
		[router_path | scoped_path] = case current_path do
			[] -> [nil]
			path -> path
		end
		assigns = Map.put(assigns, :router_path, router_path)
		assigns = Map.put(assigns, :scoped_path, scoped_path)
		assigns = Map.put(assigns, :template, template)
		require IEx; IEx.pry
		#render the section
		render "router.html", assigns
	end
end
