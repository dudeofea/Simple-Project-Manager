defmodule TicketSystem.JSONViews do

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
	def json_detail({message, values}) do
		Enum.reduce values, message, fn {k, v}, acc ->
			String.replace(acc, "%{#{k}}", to_string(v))
		end
	end
	def json_detail(message) do
		message
	end

	#show a model's JSON schema / data types
	def json("schema.json", %{model: model}) do
		fields = Enum.map(model.__schema__(:fields), fn field ->
			%{
				name: field,
				type: schema_type(model.__schema__(:type, field))
			}
		end)
		%{
			primary_keys: model.__schema__(:primary_key),
			fields: fields,
			blank_form: model.__struct__
		}
	end
	def schema_type(Elixir.Ecto.DateTime) do
		"datetime"
	end
	def schema_type(type) do
		type
	end
end
