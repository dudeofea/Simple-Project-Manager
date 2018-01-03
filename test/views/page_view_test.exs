defmodule TicketSystem.PageViewTest do
	use TicketSystem.ConnCase
	use Phoenix.View, root: "test/templates"

	#helper functions
	def mock_router(assigns, template) do
		TicketSystem.PageView.router(assigns, template, TicketSystem.PageViewTest)
	end

	def clean_html(string) do
		string = Regex.replace(~r/[\t\n]/, string, "")
		Regex.replace(~r/[ ]+/, string, " ")
	end

	#the actual test
	test "load /" do
		path = TicketSystem.PageView.get_router_path([])
		assert path[:router_path] == nil
    end

	#with full pages, these are loaded from the main app, so we need
	#a router path to trigger the load
	test "load /projects full page" do
		path = TicketSystem.PageView.get_router_path(["projects"])
		assert path[:router_path] == "projects"
	end

	#with sections, the page is directly loaded, so the first path component
	#(as well as /section) must be skipped, so the router path ends up being nil
	test "load /projects section" do
		path = TicketSystem.PageView.get_router_path(["sections", "projects"], true, nil, nil)
		assert path[:router_path] == nil
		assert path[:template] == nil
	end

	test "load /projects/create full page" do
		path = TicketSystem.PageView.get_router_path(["projects", "create"])
		assert path[:router_path] == "projects"
		assert path[:scoped_path] == ["create"]
		#keep going to resolve scoped_path
		path2 = TicketSystem.PageView.get_router_path(["projects", "create"], false, path[:scoped_path])
		assert path2 == %{router_path: "create", scoped_path: [], template: "create"}
		#try again another way
		path2 = TicketSystem.PageView.get_router_path(["projects", "create"], nil, path[:scoped_path])
		assert path2 == %{router_path: "create", scoped_path: [], template: "create"}
	end

	test "GET /projects" do
		# add get request to connection
		assigns = %{conn: build_conn(:get, "/projects_test1")}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "projects_test1.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<h2 class=\"title\">Projects</h2>"
		assert clean_html(page) == clean_html(ans)
	end

	test "GET /sections/projects" do
		# add get request to connection
		conn = build_conn(:get, "/sections/projects_test1")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "projects_test1.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<h2 class=\"title\">Projects</h2>"
		assert clean_html(page) == clean_html(ans)
	end

	test "GET /sections/dogs" do
		# add get request to connection
		conn = build_conn(:get, "/sections/dogs")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "dogs.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<p>Dogs</p>
				<router-section template=\"cats\"></router-section>"
		assert clean_html(page) == clean_html(ans)
	end

	@tag :debug
	test "GET /sections/dogs/cats" do
		# add get request to connection
		conn = build_conn(:get, "/sections/dogs/cats")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "cats.html", assigns) |> Phoenix.HTML.safe_to_string
		#we're just supposed to get the "cats" portion as this is just a section, not
		#a full page. Though the path is still /dogs/cats
		ans =  "<p>Cats</p>
				<router-section template=\"iguanas\"></router-section>"
		assert clean_html(page) == clean_html(ans)
	end

	test "GET /dogs/cats full page" do
		# add get request to connection
		conn = build_conn(:get, "/dogs/cats")
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "dogs.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<p>Dogs</p>
				<router-section path=\"cats\" template=\"cats\">
					<p>Cats</p>
					<router-section template=\"iguanas\">
					</router-section>
				</router-section>"
		assert clean_html(page) == clean_html(ans)
	end
end
