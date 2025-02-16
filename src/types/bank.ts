export type AccountFormat = {
  bankCode: number;
  branchCode: number;
  accountNumber: number;
  ribKey: number;
};

export interface BankDetails {
  code: string;
  name: string;
  swift: string;
  active: boolean;
  accountFormat: AccountFormat;
  status?: string;
  example?: string;
  ribLength: number;
  ibanRegex: RegExp;
  ribRegex: RegExp;
  branches?: Branch[];
}

export interface Branch {
  code: string;
  swift: string;
  city: string;
  name?: string;
}
