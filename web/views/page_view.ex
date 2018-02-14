defmodule TicketSystem.PageView do
	use TicketSystem.Web, :view

	def router(assigns, trigger \\ nil, default_template \\ nil, module \\TicketSystem.PageView) do
		#get the context for our router
		context = get_router_context(assigns, trigger, default_template)
		#IO.puts "#{inspect(context)} #{inspect({context.section_page, context.remaining_path, context.section_except})}"
		assigns = Map.put(assigns, :context, context)
		#get all available templates
		{_, _, names} = module.__templates__()
		assigns = Map.put(assigns, :template_names, names)
		#render the next section
		case {context.section_page, context.remaining_path, context.section_except} do
			{true, nil, false} ->
				assigns = Map.put(assigns, :context, Map.put(assigns.context, :section_except, true))
				throw render(module, context[:template] <> ".html", assigns)#if we're on the last path of a section, just render that
			_ -> render(module, "router.html", assigns)						#otherwise render the whole stack
		end
	end

	def get_router_context(assigns, trigger, default_template) do
		#get the path we have left to process
		prev_context = Map.get(assigns, :context)
		section_page = Map.get(assigns.conn, :section_page)
		path = case prev_context == nil do
			false -> prev_context.remaining_path	#keep going deeper in nest path
			true ->
				#remove /sections from path info if we're on a section page
				case section_page do
					true -> Enum.take(assigns.conn.path_info, 1 - length(assigns.conn.path_info))	#take raw path, minus /sections
					_ -> assigns.conn.path_info		#just take the raw path
				end
		end
		#remove head as root path (what we're currently on), tail become nested remaining path
		[current_path | remaining_path] = case path do
			nil -> [nil]
			[] -> [nil]
			p -> p
		end
		#clean up remaining path
		remaining_path = case remaining_path do
			[] -> nil
			rp -> rp
		end
		#match path to see if TRIGGERED, if so load templated
		template = case {default_template, trigger, current_path} do
			{_, _, nil} -> nil				#don't load if we don't have a current path
			{nil, nil, cp} -> cp			#load current path if we have one
			{nil, t, _} -> t				#no default template, load trigger
			{dt, _, _}  -> dt				#load default template
		end
		#IO.puts "template: #{inspect({default_template, trigger, current_path})} -> #{inspect(template)}"
		#IO.puts "context: current_path: #{inspect(current_path)} remaining_path: #{inspect(remaining_path)} path: #{inspect(path)} template: #{inspect(template)}"
		section_except = case prev_context do
			nil -> false
			pc -> Map.get(pc, :section_except)
		end
		%{
			current_path: current_path,			#the current path this section is
			remaining_path: remaining_path,		#what's left to process/route in the path
			template: template,					#template to load is either specified, based on trigger, or simply whatever was requested
			trigger: trigger || "*",			#the current trigger for this section
			section_page: section_page,
			section_except: section_except
		}
	end
end
