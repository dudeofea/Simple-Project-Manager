defmodule TicketSystem.DevelopersView do
	use TicketSystem.Web, :view

	def render(page, args) do
		json(page, args)
	end
end
