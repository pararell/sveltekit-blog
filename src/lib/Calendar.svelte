<script>
	let { calendars = [], openCalendarNote } = $props();
	let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
</script>

<div class="calendars-wrap">
	{#each calendars as calendar}
		<div class="calendar-month">
			<h2 class="calendar-dates-month">
				<strong>{calendar['month']} </strong>
				{calendar['year']}
			</h2>

			<div class="calendar-weekdays-title">
				{#each weekdays as weekday}
					<div class="calendar-weekday">
						{weekday}
					</div>
				{/each}
			</div>

			<div class="calendar-days-wrap">
				{#each calendar['placeholders'] as emptyDay}
					<div class="calendar-day past"></div>
				{/each}

				{#each calendar['days'] as day}
					<button
						onclick={() => openCalendarNote(day, calendar)}
						class="calendar-day"
						style="background:{day['today'] ? '#ec1' : '#fff'}"
					>
						<span class="day" style="color:{day['hasNote'] ? 'red' : '#000'}">
							{day['value']}
						</span>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>


<style>
	.calendars-wrap {
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	.calendar-month {
		padding-top: 20px;
		min-width: 400px;
		padding: 20px 12px 0 12px;
	}
	.calendar-month h2.calendar-dates-month {
		margin: 0;
		padding: 0;
		text-align: center;
	}

	.calendar-month .calendar-weekdays-title {
		display: flex;
		background-color: #fff;
		border-bottom: 1px solid #e5e5e5;
		border-left: 1px solid transparent;
		border-right: 1px solid transparent;
		border-top: 1px solid #e5e5e5;
	}
	.calendar-month .calendar-weekdays-title .calendar-weekday {
		align-items: center;
		border-left: 1px solid transparent;
		border-right: 1px solid #ccc;
		color: #999;
		display: flex;
		font-size: 11px;
		height: 26px;
		justify-content: center;
		width: 14.285%;
	}

	.calendar-month .calendar-weekdays-title .calendar-weekday:last-child {
		border-right: 1px solid transparent;
	}

	.calendar-month .calendar-days-wrap {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		background-color: transparent;
		margin-left: 5px;
		margin-top: 15px;
	}
	.calendar-month .calendar-days-wrap .calendar-day {
		display: flex;
		height: 43px;
		flex: 0 0 13.2857%;
		border-radius: 8px;
		margin: 0.5%;
		color: #333;
		font-size: 14px;
		background-color: #f8f8f8;
		overflow: hidden;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.calendar-month .calendar-days-wrap .calendar-day .day {
		font-size: 12px;
	}

	.calendar-month .calendar-days-wrap .calendar-day.past {
		background-color: transparent;
	}
</style>
