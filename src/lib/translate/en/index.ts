import accounts from './accounts';
import configurations from './configurations';
import deleteAccount from './deleteAccount';
import noticias from './noticias';
import editAccount from './editAccount';
import editConfiguration from './editConfiguration';
import editUser from './editUser';
import enterprises from './enterprises';
import errors from './errors';
import landing from './landing';
import login from './login';
import mantecaUsers from './manteca.users';
import navbar from './navbar';
import newAccount from './newAccount';
import newConfiguration from './newConfiguration';
import newEnterprise from './newEnterprise';
import newPayment from './newPayment';
import newPaymentModal from './newPaymentModal';
import newUser from './newUser';
import payments from './payments';
import profile from './profile';
import tableCommon from './tableCommon';
import users from './users';

interface langKeys {
	[key: string]: string;
}

export default {
	...accounts,
	...configurations,
	...noticias,
	...deleteAccount,
	...editAccount,
	...editConfiguration,
	...editUser,
	...enterprises,
	...landing,
	...login,
	...navbar,
	...newAccount,
	...newConfiguration,
	...newEnterprise,
	...newPayment,
	...newUser,
	...payments,
	...profile,
	...tableCommon,
	...users,
	...newPaymentModal,
	...errors,
	...mantecaUsers
} as langKeys;
