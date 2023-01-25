<script>
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { api } from '$lib/api';
	import { expenseModelForm, ADMIN_EMAIL } from '$lib/constants';
	import { goto, invalidateAll } from '$app/navigation';

	let expenseNewForm = Object.entries(expenseModelForm);
	let expenseForm = Object.entries(expenseModelForm);
	let id = '';
	let showEdit = false;
	let showAdd = false;
	let expenses = [];
	let eurToCurrencies;
	let showCategories = 'all';
	let colorsPallete = [
		'teal',
		'olive',
		'maroon',
		'purple',
		'grey',
		'orange',
		'green',
		'blue',
		'red',
		'coral',
		'darkgoldenrod',
		'indianred',
		'#112d4b'
	];

	const prepareForm = (formToFill, values) => {
		const keys = Object.keys(values);
		return [...formToFill].map((keyval) => {
			const found = keys.includes(keyval[0]);
			if (found) {
				keyval[1].value = values[keyval[0]];
				return keyval;
			}

			return keyval;
		});
	};

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data?.expenses) {
			expenses = pageVal.data.expenses;
		}
		if (pageVal.data?.eurToCurrencies) {
			eurToCurrencies = pageVal.data.eurToCurrencies;
		}
		if (pageVal.data.expenseToEdit) {
			const expenseToEdit = pageVal.data.expenseToEdit;
			id = expenseToEdit.id;
			expenseForm = prepareForm(expenseForm, expenseToEdit);
		}
	});

	$: categories = expenses.reduce(
		(prev, curr) => [...new Set([...prev, ...(curr.categories ? curr.categories.split(',') : [])])],
		['all']
	);

	$: sortedExpenses = expenses
		.filter((expense) => {
			if (showCategories === 'all') {
				return true;
			}
			return !!expense.categories && expense.categories.split(',').includes(showCategories);
		})
		.map((expense) => {
			if (!!expense.categories && categories) {
				return {
					...expense,
					color: colorsPallete[categories.indexOf(expense.categories.split(',')[0])]
				};
			}

			return expense;
		})
		.map((expense) =>
			expense.currency !== 'eur'
				? {
						...expense,
						value: parseFloat(
							eurToCurrencies?.eur[expense.currency]
								? parseFloat(expense.value).toFixed(2) / eurToCurrencies.eur[expense.currency]
								: expense.value
						).toFixed(2)
				  }
				: { ...expense, value: parseFloat(expense.value).toFixed(2) }
		)
		.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

	$: summary = sortedExpenses.reduce((prev, curr) => prev + parseFloat(curr.value), 0).toFixed(2);

	onDestroy(() => unsubscribe());

	const editExpense = async (event) => {
		const formData = event.detail;

		if (formData.title && id) {
			const data = {
				id: parseFloat(id),
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-')
			};

			const res = await api({ url: `api/expenses/update`, method: 'PATCH', data });
			if (res) {
				invalidateAll();
				showEdit = false;
			}
		}
	};

	const addExpense = async (event) => {
		const formData = event.detail;
		if (formData.title) {
			const data = {
				...formData,
				slug: formData.title
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/[^\w]/gi, '-')
			};

			const res = await api({ url: `api/expenses/create`, method: 'POST', data });

			if (res) {
				goto('/');
				invalidateAll();
				showAdd = false;
			}
		}
	};

	const removeExpense = async () => {
		if (id) {
			const res = await api({ url: `api/expenses/delete/` + id, method: 'DELETE' });

			if (res) {
				const resPages = await api({ url: `api/expenses/` });
				if (resPages) {
					const url = new URLSearchParams();
					url.delete('edit');
					await goto(`?${url}`);
					goto('/', { replaceState: true });
					invalidateAll();
					showEdit = false;
				}
			}
		}
	};

	onDestroy(() => unsubscribe());
</script>

<svelte:head>
	<title>Expenses</title>
</svelte:head>

