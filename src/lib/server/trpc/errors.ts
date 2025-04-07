import { TRPCError } from '@trpc/server';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';

const postgresToTrpcError = (
	context: string
): Record<string, { code: TRPC_ERROR_CODE_KEY; message: string }> => ({
	'23505': { code: 'CONFLICT', message: `${context} name already exists!` }, // Unique violation
	'23502': { code: 'BAD_REQUEST', message: 'Not null violation' }, // Not null violation
	'22P02': {
		code: 'BAD_REQUEST',
		message: 'Invalid text representation (e.g., incorrect UUID)'
	}, // Invalid text representation (e.g., incorrect UUID)
	'23503': { code: 'BAD_REQUEST', message: 'Foreign key violation' }, // Foreign key violation
	'42P01': { code: 'INTERNAL_SERVER_ERROR', message: 'Undefined table' } // Undefined table
});

export function PSQLTRPCError(context: string, error: any): TRPCError {
	const { code, message } = postgresToTrpcError(context)[error.code];
	return new TRPCError({
		code: code || 'INTERNAL_SERVER_ERROR',
		message: message || error.message
	});
}

// import { TRPCError } from "@trpc/server";

// // Custom error messages for unique constraints
// const uniqueConstraintMessages: Record<string, string> = {
//   "user_username_key": "This username is already taken.",
//   "user_email_key": "This email is already registered.",
//   "project_name_key": "A project with this name already exists.",
// };

// // Function to extract PostgreSQL constraint name
// function extractConstraintName(error: any): string | null {
//   return error.constraint || null;
// }

// // Function to map PostgreSQL errors to TRPC errors
// export function mapPostgresError(error: any): TRPCError {
//   if (error.code === "23505") {
//     // Unique constraint violation
//     const constraintName = extractConstraintName(error);
//     const message = constraintName ? uniqueConstraintMessages[constraintName] : "Duplicate entry detected.";

//     return new TRPCError({
//       code: "CONFLICT",
//       message,
//     });
//   }

//   // Map other errors
//   const postgresToTrpcErrorMap: Record<string, keyof typeof TRPCError.codes> = {
//     "23502": "BAD_REQUEST", // Not null violation
//     "22P02": "BAD_REQUEST", // Invalid text representation (e.g., incorrect UUID)
//     "23503": "BAD_REQUEST", // Foreign key violation
//     "42P01": "INTERNAL_SERVER_ERROR", // Undefined table
//   };

//   const trpcCode = postgresToTrpcErrorMap[error.code] || "INTERNAL_SERVER_ERROR";

//   return new TRPCError({
//     code: trpcCode,
//     message: error.detail || "Database error occurred.",
//   });
// }
