export interface OAuthErrorResponseQueryParams {
	error: "unauthorized_client" | "access_denied" | "unsupported_response_type" | "invalid_scope" | "server_error" | "temporarily_unavailable";
	error_description?: string;
	error_uri?: string;
	state?: string;
}
