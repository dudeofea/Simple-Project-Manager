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

	#TODO: add api scope for angular static site to use

	#git remote scope
	scope "/git", TicketSystem do
		get "/info/refs", GitController, :info_refs
		post "/git-upload-pack", GitController, :post_upload_pack
		post "/git-receive-pack", GitController, :post_receive_pack
		get "/*path", GitController, :index
	end

  # Other scopes may use custom stacks.
  # scope "/api", TicketSystem do
  #   pipe_through :api
  # end
end
