export const Roles = {
    ADMIN: "ADMIN",
    PROJECT_MANAGER: "PROJECT_MANAGER",
    TEAM_MEMBER: "TEAM_MEMBER"
} as const;

export type Role = typeof Roles[keyof typeof Roles];