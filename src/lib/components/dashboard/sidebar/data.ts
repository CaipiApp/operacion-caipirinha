import UserIcon from './icons/UserIcon.svelte';
import CompanyIcon from './icons/CompanyIcon.svelte';
import ComisionIcon from '$lib/components/Icons/ComisionIcon.svelte';
import PagoIcon from './icons/PagoIcon.svelte';
import WalletIcon from './icons/WalletIcon.svelte';
import ConfigIcon from './icons/ConfigIcon.svelte';
import PlugIcon from './icons/PlugIcon.svelte';
import DepositIcon from './icons/DepositIcon.svelte';
import CryptoIcon from './icons/CryptoIcon.svelte';
import DocumentationIcon from './icons/DocumentationIcon.svelte';
import MoneyIcon from './icons/MoneyIcon.svelte';
import QrIcon from '$lib/components/Icons/QrIcon.svelte';
import NotificationIcon from '$lib/components/Icons/NotificationIcon.svelte';

export const data: {
	title: string;
	icon: any;
	link: string;
	tooltip?: string;
	children?: { title: string; icon: any; link: string; tooltip?: string }[];
}[] = [
	{
		icon: PlugIcon,
		title: 'navbarManteca',
		link: '/admin/manteca',
		children: [
			{ icon: UserIcon, title: 'navbarMantecaUsers', link: '/admin/manteca/users' },
			{ icon: DepositIcon, title: 'navbarMantecaDeposits', link: '/admin/manteca/deposits' },
			{ icon: DepositIcon, title: 'navbarMantecaWithdraws', link: '/admin/manteca/withdraws' },
			{
				icon: CryptoIcon,
				title: 'navbarMantecaUsersTransactions',
				link: '/admin/manteca/transactions'
			}
		]
	},
	{
		title: 'navbarEnterprises',
		icon: CompanyIcon,
		link: '/admin/empresas'
	},
	{
		title: 'comisiones',
		icon: ComisionIcon,
		link: '/admin/comisiones'
	},
	{
		title: 'navbarUsers',
		icon: UserIcon,
		link: '/admin/users'
	},
	{
		title: 'navbarConfigurations',
		icon: ConfigIcon,
		link: '/admin/configs'
	},
	{
		icon: PagoIcon,
		title: 'navbarPayments',
		link: '/admin/cobros',
		tooltip: 'navbarPaymentsTooltip'
	},
	{
		icon: QrIcon,
		title: 'navbarStaticQrPayments',
		link: '/admin/cobros-qr',
		tooltip: 'navbarStaticQrPaymentsTooltip'
	},
	{
		icon: DocumentationIcon,
		title: 'navbarNoticias',
		link: '/admin/noticias',
		tooltip: 'navbarNoticiasTooltip'
	},
	{
		icon: NotificationIcon,
		title: 'navbarNotificaciones',
		link: '/admin/notificaciones',
		tooltip: 'navbarNotificacionesTooltip'
	},
	{
		icon: WalletIcon,
		title: 'navbarAccounts',
		link: '/admin/cuentas',
		tooltip: 'navbarAccountsTooltip'
	},
	{
		icon: MoneyIcon,
		title: 'navbarAdminPayments',
		link: '/admin/pagos'
	}
];
