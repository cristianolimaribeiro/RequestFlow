export type RequestStatus = 'aberta' | 'em_analise' | 'aprovada' | 'reprovada' | 'cancelada' | 'concluida';
export type RequestPriority = 'baixa' | 'media' | 'alta' | 'critica';

export interface RequestHistory {
  id: number;
  request_id: number;
  user_id: number;
  user_name: string;
  action: string;
  old_status: RequestStatus | null;
  new_status: RequestStatus;
  comment?: string;
  created_at: string;
}

export interface Attachment {
  id: number;
  file_name: string;
  file_type: string;
  created_at: string;
}

export interface Request {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category_name: string;
  requester_id: number;
  requester_name: string;
  approver_id: number | null;
  approver_name?: string;
  status: RequestStatus;
  priority: RequestPriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  history?: RequestHistory[];
  attachments?: Attachment[];
}
