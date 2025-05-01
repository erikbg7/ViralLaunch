export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      preferences: {
        Row: {
          id: number
          notification_day: Database["public"]["Enums"]["weekdays"]
          notification_email: string
          notification_time: Database["public"]["Enums"]["hours"]
          notificaton_frequency: Database["public"]["Enums"]["freq"]
          time_format: Database["public"]["Enums"]["t_format"]
          time_zone: Database["public"]["Enums"]["tz"]
          user_id: string
          week_start: Database["public"]["Enums"]["week_start"]
        }
        Insert: {
          id?: number
          notification_day?: Database["public"]["Enums"]["weekdays"]
          notification_email: string
          notification_time?: Database["public"]["Enums"]["hours"]
          notificaton_frequency?: Database["public"]["Enums"]["freq"]
          time_format?: Database["public"]["Enums"]["t_format"]
          time_zone?: Database["public"]["Enums"]["tz"]
          user_id: string
          week_start?: Database["public"]["Enums"]["week_start"]
        }
        Update: {
          id?: number
          notification_day?: Database["public"]["Enums"]["weekdays"]
          notification_email?: string
          notification_time?: Database["public"]["Enums"]["hours"]
          notificaton_frequency?: Database["public"]["Enums"]["freq"]
          time_format?: Database["public"]["Enums"]["t_format"]
          time_zone?: Database["public"]["Enums"]["tz"]
          user_id?: string
          week_start?: Database["public"]["Enums"]["week_start"]
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      session: {
        Row: {
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          expires_at: string
          id: string
          user_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      subreddit: {
        Row: {
          created_at: string
          id: string
          url: string
        }
        Insert: {
          created_at?: string
          id: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: []
      }
      subreddit_record: {
        Row: {
          id: number
          interval: number
          subreddit_id: string
          timestamp: string
          users: number
        }
        Insert: {
          id?: number
          interval: number
          subreddit_id: string
          timestamp?: string
          users: number
        }
        Update: {
          id?: number
          interval?: number
          subreddit_id?: string
          timestamp?: string
          users?: number
        }
        Relationships: [
          {
            foreignKeyName: "subreddit_record_subreddit_id_subreddit_id_fk"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddit"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          google_id: string | null
          id: string
          password_hash: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          google_id?: string | null
          id: string
          password_hash?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          google_id?: string | null
          id?: string
          password_hash?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_subreddits: {
        Row: {
          subreddit_id: string
          user_id: string
        }
        Insert: {
          subreddit_id: string
          user_id: string
        }
        Update: {
          subreddit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subreddits_subreddit_id_subreddit_id_fk"
            columns: ["subreddit_id"]
            isOneToOne: false
            referencedRelation: "subreddit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subreddits_user_id_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      freq: "never" | "daily" | "weekly"
      hours:
        | "00:00"
        | "00:30"
        | "01:00"
        | "01:30"
        | "02:00"
        | "02:30"
        | "03:00"
        | "03:30"
        | "04:00"
        | "04:30"
        | "05:00"
        | "05:30"
        | "06:00"
        | "06:30"
        | "07:00"
        | "07:30"
        | "08:00"
        | "08:30"
        | "09:00"
        | "09:30"
        | "10:00"
        | "10:30"
        | "11:00"
        | "11:30"
        | "12:00"
        | "12:30"
        | "13:00"
        | "13:30"
        | "14:00"
        | "14:30"
        | "15:00"
        | "15:30"
        | "16:00"
        | "16:30"
        | "17:00"
        | "17:30"
        | "18:00"
        | "18:30"
        | "19:00"
        | "19:30"
        | "20:00"
        | "20:30"
        | "21:00"
        | "21:30"
        | "22:00"
        | "22:30"
        | "23:00"
        | "23:30"
      t_format: "am_pm" | "h24"
      tz:
        | "UTC"
        | "America/New_York"
        | "America/Chicago"
        | "America/Denver"
        | "America/Los_Angeles"
        | "America/Anchorage"
        | "Pacific/Honolulu"
        | "Europe/London"
        | "Europe/Paris"
        | "Europe/Helsinki"
        | "Asia/Dubai"
        | "Asia/Singapore"
        | "Asia/Tokyo"
        | "Australia/Sydney"
      week_start: "Sunday" | "Monday"
      weekdays:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      freq: ["never", "daily", "weekly"],
      hours: [
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
      ],
      t_format: ["am_pm", "h24"],
      tz: [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Anchorage",
        "Pacific/Honolulu",
        "Europe/London",
        "Europe/Paris",
        "Europe/Helsinki",
        "Asia/Dubai",
        "Asia/Singapore",
        "Asia/Tokyo",
        "Australia/Sydney",
      ],
      week_start: ["Sunday", "Monday"],
      weekdays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
} as const
