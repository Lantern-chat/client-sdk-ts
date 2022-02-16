/// Copied from client-sdk-rs/src/api/error.rs
export enum ApiErrorCode {
    // Server errors
    DbError = 50001,
    JoinError = 50002,
    SemaphoreError = 50003,
    HashError = 50004,
    JsonError = 50005,
    EventEncodingError = 50006,
    InternalError = 50007,
    InternalErrorStatic = 50008,
    Utf8ParseError = 50009,
    IOError = 50010,
    InvalidHeaderValue = 50011,
    XMLError = 50012,
    RequestError = 50013,
    Unimplemented = 50014,

    // Client errors
    AlreadyExists = 40001,
    UsernameUnavailable = 40002,
    InvalidEmail = 40003,
    InvalidUsername = 40004,
    InvalidPassword = 40005,
    InvalidCredentials = 40006,
    InsufficientAge = 40007,
    InvalidDate = 40008,
    InvalidContent = 40009,
    InvalidName = 40010,
    InvalidTopic = 40011,
    MissingUploadMetadataHeader = 40012,
    MissingAuthorizationHeader = 40013,
    NoSession = 40014,
    InvalidAuthFormat = 40015,
    HeaderParseError = 40016,
    MissingFilename = 40017,
    MissingMime = 40018,
    AuthTokenParseError = 40019,
    Base64DecodeError = 40020,
    BodyDeserializeError = 40021,
    QueryParseError = 40022,
    UploadError = 40023,
    InvalidPreview = 40024,
    MimeParseError = 40025,
    InvalidImageFormat = 40026,
    TOTPRequired = 40027,
    InvalidPreferences = 40028,
    TemporarilyDisabled = 40029,
    InvalidCaptcha = 40030,
    Base85DecodeError = 40031,

    // Generic HTTP-like error codes
    BadRequest = 40400,
    Unauthorized = 40401,
    NotFound = 40404,
    Conflict = 40409,
    RequestEntityTooLarge = 40413,
    ChecksumMismatch = 40460,

    Unknown = 1,
}

export const enum ApiErrorKind {
    Unknown,
    ServerError,
    ClientError,
}

export class ApiError {
    code: ApiErrorCode;
    message: string;

    constructor(code: ApiErrorCode, message: string) {
        this.code = code;
        this.message = message;
    }

    /// Construct new ApiError from code and message, checking if code exists
    static from_obj({ code, message }: { code: number, message: string }): ApiError {
        return new ApiError(ApiErrorCode[code] ? code : ApiErrorCode.Unknown, message);
    }

    is_client(): boolean {
        return this.kind() == ApiErrorKind.ClientError;
    }

    is_server(): boolean {
        return this.kind() == ApiErrorKind.ServerError;
    }

    name(): string {
        return ApiErrorCode[this.code];
    }

    kind(): ApiErrorKind {
        let code = this.code;
        if(code >= 60000) {
            return ApiErrorKind.Unknown;
        } else if(code >= 50000) {
            return ApiErrorKind.ServerError;
        } else if(code >= 40000) {
            return ApiErrorKind.ClientError;
        } else {
            return ApiErrorKind.Unknown;
        }
    }
}