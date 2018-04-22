defmodule TicketSystem.PageViewTest do
	use TicketSystem.ConnCase
	use Phoenix.View, root: "test/templates", pattern: "**/*"

	#pretend to be the real router, switching between app and section views
	def mock_router(assigns, path \\ nil, template \\ nil) do
		TicketSystem.PageView.router(assigns, path, template, TicketSystem.PageViewTest)
	end

	#catch thrown exception when nesting is cut short
	def mock_section_layout(view_module, view_template, assigns) do
		try do
			render(view_module, view_template, assigns)
		catch
			rendered_section -> rendered_section
		end
	end

	def clean_html(string) do
		string = Regex.replace(~r/[\t\n]/, string, "")
		Regex.replace(~r/[ ]+/, string, " ")
	end

	# #the actual test
	# test "load /" do
	# 	path = TicketSystem.PageView.get_router_path([])
	# 	assert path[:router_path] == nil
    # end
	#
	# #with full pages, these are loaded from the main app, so we need
	# #a router path to trigger the load
	# test "load /projects full page" do
	# 	path = TicketSystem.PageView.get_router_path(["projects"])
	# 	assert path[:router_path] == "projects"
	# end
	#
	# #with sections, the page is directly loaded, so the first path component
	# #(as well as /section) must be skipped, so the router path ends up being nil
	# test "load /projects section" do
	# 	path = TicketSystem.PageView.get_router_path(["sections", "projects"], true, nil, nil)
	# 	assert path[:router_path] == nil
	# 	assert path[:template] == nil
	# end
	#
	# #added this test since I noticed problems with 2-path components (no counting /sections);
	# #sections are isolated, so they should not have a router_path used for nesting deeper.
	# #I guess you could make sections not nest all the way down but that would be too complicated for not much reward
	# test "load /projects/create section" do
	# 	path = TicketSystem.PageView.get_router_path(["sections", "projects", "create"], true, nil, nil)
	# 	assert path[:router_path] == nil
	# 	assert path[:template] == nil
	# end
	#
	# test "load /projects/create full page" do
	# 	path = TicketSystem.PageView.get_router_path(["projects", "create"])
	# 	assert path[:router_path] == "projects"
	# 	assert path[:scoped_path] == ["create"]
	# 	#keep going to resolve scoped_path
	# 	path2 = TicketSystem.PageView.get_router_path(["projects", "create"], false, path[:scoped_path])
	# 	assert path2 == %{router_path: "create", scoped_path: [], template: "create"}
	# 	#try again another way
	# 	path2 = TicketSystem.PageView.get_router_path(["projects", "create"], nil, path[:scoped_path])
	# 	assert path2 == %{router_path: "create", scoped_path: [], template: "create"}
	# end

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
		page = mock_section_layout(TicketSystem.PageViewTest, "app.html", assigns) |> Phoenix.HTML.safe_to_string
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
		page = mock_section_layout(TicketSystem.PageViewTest, "app.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<p>Dogs</p>
				<router-section trigger=\"cats\"></router-section>"
		assert clean_html(page) == clean_html(ans)
	end

	test "GET /sections/dogs/cats" do
		# add get request to connection
		conn = build_conn(:get, "/sections/dogs/cats")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = mock_section_layout(TicketSystem.PageViewTest, "app.html", assigns) |> Phoenix.HTML.safe_to_string
		#we're just supposed to get the "cats" portion as this is just a section, not
		#a full page. Though the path is still /dogs/cats
		ans =  "<p>Cats</p>
				<router-section trigger=\"iguanas\"></router-section>"
		assert clean_html(page) == clean_html(ans)
	end

	test "GET /dogs/cats full page" do
		# add get request to connection
		conn = build_conn(:get, "/dogs/cats")
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = render(TicketSystem.PageViewTest, "app.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<div class=\"app\">
					<router-section trigger=\"*\" path=\"dogs\">
						<p>Dogs</p>
						<router-section trigger=\"cats\" path=\"cats\">
							<p>Cats</p>
							<router-section trigger=\"iguanas\">
							</router-section>
						</router-section>
					</router-section>
				</div>"
		assert clean_html(page) == clean_html(ans)
	end

	#test that /sections/projects DOESN'T return the contents of /sections/projects/create
	test "GET /sections/projects (prod inspired)" do
		# add get request to connection
		conn = build_conn(:get, "/sections/projects_test2")
		# set section bool
		conn = Map.put(conn, :section_page, true)
		assigns = %{conn: conn}
		assigns = Map.put(assigns, :api, [])
		page = mock_section_layout(TicketSystem.PageViewTest, "app.html", assigns) |> Phoenix.HTML.safe_to_string
		ans =  "<div class=\"projects\">
					<h2 class=\"title\">Projects</h2>
					<router-link class=\"btn add-edit-button\" path=\"create\">Add</router-link>
					<table class=\"table table-striped\">
						<thead>
							<tr>
								<td>Id</td>
								<td>Name</td>
								<td>Repo</td>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
					<router-section trigger=\"create\"></router-section>
				</div>"
		assert clean_html(page) == clean_html(ans)
	end

	#TODO: add test for when a section request has multiple sections in the last nested router-section
end
