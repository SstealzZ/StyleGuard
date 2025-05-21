/**
 * Interface for correction request
 */
export interface CorrectionRequest {
  text: string;
  language?: string;
}

/**
 * Interface for correction response
 */
export interface CorrectionResponse {
  id: number;
  original_text: string;
  corrected_text: string;
  created_at: string;
  user_id: number;
} 