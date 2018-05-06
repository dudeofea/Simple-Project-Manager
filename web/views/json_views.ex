defmodule TicketSystem.JSONView do
	use TicketSystem.Web, :view

	def render(page, args) do
		json(page, args)
	end

	#returns the result of a get
	def json("get.json", %{rows: rows}) do
		rows
	end
	#returns the result of an insert
	def json("insert.json", _assigns) do
		[]
	end
	#return an error message
	def json("error.json", %{changeset: changeset}) do
		errors = Enum.map(changeset.errors, fn {field, detail} ->
			%{
				source: %{ pointer: "/data/attributes/#{field}" },
				title: "Invalid Attribute",
				detail: json_detail(detail)
			}
		end)
		%{errors: errors}
	end
	#show a model's JSON schema / data types
	def json("schema.json", %{model: model}) do
		#TODO: auto Nameize labels that aren't defined and aren't updated/inserted
		#TODO: sort labels into fields
		fields = Enum.map(model.__schema__(:fields), fn field ->
			%{
				name: field,
				type: schema_type(model.__schema__(:type, field)),
				label: model.labels[field]
			}
		end)
		%{
			primary_keys: model.__schema__(:primary_key),
			fields: fields,
			blank_form: filter_blank(model)
		}
	end

	def filter_blank(model) do
		struct = model.__struct__
		primary = [:id]
		Enum.filter(Map.to_list(struct), fn {k, _} ->
			case {k, k in primary} do
				{x, _} when x in [:__struct__, :__meta__, :updated_at, :inserted_at] ->
					false
				{_, true} ->
					false
				_ ->
					true
			end
		end) |> Enum.map(fn {k, v} ->
			%{
				name: k,
				default: v
			}
		end)
		#TODO: sort list by order given in model
	end

	def schema_type(type) do
		case type do
			t when t == Elixir.Ecto.DateTime or t == :naive_datetime ->
				"datetime"
			_ ->
				type
		end
	end

	def json_detail({message, values}) do
		Enum.reduce values, message, fn {k, v}, acc ->
			String.replace(acc, "%{#{k}}", to_string(v))
		end
	end
	def json_detail(message) do
		message
	end
end
