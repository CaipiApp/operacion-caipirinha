<script lang="ts">
	import { data } from './data';
	import { page } from '$app/stores';
	import { sidebarOpen } from '$lib/components/dashboard/store';
	import { canAccess } from '$lib/access';
	import { t } from '$lib/translate/i18n';

	const style = {
        title: `text-sm whitespace-pre`,
        active: `dark:bg-gray-700 bg-primary-300 rounded-full`,
        link: `flex items-center gap-2 justify-start p-3 w-full whitespace-pre cursor-pointer hover:opacity-75`,
        dropdownLink: `flex items-center px-4 py-2 gap-1 text-sm whitespace-pre hover:opacity-75`,
        close: `lg:duration-700 lg:ease-out lg:invisible lg:opacity-0 lg:transition-all`,
        open: `lg:duration-500 lg:ease-in lg:h-auto lg:opacity-100 lg:transition-all lg:w-auto`,
    };

    let openDropdown: string | null = null;

    function toggleDropdown(title: string) {
        openDropdown = openDropdown === title ? null : title;
    }

	let showTooltip: string | null | undefined = null;

	function handleMouseOver(tooltipText: string | undefined) {
		showTooltip = tooltipText;
	}

	function handleMouseLeave() {
		showTooltip = null;
	}

</script>

<ul class="md:pl-3">
	{#each data as item (item.title)}
			{#if canAccess($page?.data?.user, item.link || '')}
					
					<li class="relative">
							<!-- Elemento principal -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							{#if item.children}
								<div 
										class={style.link} 
										on:click={() => item.children ? toggleDropdown(item.title) : null}
								>
										<div class={`p-2 flex gap-1 items-center ${$page.url.pathname === item.link ? style.active : ''}`}>
											<span><svelte:component this={item.icon} /></span>
											{#if !$sidebarOpen}
												<span class="ml-auto">{openDropdown === item.title ? '▲' : '▼'}</span>
											{/if}
										</div>
										{#if $sidebarOpen}
											<span class={`${style.title}`}>
													{$t(item.title)}
											</span>
											<span class="ml-auto">{openDropdown === item.title ? '▲' : '▼'}</span>
										{/if}
								</div>
								<!-- Submenú (dropdown) -->
								{#if openDropdown === item.title}
									<ul class={`${!$sidebarOpen && "w-fit absolute top-5 left-16"}`}>
										{#each item.children as child}
												{#if canAccess($page?.data?.user, child.link)}
														<li class={`${!$sidebarOpen && "block dark:bg-gray-900 bg-gray-100 border-b border-gray-300 dark:border-gray-500"}`}>
																<!-- svelte-ignore a11y-mouse-events-have-key-events -->
																<a 
																	class={`${style.dropdownLink} ${$sidebarOpen ? 'ml-6' : ''} `} 
																	href={child.link}
																	on:mouseover={() => handleMouseOver(item.tooltip)} 
																	on:mouseleave={handleMouseLeave}
																	on:click={() => openDropdown = null}
																>
																	<span class={`p-2 ${child.link === $page.url.pathname ? style.active : ''}`}>
																		<svelte:component this={child.icon} />
																	</span>
											
																	<span class={style.title}>{$t(child.title)}</span>
																</a>
																{#if child.tooltip && showTooltip === child.tooltip}
																	<span class="flashtooltip">{$t(showTooltip)}</span>
																{/if}
														</li>
												{/if}
										{/each}
									</ul>
								{/if}
							{:else}
								<!-- svelte-ignore a11y-mouse-events-have-key-events -->
								<a 
									class={style.link} 
									href={item.link}
									on:mouseover={() => handleMouseOver(item.tooltip)} 
									on:mouseleave={handleMouseLeave}
								>
									<div class={`p-2 ${item.link === $page.url.pathname ? style.active : ''}`}>
										<span><svelte:component this={item.icon} /></span>
									</div>
									{#if $sidebarOpen}
										<span class={`${style.title}`}>
											{$t(item.title)}
										</span>
									{/if}
								</a>
								{#if item.tooltip && showTooltip === item.tooltip}
									<span class="flashtooltip">{$t(showTooltip)}</span>
								{/if}
							{/if}
					</li>
			{/if}
	{/each}
</ul>

<style>
	.flashtooltip {
		position: absolute;
		background-color: #333;
		color: #fff;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 12px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
		white-space: nowrap;
		z-index: 1000;
		visibility: visible;
		transform: translateY(-10px);
		opacity: 1;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	/* .flashtooltip[style*='null'] {
		visibility: hidden;
		opacity: 0;
		transform: translateY(-20px);
	} */
</style>
