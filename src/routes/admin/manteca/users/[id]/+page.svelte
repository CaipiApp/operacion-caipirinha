<script lang="ts">
	import MainCard from '$lib/components/MainCard.svelte';
	import type { Pagador } from '$lib/models';
	import type { Balance, BankAccounts, Deposit, Limits, Transaction, Withdraw } from '$lib/models/manteca.js';
	import { t } from '$lib/translate/i18n.js';
	import { A, Button, Heading, Hr, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import Modal from '$lib/components/Modal.svelte';
	import WithdrawForm from '$lib/components/forms/WithdrawForm.svelte';
	import { invalidateAll } from '$app/navigation';
	import { currency2 } from '$lib/utils.js';


	export let data;
	$: pagador = data.pagador as Pagador
	$: cuentas = data.cuentas as BankAccounts
	$: balance = data.balance as Balance
	$: limites = data.limites as Limits
	$: depositos = data.depositos as Deposit[]
	$: retiros = data.retiros as Withdraw[]
	$: transactions = data.transacciones as Transaction[]

	let monto: string;
	let showWithdrawForm = false;

	function handleWithdraw(amount: string){
		monto = amount;
		showWithdrawForm = true;
	}

</script>

<MainCard pages={[
	{ href: '/admin/manteca/users', value: $t('mantecaUsersBreadcrumb') },
	{ value: `${pagador?.id} - ${pagador.name}` }
]}>

	<div class="md:p-6">

		<!-- Detalles del Pagador -->
		<Heading tag="h5" class="mb-4">Detalles del Pagador</Heading>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
			<P class="text-sm"><strong>ID: </strong> {pagador.id}</P>
			<P class="text-sm"><strong>UserId: </strong> {pagador.userId}</P>
			<P class="text-sm"><strong>Nombre: </strong> {pagador.name}</P>
			<P class="text-sm"><strong>CUIL: </strong> {pagador.cuil}</P>
			<P class="text-sm"><strong>Email: </strong> {pagador.email}</P>
			<P class="text-sm"><strong>Teléfono: </strong> {pagador.telefono}</P>
			<P class="text-sm"><strong>Tipo: </strong> {pagador.tipo}</P>
			<P class="text-sm"><strong>País: </strong> {pagador.pais}</P>
			<P class="text-sm"><strong>Estado Civil: </strong> {pagador.estadoCivil}</P>
			<P class="text-sm"><strong>Verificado: </strong> {new Date(pagador.verificado).toLocaleDateString()}</P>
		</div>

		<Hr />

		<!-- Tabla de Cuentas -->
		<Heading tag="h5" class="mb-4">Balance</Heading>
		<Table>
			<TableHead>
				<TableHeadCell>Tipo</TableHeadCell>
				<TableHeadCell>Moneda</TableHeadCell>
				<TableHeadCell>Monto</TableHeadCell>
				<TableHeadCell>Acciones</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each Object.entries(balance.fiat) as [currency, data]}
					<TableBodyRow>
						<TableBodyCell>Fiat</TableBodyCell>
						<TableBodyCell>{currency}</TableBodyCell>
						<TableBodyCell>{currency2(parseFloat(data.amount)).format()}</TableBodyCell>
						<TableBodyCell>
							{#if currency === 'ARS' && parseFloat(data.amount) > 0}
								<Button on:click={() => handleWithdraw(data.amount)}>retirar</Button>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
				{#each Object.entries(balance.crypto) as [currency, data]}
					<TableBodyRow>
						<TableBodyCell>Cripto</TableBodyCell>
						<TableBodyCell>{currency}</TableBodyCell>
						<TableBodyCell>{currency2(parseFloat(data.amount)).format()}</TableBodyCell>
						<TableBodyCell></TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		<Hr />

		<!-- Límites del Pagador -->
		<Heading tag="h5" class="mb-4">Límites</Heading>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
			<P class="text-sm"><strong>Nivel Económico:</strong> {limites.economicLevel}</P>
			<P class="text-sm"><strong>Total Operado:</strong> {currency2(limites.totalOperated).format()}</P>
			<P class="text-sm"><strong>Depositado este Mes:</strong> {currency2(limites.totalDepositedMonthly).format()}</P>
			<P class="text-sm"><strong>Depositado este Año:</strong> {currency2(limites.totalDepositedYearly).format()}</P>
			<P class="text-sm"><strong>Límite Mensual:</strong> {currency2(limites.monthLimit).format()}</P>
			<P class="text-sm"><strong>Restante este Mes:</strong> {currency2(limites.monthLeft).format()}</P>
			<P class="text-sm"><strong>Límite Anual:</strong> {currency2(limites.yearLimit).format()}</P>
			<P class="text-sm"><strong>Restante este Año:</strong> {currency2(limites.yearLeft).format()}</P>
		</div>
		
		<Hr />

		<!-- Tabla de Cuentas -->
		<Heading tag="h5" class="mb-4">Ultimos depositos fiat</Heading>
		<Table>
			<TableHead>
				<TableHeadCell>Fecha</TableHeadCell>
				<TableHeadCell>Monto</TableHeadCell>
				<TableHeadCell>Banco</TableHeadCell>
				<TableHeadCell>Estado</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each depositos as deposito}
					<TableBodyRow>
						<TableBodyCell>{new Date(deposito.creationTime).toLocaleDateString()}</TableBodyCell>
						<TableBodyCell>{currency2(parseFloat(deposito.amount)).format()} ARS</TableBodyCell>
						<TableBodyCell>{deposito.bankId || '--'}</TableBodyCell>
						<TableBodyCell>{deposito.status}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex justify-end">
			<A class="font-medium hover:underline p-2 mr-4" href="/admin/manteca/deposits?search={pagador.userId}">ver todos</A>
		</div>
		
		<Hr />

		<!-- Tabla de Cuentas -->
		<Heading tag="h5" class="mb-4">Ultimos retiros fiat</Heading>
		<Table>
			<TableHead>
				<TableHeadCell>Fecha</TableHeadCell>
				<TableHeadCell>Monto</TableHeadCell>
				<TableHeadCell>Estado</TableHeadCell>
				<TableHeadCell>CBU</TableHeadCell>
				<TableHeadCell>Banco</TableHeadCell>
				
			</TableHead>
			<TableBody>
				{#each retiros as retiro}
					<TableBodyRow>
						<TableBodyCell>{new Date(retiro.creationTime).toLocaleDateString()}</TableBodyCell>
						<TableBodyCell>{currency2(parseFloat(retiro.amount)).format()} ARS</TableBodyCell>
						<TableBodyCell>{retiro.status}</TableBodyCell>
						<TableBodyCell>{retiro.destAccount.cbu || '--'}</TableBodyCell>
						<TableBodyCell>{retiro.bank || '--'}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex justify-end">
			<A class="font-medium hover:underline p-2 mr-4" href="/admin/manteca/withdraws?search={pagador.userId}">ver todos</A>
		</div>
		
		<Hr />


		<!-- Tabla de Cuentas -->
		<Heading tag="h5" class="mb-4">Ultimas transacciones cripto</Heading>
		<Table>
			<TableHead>
				<TableHeadCell>Fecha</TableHeadCell>
				<TableHeadCell>Monto</TableHeadCell>
				<TableHeadCell>Estado</TableHeadCell>
				<TableHeadCell>Costo</TableHeadCell>
				<TableHeadCell>Tipo</TableHeadCell>
				<TableHeadCell>Oringen</TableHeadCell>
				<TableHeadCell>Destino</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each transactions as tx}
					<TableBodyRow>
						<TableBodyCell>{new Date(tx.creationTime).toLocaleDateString()}</TableBodyCell>
						<TableBodyCell>{currency2(parseFloat(tx.amount)).format()} {tx.coin}</TableBodyCell>
						<TableBodyCell>{tx.status}</TableBodyCell>
						<TableBodyCell>{tx.cost}</TableBodyCell>
						<TableBodyCell>{tx.type}</TableBodyCell>
						<TableBodyCell>{tx.from}</TableBodyCell>
						<TableBodyCell>{tx.to}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
		<div class="flex justify-end">
			<A class="font-medium hover:underline p-2 mr-4" href="/admin/manteca/transactions?search={pagador.userId}">ver todos</A>
		</div>

		<Hr />

		<!-- Tabla de Cuentas -->
		<Heading tag="h5" class="mb-4">Cuentas</Heading>
		<Table>
			<TableHead>
				<TableHeadCell>Banco</TableHeadCell>
				<TableHeadCell>CBU</TableHeadCell>
				<TableHeadCell>Descripción</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each cuentas.ARS as cuenta}
					<TableBodyRow>
						<TableBodyCell>{cuenta.bankName}</TableBodyCell>
						<TableBodyCell>{cuenta.cbu}</TableBodyCell>
						<TableBodyCell>{cuenta.description}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>


</MainCard>

<Modal bind:show={showWithdrawForm} btnOk={false}>
	{#if showWithdrawForm}
		<WithdrawForm {pagador} {cuentas} {monto} on:success={async () => {
			showWithdrawForm = false;
			invalidateAll();
		} } />
	{/if}
</Modal>

