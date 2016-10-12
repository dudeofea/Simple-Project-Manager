defmodule TicketSystem.User do
  use TicketSystem.Web, :model

  schema "users" do
    field :username, :string
    field :encrypted_password, :string
	field :password, :string, virtual: true
	field :password_confirmation, :string, virtual: true

    timestamps()
  end

  @required_fields ~w(username password password_confirmation)
  @optional_fields ~w()

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:username)
	|> validate_length(:password, min: 1)
	|> validate_length(:password_confirmation, min: 1)
	|> validate_confirmation(:password)
  end
end
