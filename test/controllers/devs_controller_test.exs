defmodule TicketSystem.DevelopersControllerTest do
	use TicketSystem.ConnCase

	test "GET /api/developers", %{conn: conn} do
		api_conn = get conn, "/api/developers"
		assert json_response(api_conn, 200) == []
	end

	test "add a developer", %{conn: conn} do
		api_conn = post conn, "/api/developers", %{username: "joe"}
		assert json_response(api_conn, 200) == []
	end
end
