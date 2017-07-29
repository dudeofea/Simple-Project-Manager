defmodule TicketSystem.TicketsTest do
  use TicketSystem.ModelCase

  alias TicketSystem.Tickets

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Tickets.changeset(%Tickets{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Tickets.changeset(%Tickets{}, @invalid_attrs)
    refute changeset.valid?
  end
end
