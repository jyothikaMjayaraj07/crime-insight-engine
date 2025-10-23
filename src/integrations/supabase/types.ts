export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      case_suspects: {
        Row: {
          case_id: string
          created_at: string
          criminal_id: string
          id: string
          notes: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          criminal_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          criminal_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_suspects_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_suspects_criminal_id_fkey"
            columns: ["criminal_id"]
            isOneToOne: false
            referencedRelation: "criminals"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          assigned_officer_id: string | null
          case_number: string
          closed_at: string | null
          created_at: string
          description: string | null
          fir_id: string | null
          id: string
          investigation_notes: string | null
          outcome: string | null
          priority: Database["public"]["Enums"]["crime_severity"]
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_officer_id?: string | null
          case_number: string
          closed_at?: string | null
          created_at?: string
          description?: string | null
          fir_id?: string | null
          id?: string
          investigation_notes?: string | null
          outcome?: string | null
          priority?: Database["public"]["Enums"]["crime_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_officer_id?: string | null
          case_number?: string
          closed_at?: string | null
          created_at?: string
          description?: string | null
          fir_id?: string | null
          id?: string
          investigation_notes?: string | null
          outcome?: string | null
          priority?: Database["public"]["Enums"]["crime_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_fir_id_fkey"
            columns: ["fir_id"]
            isOneToOne: false
            referencedRelation: "firs"
            referencedColumns: ["id"]
          },
        ]
      }
      criminals: {
        Row: {
          address: string | null
          alias: string | null
          created_at: string
          criminal_history: string | null
          date_of_birth: string | null
          full_name: string
          gender: string | null
          id: string
          identification_marks: string | null
          is_repeat_offender: boolean | null
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          alias?: string | null
          created_at?: string
          criminal_history?: string | null
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          id?: string
          identification_marks?: string | null
          is_repeat_offender?: boolean | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          alias?: string | null
          created_at?: string
          criminal_history?: string | null
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          identification_marks?: string | null
          is_repeat_offender?: boolean | null
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          case_id: string
          chain_of_custody: string | null
          collected_by: string | null
          collected_date: string
          created_at: string
          description: string
          evidence_number: string
          evidence_type: string
          file_url: string | null
          id: string
        }
        Insert: {
          case_id: string
          chain_of_custody?: string | null
          collected_by?: string | null
          collected_date?: string
          created_at?: string
          description: string
          evidence_number: string
          evidence_type: string
          file_url?: string | null
          id?: string
        }
        Update: {
          case_id?: string
          chain_of_custody?: string | null
          collected_by?: string | null
          collected_date?: string
          created_at?: string
          description?: string
          evidence_number?: string
          evidence_type?: string
          file_url?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      firs: {
        Row: {
          assigned_officer_id: string | null
          created_at: string
          crime_type: string
          description: string
          fir_number: string
          id: string
          incident_date: string
          location_id: string | null
          reported_by: string | null
          severity: Database["public"]["Enums"]["crime_severity"]
          status: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at: string
          victim_address: string | null
          victim_contact: string | null
          victim_name: string
        }
        Insert: {
          assigned_officer_id?: string | null
          created_at?: string
          crime_type: string
          description: string
          fir_number: string
          id?: string
          incident_date: string
          location_id?: string | null
          reported_by?: string | null
          severity?: Database["public"]["Enums"]["crime_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          title: string
          updated_at?: string
          victim_address?: string | null
          victim_contact?: string | null
          victim_name: string
        }
        Update: {
          assigned_officer_id?: string | null
          created_at?: string
          crime_type?: string
          description?: string
          fir_number?: string
          id?: string
          incident_date?: string
          location_id?: string | null
          reported_by?: string | null
          severity?: Database["public"]["Enums"]["crime_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          title?: string
          updated_at?: string
          victim_address?: string | null
          victim_contact?: string | null
          victim_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "firs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          area: string
          city: string
          created_at: string
          district: string | null
          id: string
          latitude: number | null
          longitude: number | null
          pincode: string | null
        }
        Insert: {
          area: string
          city: string
          created_at?: string
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
        }
        Update: {
          area?: string
          city?: string
          created_at?: string
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          badge_number: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badge_number?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badge_number?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "officer"
      case_status: "open" | "investigating" | "closed" | "solved"
      crime_severity: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "officer"],
      case_status: ["open", "investigating", "closed", "solved"],
      crime_severity: ["low", "medium", "high", "critical"],
    },
  },
} as const
