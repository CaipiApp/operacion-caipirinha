export type Account = {
  _id: string,
  description: string,
  cbu: string,
  bankCode: string,
  bankName: string,
  cvu: boolean,
  actualCbu: string,
  accountType: string
}

export type BankAccounts = {
  ARS: Account[]
  USD: Account[]
  CLP: Account[]
}


export type Balance = {
  fiat: {
    ARS: {
      amount: string
    },
    USD: {
      amount: string
    }
  },
  crypto: {
    USDT: {
      amount: string
    }
  }
}

export type Limits = {
  economicLevel: number //5,
  totalOperated: number //279964.17,
  totalDepositedMonthly: number //45390.56,
  totalDepositedYearly: number //293946.77,
  monthLeft: number //9995502.24,
  yearLeft: number //21720035.83,
  monthLimit: number //10002254.200000001,
  yearLimit: number //22000000
}

export type Deposit = {
  bankId?: string; // Opcional ya que no todos los objetos tienen este campo
  status: string;
  amount: string;
  coin: string;
  creationTime: string;
  user: {
    id: string;
    cuit: string;
    name: string;
    numberId: string;
    externalId: string;
  }
}

export type Transaction = {
  from: string //"0xd99589F1b1695996533bB4dB43B97DD6331dBcc2",
  to: string //"0x96c5d20b2a975c050e4220be276ace4892f4b41a",
  amount: string //"0.717109",
  cost: string //"0.282891",
  hash: string //"100000295",
  id: string //"100000295",
  creationTime: string //"2023-12-06T14:44:05.688Z",
  chain: number //1,
  type: number //1,
  status: number | string | null,
  coin: string //"USDT",
  user: {
    name: string //"John Smith",
    cuit: string //"20380290554",
    id: string //"35"
  }
}

export type Withdraw = {
  bankId: string;
  status: string;
  amount: string;
  numberId: string;
  coin: string;
  destAccount: {
    description: string;
    cbu: string;
  };
  creationTime: string;
  user: {
    cuit: string;
    name: string;
    numberId: string;
    email: string;
  };
  bank: string;
}