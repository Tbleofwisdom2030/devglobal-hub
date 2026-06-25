import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = process.env.SUPABASE_URL || 'https://lzjbjvrigsmlkstzqizc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!supabaseInstance && supabaseKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    logger.info('Supabase client initialized');
  }
  return supabaseInstance;
}

export async function supabaseQuery<T = any>(
  table: string,
  query: {
    action: 'select' | 'insert' | 'update' | 'delete';
    data?: any;
    match?: Record<string, any>;
    select?: string;
    limit?: number;
    order?: string;
    ascending?: boolean;
  }
): Promise<T> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  let builder: any;

  switch (query.action) {
    case 'select':
      builder = client.from(table).select(query.select || '*');
      if (query.match) builder = builder.match(query.match);
      if (query.limit) builder = builder.limit(query.limit);
      if (query.order) builder = builder.order(query.order, { ascending: query.ascending ?? false });
      break;
    case 'insert':
      builder = client.from(table).insert(query.data).select(query.select || '*');
      break;
    case 'update':
      builder = client.from(table).update(query.data).match(query.match || {}).select(query.select || '*');
      break;
    case 'delete':
      builder = client.from(table).delete().match(query.match || {});
      break;
    default:
      throw new Error('Invalid action');
  }

  const { data, error } = await builder;

  if (error) {
    logger.error('Supabase query error: ' + error.message);
    throw new Error(error.message);
  }

  return data as T;
}
