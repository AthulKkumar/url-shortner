
export interface Link {
    id: string
    code: string
    targetUrl: string
    clicks: number
    lastClicked: Date | null
    createdAt: Date
    updatedAt?: Date
  }
  
  export interface CreateLinkRequest {
    url: string
    code?: string 
  }
  
  export interface ApiError {
    error: string
  }
  
  export interface DeleteResponse {
    message: string
  }
  
  export interface HealthResponse {
    ok: boolean
    version: string
    uptime?: string
    uptimeSeconds?: number
    timestamp: string
    database?: string
    error?: string
  }