<div class="expenses-wrap">
	<div class="top">
		<span class="summary">
			Summary: {summary} eur
		</span>

		{#if $page.data?.user?.email === ADMIN_EMAIL}
			<div class="expenses-actions">
				<button class="btn" on:click={() => (showAdd = true)}>Add</button>
				<button class="btn" on:click={() => (showEdit = true)}>Edit</button>
			</div>
		{/if}
	</div>
	{#if $page.data?.expenses}
		<div class="expenses">
			<div class="expense expense-titles">
				<span>Title</span>
				<span>Value - eur</span>
				<span
					>Categories
					<select bind:value={showCategories}>
						{#each categories as category}
							<option value={category}>
								{category}
							</option>
						{/each}
					</select></span
				>
			</div>
			{#each sortedExpenses as expense}
				<div class="expense" style="color:{expense.color}">
					<span>{expense.title}</span>
					<span>{expense.value}</span>
					<span>{expense.categories}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if showAdd}
	<div class="modal-window">
		<div class="modal-inside">
			<button class="modal-close" on:click={() => (showAdd = false)}>x</button>
			{#if $page.data?.user?.email === ADMIN_EMAIL}
				{#await import('$lib/FormWithMarkdown.svelte') then Form}
					<div class="container">
						<Form.default form={expenseNewForm} on:submitForm={addExpense} />
					</div>
				{/await}
			{/if}
		</div>
	</div>
{/if}

{#if showEdit}
	<div class="modal-window">
		<div class="modal-inside">
			<button class="modal-close" on:click={() => (showEdit = false)}>x</button>
			{#if $page.data?.user?.email === ADMIN_EMAIL}
				<form id="search">
					<input
						type="search"
						autocomplete="off"
						list="expenses"
						name="edit"
						placeholder="Search expenses&hellip;"
						class="draw"
					/>
					<datalist id="expenses">
						{#each $page.data?.expenses as page}
							<option>{page.slug}</option>
						{/each}
					</datalist>
					<button class="btn" type="submit">Search</button>
				</form>
				{#if $page.data?.expenseToEdit}
					<div class="edit-wrap">
						<div class="container">
							{#await import('$lib/FormWithMarkdown.svelte') then Form}
								<Form.default form={expenseForm} on:submitForm={editExpense} />
							{/await}

							<form on:submit|preventDefault={removeExpense}>
								<input type="hidden" name="id" value={id} />
								<button class="btn delete btn-delete" aria-label="Delete Expense">
									Delete Expense</button
								>
							</form>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.expenses-wrap {
		margin: 0 auto;
	}
	.expenses {
		display: flex;
		flex-flow: column;
		padding: 10px 20px;
	}

	.expense {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		box-shadow: 0px 0px 2px rgb(0 0 0 / 20%);

		span {
			padding: 5px;
		}

		&.expense-titles {
			padding-bottom: 10px;
			font-weight: bold;
			box-shadow: none;
		}
	}

	.btn-delete {
		display: block;
		max-width: 200px;
		margin: 30px auto;
	}

	.edit-wrap {
		position: relative;
		background: #fff;
		overflow: visible;
		width: 100%;
		z-index: 100;
	}

	#search {
		display: flex;
		margin: 20px auto;
		padding: 5px;
		z-index: 100;
	}

	#search input {
		background: transparent;
		border-color: #fff;
		color: #fff;
		border-style: solid;
		border-width: 1px;
		border-radius: 50px;
		width: 100%;
		padding: 0.5em 1em 0.4em 1em;
		transition: border-color 0.3s ease;
		line-height: 1;
		font-size: 14px;
		border-color: #b4b9ba;
		color: #000;
		max-width: 300px;
	}

	#search button {
		max-width: 100px;
		padding: 5px;
		margin: 0 10px;
	}

	.modal-window {
		position: fixed;
		background-color: rgba(0, 0, 0, 0.25);
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		transition: all 0.3s;

		.modal-inside {
			min-width: 300px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 2em;
			background: white;
			border-radius: 10px;
			max-height: 95vh;
			overflow: auto;
		}

		.modal-close {
			all: unset;
			cursor: pointer;
			position: absolute;
			top: 15px;
			right: 15px;
			font-size: 18px;
			font-weight: bold;
		}
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 50px 50px 30px 50px;
	}

	.summary {
		font-size: 20px;
		line-height: 1.2;
		font-weight: bold;
	}

	.expenses-actions {
		display: flex;
		max-width: 50%;
		button {
			display: inline-flex;
			margin: 0 10px;
			padding: 2px 5px;
		}
	}
</style>