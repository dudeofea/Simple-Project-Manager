defmodule TicketSystem.PageView do
	use TicketSystem.Web, :view

	def router(assigns, trigger \\ nil, default_template \\ nil, module \\TicketSystem.PageView) do
		#get the context for our router
		context = get_router_context(assigns, trigger, default_template)
		#IO.puts "#{inspect(assigns)} #{inspect(context)}"
		assigns = Map.put(assigns, :context, context)
		#get all available templates
		{_, _, names} = module.__templates__()
		assigns = Map.put(assigns, :template_names, names)
		#render the section
		render(module, "router.html", assigns)
	end

	def get_router_context(assigns, trigger, default_template) do
		#get the path we have left to process
		prev_context = Map.get(assigns, :context)
		path = case prev_context == nil do
			false -> prev_context.remaining_path	#keep going deeper in nest path
			true ->
				#remove /sections/<section_name> from path info if we're on a section page
				#we remove <section_name> as we are currently on that section and don't want
				#to nest into it twice
				case Map.get(assigns.conn, :section_page) != nil do
					true -> Enum.take(assigns.conn.path_info, 2 - length(assigns.conn.path_info))	#take raw path, minus /sections
					false -> assigns.conn.path_info		#just take the raw path
				end
		end
		#remove head as root path (what we're currently on), tail become nested remaining path
		[current_path | remaining_path] = case path do
			nil -> [nil]
			[] -> [nil]
			p -> p
		end
		#we don't need to nest when loading sections
		remaining_path = case Map.get(assigns.conn, :section_page) do
			true -> nil
			_ -> remaining_path
		end
		#match path to see if TRIGGERED, if so load templated
		template = case {default_template, trigger, current_path} do
			{_, _, nil} -> nil				#don't load if we don't have a current path
			{nil, nil, cp} -> cp			#load current path if we have one
			{nil, t, _} -> t				#no default template, load trigger
			{dt, _, _}  -> dt				#load default template
		end
		IO.puts "template: #{inspect({default_template, trigger, current_path})} -> #{inspect(template)}"
		#IO.puts "context: current_path: #{inspect(current_path)} remaining_path: #{inspect(remaining_path)} path: #{inspect(path)} template: #{inspect(template)}"
		%{
			current_path: current_path,			#the current path this section is
			remaining_path: remaining_path,		#what's left to process/route in the path
			template: template,					#template to load is either specified, based on trigger, or simply whatever was requested
			trigger: trigger || "*"				#the current trigger for this section
		}
	end
end
