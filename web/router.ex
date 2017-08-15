defmodule TicketSystem.Router do
  use TicketSystem.Web, :router

	#returns ready made pages
	pipeline :browser do
		plug :accepts, ["html"]
		plug :fetch_session
		plug :fetch_flash
		plug :protect_from_forgery
		plug :put_secure_browser_headers
	end

	#returns page sections for single page browsing
	pipeline :section do
		plug :put_layout, {TicketSystem.LayoutView, :section}
	end

	#returns data for website / other
	pipeline :api do
		plug :accepts, ["json"]
	end

	#page sections scope
	scope "/sections", TicketSystem do
		pipe_through [:browser, :section]

		get "/*path", SectionController, :get
	end

	#api scope for angular static site to use
	scope "/crud", TicketSystem do
		pipe_through :api

		resources "/developers", DevelopersController
		resources "/projects", ProjectsController
		resources "/tickets", TicketsController
	end

	#schema scope for form inputs
	scope "/schema", TicketSystem do
		pipe_through :api

		get "/developers", DevelopersController, :schema
		get "/projects", ProjectsController, :schema
		get "/tickets", TicketsController, :schema
	end

	#web page scope
	scope "/", TicketSystem do
		pipe_through :browser # Use the default browser stack

		get "/*path", PageController, :get
	end

	# #git remote scope
	# scope "/git", TicketSystem do
	# 	get "/info/refs", GitController, :info_refs
	# 	post "/git-upload-pack", GitController, :post_upload_pack
	# 	post "/git-receive-pack", GitController, :post_receive_pack
	# 	get "/*path", GitController, :index
	# end
end
