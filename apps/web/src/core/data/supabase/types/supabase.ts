export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.12 (cd3cf9e)';
  };
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string;
          id: string;
          payment_id: string | null;
          product_id: string;
          status: Database['public']['Enums']['order_status'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payment_id?: string | null;
          product_id: string;
          status?: Database['public']['Enums']['order_status'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          payment_id?: string | null;
          product_id?: string;
          status?: Database['public']['Enums']['order_status'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_payment_id_fkey';
            columns: ['payment_id'];
            isOneToOne: true;
            referencedRelation: 'payments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          promo_code_id: string | null;
          provider: Database['public']['Enums']['payment_provider'];
          provider_id: string;
          status: Database['public']['Enums']['payment_status'];
          updated_at: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          id?: string;
          promo_code_id?: string | null;
          provider: Database['public']['Enums']['payment_provider'];
          provider_id: string;
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          promo_code_id?: string | null;
          provider?: Database['public']['Enums']['payment_provider'];
          provider_id?: string;
          status?: Database['public']['Enums']['payment_status'];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_promo_code_id_fkey';
            columns: ['promo_code_id'];
            isOneToOne: false;
            referencedRelation: 'promo_code';
            referencedColumns: ['id'];
          },
        ];
      };
      product_images: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          resource_url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          resource_url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          resource_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_images_resource_url_fkey';
            columns: ['resource_url'];
            isOneToOne: false;
            referencedRelation: 'resources';
            referencedColumns: ['url'];
          },
        ];
      };
      products: {
        Row: {
          active: boolean;
          created_at: string;
          description: string | null;
          download_url: string;
          id: string;
          image_url: string;
          name: string;
          pathname: string;
          price: number;
          thumbnail_url: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          download_url: string;
          id?: string;
          image_url: string;
          name: string;
          pathname: string;
          price: number;
          thumbnail_url?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          download_url?: string;
          id?: string;
          image_url?: string;
          name?: string;
          pathname?: string;
          price?: number;
          thumbnail_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_download_url_fkey';
            columns: ['download_url'];
            isOneToOne: false;
            referencedRelation: 'resources';
            referencedColumns: ['url'];
          },
        ];
      };
      promo_code: {
        Row: {
          applies_to_all: boolean;
          code: string;
          created_at: string | null;
          discount_type: string;
          discount_value: number;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          max_uses: number | null;
          used_count: number | null;
        };
        Insert: {
          applies_to_all?: boolean;
          code: string;
          created_at?: string | null;
          discount_type: string;
          discount_value: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number | null;
        };
        Update: {
          applies_to_all?: boolean;
          code?: string;
          created_at?: string | null;
          discount_type?: string;
          discount_value?: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number | null;
        };
        Relationships: [];
      };
      promo_code_product: {
        Row: {
          id: string;
          product_id: string | null;
          promo_code_id: string | null;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          promo_code_id?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          promo_code_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'promo_code_product_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'promo_code_product_promo_code_id_fkey';
            columns: ['promo_code_id'];
            isOneToOne: false;
            referencedRelation: 'promo_code';
            referencedColumns: ['id'];
          },
        ];
      };
      resources: {
        Row: {
          created_at: string;
          folder: string;
          id: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          folder?: string;
          id?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          folder?: string;
          id?: string;
          url?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status: 'pending' | 'completed' | 'cancelled' | 'paid';
      payment_provider: 'mercadopago' | 'free';
      payment_status:
        | 'pending'
        | 'approved'
        | 'authorized'
        | 'in_process'
        | 'in_mediation'
        | 'rejected'
        | 'cancelled'
        | 'refunded'
        | 'charged_back';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      order_status: ['pending', 'completed', 'cancelled', 'paid'],
      payment_provider: ['mercadopago', 'free'],
      payment_status: [
        'pending',
        'approved',
        'authorized',
        'in_process',
        'in_mediation',
        'rejected',
        'cancelled',
        'refunded',
        'charged_back',
      ],
    },
  },
} as const;
