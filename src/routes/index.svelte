<script>
	import { _ } from 'svelte-i18n';
	import { pages } from '$lib/store';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>



<style>
	.cv {
		background-color: #ffffff;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='836' height='836' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='%23788081'/%3E%3Cstop offset='1' stop-color='%23cbd4d5'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='75' y1='76' x2='168' y2='160'%3E%3Cstop offset='0' stop-color='%23868686'/%3E%3Cstop offset='0.09' stop-color='%23ababab'/%3E%3Cstop offset='0.18' stop-color='%23c4c4c4'/%3E%3Cstop offset='0.31' stop-color='%23d7d7d7'/%3E%3Cstop offset='0.44' stop-color='%23e5e5e5'/%3E%3Cstop offset='0.59' stop-color='%23f1f1f1'/%3E%3Cstop offset='0.75' stop-color='%23f9f9f9'/%3E%3Cstop offset='1' stop-color='%23FFFFFF'/%3E%3C/linearGradient%3E%3Cfilter id='c' x='0' y='0' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='12' /%3E%3C/filter%3E%3C/defs%3E%3Cpolygon fill='url(%23a)' points='0 174 0 0 174 0'/%3E%3Cpath fill='%23000' fill-opacity='0' filter='url(%23c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z'/%3E%3Cpath fill='url(%23b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z'/%3E%3C/svg%3E");
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-position: top left;
		display: flex;
		flex-flow: column;
	}

	.icons {
		position: fixed;
		right: 0;
		top: 20%;
		display: flex;
		flex-flow: column;
		width: 100px;
	}

	.icons a:hover {
		padding-right: 15px;
	}

	.icons a {
		transition: all 0.3s ease-in-out;
		margin: 10px 0 10px auto;
	}

	.flex-in {
		display: inline-flex;
		align-items: center;
	}

	.basic-icon {
		min-width: 40px;
		font-size: 2rem;
	}

	@keyframes change-text {
		0%,
		55%,
		100% {
			transform: translateY(-45%);
		}
		5%,
		50% {
			transform: translateY(-95%);
		}
	}
	@keyframes typing {
		0% {
			width: 0;
		}
	}
	@keyframes text-blink {
		50% {
			border-color: transparent;
		}
	}
	.cv {
		box-sizing: border-box;
		color: #13293d;
		font-family: Nunito, sans-serif;
		margin: 0;
	}

	a {
		text-decoration: none;
		color: #13293d;
	}

	a:hover {
		color: #1b98e0;
	}

	.wrapper {
		margin: 2% 10%;
	}

	.heading {
		padding: 2%;
		text-align: center;
	}

	.heading h2 {
		margin: 0 auto;
		font-family: 'Source Code Pro', monospace;
		font-size: 30px;
		font-weight: 500;
		animation: 8s typing steps(16, end), 0.5s text-blink step-end infinite;
		width: 9.6em;
		white-space: nowrap;
		overflow: hidden;
		border-right: 3px solid;
		color: #13293d;
	}
	@media screen and (max-width: 550px) {
		.heading h2 {
			font-size: 30px;
		}
	}

	.sm-name {
		display: none;
		color: #13293d;
	}
	@media screen and (max-width: 550px) {
		.sm-name {
			display: block;
		}
	}

	.name {
		height: 50px;
		overflow: hidden;
		font-weight: bold;
	}
	@media screen and (max-width: 550px) {
		.name {
			display: none;
		}
	}
	.name h1 {
		list-style: none;
		padding: 0;
		color: #13293d;
		animation: 8s change-text linear infinite;
		margin: 3rem 0;
	}
	.name h1 span {
		line-height: 1.2;
		color: #13293d;
		font-size: 40px;
	}

	.block h2 {
		font-family: 'Source Code Pro', monospace;
		border-bottom: 2px solid;
		font-weight: bold;
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
	}

	.block h3 {
		font-size: 1rem;
		line-height: 1.2;
		font-weight: bold;
		margin: 0;
	}
	.block ul {
		list-style: none;
		padding-left: 0;
		margin: 0;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.pri-tag {
		display: inline-block;
		padding: 8px;
		background: #13293d;
		color: #fff;
	}

	.sec-tag {
		display: inline-block;
		padding: 8px;
		background: #e8f1f2;
		color: #13293d;
	}

	.about p::before {
		content: '    ';
	}

	.profile {
		background-size: 100%;
		border-radius: 50%;
		margin: 20px auto;
		width: 100px;
		height: 100px;
		display: inline-block;
		background-image: url('http://api.miroslavsmrtic.sk/uploads/foto_bfe1c715ec.png');
	}

	.icon-size {
		font-size: 2rem;
	}

	.block li {
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.4s ease;
		min-height: 80px;
		min-width: 80px;
		margin: 5px 15px 5px 0px;
		border-radius: 5px;
	}

	.title {
		display: none;
		transition: all 0.4s ease;
	}

	.block li:hover {
		transform: scale(1.2);
	}

	.block li:hover .title {
		display: inline-flex;
	}
</style>
