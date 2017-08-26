defmodule TicketSystem.Router do
	use TicketSystem.Web, :router
	import TicketSystem.SectionPlug

	#returns ready made pages
	pipeline :browser do
		plug :accepts, ["html"]
		plug :fetch_session
		plug :fetch_flash
		plug :protect_from_forgery
		plug :put_secure_browser_headers
		plug :put_view, TicketSystem.PageView
	end

	#returns page sections for single page browsing
	pipeline :section do
		plug :load_section
		plug :put_view, TicketSystem.PageView
		plug :put_layout, {TicketSystem.LayoutView, :section}	#use the section.html.eex layout instead of the default app.html.eex
	end

	#returns data for website / other
	pipeline :api do
		plug :accepts, ["json"]
		plug :put_view, TicketSystem.JSONView
	end

	#list of controllers, each of these must implement functions for: get, index, create, and schema at a minimum
	controllers = [
		%{path: "/developers", controller: DevelopersController},
		%{path: "/projects", controller: ProjectsController},
		%{path: "/tickets", controller: TicketsController}
	]

	#api scope for angular static site to use
	scope "/crud", TicketSystem do
		pipe_through :api

		for %{path: path, controller: controller} <- controllers do
			resources path, controller
		end
	end

	#schema scope for form inputs
	scope "/schema", TicketSystem do
		pipe_through :api

		for %{path: path, controller: controller} <- controllers do
			get path, controller, :schema
		end
	end

	#page sections scope
	scope "/sections", TicketSystem do
		pipe_through [:browser, :section]

		for %{path: path, controller: controller} <- controllers do
			get path, controller, :get
		end
	end

	#web page scope
	scope "/", TicketSystem do
		pipe_through :browser # Use the default browser stack

		for %{path: path, controller: controller} <- controllers do
			get path, controller, :get
		end
	end
end
