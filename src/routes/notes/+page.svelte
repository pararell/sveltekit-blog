<script>
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { api } from '$lib/api';
	import { notesModelForm } from '$lib/constants';
	import { goto, invalidateAll } from '$app/navigation';
	import { preparePageForm, prepareSlug, createCalendar } from '$lib/utils';
	import Calendar from '$lib/Calendar.svelte';

	let noteNewForm = Object.entries(notesModelForm);
	let noteForm = Object.entries(notesModelForm);
	let id = '';
	let showEdit = false;
    let showCalendarNotes = false;
    let calendarNotes = [];
	let showAdd = false;
	let notes = [];
	let authorization = {};
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

	let calendars = createCalendar();

	let unsubscribe = page.subscribe((pageVal) => {
		if (pageVal.data?.notes) {
			notes = pageVal.data.notes;
			calendars = calendars.map((calendar) => {
				const dateNotes = notes.filter((note) =>
					note.date.includes(`${calendar.year}-${calendar.monthTwoDigits}`)
				);
				const today =
					new Date().getFullYear() + '-' + (new Date().getMonth() + 1) ===
					`${calendar.year}-${calendar.month}`;
				return {
					...calendar,
					days: calendar.days.map((day) => {
						return {
							...day,
							hasNote: dateNotes.length
								? !!dateNotes.find(
										(note) =>
											note.date ===
											`${calendar.year}-${calendar.monthTwoDigits}-${day.valueTwoDigits}`
									)
								: false,
							today: today && new Date().getDate() === day.value
						};
					})
				};
			});
		}
		if (pageVal.data.noteToEdit) {
			const noteToEdit = pageVal.data.noteToEdit;
			id = noteToEdit.id;
			noteForm = preparePageForm(noteForm, noteToEdit);
		}
		authorization = pageVal.data?.token ? { authorization: pageVal.data.token } : {};
	});

	$: categories = notes.reduce(
		(prev, curr) => [...new Set([...prev, ...(curr.categories ? curr.categories.split(',') : [])])],
		['all']
	);

	$: sortedNotes = notes
		.filter((note) => {
			if (showCategories === 'all') {
				return true;
			}
			return !!note.categories && note.categories.split(',').includes(showCategories);
		})
		.map((note) => {
			if (!!note.categories && categories) {
				return {
					...note,
					color: colorsPallete[categories.indexOf(note.categories.split(',')[0])]
				};
			}

			return note;
		})
		.sort((a, b) => parseFloat(a.position) - parseFloat(b.position));

	onDestroy(() => unsubscribe());

	const editNote = async (event) => {
		const formData = event.detail;

		if (formData.title && id) {
			const data = {
				id: parseFloat(id),
				...formData,
				slug: prepareSlug(formData.title)
			};
			const res = await api({ url: `api/v1/notes/update`, method: 'PATCH', data, authorization });
			if (res) {
				invalidateAll();
				showEdit = false;
			}
		}
	};

	const addNote = async (event) => {
		const formData = event.detail;
		if (formData.title) {
			const data = {
				...formData,
				slug: prepareSlug(formData.title)
			};
			const res = await api({ url: `api/v1/notes/create`, method: 'POST', data, authorization });

			if (res) {
				goto('/');
				invalidateAll();
				showAdd = false;
			}
		}
	};

	const removeNote = async () => {
		if (id) {
			const res = await api({ url: `api/v1/notes/delete/` + id, method: 'DELETE', authorization });

			if (res) {
				const resPages = await api({ url: `api/v1/notes/`, authorization });
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

    const openEditNote = async (slug) => {
        const url = new URLSearchParams();
        url.set('edit', slug);
        await goto(`?${url}`);
        showCalendarNotes = false;
        showEdit = true;
    };

	const openCalendarNote = ({detail}) => {
		const { day, calendar } = detail;
		const date = `${calendar.year}-${calendar.monthTwoDigits}-${day.valueTwoDigits}`;
		const foundNotes = notes.filter((note) => note.date === date);
		if (foundNotes.length) {
            calendarNotes = foundNotes;
			showCalendarNotes = true;
		} 
	};

	onDestroy(() => unsubscribe());
</script>

<svelte:head>
	<title>Notes</title>
</svelte:head>


<Calendar calendars={calendars} on:openCalendarNote={openCalendarNote} />



<div class="notes-wrap">
	<div class="top">
		<h1>Notes</h1>
		{#if $page.data?.user?.email}
			<div class="notes-actions">
				<button class="btn" on:click={() => (showAdd = true)}>Add</button>
				<button class="btn" on:click={() => (showEdit = true)}>Edit</button>
			</div>
		{/if}
	</div>
	{#if $page.data?.notes}
		<div class="note note-titles">
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
		<div class="notes">
			{#each sortedNotes as note}
				<button class="note" style="color:{note.color};display:{note.hidden == 'true' ? 'none' : 'flex'}" on:click={openEditNote(note.slug)}>
					<span>{note.title}</span>
					<span>{note.date}</span>
					<span>{@html note.content}</span>
					<span>{note.categories}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if showAdd}
	<div class="modal-window">
		<div class="modal-inside">
			<button class="modal-close" on:click={() => (showAdd = false)}>x</button>
			{#if $page.data?.user?.email}
				{#await import('$lib/FormWithMarkdown.svelte') then Form}
					<div class="container">
						<Form.default form={noteNewForm} on:submitForm={addNote} />
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
			{#if $page.data?.user?.email}
				<form id="search">
					<input
						type="search"
						autocomplete="off"
						list="notes"
						name="edit"
						placeholder="Search notes&hellip;"
						class="draw"
					/>
					<datalist id="notes">
						{#each $page.data?.notes as page}
							<option>{page.slug}</option>
						{/each}
					</datalist>
					<button class="btn" type="submit">Search</button>
				</form>
				{#if $page.data?.noteToEdit}
					<div class="edit-wrap">
						<div class="container">
							{#await import('$lib/FormWithMarkdown.svelte') then Form}
								<Form.default
									form={noteForm}
									content={$page.data.noteToEdit.content}
									on:submitForm={editNote}
								/>
							{/await}

							<form on:submit|preventDefault={removeNote}>
								<input type="hidden" name="id" value={id} />
								<button class="btn delete btn-delete" aria-label="Delete Note"> Delete Note</button>
							</form>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

{#if showCalendarNotes}
	<div class="modal-window">
		<div class="modal-inside">
			<button class="modal-close" on:click={() => (showCalendarNotes = false)}>x</button>
            <div class="notes">
                {#each calendarNotes as note}
                    <button class="note" style="color:{note.color};" on:click={openEditNote(note.slug)}>
                        <span>{note.title}</span>
                        <span>{note.date}</span>
                        <span>{@html note.content}</span>
                        <span>{note.categories}</span>
                    </button>
                {/each}
            </div>
		</div>
	</div>
{/if}

<style>
	.notes-wrap {
		margin: 20px auto;
		background: var(--primary-color);
		border-radius: 12px;
	}
	.notes {
		display: flex;
		flex-wrap: wrap;
		padding: 10px 20px;
		gap: 6px;
	}
	.note {
		display: flex;
		flex-flow: column;
		flex: 1;
		box-shadow: 0px 0px 2px var(--opposite-color);
		min-width: 250px;
        border: none;
        background: var(--primary-color);
        cursor: pointer;
	}
	.note span {
		padding: 5px;
		text-align: center;
		color: var(--text-color);
	}
	.note.note-titles {
		padding-bottom: 10px;
		font-weight: bold;
		box-shadow: none;
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
	}
	.modal-window .modal-inside {
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
	.modal-window .modal-close {
		all: unset;
		cursor: pointer;
		position: absolute;
		top: 15px;
		right: 15px;
		font-size: 18px;
		font-weight: bold;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30px 50px 30px 50px;
	}

	.notes-actions {
		display: flex;
		max-width: 50%;
	}
	.notes-actions button {
		display: inline-flex;
		margin: 0 10px;
		padding: 2px 5px;
	}

	
</style>
