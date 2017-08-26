defmodule TicketSystem.PageView do
	use TicketSystem.Web, :view

	def router(match_str \\ ".*", default_route \\ "", assigns) do
		#get template name
		router_path = case assigns.conn.path_info do
			[] -> default_route
			[path | _] -> path
		end
		assigns = Map.put(assigns, :router_path, router_path)
		assigns = Map.put(assigns, :match_str, match_str)
		assigns = Map.put(assigns, :default_route, default_route)
		#render the section
		render "router.html", assigns
	end
end
