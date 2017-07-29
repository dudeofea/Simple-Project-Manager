defmodule TicketSystem.Tickets do
  use TicketSystem.Web, :model

  schema "tickets" do
	field :name, :string
	field :description, :string
	belongs_to :group, TicketGroup
	field :uncertainty, :float
	field :size, :float
	field :difficulty, :float
	field :planning, :float

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
end

defmodule TicketSystem.TicketGroups do
  use TicketSystem.Web, :model

  schema "ticket_groups" do
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
end
