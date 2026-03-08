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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      form_responses: {
        Row: {
          created_at: string
          disciplina: number | null
          faturamento: number | null
          frequencia_treino: number | null
          horario_fim: string | null
          horario_inicio: string | null
          horas_redes_sociais: number | null
          id: string
          idade: number | null
          margem: number | null
          meta_renda: number | null
          modo_empresario: boolean | null
          nivel_foco: number | null
          objetivo_fisico: string | null
          profissao: string | null
          renda_atual: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          disciplina?: number | null
          faturamento?: number | null
          frequencia_treino?: number | null
          horario_fim?: string | null
          horario_inicio?: string | null
          horas_redes_sociais?: number | null
          id?: string
          idade?: number | null
          margem?: number | null
          meta_renda?: number | null
          modo_empresario?: boolean | null
          nivel_foco?: number | null
          objetivo_fisico?: string | null
          profissao?: string | null
          renda_atual?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          disciplina?: number | null
          faturamento?: number | null
          frequencia_treino?: number | null
          horario_fim?: string | null
          horario_inicio?: string | null
          horas_redes_sociais?: number | null
          id?: string
          idade?: number | null
          margem?: number | null
          meta_renda?: number | null
          modo_empresario?: boolean | null
          nivel_foco?: number | null
          objetivo_fisico?: string | null
          profissao?: string | null
          renda_atual?: number | null
          user_id?: string
        }
        Relationships: []
      }
      generated_protocols: {
        Row: {
          ai_protocol_data: Json | null
          created_at: string
          id: string
          response_id: string
          user_id: string
        }
        Insert: {
          ai_protocol_data?: Json | null
          created_at?: string
          id?: string
          response_id: string
          user_id: string
        }
        Update: {
          ai_protocol_data?: Json | null
          created_at?: string
          id?: string
          response_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_protocols_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          has_completed_onboarding: boolean
          id: string
          profile_data: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          has_completed_onboarding?: boolean
          id: string
          profile_data?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          has_completed_onboarding?: boolean
          id?: string
          profile_data?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      protocol_blocks: {
        Row: {
          ativo: boolean
          categoria: string
          descricao: string
          id: string
          prioridade: number
          titulo: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          descricao: string
          id?: string
          prioridade?: number
          titulo: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          descricao?: string
          id?: string
          prioridade?: number
          titulo?: string
        }
        Relationships: []
      }
      protocol_items: {
        Row: {
          block_id: string
          id: string
          protocol_id: string
        }
        Insert: {
          block_id: string
          id?: string
          protocol_id: string
        }
        Update: {
          block_id?: string
          id?: string
          protocol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_items_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "protocol_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_items_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "generated_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_rules: {
        Row: {
          block_id: string
          campo: string
          id: string
          operador: string
          valor: string
        }
        Insert: {
          block_id: string
          campo: string
          id?: string
          operador: string
          valor: string
        }
        Update: {
          block_id?: string
          campo?: string
          id?: string
          operador?: string
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_rules_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "protocol_blocks"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
