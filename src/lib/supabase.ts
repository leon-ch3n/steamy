import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mesacysggdpqnfrqdvhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lc2FjeXNnZ2RwcW5mcnFkdmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzk3OTUsImV4cCI6MjA4MDgxNTc5NX0.fnAUDESiJyGPl9JSHNeA_aFpInWxdmx3XvxuMU6R7ss';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  created_at: string;
}

export interface SavedCar {
  id: string;
  user_id: string;
  car_name: string;
  car_data: Record<string, unknown>;
  note: string | null;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  budget_min: number;
  budget_max: number;
  body_types: string[];
  fuel_types: string[];
  must_haves: string[];
  dealbreakers: string[];
  // Location settings
  city: string;
  state: string;
  zip_code: string;
  search_radius: number; // in miles
  updated_at: string;
}

// Helper functions
export async function saveSearch(userId: string, query: string, resultsCount: number) {
  const { data, error } = await supabase
    .from('searches')
    .insert({ user_id: userId, query, results_count: resultsCount })
    .select()
    .single();
  
  if (error) console.error('Error saving search:', error);
  return data;
}

export async function getSearchHistory(userId: string): Promise<SearchHistory[]> {
  const { data, error } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) console.error('Error fetching searches:', error);
  return data || [];
}

export async function saveCar(userId: string, carName: string, carData: any, note?: string) {
  const { data, error } = await supabase
    .from('saved_cars')
    .insert({ user_id: userId, car_name: carName, car_data: carData, note })
    .select()
    .single();
  
  if (error) console.error('Error saving car:', error);
  return data;
}

export async function getSavedCars(userId: string): Promise<SavedCar[]> {
  const { data, error } = await supabase
    .from('saved_cars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) console.error('Error fetching saved cars:', error);
  return data || [];
}

export async function removeSavedCar(carId: string) {
  const { error } = await supabase
    .from('saved_cars')
    .delete()
    .eq('id', carId);
  
  if (error) console.error('Error removing car:', error);
  return !error;
}

export async function updateCarNote(carId: string, note: string) {
  const { error } = await supabase
    .from('saved_cars')
    .update({ note })
    .eq('id', carId);
  
  if (error) console.error('Error updating note:', error);
  return !error;
}

export async function getPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') console.error('Error fetching preferences:', error);
  return data;
}

export async function savePreferences(userId: string, prefs: Partial<UserPreferences>) {
  const { data, error } = await supabase
    .from('preferences')
    .upsert({ user_id: userId, ...prefs, updated_at: new Date().toISOString() })
    .select()
    .single();
  
  if (error) console.error('Error saving preferences:', error);
  return data;
}

