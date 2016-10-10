defmodule TicketSystem.PageController do
  use TicketSystem.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
