use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :ticket_system, TicketSystem.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :ticket_system, TicketSystem.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "ticket_test",
  password: "test",
  database: "ticket_system_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
