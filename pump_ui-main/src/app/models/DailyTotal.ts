export interface DailyTotal {
  date: string;
  dailyTotal: number;
}

export interface Transaction {
  type: string;
  id: number;
  date: string;
  sender: string;
  received: string;
  amount: number;
}

export interface Employee {
  id?: number; // Optional if you're creating a new employee
  name: string;
  accountNumber: string;
  employeeId: string;
  photo: string; // Photo as a File object
}

export interface JamaBaki {
  id: number;
  date: string;
  name: string;
  jama: string;
  baki: string;
}