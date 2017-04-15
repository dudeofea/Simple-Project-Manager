defmodule TicketSystem.ProjectsTest do
  use TicketSystem.ModelCase

  alias TicketSystem.Projects

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Projects.changeset(%Projects{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Projects.changeset(%Projects{}, @invalid_attrs)
    refute changeset.valid?
  end
end
