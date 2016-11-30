defmodule TicketSystem.DevelopersView do
	use TicketSystem.Web, :view
	require IEx

	#returns the result of a get
	def render("get.json", %{rows: rows}) do
		rows
	end

	#returns the result of an insert
	def render("insert.json", _assigns) do
		[]
	end

	#return an error message
	def render("error.json", %{changeset: changeset}) do
		errors = Enum.map(changeset.errors, fn {field, detail} ->
		%{
			source: %{ pointer: "/data/attributes/#{field}" },
			title: "Invalid Attribute",
			detail: render_detail(detail)
		}
		end)
		%{errors: errors}
	end

	def render_detail({message, values}) do
		Enum.reduce values, message, fn {k, v}, acc ->
			String.replace(acc, "%{#{k}}", to_string(v))
		end
	end
	def render_detail(message) do
		message
	end
end