defmodule TicketSystem.PageViewTest do
	use TicketSystem.ConnCase
	use Phoenix.View, root: "test/templates"

	def mock_render(_, template, assigns) do
		render(TicketSystem.PageViewTest, template, assigns)
	end

	test "load /" do
		path = TicketSystem.PageView.get_router_path([])
		assert path[:router_path] == nil
    end

	test "load /projects full page" do
		path = TicketSystem.PageView.get_router_path(["projects"])
		assert path[:router_path] == "projects"
	end

	test "load /projects section" do
		path = TicketSystem.PageView.get_router_path(["sections", "projects"], true, nil, nil)
		assert path[:router_path] == "projects"
	end

	test "load /projects/create full page" do
		path = TicketSystem.PageView.get_router_path(["projects", "create"])
		assert path[:router_path] == "projects"
		assert path[:scoped_path] == ["create"]
		#keep going to resolve scoped_path
		path2 = TicketSystem.PageView.get_router_path(["projects", "create"], false, path[:scoped_path])
		assert path2 == %{router_path: "create", scoped_path: [], template: nil}
		#try again another way
		path2 = TicketSystem.PageView.get_router_path(["projects", "create"], nil, path[:scoped_path])
		assert path2 == %{router_path: "create", scoped_path: [], template: nil}
	end

	test "GET /projects", assigns do
		# add get request to connection
		assigns = Map.put(assigns, :conn, get(assigns[:conn], "/projects"))
		assigns = Map.put(assigns, :api, [])
		page = TicketSystem.PageView.router(assigns, nil, &mock_render/3) |> Phoenix.HTML.safe_to_string
		assert Friendly.find(page, "router-section") == [%{
			attributes: %{"path" => "projects"},
			elements: [
				%{attributes: %{"class" => "title"}, elements: [], name: "h2", text: "Projects", texts: ["Projects"]}
			],
			name: "router-section",
			text: "",
			texts: []
		}]
	end

	test "GET /sections/projects", assigns do
		# add get request to connection
		conn = get(assigns[:conn], "/sections/projects")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = Map.put(assigns, :conn, conn)
		assigns = Map.put(assigns, :api, [])
		page = TicketSystem.PageView.router(assigns, nil, &mock_render/3) |> Phoenix.HTML.safe_to_string
		assert Friendly.find(page, "router-section") == [%{
			attributes: %{"path" => "projects"},
			elements: [
				%{attributes: %{"class" => "title"}, elements: [], name: "h2", text: "Projects", texts: ["Projects"]}
			],
			name: "router-section",
			text: "",
			texts: []
		}]
	end
end
