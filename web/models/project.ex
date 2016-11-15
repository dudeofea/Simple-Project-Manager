defmodule TicketSystem.Project do
  use TicketSystem.Web, :model

  schema "projects" do
	field :name, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end

  #actions to take when creating a project
  def create(changeset, repo) do
	  changeset
	  |> repo.insert()
  end
end
