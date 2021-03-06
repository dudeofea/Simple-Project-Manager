defmodule TicketSystem.SectionPlug do
	import Plug.Conn

	#get the requested section
	def load_section(conn, params) do
		#add flag to conn to state that this is a section, not a page
		Map.put(conn, :section_page, true)
	end
end
