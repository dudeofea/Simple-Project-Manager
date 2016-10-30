defmodule TicketSystem.GitController do
	use TicketSystem.Web, :controller
	alias TicketSystem.GitPort

	#get a list of refs in a git repo, to give client an idea of what to clone
	def info_refs(conn, %{"service" => "git-upload-pack"}) do
		packet = pkt_line("# service=git-upload-pack\n")
		packet = packet <> GitPort.upload_pack("/home/denis/Documents/anonument-copy")
		send_git_response conn, "application/x-git-upload-pack-advertisement", packet
	end

	#get a pack for a certain reference (posted by the client), and send all objects under that reference
	def post_upload_pack(conn, _params) do
		data = read_long_body(conn)
		packet = GitPort.post_upload_pack("/home/denis/Documents/anonument-copy", data)
		send_git_response conn, "application/x-git-upload-pack-result", packet
	end

	#get a specific reference in our git repo
	def index(conn, _params) do
		conn |> resp(200, "")
	end

	#  thanks to Adrien Anselme (https://github.com/adanselm/exgitd/blob/master/web/controllers/git_controller.ex)
	#  for these helper methods, as well as some base code above

	#turn a string into pkt-line format
	defp pkt_line(line) do
		packetSize = Integer.to_string(String.length(line) + 4, 16)
		packetSize = String.rjust(String.downcase(packetSize), 4, ?0)
		"#{packetSize}#{line}0000"
	end

	#send a response back with headers
	defp send_git_response(conn, content_type, data) do
		# Can't use Phoenix shortcuts because we need to control the
		# content type and charset.
		conn
		|> put_resp_header("Expires", "Fri, 01 Jan 1980 00:00:00 GMT")
		|> put_resp_header("Cache-Control", "no-cache, max-age=0, must-revalidate")
		|> put_resp_header("Pragma", "no-cache")
		|> put_resp_content_type(content_type, nil)
		|> send_resp(200, data)
	end

	#read the body from connection, append all chunks together
	defp read_long_body(conn) do 	#first call / simple call
		read_long_body conn, ""
	end
	defp read_long_body(conn, accumulated) do 		#recursive call / detailed call
		case read_body(conn) do
			{:ok, data, _rest} -> accumulated <> data
			{:more, partial, rest} -> read_long_body(rest, accumulated <> partial)
		end
	end
end
