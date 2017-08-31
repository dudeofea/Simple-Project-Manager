defmodule TicketSystem.Ticket do
  use TicketSystem.Web, :model

  @derive {Poison.Encoder, only: [:id, :name, :description, :uncertainty, :size, :difficulty, :planning, :inserted_at, :updated_at]}
  schema "tickets" do
	field :name, :string				#short description of ticket
	field :description, :string			#full description of ticket
	belongs_to :group, TicketGroup		#tickets can belong to groups to sort them by (example an email fix ticket under the group EMAIL might look like EMAIL-124: Setup local email server)
	field :uncertainty, :float			#your estimated margin for error in estimation, usually higher for bugs
	field :size, :float					#how much of a code change is involved
	field :difficulty, :float			#is this straightforward to implement or do we not even know how to start
	field :planning, :float				#how much planning is involved, this way we can guess how much time is spent coding and how much just thinking
	#field :test_required, :boolean		#is a test required for this ticket, used to catch regressions

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

defmodule TicketSystem.TicketGroup do
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
