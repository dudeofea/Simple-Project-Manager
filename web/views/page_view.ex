defmodule TicketSystem.PageView do
	use TicketSystem.Web, :view

	#route requested templates both by section (return most nested view) or
	#by page (return entire nested view stack)
	def router(assigns, template \\ nil, renderer \\ &Phoenix.View.render/3) do
		#IO.puts inspect(assigns.conn)
		path = get_router_path(assigns.conn.path_info, Map.get(assigns.conn, :section_page), Map.get(assigns, :scoped_path), template)
		assigns = Map.merge(assigns, path)
		#IO.puts "#{inspect(path)} #{inspect(assigns.conn.path_info)}"
		#render the section
		renderer.(TicketSystem.PageView, "router.html", assigns)
	end

	#determine what path to route to
	def get_router_path(path, section_page \\ nil, scoped_path \\ nil, template \\ nil) do
		#get template name
		current_path = case scoped_path != nil do
			true -> scoped_path
			false ->
				#remove /sections/<section_name> from path info if we're on a section page
				#we remove <section_name> as we are currently on that section and don't want
				#to nest into it twice
				case section_page != nil do
					true -> Enum.take(path, 2 - length(path))
					false -> path
				end
		end
		#remove head as router_path, tail become nested scoped_path
		[router_path | new_scoped_path] = case current_path do
			[] -> [nil]
			cpath -> cpath
		end
		%{
			router_path: router_path,
			scoped_path: new_scoped_path,
			template: template || router_path
		}
	end
end
