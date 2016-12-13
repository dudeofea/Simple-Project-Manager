defmodule TicketSystem.Router do
  use TicketSystem.Web, :router

	pipeline :browser do
		plug :accepts, ["html"]
		plug :fetch_session
		plug :fetch_flash
		plug :protect_from_forgery
		plug :put_secure_browser_headers
	end

	pipeline :api do
		plug :accepts, ["json"]
	end

	#web page scope
	scope "/", TicketSystem do
		pipe_through :browser # Use the default browser stack

		get "/", PageController, :index
		get "/developers", PageController, :index
		get "/projects", PageController, :index
		get "/tickets", PageController, :index
		get "/servers", PageController, :index
		get "/clients", PageController, :index
	end

	#api scope for angular static site to use
	scope "/crud", TicketSystem do
		pipe_through :api

		resources "/developers", DevelopersController
	end

	#schema scope for form inputs
	scope "/schema", TicketSystem do
		pipe_through :api

		get "/developers", DevelopersController, :schema
	end

	#git remote scope
	scope "/git", TicketSystem do
		get "/info/refs", GitController, :info_refs
		post "/git-upload-pack", GitController, :post_upload_pack
		post "/git-receive-pack", GitController, :post_receive_pack
		get "/*path", GitController, :index
	end
end
