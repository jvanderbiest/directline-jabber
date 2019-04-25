export class AuthenticationResponse {
    /**
     *Id of the generated conversation 
     */
    conversationId: string;

    /**
     * The token to use for subsequent requests
     */
    token: string;

    /**
     * Specifies time that the token expires
     */
    expires_in: number;
}