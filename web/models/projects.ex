defmodule TicketSystem.Project do
  use TicketSystem.Web, :model

  def labels do %{name: "Name", git_link: "Git Link"} end

  schema "projects" do
	field :name, :string
	field :git_link, :string

	timestamps()
  end

  @required_fields ~w(name git_link)a
  @optional_fields ~w()

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    #|> validate_required(@required_fields)
	|> unique_constraint(:name)
  end
end
