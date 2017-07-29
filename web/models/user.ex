defmodule TicketSystem.User do
  use TicketSystem.Web, :model

  @derive {Poison.Encoder, only: [:email, :id, :inserted_at, :updated_at]}
  schema "users" do
    field :email, :string
    field :encrypted_password, :string
	field :password, :string, virtual: true
	field :password_confirmation, :string, virtual: true

    timestamps()
  end

  @required_fields ~w(email)
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
