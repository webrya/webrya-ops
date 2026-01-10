export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string | null
          status: 'active' | 'maintenance' | 'archived'
          ical_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address?: string | null
          status?: 'active' | 'maintenance' | 'archived'
          ical_url?: string | null
        }
        Update: {
          name?: string
          address?: string | null
          ical_url?: string | null
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          start_date: string
          end_date: string
          guest_name: string | null
          source: string
        }
      }
    }
  }
}