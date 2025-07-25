import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { 
  Debt, 
  DebtRecord,
  CreateDebtData, 
  UpdateDebtData,
  CreateDebtRecordData,
  UpdateDebtRecordData,
  PaginatedDebts,
  PaginatedDebtRecords,
  DebtRecordSummary
} from '../types/debt';

// Debt hooks
export const useDebts = (page = 0, size = 10) => {
  return useQuery<PaginatedDebts>({
    queryKey: ['debts', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/debts?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
  });
};

export const useDebt = (id: string) => {
  return useQuery<Debt>({
    queryKey: ['debt', id],
    queryFn: async () => {
      const response = await apiClient.get(`/debts/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useLendingDebts = (page = 0, size = 10) => {
  return useQuery<PaginatedDebts>({
    queryKey: ['debts', 'lending', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/debts/lending?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
  });
};

export const useBorrowingDebts = (page = 0, size = 10) => {
  return useQuery<PaginatedDebts>({
    queryKey: ['debts', 'borrowing', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/debts/borrowing?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
  });
};

export const usePayableDebts = () => {
  return useQuery<Debt[]>({
    queryKey: ['debts', 'payable'],
    queryFn: async () => {
      const response = await apiClient.get('/debts/payable');
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });
};

export const useReceivableDebts = () => {
  return useQuery<Debt[]>({
    queryKey: ['debts', 'receivable'],
    queryFn: async () => {
      const response = await apiClient.get('/debts/receivable');
      return Array.isArray(response.data.data) ? response.data.data : [];
    },
  });
};

export const useCreateDebt = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateDebtData) => {
      const response = await apiClient.post('/debts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Debt created',
        message: 'Your debt record has been created successfully.',
      });
      navigate('/debts');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create debt',
        message: 'Please try again.',
      });
    },
  });
};

export const useUpdateDebt = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDebtData }) => {
      const response = await apiClient.put(`/debts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Debt updated',
        message: 'Your debt record has been updated successfully.',
      });
      navigate('/debts');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update debt',
        message: 'Please try again.',
      });
    },
  });
};

export const useDeleteDebt = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/debts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Debt deleted',
        message: 'The debt record has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete debt',
        message: 'Please try again.',
      });
    },
  });
};

// Debt Records hooks
export const useDebtRecords = (debtId: string, page = 0, size = 10) => {
  return useQuery<PaginatedDebtRecords>({
    queryKey: ['debt-records', debtId, page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/records/${debtId}/all?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
    enabled: !!debtId,
  });
};

export const useDebtRecord = (id: string) => {
  return useQuery<DebtRecord>({
    queryKey: ['debt-record', id],
    queryFn: async () => {
      const response = await apiClient.get(`/records/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const usePaidRecords = (debtId: string, page = 0, size = 10) => {
  return useQuery<PaginatedDebtRecords>({
    queryKey: ['debt-records', debtId, 'paid', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/records/${debtId}/paid?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
    enabled: !!debtId,
  });
};

export const useReceivedRecords = (debtId: string, page = 0, size = 10) => {
  return useQuery<PaginatedDebtRecords>({
    queryKey: ['debt-records', debtId, 'received', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/records/id/${debtId}/received?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
    enabled: !!debtId,
  });
};

export const useAdjustmentRecords = (debtId: string, page = 0, size = 10) => {
  return useQuery<PaginatedDebtRecords>({
    queryKey: ['debt-records', debtId, 'adjustment', page, size],
    queryFn: async () => {
      const response = await apiClient.get(`/records/${debtId}/adjustment?page=${page}&size=${size}`);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
    enabled: !!debtId,
  });
};

export const useDebtRecordSummary = (debtId: string) => {
  return useQuery<DebtRecordSummary>({
    queryKey: ['debt-record-summary', debtId],
    queryFn: async () => {
      const [paidResponse, receivedResponse] = await Promise.all([
        apiClient.get(`/records/${debtId}/total-paid`),
        apiClient.get(`/records/${debtId}/total-received`)
      ]);
      
      return {
        totalPaid: paidResponse.data.data || 0,
        totalReceived: receivedResponse.data.data || 0,
      };
    },
    enabled: !!debtId,
  });
};

export const useCreateDebtRecord = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ debtId, data }: { debtId: string; data: CreateDebtRecordData }) => {
      const response = await apiClient.post(`/records/${debtId}`, data);
      return response.data;
    },
    onSuccess: (_, { debtId }) => {
      queryClient.invalidateQueries({ queryKey: ['debt-records', debtId] });
      queryClient.invalidateQueries({ queryKey: ['debt-record-summary', debtId] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Record created',
        message: 'Your debt record has been created successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create record',
        message: 'Please try again.',
      });
    },
  });
};

export const useUpdateDebtRecord = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDebtRecordData }) => {
      const response = await apiClient.put(`/records/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-records'] });
      queryClient.invalidateQueries({ queryKey: ['debt-record-summary'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Record updated',
        message: 'Your debt record has been updated successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update record',
        message: 'Please try again.',
      });
    },
  });
};

export const useDeleteDebtRecord = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/records/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debt-records'] });
      queryClient.invalidateQueries({ queryKey: ['debt-record-summary'] });
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      addToast({
        type: 'success',
        title: 'Record deleted',
        message: 'The debt record has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete record',
        message: 'Please try again.',
      });
    },
  });
};