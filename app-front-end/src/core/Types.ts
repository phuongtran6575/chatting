export interface Pagination<T> {
  total: number;
  page: number;
  size: number;
  items: T[];
}

export interface User{
    id: string
    full_name: string
    email: string
    phone_number: string
    created_at: Date
    updated_at: Date
}
export interface CreateGroupPayload {
  creator_id: string;
  member_ids: string[]; // 👈 phải là mảng
  group_name?: string;
}
export interface ParticipantUser {
  id: string;
  full_name: string;
  avatar_url?: string;
}

export interface Conversation {
  id: string;
  name: string;
  type: "single" | "group";
  participants: ParticipantUser[];
}
export interface ConversationResponse {
  items: Conversation[];
  total: number;
  page: number;
  page_size: number;
}