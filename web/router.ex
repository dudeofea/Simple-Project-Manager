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
		get "/registration", RegistrationController, :new
		post "/registration", RegistrationController, :create
		resources "/users", UserController

		get "/", PageController, :index
	end

  # Other scopes may use custom stacks.
  # scope "/api", TicketSystem do
  #   pipe_through :api
  # end
end
