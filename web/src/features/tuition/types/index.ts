export interface TuitionPayment {
  id: string;
  semester: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
  method?: string;
  invoice?: string;
  installment?: string;
}
